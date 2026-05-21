# myapp/api/admin_api.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from rest_framework.pagination import PageNumberPagination


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
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    stations = ChargingStation.objects.all().order_by('-id')

    # ==================== STATS ====================

    stats = {
        'total': stations.count(),
        'active': stations.filter(status='ACTIVE').count(),
        'maintenance': stations.filter(status='MAINTENANCE').count(),
        'inactive': stations.filter(status='INACTIVE').count(),
    }

    # ==================== PAGINATION ====================

    paginator = PageNumberPagination()
    paginator.page_size = 10

    result_page = paginator.paginate_queryset(
        stations,
        request
    )

    serializer = ChargingStationSerializer(
        result_page,
        many=True
    )

    return Response({
        'stations': serializer.data,

        'stats': stats,

        'pagination': {
            'count': paginator.page.paginator.count,
            'total_pages': paginator.page.paginator.num_pages,
            'current_page': paginator.page.number,
            'has_next': paginator.page.has_next(),
            'has_previous': paginator.page.has_previous(),
        }
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
    from django.db.models import Sum, F

    now = timezone.now()

    try:
        selected_month = int(request.GET.get('month', now.month))
        selected_year = int(request.GET.get('year', now.year))
    except:
        selected_month = now.month
        selected_year = now.year

    # LẤY TẤT CẢ ĐƠN HÀNG
    orders = Order.objects.all()

    # DOANH THU THÁNG
    revenue_month = orders.filter(
        created_at__month=selected_month,
        created_at__year=selected_year
    ).aggregate(
        total=Sum('total_price')
    )['total'] or 0

    # DOANH THU HÔM NAY
    revenue_today = orders.filter(
        created_at__date=now.date()
    ).aggregate(
        total=Sum('total_price')
    )['total'] or 0

    # CHI PHÍ & LỢI NHUẬN
    expense_month = float(revenue_month) * 0.6
    profit_month = float(revenue_month) * 0.4

    def format_money(value):
        return f"{int(value):,} VNĐ".replace(",", ".")

    stats = {
        'revenue_month': format_money(revenue_month),
        'expense_month': format_money(expense_month),
        'profit_month': format_money(profit_month),
        'revenue_today': format_money(revenue_today),
    }

    # DỮ LIỆU BIỂU ĐỒ
    monthly_revenue = []
    monthly_expense = []
    monthly_profit = []

    for month in range(1, 13):

        month_total = orders.filter(
            created_at__month=month,
            created_at__year=selected_year
        ).aggregate(
            total=Sum('total_price')
        )['total'] or 0

        revenue_billion = round(float(month_total) / 1_000_000_000, 2)

        monthly_revenue.append(revenue_billion)
        monthly_expense.append(round(revenue_billion * 0.6, 2))
        monthly_profit.append(round(revenue_billion * 0.4, 2))

    revenue_data = {
        'labels': [
            'T1', 'T2', 'T3', 'T4',
            'T5', 'T6', 'T7', 'T8',
            'T9', 'T10', 'T11', 'T12'
        ],
        'revenue': monthly_revenue,
        'expense': monthly_expense,
        'profit': monthly_profit,
    }

    # TOP SẢN PHẨM
    top_products_qs = OrderItem.objects.values(
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
            'revenue': format_money(p['total_revenue']),
        })

    return Response({
    'stats': stats,
    'revenue_data': revenue_data,
    'top_products': top_products,

    'selected_month': selected_month,
    'selected_year': selected_year,

    'months': [
        {'value': 1},
        {'value': 2},
        {'value': 3},
        {'value': 4},
        {'value': 5},
        {'value': 6},
        {'value': 7},
        {'value': 8},
        {'value': 9},
        {'value': 10},
        {'value': 11},
        {'value': 12},
    ],

    'years': [2024, 2025, 2026],
})