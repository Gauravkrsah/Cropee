from flask import Blueprint, request, jsonify, session
from firebase_admin import auth as admin_auth
from functools import wraps
import firebase_admin

auth_bp = Blueprint('auth', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized', 'authenticated': False}), 401
        return f(*args, **kwargs)
    return decorated_function

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' in session:
        return jsonify({
            'authenticated': True,
            'user': {
                'id': session.get('user_id'),
                'email': session.get('email'),
                'displayName': session.get('display_name'),
                'photoURL': session.get('photo_url')
            }
        })
    return jsonify({'authenticated': False}), 401

@auth_bp.route('/google-signin', methods=['POST'])
def google_signin():
    try:
        # Check if Firebase Admin is initialized
        if not firebase_admin._apps:
            return jsonify({
                'success': False,
                'error': 'Firebase Admin SDK not initialized'
            }), 500

        data = request.get_json()
        if not data or 'token' not in data:
            return jsonify({'success': False, 'error': 'No token provided'}), 400
            
        token = data.get('token')
        
        try:
            # Verify the ID token with Firebase Admin SDK
            decoded_token = admin_auth.verify_id_token(token)
            user_id = decoded_token['uid']
            
            # Store user session
            session['user_id'] = user_id
            session['email'] = data.get('email')
            session['display_name'] = data.get('displayName')
            session['photo_url'] = data.get('photoURL')
            
            return jsonify({
                'success': True,
                'user': {
                    'id': user_id,
                    'email': data.get('email'),
                    'displayName': data.get('displayName'),
                    'photoURL': data.get('photoURL')
                }
            }), 200
            
        except admin_auth.InvalidIdTokenError:
            return jsonify({
                'success': False,
                'error': 'Invalid token'
            }), 401
            
    except Exception as e:
        print('Google Sign In Error:', str(e))
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@auth_bp.route('/logout')
def logout():
    session.clear()
    return jsonify({'success': True}) 