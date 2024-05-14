const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const { spawn } = require('child_process');



router.get('/publications', async (req, res) =>{
    try {
        var page = req.session.test || 1;
        req.session.test = page+1
        const limit = 100;
        const skip = 1; //Faire (page - 1) * limit
        
        //La ca spawn 5 par 5

        const data = await Post.find().skip(skip).limit(limit);

        // timers = createPostTimersArray(data)
        const timers = await new Promise((resolve, reject) => {
            createPostTimersArray(data, (timers) => {
                resolve(timers); 
            });
        });


        res.render('publications', {data, timers});
    } catch (error) {
        console.log(error);
    }
})

router.post('/sendPost', async (req, res)=>{
    const {title, description, adresse, price, images} = await req.body;
    insertPostData(title, description, adresse, price, images)
})

function getPostCategory(title,description,callback){
    const pythonScript = spawn('python', ['server/python_scripts/categotizer.py', title, description]);


    pythonScript.stdout.on('data', (data) => {
        //En faite ca lit le output dans la console de ce qui a ete ecris par le prog python
       const category = data.toString().trim();
        callback(category);
    });


}

function getPostTimer(time, callback){
    const pythonScript = spawn('python', ['server/python_scripts/timer.py', time]);


    pythonScript.stdout.on('data', (data) => {
        //En faite ca lit le output dans la console de ce qui a ete ecris par le prog python
       const counter = data.toString().trim();
        callback(counter);
    });
}

async function insertPostData(title, description, adresse, price, images) {
    
        //Les callbacks c'est op quand on a besoin d'attendre qu'une tache s'execute
        const category = await new Promise((resolve, reject) => {
            getPostCategory(title, description, (category) => {
                resolve(category); 
            });
        });

        let imagesBuffered = []

        for (let i = 0; i < images.length; i++){
            let imageData = {
                data: fs.readFileSync(images[i]), // Provide the image data as a Buffer
                contentType: 'image' // Specify the content type of the image
            };
            imagesBuffered.push(imageData);
        }

        // Insert post data into the database
        const result = await Post.insertMany([
            {
                title: title,
                description: description,
                adresse: adresse,
                price: price,
                category: category, // Use the category obtained from the callback
                images: imagesBuffered, // Use the read image data
                vues: 0
            }
        ]);

        console.log("Data successfully sent");

}

function changeDateFormat(timestamp) {
    const inputDate = new Date(timestamp); // Parse the input timestamp string

    // Calculate the new date and time after adjusting for a 4-hour difference
    const adjustedDate = new Date(inputDate.getTime() + (4 * 60 * 60));

    // Format the adjusted date and time into the desired format
    const year = adjustedDate.getUTCFullYear();
    const month = String(adjustedDate.getUTCMonth() + 1).padStart(2, '0');
    const day = String(adjustedDate.getUTCDate()).padStart(2, '0');
    const hours = String(adjustedDate.getUTCHours()).padStart(2, '0');
    const minutes = String(adjustedDate.getUTCMinutes()).padStart(2, '0');
    const seconds = String(adjustedDate.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(adjustedDate.getUTCMilliseconds()).padStart(3, '0');

    const formattedDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}+00:00`;
    console.log(formattedDateString)

    return formattedDateString;

}

async function createPostTimersArray(posts, callback){

    let timers = []
    for (let i = 0; i < posts.length; i++){

        let time= changeDateFormat(posts[i].createdAt)



        const timer = await new Promise((resolve, reject) => {
            getPostTimer(time, (counter) => {
                resolve(counter); 
            });
        });
        

        timers.push(timer)
    }
    // console.log(timers)
    callback(timers)

    return timers
}

async function addView(id){
    const currentPost = await User.findOne({ id }); 
    currentPost.vues++;
}

//TestData
const images = ["public/images/LOGO.png", "public/images/profile.jpg"]
insertPostData("Taha3", "ne sait pas quand le train arrive","2221 rue de Bdeb",600,images);

module.exports = router;