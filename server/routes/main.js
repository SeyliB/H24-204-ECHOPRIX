const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { Binary } = require('mongodb');
const loginRouter = require('./login')
const signInRouter = require('./sign-in')
const publicationsRouter = require('./publications')
const creationRouter = require('./creation');
const displayRouter = require('./display');
const { forEach } = require('@splidejs/splide/src/js/utils');
const fs = require('fs');
const { spawn } = require('child_process');
const Post = require('../models/Post');

router.get('/', async (req, res) => {
    if (typeof req.session.connected === 'undefined'){
        req.session.connected = false;
    }
    const data = {
        session: req.session,
    };

    res.render('home', {data});
});

router.get('/login', loginRouter);
router.post('/login', loginRouter);

router.get('/sign-in', signInRouter);
router.post('/sign-in', signInRouter);

router.get('/publications', publicationsRouter);
router.post('/publications', publicationsRouter);

router.get('/creation', creationRouter);
router.post('/creation', creationRouter);

router.get('/display/:id', displayRouter);
router.post('/display', displayRouter);

router.post('/uploadImage', upload.single('image'), (req,res) =>{
    try {
        req.session.iconProfile = req.file.buffer; // Store the image buffer in a global variable
        res.json({ message: 'Image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
})

router.post('/uploadImages', upload.single('image'), (req,res) =>{
    try {
        req.session.tempImage = req.file.buffer; // Store the image buffer in a global variable
        res.json({ message: 'Image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
})


router.get('/test', (req, res) =>{

    const buffer = Buffer.from(req.session.user.image, 'base64');
    // Create a Binary object using the Binary constructor with new
    const binaryData = new Binary(buffer, Binary.SUBTYPE_BYTE_ARRAY);

    req.session.user.image = binaryData

    // console.log(binaryData)
    // Construct the data object to pass to the view
    const data = {
        user: req.session.user
    };


    res.render('test', {data})
})


router.post('/sendPost', async (req, res)=>{
    const {title, description, adresse, price} = await req.body;
    // insertPostData(title, description, adresse, price, images)

    insertPostData(title, description, adresse, price, req.session.user._id,req.session.tempImage)

    res.redirect('publications');
})

function getPostCategory(title,description,callback){
    const pythonScript = spawn('python', ['server/python_scripts/categotizer.py', title, description]);


    pythonScript.stdout.on('data', (data) => {
        //En faite ca lit le output dans la console de ce qui a ete ecris par le prog python
       const category = data.toString().trim();
        callback(category);
    });


}


async function insertPostData(title, description, adresse, price,creatorID, images) {
    
        //Les callbacks c'est op quand on a besoin d'attendre qu'une tache s'execute
        const category = await new Promise((resolve, reject) => {
            getPostCategory(title, description, (category) => {
                resolve(category); 
            });
        });

        // // let imagesBuffered = req.session.tempImage
        let imagesBuffered = []


        // for (let i = 0; i < images.length; i++){
        //     let imageData = {
        //         data: fs.readFileSync(images[i]), // Provide the image data as a Buffer
        //         contentType: 'image' // Specify the content type of the image
        //     };
        //     imagesBuffered.push(imageData);
        // }

        // Insert post data into the database
        const result = await Post.insertMany([
            {
                title: title,
                description: description,
                adresse: adresse,
                price: price,
                creatorID: creatorID,
                category: category, // Use the category obtained from the callback
                images: images, // Use the read image data
                vues: 0
            }
        ]);

        console.log("Data successfully sent");

}
module.exports = router;