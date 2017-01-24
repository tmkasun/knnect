from map_service.models import LkState
from map_service.models import SpatialObjects
from rest_framework_mongoengine import serializers


class LkStateSerializer(serializers.DocumentSerializer):
    class Meta:
        model = LkState


class SpatialObjectsSerializer(serializers.DocumentSerializer):
    class Meta:
        model = SpatialObjects
