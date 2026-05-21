# myapp/serializers/admin_serializers.py

from rest_framework import serializers
from myapp.models import (
    User,
    Product,
    Category,
    Inventory,
    Order,
    OrderItem,
    ChargingStation,
    StockIn,
    StockOut,
)

# ==================== USER ====================

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'address',
            'role',
            'is_active',
            'date_joined',
        ]


# ==================== CATEGORY ====================

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


# ==================== INVENTORY ====================

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['stock_quantity']


# ==================== PRODUCT ====================
class ProductSerializer(serializers.ModelSerializer):

    category = CategorySerializer(read_only=True)

    inventory = InventorySerializer(read_only=True)

    stock_quantity = serializers.SerializerMethodField()

    category_name = serializers.CharField(
        source='category.name',
        read_only=True
    )

    class Meta:
        model = Product

        fields = [
            'id',
            'name',
            'description',
            'price',
            'image',
            'is_active',

            'category',
            'category_name',

            'inventory',
            'stock_quantity',

            'created_at',
        ]

    def get_stock_quantity(self, obj):

        try:
            return obj.inventory.stock_quantity
        except:
            return 0


# ==================== ORDER ITEM ====================

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'quantity',
            'price',
        ]


# ==================== ORDER ====================

class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'status',
            'total_price',
            'created_at',
            'items',
        ]


# ==================== CHARGING STATION ====================

class ChargingStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChargingStation
        fields = '__all__'


# ==================== STOCK IN ====================

class StockInSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = StockIn
        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'import_price',
            'imported_at',
        ]


# ==================== STOCK OUT ====================

class StockOutSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = StockOut
        fields = [
            'id',
            'product',
            'product_name',
            'quantity',
            'exported_at',
        ]