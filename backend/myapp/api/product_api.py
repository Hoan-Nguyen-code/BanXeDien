from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from myapp.models import Product
from myapp.serializers import ProductSerializer


@api_view(['GET'])
def product_detail_api(request, product_id):

    product = get_object_or_404(Product, id=product_id)

    related_products = Product.objects.filter(
        category=product.category
    ).exclude(id=product.id)[:4]

    return Response({
        "product": ProductSerializer(product).data,
        "related_products": ProductSerializer(
            related_products,
            many=True
        ).data
    })