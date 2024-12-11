from django.db import models

# Create your models here.
class Province(models.Model):
    id = models.IntegerField(primary_key=True, unique=True)
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=25, unique=True)
    order = models.IntegerField()

    class Meta:
        verbose_name = "Province"
        verbose_name_plural = "1. Provinces"

    def __str__(self):
        return self.name
    

class District(models.Model):
    id = models.IntegerField(primary_key=True, unique=True)
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=100, unique=True)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name='district_in_province')
    order = models.IntegerField()

    class Meta:
        verbose_name = "District"
        verbose_name_plural = "2. Districts"

    def __str__(self):
        return self.name
    

class Municipality(models.Model):
    id = models.IntegerField(primary_key=True, unique=True)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=100, null=True)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='municipality_in_district')
    type = models.CharField(max_length=50)
    order = models.IntegerField()

    class Meta:
        verbose_name = "Municipality"
        verbose_name_plural = "3. Municipalities"

    def __str__(self):
        return self.name