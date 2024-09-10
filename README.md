# Chatbot Éducatif Django avec Google Gemini

Ce projet est un chatbot éducatif développé avec Django et utilisant l'API Google Gemini pour générer des réponses intelligentes.

![alt text](<Accueil (1).png>)

![alt text](<Maths (1).png>)


## Fonctionnalités

- Interface de chat conviviale
- Intégration de l'API Google Gemini pour des réponses contextuelles
- Gestion des sessions utilisateur
- Historique des conversations

## Prérequis

- Python 3.8+
- Django 3.2+
- Compte Google Cloud Platform avec accès à l'API Gemini

## Installation

1. Clonez ce dépôt :
   ```
   git clone https://github.com/votre-username/chatbot-educatif.git
   ```

2. Installez les dépendances :
   ```
   pip install -r requirements.txt
   ```

3. Configurez vos variables d'environnement dans un fichier `.env` :
   ```
   GOOGLE_API_KEY=votre_clé_api_gemini
   ```

4. Lancez les migrations :
   ```
   python manage.py migrate
   ```

5. Démarrez le serveur :
   ```
   python manage.py runserver
   ```

## Utilisation

Accédez à `http://localhost:8000` dans votre navigateur pour interagir avec le chatbot.

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.