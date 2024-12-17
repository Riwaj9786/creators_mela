from accounts.models import Profile, AppUser
from events.models import RegisteredSession

from collections import Counter

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import IsAdminUser
from rest_framework import status

from federal.serializers import ProvinceSerializer

from django.db.models import Count, F
from django.utils import timezone

# Create your views here.
class ProfileAndRegistrationCountView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):
        
        return Response(
            {
                'registrations': self.count_registrations(),
                'approved': self.approved_accounts(),
                'rejected': self.rejected_accounts(),
                'pending': self.pending_accounts(),
                'total_users': self.total_users()
            },
            status=status.HTTP_200_OK
        )

    def count_registrations(self):
        number_of_registrations = RegisteredSession.objects.all().count()
        return number_of_registrations
    
    def approved_accounts(self):
        approved_accounts = Profile.objects.filter(status="Accepted").count()
        return approved_accounts
    
    def rejected_accounts(self):
        rejected_accounts = Profile.objects.filter(status="Rejected").count()
        return rejected_accounts
    
    def pending_accounts(self):
        pending_accounts = Profile.objects.filter(status="Pending").count()
        return pending_accounts
    
    def total_users(self):
        number_of_users = AppUser.objects.all().count()
        return number_of_users
    

class GenderCountAPIView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):
        
        return Response(
            {
                'responses': Profile.objects.exclude(gender__isnull=True).exclude(gender="").count(),
                'male': self.male_users(),
                'female': self.female_users(),
                'other': self.other_users(),
                'non_binary': self.non_binary_users(),
                'not_specified': self.not_specified_genders()
            },
            status=status.HTTP_200_OK
        )


    def male_users(self):
        count = Profile.objects.filter(gender="Male").count()
        return count

    def female_users(self):
        count = Profile.objects.filter(gender="Female").count()
        return count
    
    def other_users(self):
        count = Profile.objects.filter(gender="Other").count()
        return count
    
    def non_binary_users(self):
        count = Profile.objects.filter(gender="Non-Binary").count()
        return count
    
    def not_specified_genders(self):
        count = Profile.objects.filter(gender="Not Specified").count()
        return count


class ProvinceAnalyticsAPIView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):
        
        return Response(
            {
                'responses': Profile.objects.exclude(province__isnull=True).count(),
                'data': self.province_wise_count()
            },
            status=status.HTTP_200_OK
        )


    def province_wise_count(self):
        province_counts = Profile.objects.values('province').annotate(user_count=Count('id'))

        return province_counts


class UserAgeAnalyticsAPIView(APIView):
    permission_classes = (IsAdminUser,)

    def get(self, request, *args, **kwargs):
        return Response(
            {
                'responses': Profile.objects.exclude(date_of_birth__isnull=True).count(),
                'data': self.age_group_counts()
            },
            status=status.HTTP_200_OK
        )


    def age_group_counts(self):
        today = timezone.now().date()
        profiles = Profile.objects.values('date_of_birth')
        ages = []

        for profile in profiles:
            birth_date = profile['date_of_birth']
            if birth_date:
                print(birth_date)
                age = today.year - birth_date.year - ((today.month, today.day)<(birth_date.month, birth_date.day))
                print(age)
                ages.append(age)

        if not ages:
            return []

        min_age = min(ages)
        max_age = max(ages)

        age_groups = [
            {"range": (start, start + 6)} 
            for start in range(min_age // 6 * 6, (max_age // 6 + 1) * 6, 6)
        ]

        age_count = Counter(ages)

        age_group_counts = []
        for group in age_groups:
            count = sum(age_count[age] for age in range(group['range'][0], group['range'][1]+1))
            age_group_counts.append({
                "age_group": f"{group['range'][0]}-{group['range'][1] - 1}",
                "user_count": count,
            })

        return age_group_counts