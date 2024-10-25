// Importer marked.js dans votre fichier HTML
// <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/2.0.3/marked.min.js"></script>
// Fonctions pour créer les éléments de chat
const userChatDiv = (data) => {
  return `
    <li class="user-message">
      ${data}
    </li>
  `;
};
const aiChatDiv = (data) => {
  return `
    <li class="bot-message">
      <div class="bot-avatar">
        <img src="/static/images/chat-bot.svg" alt="Bot Image" class="bot-image">
      </div>
      <div class="markdown-content"></div>
    </li>
  `;
};
// Sélection des éléments du DOM
const userMessage = document.getElementById("message");
const chatContainer = document.getElementById("chat");
const chatForm = document.getElementById("form");
// Fonction pour l'effet de frappe
function typeEffect(element, markdown) {
  let index = 0;
  function type() {
    if (index < markdown.length) {
      element.innerHTML = marked(markdown.slice(0, index + 1));
      index++;
      setTimeout(type, 20); // Ajustez la vitesse ici (en millisecondes)
    }
  }
  type();
}



function getCurrentCourseInfo() {
  const coursInfoSpan = document.querySelector('.cours-info span');
  if (coursInfoSpan) {
      // Extraire le texte du span
      const text = coursInfoSpan.textContent;
      // Le texte est au format "Cours : NOM_DU_COURS NIVEAU"
      const match = text.match(/Cours : ([A-Z-]+)\s+(\d+[A-Za-zèéêë]+)/);
      if (match) {
          return {
              cours_name: match[1].toLowerCase(), // Le nom du cours en minuscules
              classe: match[2] // Le niveau (ex: "3eme")
          };
      }
  }
  return {
      cours_name: null,
      classe: null
  };
}

// Exemple d'utilisation :
const courseInfo = getCurrentCourseInfo();

// Fonction principale pour gérer la soumission du formulaire
const handleSubmit = async (event) => {
  event.preventDefault();
  const userPrompt = userMessage.value.trim();
  if (userPrompt === "") return;
  // Ajouter le message de l'utilisateur au chat
  chatContainer.innerHTML += userChatDiv(userPrompt);
  userMessage.value = "";
  // Ajouter l'animation de chargement
  const loadingAnimation = createLoadingAnimation();
  chatContainer.appendChild(loadingAnimation);
  // Faire défiler jusqu'au bas du chat
  chatContainer.scrollTop = chatContainer.scrollHeight;
  // Obtenir le token CSRF
  const csrf_token = getCookie("csrftoken");
  try {
    const response = await fetch("/get_chatbot_response/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        csrfmiddlewaretoken: csrf_token,
        message: userPrompt,
        session_id: document.getElementById("session_id").value,
        cours_name : courseInfo.cours_name,
        classe : courseInfo.classe
      }),
    });
    const data = await response.json();
    // Supprimer l'animation de chargement
    loadingAnimation.remove();
    // Ajouter la réponse du chatbot avec l'effet de frappe
    chatContainer.innerHTML += aiChatDiv(data.response);
    const lastBotMessage = chatContainer.querySelector('.bot-message:last-child .markdown-content');
    typeEffect(lastBotMessage, data.response);
    // Faire défiler jusqu'au bas du chat
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } catch (error) {
    console.error('Error:', error);
    // Gérer l'erreur ici (par exemple, afficher un message à l'utilisateur)
    loadingAnimation.remove();
    chatContainer.innerHTML += aiChatDiv("Désolé, je n'ai pas bien compris votre question.");
  }
};
// Fonction pour créer l'animation de chargement
function createLoadingAnimation() {
  const chatBubble = document.createElement('div');
  chatBubble.className = 'chat-bubble';
  chatBubble.innerHTML = `
    <div class="typing">
      <div class="bot-avatar">
        <img src="/static/images/chat-bot.svg" alt="Bot Image" class="bot-image">
      </div>
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
  `;
  return chatBubble;
}
// Fonction pour obtenir le cookie CSRF
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
// Écouteurs d'événements
chatForm.addEventListener("submit", handleSubmit);
chatForm.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    handleSubmit(event);
  }
});

