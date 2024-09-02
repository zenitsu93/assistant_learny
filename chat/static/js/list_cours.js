// Fonction pour basculer l'affichage de la liste des cours
function toggleCoursList() {
    const coursList = document.getElementById('coursList');
    const plusButton = document.querySelector('.plus-button img');
    if (coursList.style.display === 'none' || coursList.style.display === '') {
        coursList.style.display = 'block';
        plusButton.style.transform = 'rotate(90deg)';
    } else {
        coursList.style.display = 'none';
        plusButton.style.transform = 'rotate(0deg)';
    }
}

function markCurrentCourse() {
    // Récupérez le nom du cours actuel depuis l'URL
    var currentPath = window.location.pathname;
    var currentCourse = currentPath.split('/').pop(); // Prend le dernier segment de l'URL

    // Sélectionnez tous les liens dans la liste
    var courseLinks = document.querySelectorAll('#coursList a');

    // Variable pour vérifier si un cours actif a été trouvé
    var activeFound = false;

    // Parcourez tous les liens
    courseLinks.forEach(function(link) {
        // Réinitialiser tous les liens
        link.classList.remove('active');
        
        // Si l'href du lien contient le cours actuel et qu'aucun cours actif n'a été trouvé
        if (link.getAttribute('href').includes(currentCourse) && !activeFound) {
            // Ajoutez la classe 'active'
            link.classList.add('active');
            activeFound = true; // Marquer qu'un cours actif a été trouvé
        }
    });

    // Si aucun cours actif n'a été trouvé, on peut optionnellement activer le premier cours
    if (!activeFound && courseLinks.length > 0) {
        courseLinks[0].classList.add('active');
    }
}

// Ajouter les écouteurs d'événements une fois que le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    const plusButton = document.querySelector('.plus-button');
    if (plusButton) {
        plusButton.addEventListener('click', toggleCoursList);
    }

    // Cacher la liste des cours au chargement initial
    const coursList = document.getElementById('coursList');
    if (coursList) {
        coursList.style.display = 'none';
    }

    // Marquer le cours actuel
    markCurrentCourse();
});