const mongoose = require('mongoose');

//Définition du model de données pour les plats
const platSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    name: { type: String, default: '' },
    origin: { type: String, default: '' },
    isSpicy: {
        type: Boolean,
        default: false,
        set: function(value) {
            if (value === "on" || value === "true" || value === true) return true;
            if (value === "off" || value === "false" || value === false || value === undefined) return false;
            return Boolean(value);
        }
    },
    isVegetarian: {
        type: Boolean,
        default: false,
        set: function(value) {
            if (value === "on" || value === "true" || value === true) return true;
            if (value === "off" || value === "false" || value === false || value === undefined) return false;
            return Boolean(value);
        }
    },
    ingredients: { type: [String], default: [] },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    price: { type: Number, default: 0 }
});

//Création du modèle de données Plat qui sera utilisé pour interagir avec la collection "plats" dans MongoDB 
//Le modèle est lié au schéma défini ci-dessus
//le modèle est donc reliée à la base de données MongoDB à cette étape

module.exports = mongoose.model('Plat', platSchema);


