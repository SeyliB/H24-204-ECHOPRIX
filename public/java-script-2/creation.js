let image = document.getElementById("creation-media-image");
let file = document.getElementById("creation-media-file");

file.onchange = function() {
    image.src = URL.createObjectURL(file.files[0]);
    image.style.display = "block";
}