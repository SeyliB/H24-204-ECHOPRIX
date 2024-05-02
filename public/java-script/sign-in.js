let profile = document.getElementById("icon-profile")
let file = document.getElementById("icon-file")

// file.onchange = function() {
//     profile.src = URL.createObjectURL(file.files[0])

// }


file.onchange = async function(event) {

    event.preventDefault();

    const formData = new FormData();
    const imageFile = document.getElementById('icon-file').files[0];

    profile.src = URL.createObjectURL(file.files[0])
    formData.append('image', imageFile);

    try {
        const response = await fetch('/uploadImage', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        console.log(data); // This can be the temporary URL or other response from the server
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};


