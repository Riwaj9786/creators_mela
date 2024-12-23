from django.core.management.base import BaseCommand
from faqs.models import FrequentlyAskedQuestion

from faker import Faker

class Command(BaseCommand):
   help = "Generate Fake FAQs"

   def handle(self, *args, **kwargs):
      fake = Faker()

      num_records = 5

      for _ in range(num_records):
         question = fake.sentence(nb_words=6)
         answer = fake.paragraph(nb_sentences=3)

         FrequentlyAskedQuestion.objects.create(
            question=question,
            answer=answer
         )

      self.stdout.write(self.style.SUCCESS("Fake Frequently Asked Questions generated!"))