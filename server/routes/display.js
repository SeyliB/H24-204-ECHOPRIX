const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const { spawn } = require('child_process');
const { Binary } = require('mongodb');



router.get('/display/:id', async (req, res) =>{

        const id = req.params.id;
        const post = await Post.findById(id).exec();

        const buffer = Buffer.from(post.images, 'base64');
        // Create a Binary object using the Binary constructor with new
        const binaryData = new Binary(buffer, Binary.SUBTYPE_BYTE_ARRAY);
        post.images = binaryData

        post.posted = await new Promise((resolve, reject) => {
            createPostTimersArray(post, (timer) => {
                resolve(timer); 
            });
        });

         post.postCreator = await User.findById(post.creatorID).exec();

   

         
         const buffer2 = Buffer.from(post.postCreator.image, 'base64');
         // Create a Binary object using the Binary constructor with new
         const binaryData2 = new Binary(buffer2, Binary.SUBTYPE_BYTE_ARRAY);
         post.postCreator.image = binaryData2

        const data = {
            session: req.session,
            post: post
        }

        let newVues = post.vues+1
        const postUpdated = await Post.findByIdAndUpdate(post._id, { vues:newVues }, { new: true });
        res.render('display', {data}); //data to dataposts
})


function getPostTimer(time, callback){
    const pythonScript = spawn('python', ['server/python_scripts/timer.py', time]);


    pythonScript.stdout.on('data', (data) => {
        //En faite ca lit le output dans la console de ce qui a ete ecris par le prog python
       const counter = data.toString().trim();
        callback(counter);
    });
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
    // console.log(formattedDateString)

    return formattedDateString;

}

async function createPostTimersArray(posts, callback){

    // let timer = []
    // for (let i = 0; i < posts.length; i++){

    //     let time= changeDateFormat(posts[i].createdAt)



    //     const timer = await new Promise((resolve, reject) => {
    //         getPostTimer(time, (counter) => {
    //             resolve(counter); 
    //         });
    //     });
        
    //     console.log(timer)

    //     timer.push(timer)
    // }

    // console.log(timers)

        const timer = await new Promise((resolve, reject) => {
            getPostTimer(changeDateFormat(posts.createdAt), (counter) => {
                resolve(counter); 
            });
        });
    callback(timer)

    return timer
}



module.exports = router;