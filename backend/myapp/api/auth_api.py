from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import login, logout
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode

from myapp.models import User

from myapp.serializers.auth_serializer import (
    LoginSerializer,
    RegisterSerializer,
    ForgetPasswordSerializer,
    PasswordResetConfirmSerializer
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

                        # ROLE
                        "role": user.role,

                        # DJANGO ADMIN
                        "is_superuser": user.is_superuser,
                        "is_staff": user.is_staff,
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

                        "is_superuser": user.is_superuser,
                        "is_staff": user.is_staff,
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


# Đảm bảo miễn trừ kiểm tra CSRF hoàn toàn cho class này
@method_decorator(csrf_exempt, name='dispatch')
class LogoutAPI(APIView):
    # Cho phép bất kỳ ai (kể cả phiên lỗi) gọi vào để xóa hoàn toàn session
    permission_classes = [] 

    def post(self, request):
        # 1. Thực hiện đăng xuất hủy session trên Server
        logout(request)
        
        # 2. Xóa thủ công session trong cookie nếu còn sót lại
        response = Response({"detail": "Đăng xuất thành công"}, status=status.HTTP_200_OK)
        if 'sessionid' in request.COOKIES:
            response.delete_cookie('sessionid')
            
        return response
class ForgetPasswordAPIView(APIView):

    def post(self, request):

        serializer = ForgetPasswordSerializer(
            data=request.data
        )

        if serializer.is_valid():

            email = serializer.validated_data["email"]

            user = User.objects.get(email=email)

            token = default_token_generator.make_token(user)

            uid = urlsafe_base64_encode(
                str(user.pk).encode()
            )

            reset_link = (
    f"http://localhost:5173"
    f"/reset-password/{uid}/{token}"
)
            subject = "Yêu cầu đặt lại mật khẩu"

            message = f"""
Chào {user.username}

Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.

Nhấn vào liên kết dưới đây để đặt lại mật khẩu:

{reset_link}

Nếu không phải bạn,
hãy bỏ qua email này.
"""

            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )

            return Response(
                {
                    "message": (
                        "Hướng dẫn đặt lại mật khẩu "
                        "đã được gửi tới email."
                    )
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class PasswordResetConfirmAPIView(APIView):

    def post(self, request, uidb64, token):

        serializer = PasswordResetConfirmSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(
                uidb64=uidb64,
                token=token
            )

            return Response(
                {
                    "message": (
                        "Mật khẩu đã được thay đổi thành công!"
                    )
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )    