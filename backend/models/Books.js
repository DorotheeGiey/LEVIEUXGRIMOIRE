const mongoose = require('mongoose');

// creation d'un gabarit / shéma de données pour le livre grâce à la méthode Shema fournie par mongoose

const bookSchema = mongoose.Schema({
  userId :{type: String, required: true},
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  rating :[{
    userId:{type: String, required: true}, 
    grade:{type: Number, required: true},
  }],
  averageRating: { type: Number, required: true },
});

// exportation dans la base de données grâce à la méthode model de mongoose

module.exports = mongoose.model('Book', bookSchema);