const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser"); //importation du middleware cookie-parser pour gérer les cookies
const session = require("express-session"); //importation du middleware express-session pour gérer les sessions
const ejs = require("ejs"); //importation du moteur de template EJS
const connectDb = require("./database/database"); //importation de la connexion à la base de données
const Plat = require("./models/Plat"); //importation du modèle de données Employee
const User = require("./models/User"); //importation du modèle de données User
const bodyParser = require("body-parser"); //importation du middleware body-parser pour parser les données du corps de la requête
const mongoose = require("mongoose"); //importation de mongoose pour la connexion à MongoDB
const userRouter = require("./routers/userRouter");
const platRouter = require("./routers/platRouter"); //importation du routeur userPlat
const jwt = require("jsonwebtoken"); //importation de jsonwebtoken pour la gestion des tokens JWT
const expressLayouts = require("express-ejs-layouts"); //importation du middleware express-ejs-layouts pour gérer les layouts EJS

const reservationRouter = require("./routers/reservation"); //importation du routeur reservation
const commandeRouter = require("./routers/commande"); //importation du routeur commande
const boutiqueRouter = require("./routers/boutique"); //importation du routeur boutique
const recetteRouter = require("./routers/recette"); //importation du routeur recette
const eventRouter = require("./routers/event"); //importation du routeur event

const contactRouter = require("./routers/contact"); //importation du routeur contact
const adminRouter = require("./routers/admin"); //importation du routeur admin
const methodOverride = require("method-override"); //importation du middleware method-override pour gérer les méthodes HTTP PUT et DELETE

app.use(express.urlencoded({ extended: true }));

app.use(expressLayouts);
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(methodOverride("_method")); // Utilisation de method-override pour gérer les méthodes PUT et DELETE
app.use(cookieParser()); // Utilisation du middleware cookie-parser pour gérer les cookies
app.use(
  session({
    saveUninitialized: false, // Ne pas sauvegarder les sessions non initialisées
    secret: "secret",
    resave: false, // Ne pas sauvegarder la session si elle n'a pas été modifiée
  })
);

app.set("view engine", "ejs");
app.set("views", "./views"); // Spécifie le dossier des vues

//Lancement du serveur
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

//appel de la connection à la base de données
connectDb();

//PLATS

// Tableau de plats caribéens
/*const plats = [
  {
    name: "Poulet Colombo",
    origin: "Martinique",
    isSpicy: true,
    isVegetarian: false,
    ingredients: ["poulet", "colombo", "oignon", "ail", "curcuma", "pommes de terre", "carottes"],
    description: "Un plat emblématique de la Martinique, composé de morceaux de poulet mijotés avec un mélange d'épices appelé colombo, similaire au curry, accompagné de légumes.",
    image: "https://example.com/images/poulet-colombo.jpg",
    price: 12.99, // Ajout du prix
  },
  {
    name: "Accras de morue",
    origin: "Guadeloupe",
    isSpicy: true,
    isVegetarian: false,
    ingredients: ["morue", "farine", "ail", "oignon", "piment", "persil"],
    description: "De délicieux beignets salés à base de morue émiettée, relevés d'herbes et d'épices, souvent servis en apéritif ou en entrée.",
    image: "https://example.com/images/accras-morue.jpg",
    price: 8.50, // Ajout du prix
  },
  {
    name: "Blaff de poisson",
    origin: "Haïti",
    isSpicy: false,
    isVegetarian: false,
    ingredients: ["poisson", "citron vert", "ail", "oignon", "thym", "piment"],
    description: "Un plat léger et savoureux où le poisson est mariné dans du citron puis poché avec des aromates, parfait pour une cuisine saine.",
    image: "https://example.com/images/blaff-poisson.jpg",   
    price: 15.00, // Ajout du prix
  },
  {
    name: "Riz djon djon",
    origin: "Haïti",
    isSpicy: false,
    isVegetarian: true,
    ingredients: ["riz", "champignons noirs (djon djon)", "pois", "ail", "huile"],
    description: "Un riz noir parfumé aux champignons djon djon typiques d’Haïti, souvent servi lors des grandes occasions.",
    image: "https://example.com/images/riz-djon-djon.jpg",   
    price: 10.00, // Ajout du prix
  },
  {
    name: "Pain Patate",
    origin: "Martinique",
    isSpicy: false,
    isVegetarian: true,
    ingredients: ["patate douce", "lait", "sucre", "cannelle", "vanille", "zeste de citron"],
    description: "Un dessert traditionnel caribéen à base de patates douces râpées, sucré et parfumé aux épices, souvent servi froid.",
    image: "https://example.com/images/pain-patate.jpg", 
    price: 6.50, // Ajout du prix   
  }
]; */

