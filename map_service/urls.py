__author__ = 'tmkasun'

from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^speed_alert$', views.get_speed_alert, name='get_speed'),
    url(r'^set_speed_alert', views.set_speed_alert, name='set_speed'),
    url(r'^proximity_alert', views.proximity_alert, name='proximity')
]