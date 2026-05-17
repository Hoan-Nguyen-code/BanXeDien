from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view
from rest_framework.response import Response

from myapp.models import Product
from myapp.serializers.product_serializer import ProductSerializer


@api_view(["GET"])
def product_detail_api(request, product_id):

    product = get_object_or_404(
        Product,
        id=product_id
    )

    related_products = Product.objects.filter(
        category=product.category
    ).exclude(id=product.id)[:4]

    product_serializer = ProductSerializer(product)

    related_serializer = ProductSerializer(
        related_products,
        many=True
    )

    data = {
        "product": product_serializer.data,
        "related_products": related_serializer.data
    }

    return Response(data)