//Définition du model de données pour les plats
/*const platSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    name: String,
    origin: String,
    isSpicy: Boolean,
    isVegetarian: Boolean,
    ingredients: [String],
    description: String,
    image: String,
    price: Number, // Ajout du champ prix
}); */

//Création du modèle de données Plat
//const Plat = mongoose.model('Plat', platSchema);

//Création de connexion à MongoDB
/*mongoose.connect('mongodb://localhost:27017/mon-projet')
.then( async () => {
  console.log('MongoDB connected successfully')
    // Insertion des plats dans la base de données
    await Plat.insertMany(plats);
    console.log('Plat inserted successfully');



}).catch(err => {
  console.error('MongoDB connection error:', err);
}); */

//Routes pour ajouter un plat
// modèle Plat + méthode create() => création d'un nouveau plat
// req.body => données du plat à ajouter =
/*{
  
  "name": "Poulet Colombo - Test Ajout",
  "origin": "Martinique",
  "isSpicy": true,
  "isVegetarian": false,
  "ingredients": [
    "poulet",
    "colombo",
    "oignon",
    "ail",
    "curcuma",
    "pommes de terre",
    "carottes"
  ],
  "description": "Un plat emblématique de la Martinique, composé de morceaux de poulet mijotés avec un mélange d'épices appelé colombo, similaire au curry, accompagné de légumes.",
  "image": "https://example.com/images/poulet-colombo.jpg",
  "__v": 0
} */
/* app.post('/plats/add', async (req, res) => {
    try {
        //Récupération des données du plat depuis le corps de la requête
        const newPlat = req.body;
        await Plat.create(newPlat);
        console.log('Plat ajouté:', newPlat);
        res.status(201).json({ message: 'Plat ajouté avec succès' });
        res.end();

        
        
    } catch (error) {
        throw new Error('Error adding plat: ' + error);
    }
});


//Routes pour récupérer tous les plats
app.get('/plats', async (req, res) =>  {
    try {
        //Récupération des plats => Model + find() => [] tableau d'objets
        const plats = await Plat.find();
        console.log('Plats trouves:', plats);
        //Réponse json api
        res.status(200).json(plats);
        
    } catch (error) {
        throw new Error('Error retrieving plats: ' + error);
    }
});

//Routes pour récupérer un plat par son ID
app.get('/plats/:id', async (req, res) => {
    try {
        
        const platId = req.params.id;
        const plat = await Plat.findById(platId);
        console.log('Employee retrieved by id:', plat);
        res.status(200).json({plat}); 
        
       
      
    } catch (err) {
        throw ('Error:', err);
    }
}); 


//Routes pour mettre à jour un plat, qu'on récupère par son nom
app.patch('/plats/patch', async (req, res) => {
    try {
        const patchPlat = await Plat.findOneAndUpdate(
          {name: "Poulet Colombo - Test Ajout"}, // Critère de recherche
          { description: "Un plat emblématique de la Martinique, composé de morceaux de poulet mijotés avec un mélange d'épices appelé colombo, similaire au curry, accompagné de légumes. - Test Mise à jour" }, // Mise à jour
          { new: true } // Retourner le document mis à jour 
        );
        console.log('Plat mis à jour:', patchPlat);
        res.status(200).json({ message: 'Plat mis à jour avec succès', plat: patchPlat }); 
        
    } catch (error) {
        throw new Error('Error updating plat: ' + error);
    }
});

//Routes pour supprimer un plat
app.delete('/plats/delete/:id', async (req, res) => {
    try {
        //Récupération de l'ID du plat à supprimer depuis les paramètres de la requête
        const platId = req.params.id;
        const deletedPlat = await Plat.findByIdAndDelete(platId);
        console.log('Plat supprimé:', deletedPlat);
        res.status(200).json({ message: 'Plat supprimé avec succès', plat: deletedPlat });
    } catch (error) {
        throw new Error('Error deleting plat: ' + error);
    }});
*/

