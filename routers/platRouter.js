const express = require('express');
const router = express.Router();
const Plat = require('../models/Plat');
const platController = require('../controllers/platController');
const multer = require('multer');
const { isAdminAuthenticated } = require('../middlewares/Auth'); // Importation du middleware pour vérifier l'authentification admin
//const { isAuth } = require('../middlewares/Auth'); // Importation du middleware pour vérifier l'authentification utilisateur




// Configuration de multer pour l'upload de fichiers
// On utilise multer pour gérer l'upload des images des plats
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Dossier où les images seront stockées
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname); // Nom du fichier avec un timestamp pour éviter les conflits
        }
    });
    const uploadImage = multer({
         storage: storage 
         //Ajout de d'autres options si nécessaire
        });


//Routes pour récupérer tous les plats
router.get('/plats', platController.index); // Utilisation du contrôleur pour afficher tous les plats


//Routes pour afficher la page des plats côté admin (pour modifier ou supprimer)
router.get('/plats/admin', isAdminAuthenticated, platController.indexAdmin); // Utilisation du contrôleur pour afficher les plats côté admin

//Routes pour récupérer un plat par son ID
//router.get('/plats/:id', platController.show ); // Utilisation du contrôleur pour afficher un plat par son ID 

//Routes pour ajouter un plat via le formulaire d'ajoutPlat.ejs
router.post('/plats/add', uploadImage.single('image'), platController.create); // Utilisation du contrôleur pour ajouter un plat


//Routes pour mettre à jour un plat, qu'on récupère par son nom
router.patch('/plats/patch', platController.update); // Utilisation du contrôleur pour mettre à jour un plat

//Routes pour supprimer un plat
router.delete('/plats/delete/:id', platController.delete); // Utilisation du contrôleur pour supprimer un plat) 

// Route pour afficher le formulaire d'ajout de plat
router.get('/plats/ajout', isAdminAuthenticated, platController.form); // Affiche le formulaire pour ajouter


//Route pour mettre à jour un plat via le bouton "Mettre à jour" dans la vue plats.ejs
router.post('/plats/update/:id', uploadImage.single('image'), platController.formUpdate); // Utilisation du contrôleur avec multer

//Route pour afficher le détail d'un plat
router.get('/plats/:id', platController.show); // Utilisation du contrôleur pour afficher un plat par son ID


//Panier Routes
// Route pour ajouter un plat au panier
router.post('/plats/:id/add-to-cart', platController.addToCart); // Utilisation du contrôleur pour ajouter un plat au panier

// Route pour afficher le panier
router.get('/panier', platController.showCart); // Utilisation du contrôleur pour afficher le panier

// Route pour supprimer un article du panier
router.post('/panier/delete/:id', platController.removeFromCart); // Utilisation du contrôleur pour supprimer un plat du panier

// Exportation du routeur
module.exports = router;