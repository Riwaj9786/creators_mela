from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_invitation_email(subject, message, from_mail, email):
    try:
        send_mail(subject, message, from_mail, [email], fail_silently=False)
        print('Mail Sent!')
    except Exception as e:
        print(f"Error sending email to {email}: {str(e)}")
        return False
    return True