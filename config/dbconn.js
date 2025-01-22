
const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.DATABASE_URI) {
        console.error('MongoDB URI is not defined in the environment variables');
        return;
    }

    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
    }
}

module.exports = connectDB;
