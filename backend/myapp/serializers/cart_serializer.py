from rest_framework import serializers
from myapp.models import Product, CartItem

# ==========================================
# PRODUCT SERIALIZER
# ==========================================
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["id", "name", "price", "image"] # Xóa 'stock' ở đây


# ==========================================
# CART ITEM SERIALIZER
# ==========================================
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ["id", "product", "quantity", "subtotal"]

    def get_subtotal(self, obj):
        if not obj.product or not obj.product.price:
            return 0
        return float(obj.product.price) * obj.quantity


# ==========================================
# CHECKOUT SERIALIZER
# ==========================================
class CheckoutSerializer(serializers.Serializer):
    PAYMENT_CHOICES = (
        ("cod", "Cash on Delivery"),
        ("card", "Credit/Debit Card"),
    )

    fullname = serializers.CharField(error_messages={"blank": "Vui lòng nhập họ và tên"})
    phone = serializers.CharField(error_messages={"blank": "Vui lòng nhập số điện thoại"})
    address = serializers.CharField(error_messages={"blank": "Vui lòng nhập địa chỉ giao hàng"})
    note = serializers.CharField(required=False, allow_blank=True)
    payment = serializers.ChoiceField(choices=PAYMENT_CHOICES)

    def validate_phone(self, value):
        phone_cleaned = value.strip()
        if not phone_cleaned.isdigit():
            raise serializers.ValidationError("Số điện thoại chỉ được chứa các chữ số.")
        if len(phone_cleaned) < 9 or len(phone_cleaned) > 11:
            raise serializers.ValidationError("Số điện thoại phải từ 9 đến 11 chữ số.")
        return phone_cleaned