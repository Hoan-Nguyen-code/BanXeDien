from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from myapp.models import (
    Product,
    Inventory,
    StockIn,
    StockOut
)

from myapp.serializers.admin_serializer import ProductSerializer


# ==================== CHECK ADMIN ====================

def is_admin(user):
    return user.is_authenticated and user.role == 'ADMIN'


# ==================== PRODUCTS API ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def admin_products_api(request):

    # ==================== CHECK ROLE ====================

    if not is_admin(request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    # =========================================================
    # GET PRODUCTS
    # =========================================================

    if request.method == 'GET':

        products = Product.objects.select_related(
            'category'
        ).all().order_by('-created_at')

        # ================= PAGINATION =================

        paginator = PageNumberPagination()
        paginator.page_size = 10

        paginated_products = paginator.paginate_queryset(
            products,
            request
        )

        serializer = ProductSerializer(
            paginated_products,
            many=True
        )

        products_data = serializer.data

        # ================= ADD STATUS =================

        for product in products_data:

            stock_quantity = 0

            if product.get('inventory'):
                stock_quantity = product['inventory'].get(
                    'stock_quantity',
                    0
                )

            if stock_quantity > 5:
                product['status'] = 'IN_STOCK'

            elif stock_quantity > 0:
                product['status'] = 'LOW_STOCK'

            else:
                product['status'] = 'OUT_OF_STOCK'

        # ================= STATS =================

        all_products = Product.objects.all()

        in_stock = 0
        low_stock = 0
        out_of_stock = 0

        for p in all_products:

            qty = 0

            try:
                qty = p.inventory.stock_quantity

            except:
                qty = 0

            if qty > 5:
                in_stock += 1

            elif qty > 0:
                low_stock += 1

            else:
                out_of_stock += 1

        return Response({
            'results': products_data,

            'stats': {
                'total_products': all_products.count(),
                'in_stock': in_stock,
                'low_stock': low_stock,
                'out_of_stock': out_of_stock,
            },

            'pagination': {
                'count': paginator.page.paginator.count,
                'total_pages': paginator.page.paginator.num_pages,
                'current_page': paginator.page.number,
                'has_next': paginator.page.has_next(),
                'has_previous': paginator.page.has_previous(),
            }
        })

    # =========================================================
    # IMPORT / EXPORT
    # =========================================================

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

            # ================= IMPORT =================

            if action == 'IMPORT':

                inventory.stock_quantity += quantity
                inventory.save()

                StockIn.objects.create(
                    product=product,
                    quantity=quantity,
                    import_price=request.data.get('import_price') or product.price,
                    imported_by=request.user
                )

            # ================= EXPORT =================

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
                    quantity=quantity,
                    exported_by=request.user
                )

            return Response({
                'message': 'Cập nhật kho thành công!'
            })

        except Product.DoesNotExist:

            return Response(
                {'message': 'Không tìm thấy sản phẩm!'},
                status=status.HTTP_404_NOT_FOUND
            )