from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *
from rest_framework import status


class ReactView(APIView):

    serializer_class = ReactSerializer

    def get(self, request):
        output = [{"employee": output.employee, "department": output.department, "id": output.id}
                  for output in React.objects.all()]
        return Response(output)


    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        
    def delete(self, request, pk=None):
        if pk is None:
            return Response({"error": "No ID provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            react_instance = React.objects.get(pk=pk)
            react_instance.delete()
            return Response({'message':"Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except React.DoesNotExist:
            return Response({'message': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        

    
    def put(self, request, pk=None):
        # if pk is None:
        #     return Response({"error": "No ID provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            react_instance = React.objects.get(pk=pk)
            serializer = ReactSerializer(react_instance, data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data)
        
        except React.DoesNotExist:
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)