
const {MongoClient } = require('mongodb')

const uri = 'mongodb+srv://yakovw2706:alMRlNtXPbJYGwVk@cluster0.xccai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient(uri)

async function connectDB() {
    try {
        await client.connect();
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err);
    }
}

connectDB();

module.exports = connectDB;
