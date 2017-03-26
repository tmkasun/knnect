from django.conf.urls import url, include
from . import views
from rest_framework_mongoengine import routers

router = routers.DefaultRouter()
router.register(r'status', views.LastKnownService, 'Status')

urlpatterns = [
    # url(r'^', include(router.urls)),
    url(r'^lk_states', views.LastKnownService.lk_states),
    url(r'^session_path/(?P<id>\w+)/$', views.ObjectService.session_path),
    url(r'^history/(?P<id>\w+)/$', views.ObjectService.history),
    url(r'^history_dates/(?P<id>\w+)/$', views.ObjectService.history_dates),
]
