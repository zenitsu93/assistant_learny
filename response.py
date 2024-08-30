from dotenv import load_dotenv
import os
import google.generativeai as genai

def generate_response(prompt):
    # Charger les variables d'environnement
    load_dotenv()
    
    # Configurer l'API Google
    google_api_key = os.getenv("GOOGLE_API_KEY")
    genai.configure(api_key=google_api_key)
    
    # Initialiser le modèle
    model = genai.GenerativeModel('gemini-pro')
    
    # Générer la réponse
    response = model.generate_content(prompt)
    
    return response.text

# Exemple d'utilisation
# response = generate_response("Quelle est la capitale de la France ?")
# print(response)