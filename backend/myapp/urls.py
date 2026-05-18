from django.urls import path
from myapp.api.cart_api import AddToCartAPIView, CartAPIView, CheckoutAPIView
from myapp.api import (home_api, news_api)
from myapp.api.auth_api import (LoginAPI, RegisterAPI, LogoutAPI)
from myapp.api.admin_api import (admin_dashboard_api, admin_users_api, admin_products_api, admin_orders_api, admin_stations_api)
from myapp.api.product_api import product_detail_api
from myapp.api.auth_api import (ForgetPasswordAPIView, PasswordResetConfirmAPIView)
urlpatterns = [
    # HOME
    path("home/", home_api.home_api),

    # PRODUCT
    path("products/<int:product_id>/", product_detail_api, name="product_detail_api"),

    # AUTH
    path("login/", LoginAPI.as_view(), name="api_login"),
    path("register/", RegisterAPI.as_view(), name="api_register"),
    path("logout/", LogoutAPI.as_view(), name="api_logout"),
    path(
    "add-to-cart/<int:product_id>/",
    AddToCartAPIView.as_view()
),
path("cart/", CartAPIView.as_view()),
path("checkout/", CheckoutAPIView.as_view()),

    # ADMIN
    path('api/admin/dashboard/', admin_dashboard_api),
    path('api/admin/users/', admin_users_api),
    path('api/admin/products/', admin_products_api),
    path('api/admin/orders/', admin_orders_api),
    path('api/admin/stations/', admin_stations_api),

    # NEWS
    path("news/", news_api.get_news, name="api_news"),

    #ForgetPassword
    path("forget-password/", ForgetPasswordAPIView.as_view(), name="forget-password"),

    path("reset-password/<uidb64>/<token>/", PasswordResetConfirmAPIView.as_view(), name="reset-password"),
]