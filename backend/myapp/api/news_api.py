import feedparser

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from myapp.serializers.news_serializer import NewsSerializer


@api_view(['GET'])
def get_news(request):
    url = (
        "https://news.google.com/rss/search?"
        "q=xe+điện+OR+xăng+dầu&hl=vi&gl=VN&ceid=VN:vi"
    )

    try:
        feed = feedparser.parse(url)

        # RSS lỗi
        if feed.bozo:
            return Response(
                {"error": "RSS parse error"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        # Không có dữ liệu
        if not feed.entries:
            return Response(
                {"error": "No data"},
                status=status.HTTP_204_NO_CONTENT
            )

        # Convert RSS -> JSON
        news_data = [
            NewsSerializer.from_rss_entry(entry)
            for entry in feed.entries[:50]
        ]

        # Serialize dữ liệu
        serializer = NewsSerializer(news_data, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )