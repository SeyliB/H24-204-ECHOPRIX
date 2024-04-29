let profile = document.getElementById("icon-profile")
let file = document.getElementById("icon-file")

file.onchange = function() {
    profile.src = URL.createObjectURL(file.files[0])
}



