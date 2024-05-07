const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { Binary } = require('mongodb');
const loginRouter = require('./login')
const signInRouter = require('./sign-in')
const publicationsRouter = require('./publications')

router.get('/', async (req, res) => {
    const data = {
        title: 'ECHOPRIX',
    };

    res.render('home', data);
});

router.get('/login', loginRouter);
router.post('/login', loginRouter);

router.get('/sign-in', signInRouter);
router.post('/sign-in', signInRouter);

router.get('/publications', publicationsRouter);
router.post('/publications', publicationsRouter);

router.post('/uploadImage', upload.single('image'), (req,res) =>{
    try {
        req.session.iconProfile = req.file.buffer; // Store the image buffer in a global variable
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

    // Construct the data object to pass to the view
    const data = {
        image: binaryData
    };


    res.render('test', {data})
})

module.exports = router;