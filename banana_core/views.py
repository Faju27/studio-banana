from datetime import timedelta

import razorpay
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from django.db import transaction
from django.shortcuts import render
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, filters, permissions, viewsets, serializers
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken

from banana_core.filters import ProductFilter
from banana_core.models import Wholesaler, User, Product, ProductImage, Color, Cart, CartItem, Order, OrderItem, Payment
from banana_core.serializers import WholesalerSerializer, WholesalerProfileSerializer, UserSerializer, ProductSerializer, ProductImageSerializer, \
    ColorSerializer, CartSerializer, CartItemSerializer, OrderSerializer, OrderItemSerializer, CreatePaymentSerializer, \
    VerifyPaymentSerializer


# Create your views here.


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class WholesalerViewSet(ModelViewSet):
    queryset = Wholesaler.objects.all()
    serializer_class = WholesalerSerializer
    # permission_classes = [IsAdminUser]



User = get_user_model()         #to handle custom user models , ensures the code works without modification
class WholesalerRegister(APIView):
    def post(self, request):
        user_serializer = UserSerializer(data={
            'username' : request.data.get('username'),
            'password' : request.data.get('password'),
        })

        business_name = request.data.get('business_name')
        phone = request.data.get('phone')

        wholesaler_serializer = WholesalerProfileSerializer(data={
            'business_name': business_name,
            'phone': phone,
        })

        # if not user_serializer.is_valid():
        #     return Response(user_serializer.errors, status=400)
        #
        # # for to automatically catches uniqueness and validator checks together, after Transaction atomic
        # if not wholesaler_serializer.is_valid():
        #     return Response(wholesaler_serializer.errors, status=400)

        # for to get all errors at once instead of one by one
        is_user_valid = user_serializer.is_valid()
        is_wholesaler_valid = wholesaler_serializer.is_valid()
        if not is_user_valid or not is_wholesaler_valid:
            all_errors = {
                **user_serializer.errors,
                **wholesaler_serializer.errors
            }
            return Response(all_errors, status=400)

        # if not business_name:
        #     return Response({'business_name': ['This field is required.']}, status=400)
        #
        # if not phone:
        #     return Response({'phone': ['This field is required.']}, status=400)
        #
        # if Wholesaler.objects.filter(phone=phone).exists():
        #     return Response({'phone': ['This phone number is already registered.']}, status=400)

        with transaction.atomic():
            # Create User
            user = user_serializer.save()
            user.is_wholesaler = True
            user.save()

            # Create Wholesaler
            wholesaler = wholesaler_serializer.save(
                user=user,
                is_active=True,          # default active
                is_approved=False        # default not approved
            )

            # Return token immediately, So user don't have to login again
            # token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "message": "Wholesaler registered successfully.",
                # "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "is_wholesaler": True
                },
                "wholesaler_id": wholesaler.id
            }, status=201)


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            # token, _ = Token.objects.get_or_create(user=user)

            refresh = RefreshToken.for_user(user)

            # Determine user type for frontend routing
            if user.is_staff:
                user_type = 'admin'
            elif getattr(user, 'is_wholesaler', False):
                user_type = 'wholesaler'
            else:
                user_type = 'user'

            return Response({
                "message": "Login successful",
                # "token": token.key,

                "access": str(refresh.access_token),
                "refresh": str(refresh),

                "user_type": user_type,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "is_staff": user.is_staff,
                    "is_wholesaler": getattr(user, 'is_wholesaler', False)
                }
            })

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class WholesalerProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            wholesaler = Wholesaler.objects.get(user=request.user)
            serializer = WholesalerProfileSerializer(wholesaler)

            return Response({
                "username": request.user.username,
                "user" : {
                    "id" : request.user.id,
                    "username": request.user.username,
                },
                "wholesaler": serializer.data
            })
        except Wholesaler.DoesNotExist:
            return Response( {"error": "Wholesaler profile not found"}, status=status.HTTP_404_NOT_FOUND )

    def patch(self, request):
        try:
            wholesaler = Wholesaler.objects.get(user=request.user)

            serializer = WholesalerProfileSerializer(
                wholesaler,
                data=request.data,
                partial=True
            )

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(serializer.errors, status=400)
        except Wholesaler.DoesNotExist:
            return Response( {"error": "Wholesaler profile not found"}, status=status.HTTP_404_NOT_FOUND )




