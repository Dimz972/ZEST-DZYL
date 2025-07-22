const mongoose = require('mongoose');

// Connexion à la base de données MongoDB
module.exports = async() => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mon-projet');
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.log('Error connecting to the database:', error);
    }
}