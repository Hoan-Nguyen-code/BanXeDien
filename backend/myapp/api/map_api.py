from rest_framework.decorators import api_view
from rest_framework.response import Response

from myapp.models import ChargingStation, SearchHistory
from myapp.serializers.map_serializer import (
    ChargingStationSerializer,
    SearchHistorySerializer
)

# ==============================
# STATION API
# ==============================

@api_view(["GET"])
def station_list(request):
    stations = ChargingStation.objects.all()
    serializer = ChargingStationSerializer(stations, many=True)

    return Response({
        "stations": serializer.data
    })


# ==============================
# SEARCH HISTORY API
# ==============================

@api_view(["GET"])
def search_history_list(request):
    history = SearchHistory.objects.all()[:50]
    serializer = SearchHistorySerializer(history, many=True)

    return Response({
        "history": serializer.data
    })