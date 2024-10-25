from django.shortcuts import redirect, render, get_object_or_404
from django.http import JsonResponse
import uuid
import markdown
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from chat.models import Chat, Session
from response import generate_response, make_title

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.views.decorators.csrf import csrf_protect
from django.db import transaction
from django.contrib import messages
from .models import UserProfile



@csrf_protect
def home(request):
    if request.user.is_authenticated:
        return redirect('cours')
    
    if request.method == 'POST':
        form_type = request.POST.get('form_type')
        if form_type == 'login':
            return handle_login(request)
        elif form_type == 'register':
            return handle_register(request)
    
    return render(request, 'home.html')

def handle_login(request):
    email = request.POST.get('email')
    password = request.POST.get('password')

    user = authenticate(request, username=email, password=password)
    if user is not None:
        login(request, user)
        return redirect('cours')
    else:
        return render(request, 'home.html', {'login_error': 'Email ou mot de passe incorrect'})

@transaction.atomic
def handle_register(request):
    nom = request.POST.get('nom')
    prenom = request.POST.get('prenom')
    email = request.POST.get('email')
    telephone = request.POST.get('telephone')
    date_naissance = request.POST.get('date_naissance')
    genre = request.POST.get('genre')
    niveau = request.POST.get('niveau')
    ville = request.POST.get('ville')
    password = request.POST.get('password')

    # Validation de base
    if not all([nom, prenom, email, telephone, date_naissance, genre, niveau, ville, password]):
        return render(request, 'home.html', {'register_error': 'Tous les champs sont requis'})

    try:
        validate_email(email)
    except ValidationError:
        return render(request, 'home.html', {'register_error': 'Email invalide'})

    if User.objects.filter(email=email).exists():
        return render(request, 'home.html', {'register_error': 'Cet email est déjà utilisé'})

    # Création de l'utilisateur
    try:
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=prenom,
            last_name=nom
        )

        # Mise à jour du profil utilisateur
        user.profile.telephone = telephone
        user.profile.date_naissance = date_naissance
        user.profile.genre = genre
        user.profile.niveau = niveau
        user.profile.ville = ville
        user.profile.save()

        login(request, user)
        return redirect('cours')
    except Exception as e:
        return render(request, 'home.html', {'register_error': f"Erreur lors de l'inscription: {str(e)}"})

@login_required
def user_logout(request):
    logout(request)
    return redirect('home')


def generate_uuid():
    return str(uuid.uuid4())

def save_chat(request, session_id, message, response):
    session = get_object_or_404(Session, id=session_id)
    session.title =make_title(message)
    session.save()
    chat = Chat.objects.create(
        session=session,
        message=message,
        response=response
    )
    
@login_required(login_url='home')
def cours(request):
    return render(request, 'cours.html')

@login_required(login_url='home')
def compte_view(request):
    return render(request, 'compte.html')

@login_required(login_url='home')
def parametre_view(request):
    return render(request, 'parametre.html')

    return generate_response(message)

@login_required(login_url='home')
def chatbot(request, cours_name):
    new_session = Session(
            cours_name = cours_name,
            title='Nouvelle discussion',
            user=request.user,
        )
    new_session.save()
    context = {
        'cours_name': cours_name, 
        'sessions' :Session.objects.filter(user=request.user, cours_name=cours_name).order_by('-created')[:5], 
        'new_session':new_session}

    return render(request, 'chat.html', context)


def get_chatbot_response(request):
    if request.method == 'POST':
        user_message = request.POST.get('message')
        session_id = request.POST.get('session_id')
        cours_name = request.POST.get('cours_name')
        classe = request.POST.get('classe')
      
        chatbot_response = generate_response(user_message, session_id, cours_name, classe)
        save_chat(request, session_id, user_message, chatbot_response)
        
        chatbot_response = markdown.markdown(chatbot_response, extensions=['markdown.extensions.fenced_code'])
        return JsonResponse({'response': chatbot_response})


chats = []
@login_required(login_url='home')
def load_chats(request, session_id):
    cours_name = request.GET.get('cours_name')
    session = get_object_or_404(Session, id=session_id)
    user_chats = Chat.objects.filter(session=session)
    for chat in user_chats:
        chats.append(chat)

    context = {
        'chats': user_chats, 
        'cours_name': cours_name,
        'new_session': session, 
        'sessions' :Session.objects.filter(user=request.user, cours_name=cours_name).order_by('-created')[:5]}
    
    return render(request, 'chat.html', context, )



@login_required(login_url='home')
def delete_session(request, session_id):
    cours_name = {'cours_name': request.GET.get('cours_name')}
    session  = Session.objects.get(id=session_id)
    session.delete()
    return redirect('cours')

@login_required(login_url='home')
def new_chat(request):
    cours_name = request.GET.get('cours_name')
    new_session = Session(
            cours_name = cours_name,
            title='Nouvelle discussion',
            user=request.user,
        )
    new_session.save()
    context = {
        'cours_name': cours_name, 
        'sessions' :Session.objects.filter(user=request.user, cours_name=cours_name).order_by('-created')[:5], 
        'new_session':new_session}

    return render(request, 'chat.html', context)


@login_required(login_url='home')
def delete_all_sessions(request):
    # Supprime toutes les sessions, ce qui supprimera également tous les chats associés
    Session.objects.all().delete()
    return redirect('cours') 


@login_required
def info(request):
    if request.method == 'POST':
        user = request.user
        profile = user.profile

        # Mise à jour des champs de l'utilisateur
        user.first_name = request.POST.get('first_name')
        user.last_name = request.POST.get('last_name')
        # L'e-mail n'est plus mis à jour
        user.save()

        # Mise à jour des champs du profil
        profile.telephone = request.POST.get('telephone')
        profile.date_naissance = request.POST.get('date_naissance')
        # Le niveau n'est plus mis à jour
        profile.ville = request.POST.get('ville')
        profile.save()

        messages.success(request, 'Vos informations ont été mises à jour avec succès.')
        return redirect('compte')

    return render(request, 'compte.html', {
        'user': request.user,
        'profile': request.user.profile
    })


def process_file(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        
        # Lire le contenu du fichier
        file_content = uploaded_file.read()
        
        # Traitement du fichier ici
        # Par exemple, si c'est un fichier texte :
        # text_content = file_content.decode('utf-8')
        
        # Faites votre traitement ici
        # ...

        # Retournez une réponse
        return JsonResponse({'message': 'Fichier traité avec succès'})
    
    return JsonResponse({'error': 'Aucun fichier n\'a été uploadé'}, status=400)


