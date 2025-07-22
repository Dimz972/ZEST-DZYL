const express = require('express');
const router = express.Router();

// Garder votre logique existante
/*router.get('/admin', (req, res) => {
    res.render('pages/admin');
}); */

// Exporter le router au lieu de démarrer le serveur
module.exports = router;