import django_filters

from banana_core.models import Product


class CharInFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    pass


class ProductFilter(django_filters.FilterSet):
    category = CharInFilter(field_name='category', lookup_expr='in')
    sleeve_type = CharInFilter(field_name='sleeve_type', lookup_expr='in')
    style = CharInFilter(field_name='style', lookup_expr='in')
    pattern = CharInFilter(field_name='pattern', lookup_expr='in')
    neck_style = CharInFilter(field_name='neck_style', lookup_expr='in')
    is_active = django_filters.BooleanFilter()

    class Meta:
        model = Product
        fields = ['category', 'sleeve_type', 'style', 'pattern', 'neck_style', 'is_new_arrival', 'is_active']