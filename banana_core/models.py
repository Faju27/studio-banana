from symtable import Class

from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
from django.db import models
import uuid

from django.utils import timezone

# Create your models here.

# pan_number = models.CharField(
#     max_length=10,
#     validators=[
#         MinLengthValidator(10),
#         RegexValidator(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$', 'Invalid PAN format.')
#     ],
#     unique=True
# )
#
# # GST must be exactly 15 characters
# gst_number = models.CharField(
#     max_length=15,
#     validators=[
#         MinLengthValidator(15),
#         RegexValidator(r'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$', 'Invalid GSTIN format.')
#     ],
#     unique=True
# )
phone_validator = RegexValidator(
    regex=r'^[6-9]\d{9}$',
    message="Phone number must be 10 digits and start with 6, 7, 8, or 9."
)
pincode_validator = RegexValidator(regex=r'^\d{6}$', message="PIN code must be exactly 6 digits.")

class User(AbstractUser):
    is_wholesaler = models.BooleanField(default=False)
    def __str__(self):
        return self.username

class Wholesaler(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wholesaler_profile')
    business_name = models.CharField(max_length=100)
    gst_number = models.CharField(max_length=15, unique=True, blank=True, null=True) # 2-digit state code, 10-character PAN, plus 3 structural digits/letters eg:-(22ABCDE1234F1Z5)
    pan = models.CharField(max_length=10, unique=True, blank=True, null=True)   # required 5 letters, 4 digits, 1 letter eg:-(ABCDE1234F)
    phone = models.CharField(max_length=10, unique=True, validators=[phone_validator])                #required
    email = models.EmailField(unique=True, blank=True, null=True)       #optional
    billing_street = models.TextField(help_text="Shop/Plot No., Building, Street Name", blank=True, null=True )
    billing_city = models.CharField(max_length=50, blank=True, null=True )
    billing_state = models.CharField(max_length=50, help_text="State tied to your GSTIN registration", blank=True, null=True )
    billing_pincode = models.CharField(max_length=6, validators=[pincode_validator], blank=True, null=True )
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.business_name


class Size(models.Model):
    name = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return self.name

class Color(models.Model):
    name = models.CharField(max_length=50, unique=True)
    hex_code = models.CharField(max_length=7, default="#000000")

    def __str__(self):
        return self.name

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('tshirt', 'T-Shirts'),
        ('linen', 'Linen Shirts'),
        ('silk', 'Silk Shirts'),
        ('denim', 'Denim Shirts'),
        ('casual', 'Casual Shirts'),
        ('formal', 'Formal Shirts'),
    ]
    SLEEVE_CHOICES = [
        ('short', 'Short / Normal Sleeve'),
        ('full', 'Full Sleeve'),
        ('three_fourth', 'Five Sleeve (3/4)'),
    ]
    STYLE_CHOICES = [
        ('vintage', 'Vintage'),
        ('retro', 'Retro'),
        ('modern', 'Modern'),
        ('streetwear', 'Streetwear')]

    PATTERN_CHOICES = [
        ('printed', 'Printed'),
        ('solid', 'Solid'),
        ('checks', 'Checks'),
        ('stripes', 'stripes'),
        ('textured', 'Self-Design / Textured'),
        ('embroidered', 'Embroidered')
    ]
   # Neck Style Choices
    COLLAR_CHOICES = [
        # Shirt-specific
        ('classic', 'Classic / Point Collar'),
        ('button_down', 'Button-Down Collar'),
        ('mandarin', 'Collarless / Mandarin'),
        # Tshirt
        ('round', 'Round / Crew Neck'),
        ('v_neck', 'V-Neck'),
        ('polo', 'Polo Collar'),
        ('henley', 'Henley Neck'),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    sleeve_type = models.CharField(max_length=20, choices=SLEEVE_CHOICES)
    style = models.CharField(max_length=20, choices=STYLE_CHOICES, blank=True, null=True)
    pattern = models.CharField(max_length=20, choices=PATTERN_CHOICES, blank=True, null=True)
    neck_style = models.CharField(max_length=20, choices=COLLAR_CHOICES)
    description = models.TextField()
    sizes = models.ManyToManyField(Size, related_name='products', blank=True)
    colors = models.ManyToManyField(Color, related_name='products', blank=True)
    stock = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    # minimum_order_quantity = models.PositiveIntegerField(default=5)
    is_new_arrival = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.category} - {self.sleeve_type} - {self.pattern} "

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")

    def __str__(self):
        return f"{self.product.name} - {self.color_name}"

# class ProductVariant(models.Model):
#     SIZE_CHOICES = [('S', 'Small'), ('M', 'Medium'), ('L', 'Large'), ('XL', 'Extra Large'), ('XXL', 'Double Extra Large')]
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
#     size = models.CharField(max_length=10, choices=SIZE_CHOICES)
#     price = models.DecimalField(max_digits=10, decimal_places=2)  # Sizes can have different prices
#     stock = models.PositiveIntegerField(default=0)  # Track stock per size
#
#     class Meta:
#         # This prevents the same product from having the same size twice
#         constraints = [
#             models.UniqueConstraint(fields=['product', 'size'], name='unique_product_size')
#         ]


class Cart(models.Model):
    wholesaler = models.OneToOneField(Wholesaler, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.wholesaler.business_name}'s Cart"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    color = models.ForeignKey(Color, on_delete=models.CASCADE)
    size = models.ForeignKey(Size, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.product.name} ({self.color.name}, {self.size.name})"




# order : user forignkey , status charfield (pending,processing,shipped,completed), total_amount decimalfield, shipping address textfield .
# OrderItem: product foreignkey, selected size foreign key , selected_color forignkey, quantity positiveIntegerfield (MinValueValidator(10)), price_at_purchase (save current price).
# collect company name , Pan/gst, phone from checkout

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    order_number = models.CharField(max_length=30, unique=True, blank=True)

    # Link to Wholesaler. If a profile is deleted, to keep the order records .
    wholesaler = models.ForeignKey(Wholesaler, on_delete=models.SET_NULL, null=True, related_name='orders')

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')

    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    # shipping_address = models.TextField()
    shipping_street = models.TextField()
    shipping_city = models.CharField(max_length=50)
    shipping_state = models.CharField(max_length=50)
    shipping_pincode = models.CharField(max_length=6, validators=[pincode_validator])

    estimated_delivery_date = models.DateField(blank=True, null=True)

    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    # for order number
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = (
                f"SB-{uuid.uuid4().hex[:6].upper()}"
            )
        super().save(*args, **kwargs)
    # def __str__(self):
    #     return f"Order #{self.id} - {self.user.username if self.user else 'Guest'} ({self.get_status_display()})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.ForeignKey(Size, on_delete=models.PROTECT)
    color = models.ForeignKey(Color, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()


class Payment(models.Model):
    STATUS_CHOICES = [
        ('created', 'Created'),
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')

    razorpay_order_id = models.CharField(max_length=100, unique=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)
    payment_method = models.CharField(max_length=30, blank=True, null=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='created')

    created_at = models.DateTimeField(auto_now_add=True)