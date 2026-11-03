from django.db import models


class TestResult(models.Model):

    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    wpm = models.PositiveIntegerField()

    accuracy = models.FloatField()

    correct_chars = models.PositiveIntegerField()

    incorrect_chars = models.PositiveIntegerField()

    duration = models.PositiveIntegerField()

    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.wpm} WPM - {self.accuracy}%"