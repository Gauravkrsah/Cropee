# Generated by Django 5.1.6 on 2025-02-12 09:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app2_all_products', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subproductcategory',
            name='sub_productcategory',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subProdCategory', to='app2_all_products.subcategory'),
        ),
    ]
