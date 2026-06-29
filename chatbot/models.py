from django.db import models
from django.utils import timezone

class Conversation(models.Model):
    """Store chat conversations"""
    session_id = models.CharField(max_length=100, unique=True)
    user_email = models.EmailField(blank=True, null=True)
    user_name = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Conversation"
        verbose_name_plural = "Conversations"
    
    def __str__(self):
        return f"Conversation {self.session_id[:8]} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"
    
    def message_count(self):
        return self.messages.count()
    
    def last_message(self):
        return self.messages.first()


class Message(models.Model):
    """Store individual messages"""
    ROLE_CHOICES = [
        ('user', 'User'),
        ('bot', 'Bot'),
        ('system', 'System'),
    ]
    
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name = "Message"
        verbose_name_plural = "Messages"
    
    def __str__(self):
        return f"{self.role}: {self.content[:50]}"


class ChatbotSetting(models.Model):
    """Global chatbot settings"""
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField()
    description = models.CharField(max_length=200, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Chatbot Setting"
        verbose_name_plural = "Chatbot Settings"
    
    def __str__(self):
        return self.key


class LeadCapture(models.Model):
    """Store leads captured from chatbot"""
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='leads')
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    project_type = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    is_contacted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Lead Capture"
        verbose_name_plural = "Lead Captures"
    
    def __str__(self):
        return f"Lead: {self.name} - {self.email}"