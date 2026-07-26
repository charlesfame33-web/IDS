import os, sys, django
sys.path.insert(0, r'C:\Users\ALEXIS\Desktop\senpai\testapp')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()
from django.contrib.auth.models import User
u = User.objects.filter(username='screenshot').first()
if u:
    print('exists')
else:
    # Create user for screenshots
    User.objects.create_user('screenshot', 'shot@test.com', 'test1234')
    print('created')
