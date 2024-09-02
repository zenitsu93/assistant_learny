from dotenv import load_dotenv
import os
import google.generativeai as genai
from chat.models import Chat, Session

# Charger les variables d'environnement
load_dotenv()

# Configurer l'API Google
google_api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=google_api_key)
 # Initialiser le modèle
model = genai.GenerativeModel('gemini-pro')

def generate_response(prompt, session_id):
    
    # Récupérer l'historique de la session
    try:
        session = Session.objects.get(id=session_id)
        past_chats = Chat.objects.filter(session=session).order_by('created')
        chat_history = "\n".join([f"User: {chat.message}\nBot: {chat.response}" for chat in past_chats])
    except Session.DoesNotExist:
        chat_history = ""

    # Ajouter le message actuel à l'historique
    complete_prompt = f"{chat_history}\nUser: {prompt}\nBot:"
    
    # Générer la réponse en tenant compte du contexte
    response = model.generate_content(complete_prompt)
    
    return response.text


def make_title(message):
    prompt = f"""
    Donne un titre court et représentatif pour le message suivant. Le titre sera utilisé pour identifier la discussion dans un chatbot afin que l'utilisateur puisse facilement retrouver les discussions.

    Message :
    {message}

    Titre :
    """

    # Générer la réponse
    response = model.generate_content(prompt)
    
    return response.text

# Exemple d'utilisation
# response = generate_response("Quelle est la capitale de la France ?")
# print(response)