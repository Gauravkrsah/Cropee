import csv
import os
from django.core.management.base import BaseCommand
from app2_all_products.models import SubProductCategory, Product

class Command(BaseCommand):
    help = 'Export products from CSV file'

    def handle(self, *args, **kwargs):
        file_path = os.path.join('product_data', 'product.csv')
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File {file_path} not found!'))
            return

        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                try:
                    subproductcategory = SubProductCategory.objects.get(sub_productname=row['sub_category'])
                    product, created = Product.objects.get_or_create(
                        sub_category=subproductcategory,
                        prod_name=row['prod_name'],
                        defaults={
                            'prod_img': row['prod_img'],
                            'description': row['description'],
                            'rating': row['rating'] if row['rating'] else None,
                            'price': row['price'],
                            'status': row['status'],
                            'left_item': row['left_item'],
                            'prod_status': row['prod_status']
                        }
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Added product: {product.prod_name}'))
                    else:
                        self.stdout.write(self.style.WARNING(f'Product {product.prod_name} already exists'))
                except SubProductCategory.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"SubProductCategory '{row['sub_category']}' not found. Skipping."))
