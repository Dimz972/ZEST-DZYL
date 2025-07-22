const express = require('express');
const router = express.Router();
const { isAuth } = require('../middlewares/Auth'); // Importation des middlewares d'authentification



//route pour afficher la page de commande
router.get('/commande', isAuth, (req, res) => {
    // Récupérer le panier depuis la session
    const cart = req.session.cart || [];
    // Récupérer les informations de l'utilisateur connecté
    const user = req.session.user || null;
    res.render('pages/commande', { 
        cart: cart,
        user: user,
        title: 'Commande - Restaurant Caribéen' 
    }); 
});


//Route pour traiter la soumission du formulaire de commande
router.post('/commande/confirm', isAuth, (req, res) => {
    const cart = req.session.cart || [];
    const user = req.session.user || null;
    
    // Calculer le total de la commande
    let total = 0;
    cart.forEach(item => {
        total += item.plat.price * item.quantity;
    });
    
    // Sauvegarder les détails de la commande dans la session
    req.session.orderSummary = {
        cart: cart,
        user: user,
        deliveryMethod: req.body.deliveryMethod,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        notes: req.body.notes,
        total: total,
        orderDate: new Date()
    };
    
    // Vider le panier après confirmation
    //req.session.cart = [];
    
    // Rediriger vers la page de paiement 
    res.redirect('/paiement');
});



//Route pour afficher la page de paiement
router.get('/paiement', isAuth, (req, res) => {
    // Récupérer le résumé de commande depuis la session
    const orderSummary = req.session.orderSummary || null;
    
    if (!orderSummary) {
        // Si pas de commande en cours, rediriger vers les plats
        return res.redirect('/plats');
    }
    
    res.render('pages/paiement', { 
        orderSummary: orderSummary,
        title: 'Paiement - Restaurant Caribéen' 
    }); 
});


//Route pour traiter le paiement
router.post('/paiement', isAuth, (req, res) => {
    const orderSummary = req.session.orderSummary || null;

    if (!orderSummary) {
        // Si pas de commande en cours, rediriger vers les plats
        return res.redirect('/plats');
    }

    // Traitement du paiement (simulation)
    const paymentMethod = req.body.paymentMethod;
    if (paymentMethod === 'card') {
        // Traitement de la carte bancaire
        const cardNumber = req.body.cardNumber;
        const expiryDate = req.body.expiryDate;
        const cvv = req.body.cvv;

        // Ici, vous pouvez ajouter la logique pour traiter le paiement par carte
        console.log(`Traitement du paiement par carte: ${cardNumber}, ${expiryDate}, ${cvv}`);
    } else {
        // Traitement des paiements en espèces
        console.log(`Traitement du paiement en espèces`);
    }

    // Rediriger vers la page de confirmation
    res.redirect('/confirmation');
});



//Route pour afficher la page de confirmation
router.get('/confirmation', isAuth, (req, res) => {
    // Récupérer le résumé de commande depuis la session
    const orderSummary = req.session.orderSummary || null;
    
    if (!orderSummary) {
        // Si pas de commande en cours, rediriger vers les plats
        return res.redirect('/plats');
    }
    
    // Vider le panier après confirmation du paiement
    req.session.cart = [];
    
    res.render('pages/confirmation', { 
        orderSummary: orderSummary,
        title: 'Confirmation de commande - Restaurant Caribéen' 
    }); 
});

// Exporter le router au lieu de démarrer le serveur
module.exports = router;
