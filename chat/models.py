from django.db import models
from django.contrib.auth.models import User
import uuid
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    telephone = models.CharField(max_length=20)
    date_naissance = models.DateField(null=True, blank=True)
    genre = models.CharField(max_length=10, choices=[('M', 'Masculin'), ('F', 'Féminin')])
    niveau = models.CharField(max_length=10, choices=[('6eme', '6ème'), ('5eme', '5ème'), ('4eme', '4ème'), ('3eme', '3ème')])
    ville = models.CharField(max_length=100)

    def __str__(self):
        return f"Profil de {self.user.username}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

class Session(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    title = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='session')
    created = models.DateTimeField(auto_now_add=True)
    cours_name = models.TextField(default='cours name')

    def __str__(self):
        return f"Session {self.title}"

class Chat(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True)
    created = models.DateTimeField(auto_now_add=True)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='chats', blank=True, null=True)
    message = models.TextField()
    response = models.TextField()

    def __str__(self):
        return self.message