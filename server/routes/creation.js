const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const fs = require('fs');
const { spawn } = require('child_process');




router.get('/creation', async (req, res) =>{
        const data = {
            session: req.session,
        }
        res.render('creation', {data}); //data to dataposts
})






module.exports = router;