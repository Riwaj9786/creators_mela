from django.contrib import admin
from federal.models import Province, District, Municipality

# Register your models here.
@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    list_display_links = ('id', 'name')
    ordering = ('id',)


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ('name', 'province')
    list_display_links = ('name', 'province')
    search_fields = ('name',)
    list_filter = ('province',)
    ordering = ('province',)


@admin.register(Municipality)
class MunicipalityAdmin(admin.ModelAdmin):
    list_display = ('name', 'district', 'district__province', 'type')
    list_display_links = ('name', 'district', 'district__province', 'type')
    search_fields = ('name',)
    list_filter = ('district', 'district__province', 'type')
    ordering = ('district', 'district__province')