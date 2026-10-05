from django.contrib import admin

from banana_core.models import User, Wholesaler, Product, ProductImage, Size, Color, Cart, CartItem, Order, OrderItem, \
    Payment

# Register your models here.
admin.site.register(User)
admin.site.register(Wholesaler)
# admin.site.register(Product)
# @admin.register(Size)
# class SizeAdmin(admin.ModelAdmin):
#     list_display = ('name',)
admin.site.register(Size)
admin.site.register(Color)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    filter_horizontal = ('sizes',)       # many to many field

    list_display = ('id', 'name', 'category', 'sleeve_type', 'style', 'pattern', 'neck_style', 'price', 'stock', 'is_new_arrival', 'is_active')
    list_filter = ('category', 'pattern', 'style', 'is_active', 'is_new_arrival')
    search_fields = ('name', 'category')
    ordering = ('-id',)
    fieldsets = (
        ('Product Info', {
    'fields': ('name', 'category', 'sleeve_type', 'style', 'pattern', 'neck_style', 'stock', 'price', 'description', 'sizes', 'colors')
        }),
        ('Status', {
    'fields': ('is_new_arrival', 'is_active')
        }),
    )

# admin.site.register(ProductImage)

admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)
