// Sélectionne les éléments HTML correspondant à l'image et au champ de fichier dans le formulaire
let image = document.getElementById("sign-in-profile-image");
let file = document.getElementById("sign-in-profile-file");

// Événement déclenché lorsqu'un fichier est sélectionné dans le champ de fichier
file.onchange = async function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du navigateur lors de la sélection du fichier

    // Crée un objet FormData pour stocker les données du formulaire, y compris le fichier sélectionné
    const formData = new FormData();
    const imageFile = file.files[0]; // Récupère le fichier sélectionné dans le champ de fichier

    // Met à jour l'élément d'image HTML pour afficher un aperçu du fichier sélectionné
    image.src = URL.createObjectURL(file.files[0]); // Crée une URL objet à partir du fichier sélectionné
    image.style.display = "block"; // Affiche l'élément d'image

    // Ajoute le fichier sélectionné à l'objet FormData pour l'envoi au serveur
    formData.append('image', imageFile);

    try {
        // Envoie les données du formulaire (y compris le fichier) au serveur via une requête POST
        const response = await fetch('/uploadImage', {
            method: 'POST', // Utilise la méthode POST pour envoyer les données
            body: formData // Utilise l'objet FormData comme corps de la requête
        });

        // Attend la réponse du serveur et la transforme en format JSON
        const data = await response.json();
        console.log(data); // Affiche les données de réponse du serveur dans la console
    } catch (error) {
        // En cas d'erreur lors de l'envoi de la requête au serveur, affiche l'erreur dans la console
        console.error('Error uploading image:', error);
    }
};
