import os
import random
from faker import Faker

from accounts.models import UserType, AppUser, Profile
from federal.models import Province, District, Municipality

from django.contrib.auth import get_user_model


fake = Faker()

user = get_user_model()


def generate_users():
   user_types = ['attendee', 'speaker', 'team', 'performer']
   provinces = list(Province.objects.all())
   districts = list(District.objects.all())
   municipalities = list(Municipality.objects.all())

   for _ in range(50):
      email = fake.email()
      name = fake.name()
      password = 'password123'

      user_type_name = random.choice(user_types)
      user_type = UserType.objects.get_or_create(name=user_type_name)

      user = AppUser.objects.create_user(
         email = email,
         name = name,
         password = password,
         user_type = user_type[0],
         is_active = True
      )

      profile, created = Profile.objects.get_or_create(user=user)

      if created:
         profile.phone = fake.phone_number()
         profile.date_of_birth = fake.date_of_birth()
         profile.gender = random.choice(['Male', 'Female', 'Other', 'Non-Binary', 'Not Specified'])
         profile.province = random.choice(provinces)
         profile.district = random.choice(districts)
         profile.municipality = random.choice(municipalities)
         profile.status = random.choice(['Accepted', 'Pending', 'Rejected'])
         profile.is_international = random.choice([True, False])
         profile.interest = fake.text(max_nb_chars=200)
         profile.bio = fake.text(max_nb_chars=450)
         profile.heard_from = random.choice(['Social Media', 'Advertisement', 'Friends/Family', 'Our Website', 'News/Information'])
         profile.save()
         print(f"Profile created successfully: {user.name}")
      else:
         profile.phone = fake.phone_number()
         profile.date_of_birth = fake.date_of_birth()
         profile.gender = random.choice(['Male', 'Female', 'Other', 'Non-Binary', 'Not Specified'])
         profile.province = random.choice(provinces)
         profile.district = random.choice(districts)
         profile.municipality = random.choice(municipalities)
         profile.status = random.choice(['Accepted', 'Pending', 'Rejected'])
         profile.is_international = random.choice([True, False])
         profile.interest = fake.text(max_nb_chars=200)
         profile.bio = fake.text(max_nb_chars=450)
         profile.heard_from = random.choice(['Social Media', 'Advertisement', 'Friends/Family', 'Our Website', 'News/Information'])
         profile.save()
         print(f"Profile updated successfully: {user.name}")



if __name__ == '__main__':
   generate_users()