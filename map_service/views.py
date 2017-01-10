from rest_framework_mongoengine import viewsets
from map_service.serializers import LkStateSerializer
from map_service.models import LkState


class KnnectViewSet(viewsets.ModelViewSet):
    lookup_field = 'id'
    serializer_class = LkStateSerializer

    def get_lk_state(self):
        return LkState.objects.all()
