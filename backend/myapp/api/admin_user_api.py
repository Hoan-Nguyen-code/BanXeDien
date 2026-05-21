from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from rest_framework.pagination import PageNumberPagination

from myapp.models import User
from myapp.serializers.admin_serializer import UserSerializer


# ==================== CHECK ADMIN ====================

def is_admin(user):
    return user.is_authenticated and user.role == User.Role.ADMIN


# ==================== USERS LIST ====================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_users_api(request):

    if not is_admin(request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    users_list = User.objects.all().order_by('-date_joined')

    role = request.GET.get('role')

    if role:
        users_list = users_list.filter(role=role)

    stats = {
        'total': User.objects.count(),
        'active': User.objects.filter(is_active=True).count(),
        'admin': User.objects.filter(role=User.Role.ADMIN).count(),
        'new_this_month': User.objects.filter(
            date_joined__gte=timezone.now() - timedelta(days=30)
        ).count()
    }

    paginator = PageNumberPagination()
    paginator.page_size = 10

    paginated_users = paginator.paginate_queryset(
        users_list,
        request
    )

    serializer = UserSerializer(
        paginated_users,
        many=True
    )

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
    }, status=status.HTTP_200_OK)


# ==================== ADD USER ====================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_add_user_api(request):

    if not is_admin(request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    data = request.data

    if User.objects.filter(username=data.get('username')).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=data.get('username'),
        email=data.get('email'),
        password=data.get('password'),
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        phone=data.get('phone'),
        address=data.get('address'),
        role=data.get('role', 'CUSTOMER'),
        is_active=data.get('is_active', True),
    )

    serializer = UserSerializer(user)

    return Response(
        serializer.data,
        status=status.HTTP_201_CREATED
    )


# ==================== EDIT USER ====================

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def admin_edit_user_api(request, user_id):

    if not is_admin(request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    user = get_object_or_404(User, id=user_id)

    data = request.data

    user.email = data.get('email', user.email)
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.phone = data.get('phone', user.phone)
    user.address = data.get('address', user.address)
    user.role = data.get('role', user.role)
    user.is_active = data.get('is_active', user.is_active)

    if data.get('password'):
        user.set_password(data.get('password'))

    user.save()

    serializer = UserSerializer(user)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )


# ==================== DELETE USER ====================

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def admin_delete_user_api(request, user_id):

    if not is_admin(request.user):
        return Response(
            {'error': 'Permission denied'},
            status=status.HTTP_403_FORBIDDEN
        )

    user = get_object_or_404(User, id=user_id)

    if user == request.user:
        return Response(
            {'error': 'Cannot delete yourself'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.delete()

    return Response(
        {'message': 'User deleted successfully'},
        status=status.HTTP_200_OK
    )