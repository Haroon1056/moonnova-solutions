from django.shortcuts import render

from django.shortcuts import render

def service_list(request):
    services = [
        {
            'title': 'Web & Mobile Development',
            'slug': 'web-mobile-development',
            'description': 'Custom web and mobile applications with cutting-edge technologies.',
            'icon': '💻',
            'services': [
                'Custom Web Development',
                'Mobile App Development',
                'Custom Software Development',
                'E-Commerce Web Development',
                'Scalable Business Applications'
            ],
            'color': 'from-purple-600 to-blue-500'
        },
        {
            'title': 'AI & Machine Learning',
            'slug': 'ai-ml',
            'description': 'Intelligent systems and machine learning models for business transformation.',
            'icon': '🤖',
            'services': [
                'AI Development Services',
                'AI-Powered Chatbots',
                'Custom Machine Learning Models',
                'Predictive Analysis',
                'Deep Learning Solutions',
                'Natural Language Processing (NLP)',
                'Sentiment Analysis'
            ],
            'color': 'from-blue-600 to-cyan-500'
        },
        {
            'title': 'Data & Analysis',
            'slug': 'data-analysis',
            'description': 'Data analytics and business intelligence solutions.',
            'icon': '📊',
            'services': [
                'Data Analysis & Visualization',
                'Business Insights & Reporting',
                'Data Cleaning & Preparation',
                'Data Scraping & Automation',
                'Web Scraping Solutions'
            ],
            'color': 'from-green-600 to-emerald-500'
        },
        {
            'title': 'Digital Marketing & SEO',
            'slug': 'digital-marketing',
            'description': 'Growth-focused digital marketing strategies.',
            'icon': '📈',
            'services': [
                'Digital Marketing',
                'Search Engine Optimization (SEO)',
                'Website SEO & Performance Optimization',
                'Local SEO & Google Business Profile Optimization'
            ],
            'color': 'from-yellow-600 to-orange-500'
        },
    ]
    context = {
        'page_title': 'Our Services',
        'services': services,
    }
    return render(request, 'services/service_list.html', context)

# Individual service views
def custom_web_development(request):
    """Custom Web Development service page"""
    return render(request, 'services/custom_web_development.html')

def ecommerce_web_development(request):
    """E-Commerce Web Development service page"""
    return render(request, 'services/ecommerce_development.html')

def custom_software_development(request):
    """Custom Software Development service page"""
    return render(request, 'services/custom_software_development.html')

def mobile_app_development(request):
    """Mobile App Development service page"""
    return render(request, 'services/mobile_app_development.html')

def ai_ml_solutions(request):
    context = {'page_title': 'AI & ML Solutions'}
    return render(request, 'services/ai_ml_solutions.html', context)

def data_analytics(request):
    context = {'page_title': 'Data Analytics'}
    return render(request, 'services/data_analytics.html', context)

def seo_digital_growth(request):
    context = {'page_title': 'SEO & Digital Growth'}
    return render(request, 'services/seo_digital_growth.html', context)