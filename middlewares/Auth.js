const jwt = require('jsonwebtoken'); // Importation de jsonwebtoken pour la gestion des tokens JWT

//Fonctions pour vérifier l'authentification des utilisateurs admin
exports.isAdminAuthenticated = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.redirect('/users/profil'); // Redirection vers le profil utilisateur si non admin
}

//Fonction pour rediriger les utilisateurs déja loger vers leur profil
exports.redirectUserIfAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return res.redirect('/users/profil');
    }
    next();
} 

//Fonction pour vérifier l'authentification des utilisateurs via JWT
exports.isAuthJwt = async (req, res, next) => {
    const token = req.cookies.token; // Récupération du token depuis les cookies
    console.log("Token:", token); // Affichage du token dans la console pour débogage
    if (!token) {
        return res.redirect('/users/login'); // Redirection vers la page de connexion si le token n'est pas présent         
}
let decoded = await jwt.verify(token, "a-string-secret-at-least-256-bits-long"); // Vérification du token avec la clé secrète
    console.log("Decoded:", decoded); // Affichage du contenu décodé du token pour débogage
    req.user = decoded; // Ajout des informations décodées à la requête
    next(); // Passe au middleware suivant ou à la route
}

//Fonction pour vérifier si l'utilisateur est authentifié 
exports.isAuth =  (req, res, next)=>{
    if(!req.session.user) {
        return res.redirect("/users/login"); // Ajout du return
    }
    next()
}