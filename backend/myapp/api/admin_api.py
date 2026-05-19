# myapp/api/admin_api.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum

from myapp.models import (
    User,
    Product,
    Order,
    OrderItem,
    ChargingStation,
)

from myapp.serializers.admin_serializer import (
    UserSerializer,
    ProductSerializer,
    OrderSerializer,
    ChargingStationSerializer,
)


# ==================== CHECK ADMIN ====================

def is_admin(user):
    return user.is_authenticated and user.role == User.Role.ADMIN


# ==================== DASHBOARD ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_api(request):

    if not is_admin(request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    stats = {
        'total_users': User.objects.count(),
        'total_products': Product.objects.count(),
        'total_orders': Order.objects.count(),
        'total_stations': ChargingStation.objects.count(),
        'revenue': Order.objects.aggregate(
            total=Sum('total_price')
        )['total'] or 0,
    }

    recent_orders = Order.objects.select_related(
        'user'
    ).prefetch_related(
        'items__product'
    ).order_by('-created_at')[:5]

    serializer = OrderSerializer(recent_orders, many=True)

    return Response({
        'stats': stats,
        'recent_orders': serializer.data,
    })


# ==================== USERS ====================



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_api(request):
    if not is_admin(request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    # 1. Lấy danh sách toàn bộ user, xếp theo ngày tham gia mới nhất
    users_list = User.objects.all().order_by('-date_joined')

    # 2. Tính toán số liệu thống kê (stats) đổ lên các thẻ Card ở UI
    stats = {
        'total': users_list.count(),
        'active': users_list.filter(is_active=True).count(),
        'admin': users_list.filter(role=User.Role.ADMIN).count(),
        'new_this_month': users_list.filter(
            date_joined__gte=timezone.now() - timedelta(days=30)
        ).count()
    }

    # 3. Kích hoạt bộ phân trang tự động (Mỗi trang hiển thị 10 dòng)
    paginator = PageNumberPagination()
    paginator.page_size = 10
    paginated_users = paginator.paginate_queryset(users_list, request)

    # 4. Chuyển đổi dữ liệu đã phân trang qua Serializer
    serializer = UserSerializer(paginated_users, many=True)

    # 5. Phản hồi cấu trúc JSON hoàn chỉnh
    return Response({
        'stats': stats,
        'pagination': {
            'count': paginator.page.paginator.count,
            'next': paginator.get_next_link(),
            'previous': paginator.get_previous_link(),
            'total_pages': paginator.page.paginator.num_pages,
            'current_page': paginator.page.number,
        },
        'results': serializer.data
    }, status=status.HTTP_OK)


# ==================== PRODUCTS ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_products_api(request):

    if not is_admin(request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    products = Product.objects.select_related(
        'category',
        'inventory'
    ).all()

    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data)


# ==================== ORDERS ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_orders_api(request):

    if not is_admin(request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    orders = Order.objects.select_related(
        'user'
    ).prefetch_related(
        'items__product'
    ).order_by('-created_at')

    serializer = OrderSerializer(orders, many=True)

    return Response(serializer.data)


# ==================== STATIONS ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stations_api(request):
    if not is_admin(request.user):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    stations = ChargingStation.objects.all().order_by('-id')
    
    # Tính toán thống kê
    stats = {
        'total': stations.count(),
        'active': stations.filter(status='ACTIVE').count(),
        'maintenance': stations.filter(status='MAINTENANCE').count(),
        'inactive': stations.filter(status='INACTIVE').count(),
    }

    serializer = ChargingStationSerializer(stations, many=True)

    # Đã thêm dấu ngoặc đóng ')' cho hàm Response
    return Response({
        'stats': stats,
        'stations': serializer.data
    })

# ==================== FINANCE (QUẢN LÝ TÀI CHÍNH) ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_taichinh_api(request):
    if not is_admin(request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    from django.utils import timezone
    from django.db.models import F, Sum
    
    now = timezone.now()
    
    try:
        selected_month = int(request.GET.get('month', now.month))
        selected_year = int(request.GET.get('year', now.year))
    except ValueError:
        selected_month = now.month
        selected_year = now.year

    today = now.date()
    VALID_STATUS = ['CONFIRMED', 'COMPLETED', 'SHIPPING']

    # 1. Tính tổng doanh thu tháng
    revenue_month = Order.objects.filter(
        created_at__month=selected_month,
        created_at__year=selected_year,
        status__in=VALID_STATUS
    ).aggregate(total=Sum('total_price'))['total'] or 0

    # 2. Tính doanh thu hôm nay
    revenue_today = Order.objects.filter(
        created_at__date=today,
        status__in=VALID_STATUS
    ).aggregate(total=Sum('total_price'))['total'] or 0

    # Tạm tính Chi phí (60%) và Lợi nhuận (40%) cho UI React
    expense_month = round(float(revenue_month) * 0.6, 2)
    profit_month = round(float(revenue_month) * 0.4, 2)

    def fmt(num):
        return f"{int(num):,} VNĐ".replace(',', '.')

    stats = {
        'revenue_month': fmt(revenue_month),
        'expense_month': fmt(expense_month),
        'profit_month': fmt(profit_month),
        'revenue_today': fmt(revenue_today),
    }

    # 3. Tính dữ liệu biểu đồ 12 tháng (Đơn vị: Tỷ VNĐ)
    monthly_revenue = []
    monthly_expense = []
    monthly_profit = []

    for m in range(1, 13):
        rev = Order.objects.filter(
            created_at__month=m,
            created_at__year=selected_year,
            status__in=VALID_STATUS
        ).aggregate(total=Sum('total_price'))['total'] or 0

        rev_billion = round(float(rev) / 1_000_000_000, 2)
        exp_billion = round(rev_billion * 0.6, 2)
        pro_billion = round(rev_billion * 0.4, 2)

        monthly_revenue.append(rev_billion)
        monthly_expense.append(exp_billion)
        monthly_profit.append(pro_billion)

    revenue_data = {
        'labels': ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'],
        'revenue': monthly_revenue,
        'expense': monthly_expense,
        'profit': monthly_profit,
    }

    # 4. Thống kê Top 5 sản phẩm bán chạy
    top_products_qs = OrderItem.objects.filter(
        order__status__in=VALID_STATUS
    ).values(
        'product__name'
    ).annotate(
        total_sold=Sum('quantity'),
        total_revenue=Sum(F('quantity') * F('price'))
    ).order_by('-total_revenue')[:5]

    top_products = []
    for p in top_products_qs:
        top_products.append({
            'name': p['product__name'],
            'sold': p['total_sold'],
            'revenue': fmt(p['total_revenue']),
        })

    months_options = [{'value': i} for i in range(1, 13)]
    years_options = list(range(2024, now.year + 1))

    return Response({
        'stats': stats,
        'revenue_data': revenue_data,
        'top_products': top_products,
        'selected_month': selected_month,
        'selected_year': selected_year,
        'months': months_options,
        'years': years_options,
    }, status=status.HTTP_OK)