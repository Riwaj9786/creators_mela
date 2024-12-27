import os
from faker import Faker
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from io import BytesIO
from PIL import Image
from accounts.models import Profile

class Command(BaseCommand):
   help = "Populate profiles with fake profile pictures"
   faker = Faker()

   def handle(self, *args, **kwargs):

      profiles = Profile.objects.all()

      for profile in profiles:
         if not profile.profile_picture:
               # Generate a fake image
               image = self._generate_fake_image()

               # Save the image to the profile
               profile.profile_picture.save(
                  f"fake_profile_{profile.id}.jpg", ContentFile(image.getvalue())
               )
               profile.save()
               self.stdout.write(f"Profile {profile.id} updated with fake picture.")


   def _generate_fake_image(self):
      """Generate a simple fake image."""
      image = Image.new("RGB", (200, 200), (self.faker.random_int(0, 255), self.faker.random_int(0, 255), self.faker.random_int(0, 255)))
      buffer = BytesIO()
      image.save(buffer, format="JPEG")
      buffer.seek(0)
      return buffer