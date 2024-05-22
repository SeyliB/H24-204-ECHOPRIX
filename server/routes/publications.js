const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { Binary } = require('mongodb');
const fs = require('fs');
const { spawn } = require('child_process');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;




router.get('/publications', async (req, res) =>{

    try {
        var page = req.session.test || 1;
        req.session.test = page+1
        const limit = 2;
        const skip = 1; //Faire (page - 1) * limit
        
        //La ca spawn 5 par 5



        const categoriesName = ["Video Games", "Cars", "Vegetation", "Home Appliances", "Fashion Accessories", "Sports Equipment", "Art Supplies", "Books", "Pet Supplies", "Furniture", "Electronics", "Jewelry", "Toys", "Health & Beauty Products", "Kitchenware", "Outdoor Gear", "Musical Instruments", "Fitness Equipment", "Tools & Hardware", "Office Supplies"]


        let categories = new Map();

        async function fetchPosts() {
            for (const categorie of categoriesName) {
                 const CategoriePost = await Post.find({ category: categorie }).exec();
                 categories.set(categorie, CategoriePost);

                 for(const post of CategoriePost){

                    const timer = await new Promise((resolve, reject) => {
                        createPostTimersArray(post, (timer) => {
                            resolve(timer); 
                        });
                    });
                    
                    post.posted = timer

                
                    const postCreator = await User.findById(post.creatorID).exec();

                    const buffer = Buffer.from(postCreator.image, 'base64');
                    // Create a Binary object using the Binary constructor with new
                    const binaryData = new Binary(buffer, Binary.SUBTYPE_BYTE_ARRAY);
                    post.creatorImage = binaryData



                    
                    

                 }
                    
            }
            return categories
        }

        


        // timer = createPostTimersArray(data)
        // const timer = await new Promise((resolve, reject) => {
        //     createPostTimersArray(post, (timers) => {
        //         resolve(timers); 
        //     });
        // });

        if (req.session.connected){
            const buffer = Buffer.from(req.session.user.image, 'base64');
            // Create a Binary object using the Binary constructor with new
            const binaryData = new Binary(buffer, Binary.SUBTYPE_BYTE_ARRAY);
            req.session.user.image = binaryData
        }


        const data = {
            session: req.session,
            categories: await fetchPosts()
        }


        res.render('publications', {categories, data}); //data to dataposts

    } catch (error) {
        console.log(error);
    }
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



async function addView(id){
    const currentPost = await User.findOne({ id }); 
    currentPost.vues++;
}



module.exports = router;