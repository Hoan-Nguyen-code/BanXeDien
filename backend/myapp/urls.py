from django.urls import path
from myapp.api.cart_api import (AddToCartAPIView, CartAPIView, CheckoutAPIView, RemoveFromCartAPIView, IncreaseQuantityAPIView,
                                    DecreaseQuantityAPIView, PaymentQRAPIView, PaymentSuccessAPIView)
from myapp.api import (home_api, news_api)
from myapp.api.auth_api import (LoginAPI, RegisterAPI, LogoutAPI)
from myapp.api.admin_api import (admin_dashboard_api, admin_users_api, admin_products_api, admin_orders_api, admin_stations_api)
from myapp.api.product_api import product_detail_api
from myapp.api.auth_api import (ForgetPasswordAPIView, PasswordResetConfirmAPIView)
from myapp.api.csrf_api import CSRFAPIView
from myapp.api.qr_api import confirm_payment
from myapp.api.map_api import (station_list, search_history_list)

urlpatterns = [
    # HOME
    path("home/", home_api.home_api),

    # PRODUCT
    path("products/<int:product_id>/", product_detail_api, name="product_detail_api"),

    # AUTH
    path("login/", LoginAPI.as_view(), name="api_login"),
    path("register/", RegisterAPI.as_view(), name="api_register"),
    path("logout/", LogoutAPI.as_view(), name="api_logout"),

    # CART
    path("add-to-cart/<int:product_id>/", AddToCartAPIView.as_view()),
    path("cart/", CartAPIView.as_view()),
    path("checkout/", CheckoutAPIView.as_view()),
    path("remove-from-cart/<int:item_id>/", RemoveFromCartAPIView.as_view()),
    path("increase-quantity/<int:item_id>/", IncreaseQuantityAPIView.as_view()),
    path("decrease-quantity/<int:item_id>/", DecreaseQuantityAPIView.as_view()),

    # PAYMENT
    path("payment-qr/<int:order_id>/", PaymentQRAPIView.as_view()),
    path("payment-success/<int:order_id>/", PaymentSuccessAPIView.as_view()),
    path("orders/<int:order_id>/confirm-payment/", confirm_payment),

    # ADMIN
    path('admin/dashboard/', admin_dashboard_api),
    path('admin/users/', admin_users_api),
    path('admin/products/', admin_products_api),
    path('admin/orders/', admin_orders_api),
    path('admin/stations/', admin_stations_api),

    # NEWS
    path("news/", news_api.get_news, name="api_news"),

    # FORGET PASSWORD
    path("forget-password/", ForgetPasswordAPIView.as_view(), name="forget-password"),
    path("reset-password/<uidb64>/<token>/", PasswordResetConfirmAPIView.as_view(), name="reset-password"),

    # MAP
    path("stations/", station_list, name="station-list"),
    path("search-history/", search_history_list, name="search-history"),

    # CSRF
    path("csrf/", CSRFAPIView.as_view()),
]