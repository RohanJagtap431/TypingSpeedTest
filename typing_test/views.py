import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie

from .models import TestResult

from django.db.models import Avg, Max, Count

from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages


@ensure_csrf_cookie
@require_http_methods(["GET", "POST"])
def home(request):

    if request.method == "GET":
        return render(request, "typing_test/home.html")

    try:
        data = json.loads(request.body)

        wpm = int(data.get("wpm", 0))
        accuracy = float(data.get("accuracy", 0))
        correct_chars = int(data.get("correct_chars", 0))
        incorrect_chars = int(data.get("incorrect_chars", 0))
        duration = int(data.get("duration", 1))
        difficulty = data.get("difficulty", "easy")

        if not 1 <= duration <= 5:
            return JsonResponse(
                {"error": "Invalid duration."},
                status=400
            )

        if difficulty not in ["easy", "medium", "hard"]:
            return JsonResponse(
                {"error": "Invalid difficulty."},
                status=400
            )

        if not (
            0 <= wpm <= 1000
            and 0 <= accuracy <= 100
            and 0 <= correct_chars <= 100000
            and 0 <= incorrect_chars <= 100000
        ):
            return JsonResponse(
                {"error": "Invalid result values."},
                status=400
            )

        result = TestResult.objects.create(
            wpm=wpm,
            accuracy=accuracy,
            correct_chars=correct_chars,
            incorrect_chars=incorrect_chars,
            duration=duration,
            difficulty=difficulty
        )

        return JsonResponse({
            "success": True,
            "message": "Result saved successfully!",
            "result_id": result.id
        })

    except (ValueError, TypeError, json.JSONDecodeError):
        return JsonResponse(
            {"error": "Invalid request data."},
            status=400
        )
        
        
def history(request):

    # Get latest 20 test results
    results = TestResult.objects.order_by("-created_at")[:20]

    # Calculate dashboard statistics
    stats = TestResult.objects.aggregate(
        total_tests=Count("id"),
        average_wpm=Avg("wpm"),
        best_wpm=Max("wpm"),
        average_accuracy=Avg("accuracy"),
    )

    # Convert results into chart-friendly data
    chart_results = list(reversed(results))

    chart_labels = [
        result.created_at.strftime("%d %b %H:%M")
        for result in chart_results
    ]

    chart_wpm = [
        result.wpm
        for result in chart_results
    ]

    context = {
        "results": results,
        "total_tests": stats["total_tests"] or 0,
        "average_wpm": round(stats["average_wpm"] or 0, 1),
        "best_wpm": stats["best_wpm"] or 0,
        "average_accuracy": round(
            stats["average_accuracy"] or 0, 1
        ),
        "chart_labels": chart_labels,
        "chart_wpm": chart_wpm,
    }

    return render(
        request,
        "typing_test/history.html",
        context
    )
    
@staff_member_required
@require_POST
def delete_result(request, result_id):

    result = get_object_or_404(TestResult, id=result_id)

    result.delete()

    messages.success(request, "Test result deleted successfully!")

    return redirect("history")


@staff_member_required
@require_POST
def clear_all_history(request):

    deleted_count, _ = TestResult.objects.all().delete()

    messages.success(
        request,
        f"{deleted_count} database records deleted successfully!"
    )

    return redirect("history")

