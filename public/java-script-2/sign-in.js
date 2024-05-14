let image = document.getElementById("sign-in-profile-image");
let file = document.getElementById("sign-in-profile-file");

file.onchange = function() {
    image.src = URL.createObjectURL(file.files[0]);
    image.style.display = "block";
}