const express = require('express');
const router = express.Router();

// Garder votre logique existante
router.get('/contact', (req, res) => {
    res.render('pages/contact', { title: 'Contact - Restaurant Caribéen' });
}); 


// Exporter le router au lieu de démarrer le serveur
module.exports = router;