class ProductPagination(PageNumberPagination):
    page_size = 20 # default

    page_size_query_param = 'page_size' # for admin
    max_page_size = 100

class ProductViewSet(ModelViewSet):
    # queryset = Product.objects.all()
    serializer_class = ProductSerializer
    # permission_classes = [AllowAny]

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'recommendations']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


    def get_queryset(self):
        if self.request.user and self.request.user.is_staff:
            return Product.objects.all()

        return Product.objects.filter(is_active=True)

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter # for order
    ]

    # filterset_fields = ['is_new_arrival', 'category', 'sleeve_type', 'style', 'pattern', 'neck_style'] # Field allowed to filter
    filterset_class = ProductFilter

    search_fields = ['name', 'category']    # Fields allowed to search
    ordering_fields = ['id', 'created_at', 'name', 'price'] # Fields allowed to sort
    ordering = ['-id'] # ordering

    pagination_class = ProductPagination

    # to show all product without pagination
    # def paginate_queryset(self, queryset):
    #     # Disable pagination if 'no_pagination' is in the URL
    #     # or if it's a request where you want everything at once.
    #     if self.request.query_params.get('no_pagination') == 'true':
    #         return None
    #     return super().paginate_queryset(queryset)

    # for to show total count on admin page
    @action(detail=False, methods=['get'])
    def total_count(self, request):
        count = Product.objects.count()
        return Response({
            "count": count
        })

    @action(detail=True, methods=['get'])
    def recommendations(self, request, pk=None):
        product = self.get_object()     # to get single item

        products = Product.objects.filter(
            is_active=True,
            category=product.category,
            # style=product.style,
            pattern=product.pattern
        ).exclude(id=product.id     # to remove current product
        ).order_by('?')[:8]     # randomly order the matching products. and only 8 products will show

        serializer = self.get_serializer(products, many=True)

        return Response(serializer.data)

class ProductImageViewSet(ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    parser_classes = [MultiPartParser, FormParser]

# class ProductVariantViewSet(ModelViewSet):
#     queryset = ProductVariant.objects.all()
#     serializer_class = ProductVariantSerializer

class ProductColorViewSet(ModelViewSet):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    # Add search so frontend can check if color exists
    search_fields = ['name']


class CartViewSet(ModelViewSet):
    serializer_class = CartSerializer
    queryset = Cart.objects.all()
    # permission_classes = [IsAuthenticated]

    # def get_queryset(self):
    #     return Cart.objects.filter(
    #         wholesaler=self.request.user.wholesaler_profile
    #     )

    def perform_create(self, serializer):
        serializer.save(
            wholesaler=self.request.user.wholesaler_profile
        )

class CartItemViewSet(ModelViewSet):
    # queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(
            cart__wholesaler=self.request.user.wholesaler_profile
        )


class OrderPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size' # 10/50/100
    max_page_size = 1000

