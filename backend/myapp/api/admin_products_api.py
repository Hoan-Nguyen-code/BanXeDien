from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from myapp.models import Product, Inventory, StockIn, StockOut
from myapp.serializers.admin_serializer import ProductSerializer, CategorySerializer

def is_admin(user):
    return user.is_authenticated and user.role == 'ADMIN'

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def admin_products_api(request):

    if not is_admin(request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    if request.method == 'GET':

        products = Product.objects.select_related(
            'category',
            'inventory'
        ).all()

        serializer = ProductSerializer(products, many=True)

        return Response(serializer.data)

    elif request.method == 'POST':

        action = request.data.get('action')
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 0))

        try:
            product = Product.objects.get(id=product_id)

            inventory, created = Inventory.objects.get_or_create(
                product=product,
                defaults={'stock_quantity': 0}
            )

            if action == 'IMPORT':

                inventory.stock_quantity += quantity
                inventory.save()

                StockIn.objects.create(
                    product=product,
                    quantity=quantity,
                    import_price=request.data.get('import_price') or product.price
                )

            elif action == 'EXPORT':

                if inventory.stock_quantity < quantity:
                    return Response(
                        {'message': 'Số lượng tồn kho không đủ!'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                inventory.stock_quantity -= quantity
                inventory.save()

                StockOut.objects.create(
                    product=product,
                    quantity=quantity
                )

            return Response({
                'message': 'Cập nhật kho thành công!'
            })

        except Product.DoesNotExist:
            return Response(
                {'message': 'Không tìm thấy sản phẩm!'},
                status=status.HTTP_404_NOT_FOUND
            )