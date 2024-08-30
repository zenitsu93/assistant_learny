document.getElementById('file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileIcon = document.getElementById('file-icon');

    fileName.textContent = file.name;
    
    // Définir l'icône en fonction du type de fichier
    if (file.type.startsWith('image/')) {
        fileIcon.src = image;
    } else if (file.type === 'application/pdf') {
        fileIcon.src = pdf;
    } else if (file.type.includes('word')) {
        fileIcon.src = doc;
    } else {
        fileIcon.src = files;
    }

    fileInfo.style.display = 'block';
});

document.getElementById('remove-file').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('file-input').value = '';
    document.getElementById('file-info').style.display = 'none';
});