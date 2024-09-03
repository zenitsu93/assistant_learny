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
    // Récupérez l'URL complète du cours actuel
    var currentPath = window.location.pathname;

    // Sélectionnez tous les liens dans la liste
    var courseLinks = document.querySelectorAll('#coursList a');

    // Parcourez tous les liens
    courseLinks.forEach(function(link) {
        // Réinitialiser tous les liens
        link.classList.remove('active');
        
        var href = link.getAttribute('href');
        // Si l'href du lien correspond à l'URL actuelle (en ignorant les slashes de début/fin)
        var searchParams = new URLSearchParams(window.location.search);
        var currentCourseName = searchParams.get('cours_name');

        if (href === currentPath || href.includes(currentCourseName)) {
            // Ajoutez la classe 'active'
            link.classList.add('active');
        }  
    });
}

// Fonction d'initialisation principale
function initializeCourseFunctionality() {
    const plusButton = document.querySelector('.plus-button');
    if (plusButton) {
        plusButton.addEventListener('click', toggleCoursList);
    } else {
        console.log("Bouton plus non trouvé");
    }

    // Cacher la liste des cours au chargement initial
    const coursList = document.getElementById('coursList');
    if (coursList) {
        coursList.style.display = 'none';
    } else {
        console.log("Liste de cours non trouvée");
    }

    // Marquer le cours actuel
    markCurrentCourse();
}

// Appeler la fonction d'initialisation lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', initializeCourseFunctionality);