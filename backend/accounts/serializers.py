# Django Packages
from django.contrib.auth import authenticate, login

# DRF Packages
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

# App Packages
from accounts.models import User


#  Django Registration, Login, Logout, Reset Password and Set New Password
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=68,
        min_length=8,
        write_only=True,
        error_messages={
            "min_length": "Password must be at least 8 characters long.",
            "max_length": "Password must be at most 68 characters long.",
        },
    )
    password2 = serializers.CharField(
        max_length=68,
        min_length=8,
        write_only=True,
        error_messages={
            "min_length": "Confirm Password must be at least 8 characters long.",
            "max_length": "Confirm Password must be at most 68 characters long.",
        },
    )

    class Meta:
        model = User
        fields = ["email", "username", "password", "password2"]

    def validate(self, attrs):
        password = attrs.get("password", "")
        password2 = attrs.get("password2", "")
        if password != password2:
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    def create(self, validated_data):
        email = str(validated_data["email"]).lower()
        username = str(validated_data.get("username")).lower()
        password = validated_data.get("password")

        user = User.objects.create_user(
            email=email,
            username=username,
            password=password,
        )

        return user


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255, min_length=6)
    password = serializers.CharField(max_length=68, write_only=True)
    access_token = serializers.CharField(max_length=255, read_only=True)
    refresh_token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "access_token", "refresh_token"]

    def validate(self, attrs):
        email = str(attrs.get("email")).lower()
        password = attrs.get("password")
        request = self.context.get("request")
        user = authenticate(request, email=email, password=password)
        if not user:
            raise AuthenticationFailed("Invalid credentials, try again")

        login(request, user)  # This logs the user in and updates last_login

        user_token = user.tokens()
        return {
            "email": user.email,
            "full_name": user.get_full_name,
            "access_token": str(user_token.get("access")),
            "refresh_token": str(user_token.get("refresh")),
        }
