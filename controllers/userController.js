const express = require('express');
const User = require('../models/User'); // Importation du modèle User
const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken pour la gestion des tokens JWT
const cookieParser = require('cookie-parser'); // Importation de cookie-parser pour gérer les cookies

//Dans ce fichier, on va créer les controllers pour gérer les utilisateurs
//Qu'on va exporter pour les utiliser dans le routeur userRouter.js

//Controller pour afficher tous les utilisateurs
exports.index = async (req, res) => {
    try {
        //Récupération des utilisateurs => Model + find() => [] tableau d'objets
        const users = await User.find();
        //console.log('Users trouvés:', users);
        res.status(200).render('pages/user', { users, title: 'Utilisateurs - Restaurant Caribéen' });

        //Réponse json api
        //res.status(200).json(users);
        
    } catch (error) {
        throw new Error('Error retrieving users: ' + error);
    }
};

//Controller pour les users coté admin afin de le modifier ou supprimer
exports.indexAdmin = async (req, res) => {
    try {
        //Récupération des plats => Model + find() => [] tableau d'objets
        const users = await User.find();
        console.log('Users trouvés:', users);
        res.status(200).render('pages/adminUser', { users, title: 'Administration Utilisateurs - Restaurant Caribéen' });
        //Réponse json api
        //res.status(200).json(plats);
        
    } catch (error) {
        throw new Error('Error retrieving user: ' + error);
    }
}
//Controller pour afficher un utilisateur par son ID
exports.show = async (req, res) => {
        try {
            //Récupération de l'employé par son ID
            const userId = req.params.id;
            const user = await User.findById(userId);
            console.log('Employee retrieved by id:', user);
            res.status(200).json({user}); 
            
          
        } catch (err) {
            throw ('Error:', err);
        }
}; 


//Controller pour ajouter un utilisateur via le formulaire => inscription
exports.create = async (req, res) => {
     try {
           const newUser = new User(req.body); // Création d'une nouvelle instance de User avec les données du formulair
           await newUser.save();
           console.log('Utilisateur ajouté :', newUser);
           res.redirect('/users/login'); // Tu peux rediriger où tu veux après l’ajout
       } catch (error) {
           console.error('Erreur lors de l’ajout de l’utilisateur :', error);
           res.status(500).send('Erreur lors de l’ajout de l’utilisateur');
       }
};

//Validation du prénom et la date de naissance de l'utilisateur lors de la création d'un utilisateur
/* exports.create = async (req, res) => {
    try {
        //Récupération des données de l'utilisateur depuis le corps de la requête
        const {fname, birthdate} = req.body;
        const user = new User({fname, birthdate});
        await user.save(); // Création de l'utilisateur dans la base de données

        console.log('Utilisateur ajouté:', user);
        res.status(201).json({ message: 'Utilisateur ajouté avec succès' });
        res.end();
        
    } catch (error) {
        throw new Error('Error adding user: ' + error.message);
    }
}; */

//Validate le birthdate de l'utilisateur lors de la création d'un utilisateur
/*exports.create = async (req, res) => {
    try {
        //Récupération des données de l'utilisateur depuis le corps de la requête
        const {birthdate} = req.body;
        const user = new User({birthdate})
        await user.save(); // Création de l'utilisateur dans la base de données

        console.log('Utilisateur ajouté avec date de naissance:', user);
        res.status(201).json({ message: 'Utilisateur ajouté avec succès' });
        res.end();
        
    } catch (error) {
        throw new Error('Error adding user with birthdate: ' + error.message);
    }
} */


//Controller pour mettre à jour un utilisateur qu'on récupère par son fname
exports.update = async (req, res) => {
    try {
            const patchUser = await User.findOneAndUpdate(
              {fname: "Dimitri"}, // Critère de recherche
              { adresse: "13 rue de la destinée, Cergy-le-haut - Test Mise à jour v.2" }, // Mise à jour
              { new: true } // Retourner le document mis à jour 
            );
            res.status(200).json({'Utilisateur mis à jour avec succès' : patchUser});
        
          } catch (error) {
            throw new Error('Error updating user: ' + error);
          }
    };

//Controller pour supprimer un utilisateur
exports.delete = async (req, res) => {
    try {
        //Récupération de l'ID de l'utilisateur à supprimer depuis les paramètres de la requête
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        console.log('Utilisateur supprimé:', deletedUser);
        res.redirect('/users/inscription'); // Redirection vers la page admin après la suppression
        
    } catch (error) {
        throw new Error('Error deleting user: ' + error);
    }
};

//Controller pour afficher le formulaire d'ajout d'utilisateur
exports.form = async (req, res) => {
    try {
    res.status(200).render('pages/inscription', { style : "client", title: 'Inscription - Restaurant Caribéen' }); // Affiche le formulaire sans données utilisateur
    } catch (error) {
    console.error('Erreur lors de l’affichage du formulaire :', error);
    res.status(500).send('Erreur lors de l’affichage du formulaire');
    }}

//Controller pour mettre à jour un utilisateur via le bouton "Mettre à jour" dans adminUser et profil.ejs
exports.formUpdate = async (req, res) => { 
     try {
        const userId = req.params.id;
        const { fname, lname, email, phone_number, adresse, password } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fname, lname, email, phone_number, adresse, password },
            { new: true } // Retourne le document mis à jour
        );
        
        if (!updatedUser) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        
        console.log('Utilisateur mis à jour:', updatedUser);
        res.redirect('/users'); // Redirection vers la liste des utilisateurs
        
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        res.status(500).send('Erreur lors de la mise à jour de l\'utilisateur');
    }
};
  

//Système de login 

//Controller pour afficher le formulaire de connexion
exports.loginForm = (req, res) => {
    res.render('pages/login', { title: 'Connexion - Restaurant Caribéen' }); // Affiche le formulaire de connexion
}

//Controller pour se login
//Méthode POST pour le login via le formulaire => login
// On vérifie si l'utilisateur existe (par son email) et si le mot de passe est correct
exports.login = async (req, res) => {
    try {
           const {email, password} = req.body;
           const user = await User.findOne({email: email});
           
           if (user && user.password === password) {  
           req.session.user = user                    
           const token = jwt.sign({
                sub: user._id,
                fname: user.fname,
                email: user.email } 
                , "a-string-secret-at-least-256-bits-long", 
                {expiresIn: '1h'}); 
                
            res.cookie("token", token, { httpOnly: true, secure: false }); // Stockage du token dans un cookie 
               
            res.redirect("/users/profil");
           } else {
               res.status(401).send("Mot de passe ou email incorrect");
           }
       } catch (error) {
           res.status(500).send("Error during login", error);
       }
};

//Controller pour afficher le profil de l'utilisateur connecté
exports.profil = (req, res) => {
      if (req.session.user) {
        res.render("pages/profil", {user: req.session.user, title: 'Profil - Restaurant Caribéen' }); // Affiche le profil de l'utilisateur connecté
    } else {
        res.redirect("/users/login");
    }
};

//Controller pour la déconnexion
exports.logout = (req, res) => {
    req.session.destroy();
    res.clearCookie('token'); // Suppression du cookie contenant le token
    res.redirect('/users/login'); // Redirection vers la page de connexion après la destruction de la session
}