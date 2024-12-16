from django.contrib import admin
from faqs.models import FrequentlyAskedQuestion
from faqs.serializers import FAQSerializer

# Register your models here.
@admin.register(FrequentlyAskedQuestion)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'answer')
    list_display_links = ('question', 'answer')
    search_fields = ('question',)