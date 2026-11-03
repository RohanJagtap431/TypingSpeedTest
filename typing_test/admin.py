from django.contrib import admin
from .models import TestResult


@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):

    list_display = (
        'wpm',
        'accuracy',
        'duration',
        'difficulty',
        'created_at',
    )

    list_filter = (
        'difficulty',
        'duration',
        'created_at',
    )

    search_fields = (
        'difficulty',
    )

    ordering = ('-created_at',)