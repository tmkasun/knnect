from django.http.response import HttpResponse
from django.shortcuts import render

from lib.wso2.services.eventProcessorAdminService import EventProcessor
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def proximity_alert(request):
    pass

def get_speed_alert(request):
    speed_value = -1  # TODO: This value should fetch from organization.globals.speed_limit {MongoDB}
    context = {
        'speed_value': speed_value
    }
    return render(request, 'map_service/speed_alert.html', context=context)


def set_speed_alert(request):
    evnt_proc = EventProcessor()
    speed_limit = request.POST['speedAlertValue'][0]
    alert_template = open(os.path.join(BASE_DIR, 'map_service/templates/map_service/xml/geo_speed_alert.xml'))
    placeholder_pattern = re.compile(r'\$speedAlertValue')
    alert_query = placeholder_pattern.sub(speed_limit, alert_template.read())
    response = evnt_proc.editActiveExecutionPlanConfiguration(alert_query, 'geo_speed_alert')
    print(response)
    return HttpResponse("Ok done")
