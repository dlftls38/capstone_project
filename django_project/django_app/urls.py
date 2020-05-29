from django.urls import path
from . import views

urlpatterns = [

    path('/slackevent', views.slackevent, name='event'),
]
