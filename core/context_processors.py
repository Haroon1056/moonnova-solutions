def site_settings(request):
    return {
        'site_name': 'MoonNova Solutions',
        'site_description': 'Modern Tech Agency specializing in AI, Data Science, and Digital Solutions',
        'contact_email': 'contact@moonnova.com',
        'contact_phone': '+1 (555) 123-4567',
        'social_links': {
            'linkedin': 'https://linkedin.com/company/moonnova',
            'twitter': 'https://twitter.com/moonnova',
            'facebook': 'https://facebook.com/moonnova',
            'instagram': 'https://instagram.com/moonnova',
            'youtube': 'https://youtube.com/moonnova',
        }
    }