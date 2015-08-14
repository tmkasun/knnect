__author__ = 'tmkasun'

from services.eventProcessorAdminService import EventProcessor
from suds import WebFault

evn = EventProcessor()
try:
    a = evn.getActiveExecutionPlanConfiguration('geo_speed_alerts')
    print(a)
except WebFault, e:
    print(e)
