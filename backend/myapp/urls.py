from django.urls import path
from myapp.api import (home_api, product_api, news_api)
from myapp.api.auth_api import (LoginAPI, RegisterAPI, LogoutAPI)

urlpatterns = [
    # HOME
    path("home/", home_api.home_api),

    # PRODUCT
    path("products/<int:product_id>/", product_api.product_detail_api),

    # AUTH
    path("login/", LoginAPI.as_view(), name="api_login"),
    path("register/", RegisterAPI.as_view(), name="api_register"),
    path("logout/", LogoutAPI.as_view(), name="api_logout"),

    # NEWS
    path("news/", news_api.get_news, name="api_news"),
]