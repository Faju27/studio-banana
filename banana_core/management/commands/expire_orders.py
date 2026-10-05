from django.core.management.base import BaseCommand
from django.utils import timezone

from banana_core.models import Order

# For development run this code in Terminal
# python manage.py expire_orders

class Command(BaseCommand):
    help = "Expire unpaid pending orders"

    def handle(self, *args, **kwargs):
        # .update() automatically returns the total number of rows changed in the DB
        expired_count = Order.objects.filter(
            status='pending',
            payment_status='pending',
            expires_at__lt=timezone.now()
        ).update(
            status='expired'
        )

        # This prints a green success message in your terminal
        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully processed cleanup. {expired_count} order(s) expired."
            )
        )
