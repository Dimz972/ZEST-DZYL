const express = require('express');
const router = express.Router();

// Garder votre logique existante
router.get('/boutique', (req, res) => {
    res.render('pages/boutique', { title: 'Boutique - Restaurant Caribéen' });
}); // Affichage de la page de commande

// Exporter le router au lieu de démarrer le serveur
module.exports = router;