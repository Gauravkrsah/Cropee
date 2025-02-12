import csv
import os
from django.core.management.base import BaseCommand
from app2_all_products.models import Category

class Command(BaseCommand):
    help = 'Export categories from CSV file'

    def handle(self, *args, **kwargs):
        file_path = os.path.join('product_data', 'category.csv')
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File {file_path} not found!'))
            return

        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                category, created = Category.objects.get_or_create(
                    category=row['category'],
                    defaults={'description': row['description']}
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Added category: {category.category}'))
                else:
                    self.stdout.write(self.style.WARNING(f'Category {category.category} already exists'))
