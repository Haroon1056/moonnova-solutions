from django.contrib import admin
from .models import Conversation, Message, ChatbotSetting, LeadCapture


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    fields = ['role', 'content', 'created_at']
    readonly_fields = ['created_at']
    ordering = ['created_at']


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'session_id', 'user_name', 'user_email', 'message_count', 'created_at', 'is_active']
    list_filter = ['is_active', 'created_at']
    search_fields = ['session_id', 'user_name', 'user_email']
    readonly_fields = ['session_id', 'created_at', 'updated_at']
    inlines = [MessageInline]
    fieldsets = (
        ('Conversation Info', {
            'fields': ('session_id', 'is_active')
        }),
        ('User Info (if provided)', {
            'fields': ('user_name', 'user_email'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'conversation', 'role', 'content_preview', 'created_at']
    list_filter = ['role', 'created_at']
    search_fields = ['content']
    readonly_fields = ['created_at']
    
    def content_preview(self, obj):
        return obj.content[:100] + '...' if len(obj.content) > 100 else obj.content
    content_preview.short_description = 'Message Preview'


@admin.register(ChatbotSetting)
class ChatbotSettingAdmin(admin.ModelAdmin):
    list_display = ['key', 'value_preview', 'updated_at']
    search_fields = ['key', 'description']
    
    def value_preview(self, obj):
        return obj.value[:100] + '...' if len(obj.value) > 100 else obj.value
    value_preview.short_description = 'Value'


@admin.register(LeadCapture)
class LeadCaptureAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'project_type', 'is_contacted', 'created_at']
    list_filter = ['is_contacted', 'project_type', 'created_at']
    search_fields = ['name', 'email', 'phone', 'message']
    actions = ['mark_as_contacted']
    
    def mark_as_contacted(self, request, queryset):
        queryset.update(is_contacted=True)
    mark_as_contacted.short_description = "Mark selected leads as contacted"
    
    fieldsets = (
        ('Lead Information', {
            'fields': ('name', 'email', 'phone', 'project_type')
        }),
        ('Message', {
            'fields': ('message',)
        }),
        ('Status', {
            'fields': ('is_contacted',),
            'classes': ('collapse',)
        }),
    )