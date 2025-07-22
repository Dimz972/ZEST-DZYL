const express = require('express');
const router = express.Router();

// Garder votre logique existante
router.get('/reservation', (req, res) => {
    res.render('pages/reservation', { title: 'Réservation - Restaurant Caribéen' });
});

// Exporter le router au lieu de démarrer le serveur
module.exports = router;