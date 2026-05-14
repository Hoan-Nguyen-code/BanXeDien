from rest_framework.decorators import api_view
from rest_framework.response import Response
from myapp.models import Product

@api_view(["GET"])
def product_list(request):
    products = Product.objects.filter(is_active=True)

    data = []

    for p in products:
        data.append({
            "id": p.id,
            "name": p.name,
            "price": str(p.price),
            "description": p.description,
        })

    return Response(data)