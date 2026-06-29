# chatbot/views.py

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.admin.views.decorators import staff_member_required

import json
import uuid
import logging

from .models import Conversation, Message, LeadCapture
from .gemini_service import MoonNovaChatbot


logger = logging.getLogger(__name__)

_chatbot_instance = None


def get_chatbot():
    """
    Lazy-load chatbot only when a user sends a message.
    This prevents database queries during Django startup/migrations.
    """
    global _chatbot_instance

    if _chatbot_instance is None:
        _chatbot_instance = MoonNovaChatbot()

    return _chatbot_instance


@csrf_exempt
@require_http_methods(["POST"])
def send_message(request):
    """Handle chat message and return AI response"""
    try:
        data = json.loads(request.body)

        user_message = data.get("message", "").strip()
        conversation_id = data.get("conversation_id")

        if not user_message:
            return JsonResponse({"error": "Message is required"}, status=400)

        if conversation_id:
            try:
                conversation = Conversation.objects.get(session_id=conversation_id)
            except Conversation.DoesNotExist:
                conversation_id = str(uuid.uuid4())
                conversation = Conversation.objects.create(session_id=conversation_id)
        else:
            conversation_id = str(uuid.uuid4())
            conversation = Conversation.objects.create(session_id=conversation_id)

        Message.objects.create(
            conversation=conversation,
            role="user",
            content=user_message,
        )

        history_messages = list(
            conversation.messages
            .values("role", "content")
            .order_by("created_at")[:20]
        )

        formatted_history = [
            {
                "role": msg["role"],
                "content": msg["content"],
            }
            for msg in history_messages
        ]

        chatbot = get_chatbot()
        bot_response = chatbot.get_response(user_message, formatted_history)

        Message.objects.create(
            conversation=conversation,
            role="bot",
            content=bot_response,
        )

        return JsonResponse({
            "response": bot_response,
            "conversation_id": conversation.session_id,
        })

    except Exception as e:
        logger.error(f"Error in send_message: {e}")
        return JsonResponse({
            "error": str(e),
            "response": "Something went wrong. Please try again or email us at info@moonnovasolutions.com.",
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def capture_lead(request):
    """Capture lead information from chatbot"""
    try:
        data = json.loads(request.body)

        conversation_id = data.get("conversation_id")
        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        phone = data.get("phone", "").strip()
        project_type = data.get("project_type", "").strip()
        message = data.get("message", "").strip()

        if not name or not email:
            return JsonResponse({"error": "Name and email are required"}, status=400)

        try:
            conversation = Conversation.objects.get(session_id=conversation_id)
        except Conversation.DoesNotExist:
            return JsonResponse({"error": "Conversation not found"}, status=404)

        conversation.user_name = name
        conversation.user_email = email
        conversation.save()

        LeadCapture.objects.create(
            conversation=conversation,
            name=name,
            email=email,
            phone=phone,
            project_type=project_type,
            message=message,
        )

        return JsonResponse({
            "success": True,
            "message": "Thank you! Our team will contact you within 24 hours.",
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@staff_member_required
def refresh_context(request):
    """Admin view to manually refresh chatbot context"""
    if request.method == "POST":
        chatbot = get_chatbot()
        chatbot.refresh_context()
        return JsonResponse({
            "success": True,
            "message": "Chatbot context refreshed successfully",
        })

    return JsonResponse({"error": "Method not allowed"}, status=405)


@staff_member_required
def dashboard(request):
    """Admin dashboard for chatbot analytics"""
    total_conversations = Conversation.objects.count()
    total_leads = LeadCapture.objects.count()
    pending_leads = LeadCapture.objects.filter(is_contacted=False).count()
    recent_messages = Message.objects.order_by("-created_at")[:50]

    context = {
        "total_conversations": total_conversations,
        "total_leads": total_leads,
        "pending_leads": pending_leads,
        "recent_messages": recent_messages,
    }

    return render(request, "chatbot/admin_dashboard.html", context)