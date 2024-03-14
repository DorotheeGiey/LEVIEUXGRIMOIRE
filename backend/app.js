const express = require('express');
const mongoose = require('mongoose');
const path = require('path');   // permet d'accéder au path de mon serveur '

const app = express();

const userRoutes = require('./routes/user');
const booksRoutes = require('./routes/books')

/// connexion à la base de données MongoDB


mongoose.connect("mongodb+srv://do-y:NFqBqljMmBpw4iWw@cluster0.kevl4x5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(express.json());  // middleware qui intercepte tous les requetes qui ont un content type json et met à dispoistion ce contenu sur l'objet requete dans req.body

//CORS = « Cross Origin Resource Sharing ». Il s'agit d'un système de sécurité qui, par défaut, bloque les appels 
// HTTP entre des serveurs différents, ce qui empêche donc les requêtes malveillantes d'accéder à des ressources sensibles.
// premier middleware qui résoud le pb de CORS : pas de routes car général 

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static('images'));   /// gestion des routes des images 

module.exports = app;