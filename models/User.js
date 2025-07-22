const express = require('express');
const mongoose = require('mongoose');

//Définition du model de données pour les utilisateurs
const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
     fname: {
        type: String,
        required: [true, 'Le prénom est obligatoire'],
        minlength: [3, 'Le prénom doit contenir au moins 3 caractères'],
        maxlength: [20, 'Le prénom ne peut pas dépasser 20 caractères'],
    },
    lname: String,
    email: String,
    phone_number: Number,
    adresse: String,
    password: String,
    /* birthdate: {
        type: Date,
        required: [true, 'La date de naissance est obligatoire'],
        validate : {
            validator: function(date) {
                return date < new Date();
            },
            message: 'La date de naissance doit être dans le passé'
        } */
        
    }
);

//Création du modèle de données User qui sera utilisé pour interagir avec la collection "users" dans MongoDB 
//Le modèle est lié au schéma défini ci-dessus
//le modèle est donc reliée à la base de données MongoDB à cette étape

module.exports = mongoose.model('User', userSchema);



