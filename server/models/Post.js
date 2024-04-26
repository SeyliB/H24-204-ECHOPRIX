const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    adresse:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    image: {
        type: Buffer,
        required: true
    },
    vues:{
        type:Number,
        default:0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Post', PostSchema);