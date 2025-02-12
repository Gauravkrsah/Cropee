import csv
import os
from django.core.management.base import BaseCommand
from app2_all_products.models import SubCategory, SubProductCategory

class Command(BaseCommand):
    help = 'Export sub-product categories from CSV file'

    def handle(self, *args, **kwargs):
        file_path = os.path.join('product_data', 'subproductcategory.csv')
        if not os.path.exists(file_path):
            self.stdout.write(self.style.ERROR(f'File {file_path} not found!'))
            return

        with open(file_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                try:
                    subcategory = SubCategory.objects.get(sub_categoryname=row['sub_category'])
                    subproductcategory, created = SubProductCategory.objects.get_or_create(
                        sub_productcategory=subcategory,
                        sub_productname=row['sub_productname'],
                        defaults={'description': row['description']}
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Added subproduct category: {subproductcategory.sub_productname}'))
                    else:
                        self.stdout.write(self.style.WARNING(f'Subproduct category {subproductcategory.sub_productname} already exists'))
                except SubCategory.DoesNotExist:
                    self.stdout.write(self.style.ERROR(f"SubCategory '{row['sub_category']}' not found. Skipping."))
