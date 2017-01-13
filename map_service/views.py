from rest_framework_mongoengine import viewsets
from map_service.serializers import LkStateSerializer
from map_service.models import LkState

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


class KnnectViewSet(object):
    # serializer_class = LkStateSerializer
    # queryset = LkState.objects.all()
    # many = True


    @csrf_exempt
    def lk_states(self):
        states = LkState.objects.all()
        serialized = LkStateSerializer(states, many=True)
        return JSONResponse(serialized.data)
