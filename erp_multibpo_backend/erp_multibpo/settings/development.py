from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', 'erp_backend_testes', 'app-testes.multibpo.com.br']


# Trusted Origins para Django Admin / CSRF
CSRF_TRUSTED_ORIGINS = [
    "https://app-testes.multibpo.com.br",
    "http://localhost:5015",
]

# CORS Configuration for Next.js
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5013",  # Frontend teste
    "http://erp_frontend_testes:3000",
    "https://app-testes.multibpo.com.br",
    "http://192.168.1.4:5013",
    "http://127.0.0.1:5013",
]


CORS_ALLOW_CREDENTIALS = True

# Debug Toolbar
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE = ['debug_toolbar.middleware.DebugToolbarMiddleware'] + MIDDLEWARE
    INTERNAL_IPS = ['127.0.0.1', 'localhost']

# ------------------------------
# Celery Configuration
# ------------------------------
CELERY_BROKER_URL = 'redis://redis:6379/0'       # Redis container
CELERY_RESULT_BACKEND = 'redis://redis:6379/0'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'America/Sao_Paulo'

# Celery Beat schedule
# from apps.noticias.tasks import CELERY_BEAT_SCHEDULE
#CELERY_BEAT_SCHEDULE = CELERY_BEAT_SCHEDULE

CELERY_BEAT_SCHEDULE = {}

