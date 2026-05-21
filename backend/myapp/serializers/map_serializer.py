from rest_framework import serializers
from myapp.models import ChargingStation, SearchHistory


class ChargingStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChargingStation
        fields = [
            "id",
            "name",
            "address",
            "latitude",
            "longitude",
            "charger_type",
            "power",
            "total_ports",
            "available_ports",
            "status",
            "image",
            "created_at",
            "updated_at",
        ]


class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = [
            "id",
            "query",
            "display_name",
            "latitude",
            "longitude",
            "image_url",
            "searched_at",
        ]