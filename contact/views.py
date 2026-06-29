# from django.shortcuts import render, redirect
# from django.contrib import messages

# def contact(request):
#     if request.method == 'POST':
#         # Process form data
#         name = request.POST.get('name')
#         email = request.POST.get('email')
#         message = request.POST.get('message')
        
#         # Here you would typically:
#         # 1. Save to database
#         # 2. Send email
#         # 3. Process the contact request
        
#         messages.success(request, 'Thank you for your message! We will get back to you soon.')
#         return redirect('contact:contact_success')
    
#     context = {
#         'page_title': 'Contact Us',
#     }
#     return render(request, 'contact/contact.html', context)


from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings

def contact(request):
    """Render the contact page"""
    return render(request, 'contact/contact.html')

def submit_inquiry(request):
    """Handle contact form submission"""
    if request.method == 'POST':
        # Get form data
        fullname = request.POST.get('fullname')
        email = request.POST.get('email')
        phone = request.POST.get('phone', '')
        company = request.POST.get('company', '')
        project_type = request.POST.get('project_type')
        budget = request.POST.get('budget')
        timeline = request.POST.get('timeline')
        details = request.POST.get('details')
        
        # Here you would typically:
        # 1. Save to database
        # 2. Send email notification
        # 3. Send auto-reply to client
        
        # For now, just show success message
        messages.success(request, 'Your inquiry has been sent! We\'ll respond within 24 hours.')
        
        return redirect('contact:contact')
    
    return redirect('contact:contact')

def contact_success(request):
    context = {
        'page_title': 'Message Sent Successfully',
    }
    return render(request, 'contact/contact_success.html', context)