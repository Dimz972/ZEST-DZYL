const express = require('express');
const router = express.Router();

// Garder votre logique existante
router.get('/recette', (_, res) => {
    res.render('pages/recette', { title: 'Recette - Restaurant Caribéen' }); // Affichage de la page de commande
});

// Exporter le router au lieu de démarrer le serveur
module.exports = router;