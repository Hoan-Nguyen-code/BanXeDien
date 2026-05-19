from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from myapp.models import Order


@api_view(["POST"])
def confirm_payment(request, order_id):
    try:
        order = Order.objects.get(id=order_id)

        order.status = "paid"
        order.save()

        try:
            send_mail(
                subject=f"Hóa đơn đơn hàng #{order.id}",
                message=f"""
Cảm ơn bạn đã mua hàng!

Mã đơn: {order.id}
Tổng tiền: {order.total_price}đ
Trạng thái: Đã thanh toán
""",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[order.user.email],  # ✅ đúng chỗ
                fail_silently=False,
            )
            print("EMAIL SENT TO:", order.user.email)

        except Exception as mail_error:
            print("MAIL ERROR:", mail_error)

        return Response({"success": True})

    except Order.DoesNotExist:
        return Response({"success": False, "error": "Not found"}, status=404)

    except Exception as e:
        print("QR API ERROR:", e)
        return Response({"success": False, "error": str(e)}, status=500)