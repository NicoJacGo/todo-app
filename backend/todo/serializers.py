from rest_framework import serializers
from .models import Todo, ItemChange

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('id', 'title', 'description', 'completed')


class ItemChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemChange
        fields = ('id', 'item', 'change_type', 'previous_state', 'current_state', 'timestamp')
