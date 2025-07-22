const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const userController = require('../controllers/userController');
const { isAdminAuthenticated, redirectUserIfAuthenticated, isAuthJwt } = require('../middlewares/Auth'); // Importation des middlewares




//Router pour afficher tous les utilisateurs
router.get('/users', isAdminAuthenticated, userController.index); // Utilisation du contrôleur pour afficher tous les utilisateurs
  

//Router pour afficher les utilisateurs côté admin (pour modifier ou supprimer)
router.get('/users/admin', isAdminAuthenticated, userController.indexAdmin); // Utilisation du contrôleur pour afficher

//Router pour ajouter un utilisateur
// req.body => exemple de données de l'utilisateur à ajouter via Postman "Body => raw => j.son" =
/* {
  
  "fname": "Dimitri",
  "lname": "Coppet",
  "email": "dimitri.coppet@example.fr",
  "phone_number": 786603004,
  "adresse": "13 rue de la destinée, Cergy-le-haut",
  "password": "dimitri1234",
  "__v": 0
} */
//router.post('/users/add', userController.create);

//Routes pour mettre à jour un utilisateur qu'on récupère par son fname
router.post('/users/patch', userController.update); // Utilisation du contrôleur pour mettre à jour un utilisateur


//Routes pour supprimer un utilisateur via le bouton "Supprimer" dans la vue adminUser.ejs via la methode POST
router.delete('/users/delete/:id', userController.delete); // Utilisation du contrôleur pour supprimer un utilisateur) 
 
//Route pour ajouter un utilisateur via le formulaire d'inscription
router.post('/users/add', userController.create); // Utilisation du contrôleur pour ajouter un utilisateur) 

//Route pour afficher le formulaire d'ajout d'utilisateur
router.get('/users/inscription', redirectUserIfAuthenticated , userController.form); // Affiche le formulaire pour ajouter un utilisateur

//Router pour récupérer un utilisateur par son ID
//router.get('/users/:id', userController.show);

//Router pour mettre à jour un utilisateur via le formulaire de mise à jour
router.post('/users/update/:id', userController.formUpdate); 




//Système de login

// Route pour afficher le formulaire de connexion
router.get("/users/login", redirectUserIfAuthenticated , userController.loginForm); // Affiche le formulaire de connexion


// Route pour gérer la connexion de l'utilisateur
router.post("/login", userController.login); // Utilisation du contrôleur pour gérer la connexion


// Route pour afficher le profil de l'utilisateur connecté
router.get("/users/profil", isAuthJwt, userController.profil); // Affiche le profil de l'utilisateur connecté


// Route pour la déconnexion => profil.ejs
router.get('/logout', userController.logout); // Utilisation du contrôleur pour gérer la déconnexion






// Export du routeur
module.exports = router; 




