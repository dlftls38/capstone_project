"""
WSGI config for django_project project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/
"""

import os
from slacker import Slacker

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_project.settings")

application = get_wsgi_application()


token = 'xoxb-951760360900-983050911556-1TZzXI9OX2utzpr6PKylwMZZ'
slack = Slacker(token)

slack.chat.post_message('#general', '접속되었습니다. ID를 입력해주세요')