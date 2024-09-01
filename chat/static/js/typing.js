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
              ${data}
      </li>
      `;
  };
  
  // Sélection des éléments du DOM
  const userMessage = document.getElementById("message");
  const chatContainer = document.getElementById("chat");
  const chatForm = document.getElementById("form");
  
  // Fonction principale pour gérer la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    const userPrompt = userMessage.value.trim();
    if (userPrompt === "") return;
  
    // Ajouter le message de l'utilisateur au chat
    chatContainer.innerHTML += userChatDiv(userPrompt);
    userMessage.value = "";
  
    // Ajouter l'animation de frappe
    const typingAnimation = createTypingAnimation();
    chatContainer.appendChild(typingAnimation);
  
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
        }),
      });
      const data = await response.json();
      
      // Supprimer l'animation de frappe
      typingAnimation.remove();
  
      // Ajouter la réponse du chatbot
      const botMessageElement = document.createElement('li');
      botMessageElement.className = 'bot-message';
      const messageContent = document.createElement('div');
      messageContent.className = 'message-content';
      messageContent.style.display = 'none';
      messageContent.innerHTML = data.response;
      botMessageElement.appendChild(messageContent);
      chatContainer.appendChild(botMessageElement);
  
      // Démarrer l'effet de frappe
      setTimeout(() => {
        startTypingEffect(messageContent);
      }, 500);
  
      // Faire défiler jusqu'au bas du chat
      chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
      console.error('Error:', error);
      // Gérer l'erreur ici (par exemple, afficher un message à l'utilisateur)
    }
  };
  
  // Fonction pour créer l'animation de frappe
  function createTypingAnimation() {
    const chatBubble = document.createElement('div');
    chatBubble.className = 'chat-bubble';
    chatBubble.innerHTML = `
      <div class="typing">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `;
    return chatBubble;
  }
  
  // Fonction pour l'effet de frappe
  function startTypingEffect(element, speed = 10) {
    const content = element.innerHTML;
    element.innerHTML = '';
    element.style.display = 'block';
    
    let i = 0;
    function typeWriter() {
      if (i < content.length) {
        if (content.charAt(i) === '<') {
          // Trouver la fermeture '>' de la balise
          const closingIndex = content.indexOf('>', i);
          if (closingIndex !== -1) {
            element.innerHTML += content.substring(i, closingIndex + 1);
            i = closingIndex + 1;
          }
        } else {
          element.innerHTML += content.charAt(i);
          i++;
        }
        setTimeout(typeWriter, speed);
      }
    }
    typeWriter();
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
  
  // Fonction pour gérer le téléchargement de fichiers
  document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const fileInfo = document.getElementById('file-info');
      const fileName = document.getElementById('file-name');
      const fileIcon = document.getElementById('file-icon');
  
      fileName.textContent = file.name;
      fileInfo.style.display = 'block';
  
      // Définir l'icône en fonction du type de fichier
      if (file.type.startsWith('image/')) {
        fileIcon.src = image;
      } else if (file.type === 'application/pdf') {
        fileIcon.src = pdf;
      } else if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        fileIcon.src = doc;
      } else {
        fileIcon.src = files;
      }
    }
  });
  
  // Fonction pour supprimer le fichier sélectionné
  document.getElementById('remove-file').addEventListener('click', function() {
    document.getElementById('file-input').value = '';
    document.getElementById('file-info').style.display = 'none';
  });
  