//USER

//Tableau d'utilisateurs
/*const users = [
  {
    fname: "Jean",
    lname:"Dupont",
    email: "jean.dupont@example.com",
    phone_number: 712345678,
    adresse: "123 Rue de la République, Paris",
    password: "password123", 
  },
  {
    fname: "Marie",
    lname:"Martin",
    email: "marie.martin@example.com",
    phone_number: 640345078,
    adresse: "18 rue de la gerbe d'or, Cergy-Pontoise", 
    password: "password456", 
  },]  */

//Définition du model de données pour les utilisateurs
/*const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    fname: String,
    lname: String,
    email: String,
    phone_number: Number,
    adresse: String,
    password: String,
}); */

//Création du modèle de données User
//const User = mongoose.model('User', userSchema);

//Création de connexion à MongoDB
/*mongoose.connect('mongodb://localhost:27017/mon-projet')
.then( async () => {
  console.log('MongoDB connected successfully')
    // Insertion des users dans la base de données
    await User.insertMany(users);
    console.log('User inserted successfully');



}).catch(err => {
  console.error('MongoDB connection error:', err);
}); */

//Routes pour afficher tous les utilisateurs
/*app.get('/users', async (req, res) => {
    try {
        //Récupération des utilisateurs => Model + find() => [] tableau d'objets
        const users = await User.find();
        console.log('Users trouvés:', users);
        //Réponse json api
        res.status(200).json(users);
        
    } catch (error) {
        throw new Error('Error retrieving users: ' + error);
    }
});

//Routes pour récupérer un utilisateur par son ID
app.get('/users/:id', async (req, res) => {
    try {
        //Récupération de l'employé par son ID
        const userId = req.params.id;
        const user = await User.findById(userId);
        console.log('Employee retrieved by id:', user);
        res.status(200).json({user}); 
        
      
    } catch (err) {
        throw ('Error:', err);
    }
}); 

//Routes pour ajouter un utilisateur
// modèle User + méthode create() => création d'un nouvel utilisateur
// req.body => exemple de données de l'utilisateur à ajouter via Postman "Body => raw => j.son" =
/* {
  
  "fname": "Dimitri",
  "lname": "Coppet",
  "email": "dimitri.coppet@example.fr",
  "phone_number": 786603004,
  "adresse": "13 rue de la destinée, Cergy-le-haut",
  "__v": 0
} */

/*app.post('/users/add', async (req, res) => {
    try {
        //Récupération des données de l'utilisateur depuis le corps de la requête
        const newUser = req.body;
        await User.create(newUser);
        console.log('Utilisateur ajouté:', newUser);
        res.status(201).json({ message: 'Utilisateur ajouté avec succès' });
        res.end();
        
    } catch (error) {
        throw new Error('Error adding user: ' + error);
    }
}); 

//Routes pour mettre à jour un utilisateur qu'on récupère par son fname
app.patch('/users/patch', async (req, res) => {
    try {
        const patchUser = await User.findOneAndUpdate(
          {fname: "Dimitri"}, // Critère de recherche
          { adresse: "13 rue de la destinée, Cergy-le-haut - Test Mise à jour" }, // Mise à jour
          { new: true } // Retourner le document mis à jour 
        );
        res.status(200).json({ message: 'Utilisateur mis à jour avec succès'});
    
      } catch (error) {
        throw new Error('Error updating user: ' + error);
      }
});


//Routes pour supprimer un utilisateur
app.delete('/users/delete/:id', async (req, res) => {
    try {
        //Récupération de l'ID de l'utilisateur à supprimer depuis les paramètres de la requête
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        console.log('Utilisateur supprimé:', deletedUser);
        res.status(200).json({ message: 'Utilisateur supprimé avec succès'});

    } catch (error) {
        throw new Error('Error deleting user: ' + error);
    }});  */

