from rest_framework.decorators import api_view
from rest_framework.response import Response

from myapp.models import Product, Category
from myapp.serializers import ProductSerializer, CategorySerializer


@api_view(['GET'])
def home_api(request):

    category_id = request.GET.get("category")
    q = request.GET.get("q")
    sort = request.GET.get("sort")

    products = Product.objects.filter(is_active=True)

    # FILTER CATEGORY
    if category_id:
        products = products.filter(category_id=category_id)

    # SEARCH
    if q:
        products = products.filter(name__icontains=q)

    # SORT
    if sort == "price_asc":
        products = products.order_by("price")

    elif sort == "price_desc":
        products = products.order_by("-price")

    categories = Category.objects.all()

    return Response({
        "products": ProductSerializer(products, many=True).data,
        "categories": CategorySerializer(categories, many=True).data,
    })