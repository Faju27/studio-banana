from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from banana_core.models import Wholesaler, User, ProductImage, Product, Size, Color, CartItem, Cart, OrderItem, Order, \
    Payment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password' : {'write_only' : True}}     # for hiding password from api

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class WholesalerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Wholesaler
        fields = '__all__'
        read_only_fields = ('user',)

class WholesalerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Wholesaler
        fields = '__all__'
        read_only_fields = ('user', 'is_approved','is_active')

        def validate_gst_number(self, value):
            if value is None or str(value).strip() == "":
                return None
            return value

        # 2. Handles your unique, optional email field
        def validate_email(self, value):
            if value is None or str(value).strip() == "":
                return None
            return value

        # 3. Keep your existing PAN validator
        def validate_pan(self, value):
            if value is None or str(value).strip() == "":
                return None
            return value


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('id', 'product', 'image')

# class ProductVariantSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ProductVariant
#         fields = ('id', 'product', 'size')
class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex_code']

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    # variants = ProductVariantSerializer(many=True, read_only=True)

    sizes = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Size.objects.all()
    )
    colors = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Color.objects.all()
    )

    class Meta:
        model = Product
        fields = '__all__'
    # OVERRIDE to_representation to show full color details in GET requests
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # We replace the list of names with the full Color objects
        representation['colors'] = ColorSerializer(instance.colors.all(), many=True).data
        representation['sizes'] = SizeSerializer(instance.sizes.all(), many=True).data # Add this line
        return representation



class CartItemSerializer(serializers.ModelSerializer):
    # This handles the GET requests (returns full nested object data)
    #     product = ProductSerializer(read_only=True) # so we get data with {item.product.name}
    # size = serializers.SlugRelatedField(read_only=True, slug_field='name')    # get data with {item.size} instead of {item.size.name}
    # This handles the POST/PUT requests (accepts simple numeric IDs)
    #     product_id = serializers.PrimaryKeyRelatedField(
    #         queryset=Product.objects.all(),
    #         source='product' )    # source: If serializer name(product) == model column name(product_id) → No source required.

    class Meta:
        model = CartItem
        fields = '__all__'

    def to_representation(self, instance):
        # Get the standard dictionary output (which contains simple IDs)
        representation = super().to_representation(instance)

        #  Dynamically replace those IDs with full serialized objects for your React UI
        representation["product"] = ProductSerializer(instance.product, context=self.context).data      # context : for to get full path of image
        representation["color"] = ColorSerializer(instance.color).data
        representation["size"] = SizeSerializer(instance.size).data

        return representation


class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = '__all__'
        read_only_fields = ['wholesaler']


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    size = SizeSerializer(read_only=True)
    color = ColorSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['razorpay_order_id','razorpay_payment_id','payment_method','amount','status','created_at',]
        read_only_fields = fields

class OrderSerializer(serializers.ModelSerializer):
    wholesaler = WholesalerSerializer(read_only=True)
    order_items = OrderItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = '__all__'

class CreatePaymentSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()

class VerifyPaymentSerializer(serializers.Serializer):
    razorpay_payment_id = serializers.CharField()
    razorpay_order_id = serializers.CharField()
    razorpay_signature = serializers.CharField()