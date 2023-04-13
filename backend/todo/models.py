from django.db import models

class Todo(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class ItemChange(models.Model):
    CHANGE_TYPE_CHOICES = (
        ('created', 'Created'),
        ('updated', 'Updated'),
        ('deleted', 'Deleted'),
    )

    item = models.ForeignKey(Todo, on_delete=models.CASCADE, related_name='changes')
    change_type = models.CharField(max_length=10, choices=CHANGE_TYPE_CHOICES)
    previous_state = models.TextField(blank=True, null=True)
    current_state = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.change_type} {self.item}"
