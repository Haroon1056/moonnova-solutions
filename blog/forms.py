from django import forms
from .models import BlogPost

class SearchForm(forms.Form):
    q = forms.CharField(
        required=False,
        widget=forms.TextInput(attrs={
            'placeholder': 'Search articles...',
            'class': 'search-input'
        })
    )
    category = forms.ChoiceField(required=False, widget=forms.Select(attrs={
        'class': 'category-select'
    }))
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from .models import Category
        categories = Category.objects.filter(is_active=True)
        self.fields['category'].choices = [('all', 'All Categories')] + [
            (cat.slug, cat.name) for cat in categories
        ]