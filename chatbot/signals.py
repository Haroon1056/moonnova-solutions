# chatbot/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from blog.models import BlogPost
from portfolio.models import Project
from .gemini_service import MoonNovaChatbot


@receiver(post_save, sender=BlogPost)
@receiver(post_save, sender=Project)
def refresh_chatbot_context(sender, instance, **kwargs):
    """Auto-refresh chatbot context when new blog or project is added"""
    if kwargs.get('created', False):
        try:
            chatbot = MoonNovaChatbot()
            chatbot.refresh_context()
        except Exception as e:
            print(f"Error refreshing chatbot context: {e}")