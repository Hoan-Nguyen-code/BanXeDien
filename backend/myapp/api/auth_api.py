from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import login, logout

from myapp.serializers.auth_serializer import (
    LoginSerializer,
    RegisterSerializer,
)


class LoginAPI(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.validated_data["user"]
            remember = serializer.validated_data["remember"]

            login(request, user)

            # Ghi nhớ đăng nhập
            if not remember:
                request.session.set_expiry(0)
            else:
                request.session.set_expiry(1209600)

            return Response(
                {
                    "success": True,
                    "message": f"Chào mừng {user.username}!",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "role": user.role,
                    },
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class RegisterAPI(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Đăng ký thành công!",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                        "role": user.role,
                    },
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            {
                "success": False,
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class LogoutAPI(APIView):

    def post(self, request):

        logout(request)

        return Response(
            {
                "success": True,
                "message": "Đăng xuất thành công!",
            },
            status=status.HTTP_200_OK,
        )