<!-- Folder Structure -->

moonnova-solutions/
│
├── moonnova/                    # Project settings
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── core/                        # Main pages (Home, About, etc.)
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
│   └── urls.py
│
├── services/                    # Services app
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
│
├── portfolio/                   # Portfolio/Projects
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
│
├── blog/                        # Blog for SEO
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
│
├── contact/                     # Contact form
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   └── views.py
│
├── static/                      # Static files
│   ├── css/
│   │   ├── base.css
│   │   ├── header.css
│   │   ├── footer.css
│   │   └── home.css
│   ├── js/
│   │   ├── base.js
│   │   ├── header.js
│   │   ├── footer.js
│   │   ├── animations.js
│   │   └── home.js
│   ├── images/
│   └── fonts/
│
├── templates/                   # Base templates
│   ├── base.html
│   ├── includes/
│   │   ├── header.html
│   │   ├── footer.html
│   │   └── navigation.html
│   │
│   ├── core/                    # Core app templates
│   │   ├── home.html
│   │
│   ├── services/                # Services templates
│   │
│   ├── portfolio/               # Portfolio templates
│   │
│   ├── blog/                    # Blog templates
│   │
│   └── contact/                 # Contact templates
│
├── media/                       # User uploaded files
├── requirements.txt
├── manage.py
└── .env                         # Environment variables