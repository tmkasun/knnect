from rest_framework_mongoengine import viewsets
from mongoengine.queryset.visitor import Q
from map_service.serializers import LkStateSerializer
from map_service.serializers import SpatialObjectsSerializer
from map_service.models import LkState
from map_service.models import SpatialObjects
from datetime import datetime

from django.views.decorators.csrf import csrf_exempt
from map_service.lib.JsonResponseFactory import JSONResponseFactory
from map_service.lib.SpatialUtils import SpatialUtils
from map_service.lib.SpatialUtils import SpatialCons


# https://medium.com/@vasjaforutube/django-mongodb-django-rest-framework-mongoengine-ee4eb5857b9a#.pzfldga4w

class LastKnownService(object):
    # serializer_class = LkStateSerializer
    # queryset = LkState.objects.all()
    # many = True


    @csrf_exempt
    def lk_states(self):
        states = LkState.objects.all()
        serialized = LkStateSerializer(states, many=True)
        return JSONResponseFactory(serialized.data).get_response()


class ObjectService(object):
    @csrf_exempt
    def session_path(request, id):
        session = LkState.objects.get(id=id)
        limit = request.GET.get('limit', False)
        session_start_time = session.lk_properties['updated_at']
        current_time = datetime.now().strftime(SpatialCons.DATE_TIME_FORMAT)
        db_query = Q(id=id) & Q(properties__created_at__lte=current_time) & Q(
            properties__created_at__gte=session_start_time)
        path = SpatialObjects.objects(db_query).limit(int(limit)) if limit else SpatialObjects.objects(db_query)
        serialized_path = SpatialObjectsSerializer(path, many=True)
        return JSONResponseFactory(serialized_path.data).get_response()

    @csrf_exempt
    def history(request, id):
        try:
            start_time = request.GET.get(SpatialCons.START_TIME)
            end_time = request.GET.get(SpatialCons.END_TIME)
            SpatialUtils.validate_date(start_time)
            SpatialUtils.validate_date(end_time)
        except ValueError as e:
            return JSONResponseFactory({"error": str(e)}, 400).get_response()
        db_query = Q(id=id) & Q(properties__created_at__lte=end_time) & Q(properties__created_at__gte=start_time)
        path = SpatialObjects.objects(db_query)
        serialized_path = SpatialObjectsSerializer(path, many=True)
        return JSONResponseFactory(serialized_path.data).get_response()
