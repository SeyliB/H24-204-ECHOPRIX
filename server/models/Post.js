const mongoose = require(`mongoose`);

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    data: {
        type: Buffer,
        required: true
    },
    contentType: {
        type: String,
        required: true
    }
});

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
    images: [ImageSchema],
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