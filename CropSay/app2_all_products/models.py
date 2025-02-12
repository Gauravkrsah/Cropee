from django.db import models


class Category(models.Model):
    category = models.CharField(max_length=255, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.category


class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    sub_categoryname = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.sub_categoryname


class SubProductCategory(models.Model):
    sub_productcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='subProdCategory')
    sub_productname = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.sub_productname


class Product(models.Model):
    class StockStatus(models.TextChoices):
        IN_STOCK = "In_stock", "In Stock"
        LOW_STOCK = "Low_stock", "Low Stock"
        OUT_OF_STOCK = "Out_of_stock", "Out of Stock"

    class ProductStatus(models.TextChoices):
        PENDING = "Pending", "Pending"
        LIVE = "Live", "Live"

    sub_category = models.ForeignKey(SubProductCategory, on_delete=models.CASCADE, related_name='product_images')
    prod_name = models.CharField(max_length=255)
    prod_img = models.ImageField(upload_to='products/')
    description = models.TextField()
    rating = models.FloatField(null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=15,
        choices=StockStatus.choices,
        default=StockStatus.IN_STOCK
    )
    left_item = models.PositiveIntegerField()
    prod_status = models.CharField(
        max_length=10,
        choices=ProductStatus.choices,
        default=ProductStatus.PENDING
    )

    def __str__(self):
        return f"{self.prod_name} - {self.prod_name} - {self.price}"


