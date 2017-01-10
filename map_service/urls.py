from django.conf.urls import url, include
from . import views
from rest_framework_mongoengine import routers

router = routers.DefaultRouter()
router.register(r'status', views.KnnectViewSet, 'Status')

urlpatterns = [
    url(r'^', include(router.urls)),
]
