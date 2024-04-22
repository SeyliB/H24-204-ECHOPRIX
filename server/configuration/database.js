const mongoose = require('mongoose');

const connectDB = async () => {

    try {
        mongoose.set('strictQuery', false);
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected successfully!`);
    }catch (error){
        console.log(error);
    }
}

module.exports = connectDB;