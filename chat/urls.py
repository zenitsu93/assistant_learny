from django.urls import path
from . import views


urlpatterns = [
    path('', views.home, name='home'),
    path('cours/', views.cours, name='cours'),
    path('compte/', views.compte_view, name='compte'),
    path('parametre/', views.parametre_view, name='parametre'),
    path('cours/<str:cours_name>/', views.chatbot, name='chatbot'),
    path('logout/', views.user_logout, name='logout'),
    path('save_chat/', views.save_chat, name='save_chat'),
    
    path('new_chat/', views.new_chat, name='new_chat'),
    path('load/<str:session_id>', views.load_chats, name='load'),
    path('delete/<str:session_id>', views.delete_session, name='delete_session'),
    path('get_chatbot_response/', views.get_chatbot_response, name='get_chatbot_response'),

    ]

