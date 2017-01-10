from map_service.models import LkState
from rest_framework_mongoengine import serializers


class LkStateSerializer(serializers.DocumentSerializer):
    class Meta:
        model = LkState
