const express = require('express');
const Plat = require('../models/Plat'); // Importation du modèle Plat

//Dans ce fichier, on va créer les controllers pour gérer les plats
//Qu'on va exporter pour les utiliser dans le routeur platRouter.js

//Controller pour afficher tous les plats
exports.index = async (req, res) => {
    try {
        //Récupération des plats => Model + find() => [] tableau d'objets
        const plats = await Plat.find();
        //console.log('Plats trouvés:', plats);
        res.status(200).render('pages/plats', { plats, title: 'Plats - Restaurant Caribéen' });
        
    } catch (error) {
        throw new Error('Error retrieving plats: ' + error);
    }
}
//Controller pour les plats coté admin afin de le modifier ou supprimer
exports.indexAdmin = async (req, res) => {
    try {
        //Récupération des plats => Model + find() => [] tableau d'objets
        const plats = await Plat.find();
        console.log('Plats trouvés:', plats);
        res.status(200).render('pages/adminPlat', { plats, title: 'Administration Plats - Restaurant Caribéen' });
        //Réponse json api
        //res.status(200).json(plats);
        
    } catch (error) {
        throw new Error('Error retrieving plats: ' + error);
    }
}
//Controller pour afficher un plat par son ID
/*exports.show = async (req, res) => {
    try {
        //Récupération du plat par son ID
        const platId = req.params.id;
        const plat = await Plat.findById(platId);
        console.log('Plat récupéré par ID:', plat);
        res.status(200).json({plat}); 
        
    } catch (err) {
        throw ('Error:', err);
    }
} */

//Controller pour ajouter un plat via le formulaire => ajoutPlat.ejs
exports.create = async (req, res) => {
    try {
         const imagePlat = '/' + req.file.filename; // Chemin de l'image uploadée
         const newPlat = new Plat({...req.body, image: imagePlat}); // Création d'une nouvelle instance de Plat avec les données du formulaire
         console.log("Message: ",req.file)
         await newPlat.save();
         console.log('Plat ajouté :', newPlat);
         res.redirect('/plats'); // Redirection vers la liste des plats
      } catch (error) {
         console.error('Erreur lors de l\'ajout du plat :', error);
         res.status(500).send('Erreur lors de l\'ajout du plat');
      }
};


//Controller pour mettre à jour un plat, qu'on récupère par son nom
exports.update = async (req, res) => {
    try {
        const patchPlat = await Plat.findOneAndUpdate(
          {name: "Poulet Colombo - Test Ajout"}, // Critère de recherche
          { description: " Test Mise à jour" }, // Mise à jour de la description
          { new: true } // Retourner le document mis à jour 
        );
        res.status(200).json({'Plat mis à jour avec succès' : patchPlat});
        
    } catch (error) {
        throw new Error('Error updating plat: ' + error);
    }
}

//Controller pour supprimer un plat
exports.delete = async (req, res) => {
     try {
            //Récupération de l'ID du plat à supprimer depuis les paramètres de la requête
            const platId = req.params.id;   
            const deletedPlat = await Plat.findByIdAndDelete(platId);
            console.log('Plat supprimé:', deletedPlat);
            res.redirect('/plats'); // Redirection vers la liste des plats après suppression
        } catch (error) {
            throw new Error('Error deleting plat: ' + error);
        }};

//Controller pour afficher le formulaire d'ajout de plat
exports.form = (req, res) => {
    try {
        res.status(200).render('pages/ajoutPlat',
             {  style : "client", // Style spécifique pour cette page
                title: 'Ajouter un plat - Restaurant Caribéen' });// Affiche le formulaire pour ajouter un plat
    } catch (error) {
        throw new Error('Error displaying add plat form: ' + error);
    }
}

