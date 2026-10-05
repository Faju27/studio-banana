from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from banana_core.views import UserViewSet, WholesalerViewSet, ProductViewSet, ProductImageViewSet, LoginView, \
    WholesalerRegister, WholesalerProfile, ProductColorViewSet, CartViewSet, CartItemViewSet, OrderViewSet, \
    OrderItemViewSet, PaymentViewSet, VerifyPaymentView

router = DefaultRouter()
# Admin / Wholesaler CRUD
router.register('users', UserViewSet, basename='users')
router.register(r'wholesalers', WholesalerViewSet, basename='wholesalers')

# Products and images
router.register(r'products', ProductViewSet, basename='products')
router.register('product-images', ProductImageViewSet, basename='product-images')
router.register('product-colors', ProductColorViewSet, basename='product-colors')
# router.register('product-variant', ProductVariantViewSet, basename='product-variant')

# Cart and Orders
router.register('cart', CartViewSet, basename='cart')
router.register('cart-items', CartItemViewSet, basename='cart-items')
router.register(r'order', OrderViewSet, basename='orders')
router.register('order-items', OrderItemViewSet, basename='order-items')

router.register(r'payments', PaymentViewSet, basename='payments')


urlpatterns = [
    path('', include(router.urls)),

    # Registration and Login
    path('register/wholesaler/', WholesalerRegister.as_view(), name='wholesaler-register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Wholesaler profile (current logged-in user)
    path('wholesaler/profile/', WholesalerProfile.as_view(), name='wholesaler-profile'),

    # Verify Payment
    path('payments/verify/', VerifyPaymentView.as_view(), name='payments-verify'),

]