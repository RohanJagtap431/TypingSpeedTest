from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("history/", views.history, name="history"),

    path(
        "history/delete/<int:result_id>/",
        views.delete_result,
        name="delete_result"
    ),

    path(
        "history/clear/",
        views.clear_all_history,
        name="clear_all_history"
    ),
]