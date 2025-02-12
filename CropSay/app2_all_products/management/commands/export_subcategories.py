import csv
import os
from django.core.management.base import BaseCommand
from app2_all_products.models import Category, SubCategory

class Command(BaseCommand):
    help = 'Export subcategories from CSV file'

    def handle(self, *args, **kwargs):
        file_path = os.path.join('product_data', 'subcategory.csv')
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File {file_path} not found!'))
            return

        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                try:
                    category = Category.objects.get(category=row['category'])
                    subcategory, created = SubCategory.objects.get_or_create(
                        category=category,
                        sub_categoryname=row['sub_categoryname'],
                        defaults={'description': row['description']}
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Added subcategory: {subcategory.sub_categoryname}'))
                    else:
                        self.stdout.write(self.style.WARNING(f'Subcategory {subcategory.sub_categoryname} already exists'))
                except Category.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"Category '{row['category']}' not found. Skipping."))