//Controller pour mettre à jour un plat via le bouton "Mettre à jour" dans la vue plats.ejs
exports.formUpdate = async (req, res) => {
    try {
        const platId = req.params.id;
        const { name, origin, isSpicy, isVegetarian, ingredients, description, price } = req.body;
        
        // Gérer l'image : si une nouvelle image est uploadée, l'utiliser, sinon garder l'ancienne
        const updateData = { name, origin, isSpicy, isVegetarian, ingredients, description, price };
        
        if (req.file) {
            updateData.image = '/' + req.file.filename; // Nouvelle image uploadée
        }
        
        const updatedPlat = await Plat.findByIdAndUpdate(
            platId,
            updateData,
            { new: true } // Retourne le document mis à jour
        );
        
        if (!updatedPlat) {
            return res.status(404).send('Plat non trouvé');
        }
        
        console.log('Plat mis à jour:', updatedPlat);
        res.redirect('/plats'); // Redirection vers la page admin des plats
        
    } catch (error) {
        console.error('Error updating plat:', error);
        res.status(500).send('Erreur lors de la mise à jour du plat');
    }
}

//Controller pour afficher un plat
exports.show = async (req, res) => {
    try {
        const platId = req.params.id;
        const plat = await Plat.findById(platId);
        if (!plat) {
            return res.status(404).send('Plat non trouvé');
        }
        res.status(200).render('pages/platDetail', { plat, title: `${plat.name} - Restaurant Caribéen` }); // Affiche les détails du plat
    } catch (error) {
        console.error('Erreur lors de la récupération du plat:', error);
        res.status(500).send('Erreur lors de la récupération du plat');
    }
};



//Panier Controllers
//Controller pour ajouter un plat au panier
exports.addToCart = async (req, res) => {
    try {
        const platId = req.params.id;
        const plat = await Plat.findById(platId);
        if (!plat) {
            return res.status(404).send('Plat non trouvé');
        }
        // Initialiser le panier dans la session s'il n'existe pas
        if (!req.session.cart) {
            req.session.cart = [];
        }
        // Vérifier si le plat est déjà dans le panier
        const existingItem = req.session.cart.find(item => item.plat._id.toString() === plat._id.toString());
        if (existingItem) {
            // Incrémenter la quantité si déjà présent
            existingItem.quantity += 1;
        } else {
            // Ajouter le plat avec quantité 1
            req.session.cart.push({ plat, quantity: 1 });
        }
        console.log('Panier mis à jour:', req.session.cart);
        res.status(200).render('pages/panier', { cart: req.session.cart, title: 'Panier - Restaurant Caribéen' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du plat au panier:', error);
        res.status(500).send('Erreur lors de l\'ajout du plat au panier');
    }
};

//Controller pour supprimer un plat du panier
exports.removeFromCart = async (req, res) => {
    try {
        const platId = req.params.id;
        
        // Vérifier si le panier existe
        if (!req.session.cart) {
            req.session.cart = [];
        }
        
        // Filtrer le panier pour supprimer l'article avec l'ID correspondant
        req.session.cart = req.session.cart.filter(item => item.plat._id.toString() !== platId);
        
        console.log('Article supprimé du panier. Panier mis à jour:', req.session.cart);
        res.status(200).render('pages/panier', { cart: req.session.cart, title: 'Panier - Restaurant Caribéen' });
    } catch (error) {
        console.error('Erreur lors de la suppression du plat du panier:', error);
        res.status(500).send('Erreur lors de la suppression du plat du panier');
    }
};

//Controller pour afficher le panier
exports.showCart = (req, res) => {
    try {
        // Vérifier si le panier existe
        if (!req.session.cart) {
            req.session.cart = [];
        }
        
        console.log('Affichage du panier:', req.session.cart);
        res.status(200).render('pages/panier', { cart: req.session.cart, title: 'Panier - Restaurant Caribéen' });
    } catch (error) {
        console.error('Erreur lors de l\'affichage du panier:', error);
        res.status(500).send('Erreur lors de l\'affichage du panier');
    }
};