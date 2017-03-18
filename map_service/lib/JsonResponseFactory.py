from django.http import HttpResponse, HttpResponseBadRequest
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser


class JSONResponseFactory(object):
    def __init__(self, data, status=200):
        content = JSONRenderer().render(data)
        kwargs = {'content_type': 'application/json'}
        if status == 400:
            self.response = HttpResponseBadRequest(content, **kwargs)
        else:
            self.response = HttpResponse(content, **kwargs)

    def get_response(self):
        return self.response
