from rest_framework_mongoengine import viewsets
from mongoengine.queryset.visitor import Q
from map_service.serializers import LkStateSerializer
from map_service.serializers import SpatialObjectsSerializer
from map_service.models import LkState
from map_service.models import SpatialObjects
from datetime import datetime

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser


# https://medium.com/@vasjaforutube/django-mongodb-django-rest-framework-mongoengine-ee4eb5857b9a#.pzfldga4w

class JSONResponse(HttpResponse):
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)


class LastKnownService(object):
    # serializer_class = LkStateSerializer
    # queryset = LkState.objects.all()
    # many = True


    @csrf_exempt
    def lk_states(self):
        states = LkState.objects.all()
        serialized = LkStateSerializer(states, many=True)
        return JSONResponse(serialized.data)


class ObjectService(object):
    @csrf_exempt
    def session_path(request, id):
        session = LkState.objects.get(id=id)
        limit = request.GET.get('limit', False)
        session_start_time = session.lk_properties['updated_at']
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        db_query = Q(properties__created_at__lte=current_time) & Q(properties__created_at__gte=session_start_time)
        path = SpatialObjects.objects(db_query).limit(int(limit)) if limit else SpatialObjects.objects(db_query)
        serialized_path = SpatialObjectsSerializer(path, many=True)
        return JSONResponse(serialized_path.data)