class OrderViewSet(ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    pagination_class = OrderPagination

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ['status']

    search_fields = [
        # 'id',
        'order_number',
        'wholesaler__business_name',
    ]

    ordering_fields = [
        'order_number',
        'id',
        'created_at',
        'total_price',
        'payment_status'
    ]

    ordering = ['-created_at']

    # permission_classes = [IsAuthenticated]
    #
    # def get_queryset(self):
    #     return Order.objects.filter(
    #         wholesaler=self.request.user.wholesaler_profile
    #     )

    # permission_classes = [IsAuthenticated]
    # def get_queryset(self):
    #     user = self.request.user
    #
    #     # 1. If the user is an admin or staff member, let them see All
    #     if user.is_staff or user.is_superuser:
    #         return Order.objects.all()
    #
    #     # 2. If it's a regular user, ensure they have a profile before filtering
    #     if hasattr(user, 'wholesaler_profile'):
    #         return Order.objects.filter(wholesaler=user.wholesaler_profile)
    #
    #     # 3. Fallback: Return nothing if they are authenticated but have no profile
    #     return Order.objects.none()

    def create(self, request, *args, **kwargs): # used when wholesaler place order
        try:
            wholesaler = request.user.wholesaler_profile
        except Wholesaler.DoesNotExist:
            return Response(
                {"error": "Wholesaler profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if not wholesaler.is_active:
            return Response(
                {"error": "Your account is inactive."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not wholesaler.is_approved:
            return Response(
                {"error": "Your account is not approved yet."},
                status=status.HTTP_403_FORBIDDEN
            )

        cart = wholesaler.cart
        cart_items = cart.cart_items.all()

        if not cart_items.exists():
            return Response(
                {"error": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST
            )

        total_quantity = sum(item.quantity for item in cart_items)
        if total_quantity < 10:
            return Response(
                {
                    "error": f"Minimum order quantity is 10 pieces.You Currently have {total_quantity}",
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Product availability check
        for item in cart_items:
            if not item.product.is_active:
                return Response(
                    {
                        "error": f"{item.product.name} is no longer available."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            if item.product.stock <= 0:
                return Response(
                    {"error": f"{item.product.name} is out of stock."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if item.color and item.color not in item.product.colors.all():
                return Response(
                    {"error": f"Selected color {item.color.name} is no longer available for {item.product.name}."},
                    status=400
                )
            if item.size and item.size not in item.product.sizes.all():
                return Response(
                    {"error": f"Selected size {item.size.name} is no longer available for {item.product.name}."},
                    status=400
                )


        with transaction.atomic():
            # Create Order
            order = Order.objects.create(
                wholesaler=wholesaler,
                # shipping_address=request.data["shipping_address"], # same name from frontend
                shipping_street=request.data["shipping_street"],
                shipping_city=request.data["shipping_city"],
                shipping_state=request.data["shipping_state"],
                shipping_pincode=request.data["shipping_pincode"],
                total_price=0,
                estimated_delivery_date=timezone.now().date() + timedelta(days=7),
                expires_at=timezone.now() + timedelta(minutes=30)
            )

            total = 0

            for item in cart_items:
                selling_price = (
                        item.product.discount_price
                        or item.product.price
                )
                OrderItem.objects.create(
                    order=order, # order_id
                    product=item.product,
                    color=item.color,
                    size=item.size,
                    quantity=item.quantity,
                    price_at_purchase=selling_price
                )
                total += selling_price * item.quantity

            order.total_price = total
            order.save()

        serializer = self.get_serializer(order)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    def perform_update(self, serializer): # used when admin updates the order
        order = self.get_object()
        new_status = self.request.data.get("status")

        if new_status == "accepted" and order.payment_status != "paid":
            raise serializers.ValidationError(
                "Cannot accept an unpaid order."
            )

        order = serializer.save()

        if order.status == "shipped" and not order.shipped_at:
            order.shipped_at = timezone.now()
        elif order.status == "delivered" and not order.delivered_at:
            order.delivered_at = timezone.now()
        elif order.status == "cancelled" and not order.cancelled_at:
            order.cancelled_at = timezone.now()

        order.save()

    # @action(detail=False, methods=['get'], url_path='dashboard-stats')
    # def dashboard_stats(self, request):
    #     total = Order.objects.count()
    #     delivered = Order.objects.filter(status='delivered').count()
    #     cancelled = Order.objects.filter(status='cancelled').count()
    #     unfulfilled = total - (delivered + cancelled)
    #     # unfulfilled = Order.objects.filter(
    #     #     status__in=['pending','processing','accepted','shipped']).count()
    #
    #     return Response({
    #         "totalOrders": total,
    #         "totalDelivered": delivered,
    #         "totalCancelled": cancelled,
    #         "totalUnfulfilled": unfulfilled
    #     })



class OrderItemViewSet(ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class PaymentViewSet(viewsets.ViewSet):

    permission_classes = [IsAuthenticated]

    def create(self, request):
        serializer = CreatePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        order_id = serializer.validated_data['order_id']

        try:
            wholesaler = request.user.wholesaler_profile
            order = Order.objects.get(
                id=order_id,
                wholesaler=wholesaler
            )
        except Wholesaler.DoesNotExist:
            return Response(
                {"error": "Wholesaler profile not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if order.payment_status == 'paid':
            return Response(
                {"error": "Order is already paid."},
                status=status.HTTP_400_BAD_REQUEST
            )

        amount = int(order.total_price * 100)  # for razorpay amount (1rs means 100 paise)
        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,   # from.env
                settings.RAZORPAY_KEY_SECRET
            )
        )
        razorpay_order = client.order.create({
            "amount": amount,
            "currency": "INR",
            "receipt": order.order_number,
        })

        # for to create payment
        payment = Payment.objects.create(
            order=order,
            razorpay_order_id=razorpay_order['id'],
            amount=order.total_price,
            status='created'
        )

        return Response({
            "key": settings.RAZORPAY_KEY_ID,
            "razorpay_order_id": razorpay_order['id'],
            "amount": amount,
            "currency": "INR",
            "order_id": order.id,
            "order_number": order.order_number,
            "payment_id": payment.id,
        })

    @action(detail=False, methods=['post'], url_path='fail')
    def report_failure(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')

        try:
            payment = Payment.objects.get(
                razorpay_order_id=razorpay_order_id
            )
        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment record not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Make sure this payment belongs to the logged-in wholesaler
        if payment.order.wholesaler != request.user.wholesaler_profile:
            return Response(
                {"error": "You are not allowed to update this payment."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Don't change an already successful payment
        if payment.status == "paid":
            return Response(
                {"error": "This payment is already marked as paid."},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment.status = "failed"
        payment.razorpay_payment_id = razorpay_payment_id
        payment.save()

        return Response({
            "message": "Payment failure recorded."
        })



class VerifyPaymentView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        razorpay_payment_id = serializer.validated_data["razorpay_payment_id"]
        razorpay_order_id = serializer.validated_data["razorpay_order_id"]
        razorpay_signature = serializer.validated_data["razorpay_signature"]

        try:
            payment = Payment.objects.get(
                razorpay_order_id=razorpay_order_id
            )
        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment record not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Make sure this payment belongs to the logged-in wholesaler
        if payment.order.wholesaler != request.user.wholesaler_profile:
            return Response(
                {"error": "You are not allowed to verify this payment."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Don't change an already successful payment
        if payment.status == "paid":
            return Response(
                {"error": "This payment is already marked as paid."},
                status=status.HTTP_400_BAD_REQUEST
            )

        client = razorpay.Client(
            auth=(
                settings.RAZORPAY_KEY_ID,
                settings.RAZORPAY_KEY_SECRET
            )
        )
        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature
            })
        except razorpay.errors.SignatureVerificationError:
            payment.status = "failed"
            payment.save()
            return Response(
                {"error": "Payment verification failed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        razorpay_payment = client.payment.fetch(razorpay_payment_id)

        # After Successful payment
        payment.status = "paid"
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.payment_method = razorpay_payment.get("method")
        payment.save()

        # for to save order payment status as paid
        order = payment.order
        order.payment_status = "paid"
        order.save()

        # for to delete cart after successful payment
        wholesaler = order.wholesaler
        cart = wholesaler.cart
        cart.cart_items.all().delete()

        return Response({
            "message": "Payment verified successfully.",
            "order_id": order.id,
            "order_number": order.order_number,
            "payment_id": payment.id
        })