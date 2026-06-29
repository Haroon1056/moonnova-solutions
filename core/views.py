from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.conf import settings
from django.contrib import messages


class HomeView(TemplateView):
    template_name = "core/home.html"

    @method_decorator(cache_page(settings.CACHE_TIMEOUT))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Page metadata only. No database tables needed.
        context["meta_title"] = "MoonNova Solutions | Premium Technology & Innovation Partner"
        context["meta_description"] = (
            "Transform your business with cutting-edge technology solutions from "
            "MoonNova Solutions. AI development, web solutions, data analytics, "
            "and digital innovation."
        )
        context["meta_keywords"] = (
            "technology solutions, web development, AI solutions, "
            "data analytics, digital transformation"
        )
        context["meta_image"] = "images/og-home.jpg"
        context["meta_url"] = self.request.build_absolute_uri()

        return context


def about(request):
    context = {
        "page_title": "About Us",
        "meta_description": "Learn about MoonNova Solutions and our mission to deliver cutting-edge technology solutions.",
    }
    return render(request, "core/about.html", context)


def team(request):
    context = {
        "page_title": "Our Team",
    }
    return render(request, "core/team.html", context)


def careers(request):
    context = {
        "page_title": "Careers",
    }
    return render(request, "core/careers.html", context)


def privacy_policy(request):
    context = {
        "page_title": "Privacy Policy",
    }
    return render(request, "core/privacy_policy.html", context)


def terms_of_service(request):
    context = {
        "page_title": "Terms of Service",
    }
    return render(request, "core/terms_of_service.html", context)


def cookies_policy(request):
    context = {
        "page_title": "Cookies Policy",
    }
    return render(request, "core/cookies-policy.html", context)


def consulting(request):
    return render(request, "core/consulting.html")


def book_consultation(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        company = request.POST.get("company", "")
        message = request.POST.get("message")

        messages.success(
            request,
            "Consultation request sent! We'll contact you within 24 hours."
        )

        return redirect("core:consulting")

    return redirect("core:consulting")