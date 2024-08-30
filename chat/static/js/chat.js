var textarea = document.querySelector('textarea');

textarea.addEventListener('keydown', autosize);

function autosize() {
  var el = this;
  setTimeout(function() {
    el.style.height = 'auto'; // Réinitialiser la hauteur
    var newHeight = el.scrollHeight;
    el.style.height = (newHeight > 250 ? 250 : newHeight) + 'px'; // Limiter la hauteur à 250px
  }, 0);
}
