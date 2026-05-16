from rest_framework import serializers
from django.contrib.auth import authenticate

from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.utils.http import urlsafe_base64_decode

from myapp.models import User


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    remember = serializers.BooleanField(default=False)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError(
                "Tên đăng nhập hoặc mật khẩu không đúng!"
            )

        data["user"] = user
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(
        write_only=True,
        min_length=8
    )

    password2 = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password1",
            "password2",
        ]

    def validate_username(self, value):
        if len(value) < 3:
            raise serializers.ValidationError(
                "Tên đăng nhập phải có ít nhất 3 ký tự!"
            )

        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "Tên đăng nhập đã tồn tại!"
            )

        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email đã được sử dụng!"
            )

        return value

    def validate(self, data):
        password1 = data.get("password1")
        password2 = data.get("password2")

        if password1 != password2:
            raise serializers.ValidationError(
                "Mật khẩu không khớp!"
            )

        if password1.isdigit():
            raise serializers.ValidationError(
                "Mật khẩu không được toàn số!"
            )

        return data

    def create(self, validated_data):
        validated_data.pop("password2")

        password = validated_data.pop("password1")

        user = User.objects.create_user(
            password=password,
            role=User.Role.CUSTOMER,
            **validated_data
        )

class ForgetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email không tồn tại trong hệ thống!"
            )
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        new_password = attrs.get("new_password")
        confirm_password = attrs.get("confirm_password")

        if new_password != confirm_password:
            raise serializers.ValidationError(
                "Mật khẩu xác nhận không khớp!"
            )

        validate_password(new_password)

        return attrs

    def save(self, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except Exception:
            raise serializers.ValidationError(
                "Liên kết không hợp lệ!"
            )

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError(
                "Liên kết đã hết hạn hoặc không hợp lệ!"
            )

        user.set_password(self.validated_data["new_password"])
        user.save()

        return user