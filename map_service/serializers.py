from map_service.models import LkState
from map_service.models import SpatialObjects
from rest_framework_mongoengine import serializers


class LkStateSerializer(serializers.DocumentSerializer):
    class Meta:
        model = LkState
        fields = '__all__'

class SpatialObjectsSerializer(serializers.DocumentSerializer):
    class Meta:
        model = SpatialObjects
        fields = '__all__'