// Importation du routeur UserRouter
app.use(userRouter); // Utilisation du routeur pour les routes utilisateur

// Importation du routeur PlatRouter
app.use(platRouter); // Utilisation du routeur pour les routes plat

//Route pour la page d'accueil
app.get("/", (req, res) => {
  res.render("pages/accueil", { title: "Accueil - Restaurant Caribéen" }); // Affichage de la page d'accueil
});

//Utilisation du routeur reservation
app.use(reservationRouter); // Utilisation du routeur pour les routes de réservation

//Utilisation du routeur commande
app.use(commandeRouter); // Utilisation du routeur pour les routes de commande

//Utilisation du routeur boutique
app.use(boutiqueRouter); // Utilisation du routeur pour les routes de boutique

//Utilisation du routeur recette
app.use(recetteRouter); // Utilisation du routeur pour les routes de recette

//Utilisation du routeur event
app.use(eventRouter); // Utilisation du routeur pour les routes d'événements

//Utilisation du routeur contact
app.use(contactRouter); // Utilisation du routeur pour les routes de contact

//Utilisation du routeur admin
app.use(adminRouter); // Utilisation du routeur pour les routes d'administration

//COOKIES (stockage de données sur le navigateur)
// Route pour définir un cookie qui sera envoyé au navigateur et qui se stockera dans le navigateur => F12 > Application > Cookies
/* app.get('/set-cookie', (req, res) => {
    res.cookie("username", "Dimz", 
      {
      //httpOnly: true, // Le cookie ne sera accessible que par le serveur
      //maxAge: 3000, // Durée de vie du cookie en millisecondes
      //expires: new Date(Date.now() + 3000), // Date d'expiration du cookie 
    }
    
    )
    res.end('Cookie has been set!'); // Réponse pour indiquer que le cookie a été défini
});

// Route pour récupérer un cookie depuis le navigateur 
app.get('/get-cookie', (req, res) => {
  console.log(req.cookies); // Affiche les cookies dans la console
   res.end("Bonjour " + req.cookies.username); // Affiche le cookie "username" dans la réponse
});


//SESSION (stockage de données côté serveur)

app.get('/set-session', (req, res) => {
    req.session.isAdmin = true; // Définition d'une variable de session // { isAdmin: true }
    req.session.email = "admin@hotmail.fr"
    res.end("Session ouverte !"); // Réponse pour indiquer que la session est ouverte
});

app.get('/get-session', (req, res) => {
   res.write('<a href="/logout">Logout</a><br>'); // Lien pour voir les données de session
   res.end(`Bonjour, vous etes connecte en tant qu'admin : ${req.session.isAdmin} et votre email est : ${req.session.email}`); // Affiche les données de session dans la réponse
  
});

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/get-session'); // Redirection vers la page d'accueil après la destruction de la session
}); */

//JWT (JSON Web Token) - Authentification et autorisation
//Le JWT est un standard ouvert (RFC 7519) qui permet de transmettre des informations entre deux parties de manière sécurisée sous forme d'objet JSON. Il est souvent utilisé pour l'authentification et l'autorisation dans les applications web.
/*app.get('/jwt', (req, res) => {
    try {
        const token = jwt.sign({_id: 1234, role:'admin'},"xxxx",{expiresIn: '1h'}) //creation du token  
        // { _id: 1234, role: 'admin' } => payload du token  // "xxxx" => secret key pour signer le token // { expiresIn: '1h' } => durée de validité du token
        console.log(token); // Affichage du token dans la console

        const decoded = jwt.verify(token, "xxxx") //verification du token
        console.log(decoded); // Affichage du payload décodé dans la console


    } catch (error) {
        throw error;
    }
}); */
