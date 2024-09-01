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

const userMessage = document.getElementById("message");
const chatContainer = document.getElementById("chat");
const chatForm = document.getElementById("form");

const handleSubmit = async (event) => {
  event.preventDefault();
  const userPrompt = userMessage.value;
  if (userPrompt.trim() == "") return;

  chatContainer.innerHTML += userChatDiv(userPrompt);
  userMessage.value = "";

  //   Get CSRF Token from cookie data
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  //   Get CSRF Token
  csrf_token = getCookie("csrftoken");

  fetch("http://127.0.0.1:8000/get_chatbot_response/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      csrfmiddlewaretoken: csrf_token,
      message: userPrompt,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const response = data.response;
      chatContainer.innerHTML += aiChatDiv(response);
    });
};

chatForm.addEventListener("submit", handleSubmit);
chatForm.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    handleSubmit(event);
  }
});
