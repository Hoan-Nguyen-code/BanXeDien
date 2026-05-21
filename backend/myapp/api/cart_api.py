from django.shortcuts import get_object_or_404
from django.db.models import Sum
from django.db import transaction
from django.utils import timezone

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication # <--- Giữ nguyên import này

from myapp.models import (
    Cart, CartItem, Product,
    Order, OrderItem, Payment
)

from myapp.serializers.cart_serializer import (
    CartItemSerializer,
    ProductSerializer,
    CheckoutSerializer
)

# ==========================================
# CẤU HÌNH BỎ QUA KIỂM TRA CSRF TOKEN
# ==========================================
class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # Không làm gì cả -> Bỏ qua kiểm tra CSRF bảo mật


# ==========================================
# 1. XEM CHI TIẾT GIỎ HÀNG
# ==========================================
class CartAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]  # <--- ĐỔI SANG LỚP NÀY
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items = CartItem.objects.filter(cart=cart).select_related("product")

        total_price = sum(
            float(item.product.price or 0) * item.quantity for item in items
        )

        cart_count = items.aggregate(total=Sum("quantity"))["total"] or 0
        recommended_products = Product.objects.order_by("-id")[:4]

        return Response({
            "success": True,
            "message": "Lấy thông tin giỏ hàng thành công",
            "data": {
                "items": CartItemSerializer(items, many=True).data,
                "total_price": total_price,
                "cart_count": cart_count,
                "recommended_products": ProductSerializer(recommended_products, many=True).data
            }
        }, status=status.HTTP_200_OK)


# ==========================================
# 2. THÊM SẢN PHẨM VÀO GIỎ HÀNG
# ==========================================
class AddToCartAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]  # <--- ĐỔI SANG LỚP NÀY
    permission_classes = [IsAuthenticated]

    def post(self, request, product_id):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product = get_object_or_404(Product, id=product_id)

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={"quantity": 1}
        )

        if not created:
            item.quantity += 1
            item.save()

        cart_count = CartItem.objects.filter(cart=cart).aggregate(total=Sum("quantity"))["total"] or 0

        return Response({
            "success": True,
            "message": f"Đã thêm '{product.name}' vào giỏ hàng",
            "data": {
                "cart_count": cart_count
            }
        }, status=status.HTTP_201_CREATED)


# ==========================================
# 3. XÓA MÓN ĐỒ RA KHỎI GIỎ HÀNG
# ==========================================
class RemoveFromCartAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]  # <--- ĐỔI SANG LỚP NÀY
    permission_classes = [IsAuthenticated]

    def delete(self, request, item_id):
        cart = get_object_or_404(Cart, user=request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        
        product_name = item.product.name
        item.delete()

        return Response({
            "success": True,
            "message": f"Đã xóa sản phẩm '{product_name}' khỏi giỏ hàng"
        }, status=status.HTTP_200_OK)


# ==========================================
# 4. TĂNG SỐ LƯỢNG (+1) TẠI GIỎ HÀNG
# ==========================================
class IncreaseQuantityAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]  # <--- ĐỔI SANG LỚP NÀY
    permission_classes = [IsAuthenticated]

    def post(self, request, item_id):
        item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)
        
        item.quantity += 1
        item.save()

        return Response({
            "success": True,
            "message": "Tăng số lượng thành công"
        }, status=status.HTTP_200_OK)


# ==========================================
# 5. GIẢM SỐ LƯỢNG (-1) TẠI GIỎ HÀNG
# ==========================================
class DecreaseQuantityAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]  # <--- ĐỔI SANG LỚP NÀY
    permission_classes = [IsAuthenticated]

    def post(self, request, item_id):
        item = get_object_or_404(CartItem, id=item_id, cart__user=request.user)

        if item.quantity > 1:
            item.quantity -= 1
            item.save()
            msg = "Giảm số lượng thành công"
        else:
            item.delete()
            msg = "Đã xóa sản phẩm khỏi giỏ hàng"

        return Response({
            "success": True,
            "message": msg
        }, status=status.HTTP_200_OK)


# ==========================================
# 6. ĐẶT HÀNG / THANH TOÁN (CHECKOUT)
# ==========================================
class CheckoutAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]  # <--- ĐỔI SANG LỚP NÀY
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = get_object_or_404(Cart, user=request.user)
        items = CartItem.objects.filter(cart=cart).select_related("product")

        if not items.exists():
            return Response({
                "success": False,
                "message": "Giỏ hàng trống, không thể thanh toán."
            }, status=status.HTTP_400_BAD_REQUEST)

        payment_method = serializer.validated_data["payment"]

        with transaction.atomic():
            order = Order.objects.create(
                user=request.user,
                total_price=0
            )

            order_items = []
            for item in items:
                order_items.append(
                    OrderItem(
                        order=order,
                        product=item.product,
                        quantity=item.quantity,
                        price=item.product.price
                    )
                )

            OrderItem.objects.bulk_create(order_items)
            order.calculate_total()

            Payment.objects.create(
                order=order,
                method="CASH" if payment_method == "cod" else "CARD",
                amount=order.total_price,
                status="PENDING"
            )

            items.delete()
            cart.total_price = 0
            cart.save()

        return Response({
            "success": True,
            "message": "Đặt hàng thành công!",
            "data": {
                "order_id": order.id,
                "redirect": "/success" if payment_method == "cod" else f"/qr/{order.id}"
            }
        }, status=status.HTTP_201_CREATED)


# ==========================================
# 7. LẤY MÃ QR VIETQR
# ==========================================
class PaymentQRAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]  # <--- ĐỔI SANG LỚP NÀY
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)

        qr_url = (
            f"https://img.vietqr.io/image/"
            f"970422-123456789-compact.png"
            f"?amount={int(order.total_price)}"
            f"&addInfo=ORDER{order.id}"
            f"&accountName=NGUYEN VAN A"
        )

        return Response({
            "success": True,
            "data": {
                "order": {
                    "id": order.id,
                    "total_price": order.total_price
                },
                "qr_url": qr_url
            }
        }, status=status.HTTP_200_OK)


# ==========================================
# 8. XÁC NHẬN GIAO DỊCH THÀNH CÔNG
# ==========================================
class PaymentSuccessAPIView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]  # <--- ĐỔI SANG LỚP NÀY
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(Order, id=order_id, user=request.user)
        payment = get_object_or_404(Payment, order=order)
        
        payment.status = "SUCCESS"
        payment.paid_at = timezone.now()
        payment.save()

        return Response({
            "success": True,
            "message": "Hệ thống xác nhận giao dịch thanh toán thành công."
        }, status=status.HTTP_200_OK)