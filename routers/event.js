const express = require('express');
const router = express.Router();

// Garder votre logique existante
router.get('/event', (req, res) => {
    res.render('pages/event', { title: 'Evénements - Restaurant Caribéen' }); // Affichage de la page de commande
});

// Exporter le router au lieu de démarrer le serveur
module.exports = router;