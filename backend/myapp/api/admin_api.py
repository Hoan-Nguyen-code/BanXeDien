# myapp/api/admin_api.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.db.models import Sum

from myapp.models import (
    User,
    Product,
    Order,
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

    users = User.objects.all().order_by('-date_joined')

    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)


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
def admin_stations_api(request):

    stations = ChargingStation.objects.all()

    serializer = ChargingStationSerializer(
        stations,
        many=True
    )

    return Response(serializer.data)