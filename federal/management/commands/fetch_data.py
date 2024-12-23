import requests
from django.core.management.base import BaseCommand
from federal.models import Province, District, Municipality

class Command(BaseCommand):
    help = "Fetch province, district, and municipality data from an API and populate the database"

    def handle(self, *args, **kwargs):
        try:

            # Fetch Provinces
            province_url = 'https://bipadportal.gov.np/api/v1/province/'
            province_response = requests.get(province_url)

            print(province_response.status_code)

            if province_response.status_code == 200:
                provinces_result = province_response.json()
                provinces = provinces_result.get('results', [])

                if not provinces:
                    self.stderr.write("No Provinces found in the API response!")
                    return 

                for province_data in provinces:
                    province, created = Province.objects.get_or_create(
                        id = province_data['id'],
                        name = province_data['title'],
                        code = province_data['code'],
                        defaults = {
                            'order': province_data['order'],
                        }
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Province Created: {province.name}'))
                    else:
                        self.stdout.write(self.style.WARNING(f'Province already exists {province.name}'))

                self.stdout.write(self.style.SUCCESS('Provinces fetched and stored successfully!'))
            else:
                self.stderr.write("Failed to fetch Provinces.")


            # Fetch Districts
            district_url = 'https://bipadportal.gov.np/api/v1/district/'
            district_response = requests.get(district_url)

            if district_response.status_code == 200:
                district_results = district_response.json()
                districts = district_results.get('results', [])

                if not districts:
                    self.stderr.write("No Districts in the API response!")
                    return 
                
                for district_data in districts:
                    province_code = district_data.get('province')
                    province = Province.objects.filter(id=province_code).first()

                    if not province:
                        self.stderr.write(f"Province with code {province_code} not found for district {district_data['title']}")
                        continue

                    district, created = District.objects.get_or_create(
                        id = district_data['id'],
                        name = district_data['title'],
                        code = district_data['code'],
                        province = province,
                        defaults = {
                            'order': district_data['order'],
                        }
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'District Created: {district.name}'))
                    else:
                        self.stdout.write(self.style.WARNING(f'District already exists {district.name}'))

                self.stdout.write(self.style.SUCCESS('Districts fetched and stored successfully!'))
            else:
                self.stderr.write("Failed to fetch Districts.")


            # Fetch Municipalities
            municipality_url = 'https://bipadportal.gov.np/api/v1/municipality/'
            municipality_response = requests.get(municipality_url)

            if municipality_response.status_code == 200:
                municipality_results = municipality_response.json()
                municipalities = municipality_results.get('results', [])

                if not municipalities:
                    self.stderr.write("No Municipalities in the API response!")
                    return 
                
                for municipality_data in municipalities:
                    district_code = municipality_data.get('district')
                    district = District.objects.filter(id=district_code).first()

                    if not district:
                        self.stderr.write(f"District with code {district_code} not found for district {municipality_data['title']}")
                        continue

                    municipality, created = Municipality.objects.get_or_create(
                        id = municipality_data['id'],
                        name = municipality_data['title'],
                        code = municipality_data['code'],
                        district = district,
                        type = municipality_data['type'],
                        defaults = {
                            'order': municipality_data['order'],
                        }
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Municipality Created: {municipality.name}'))
                    else:
                        self.stdout.write(self.style.WARNING(f'Municipality already exists {municipality.name}'))

                self.stdout.write(self.style.SUCCESS('Municipalities fetched and stored successfully!'))
            else:
                self.stderr.write("Failed to fetch Municipalities.")


        except Exception as e:
            self.stderr.write(f"An error occurred: {str(e)}")