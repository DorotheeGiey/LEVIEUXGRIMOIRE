const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();                                  // Utilisez memoryStorage pour mémoriser et traiter l'image avant de la sauvegarder

const fileFilter = (req, file, callback) => {                           // filtrer les fichiers en fonction de leur type MIME, acceptant uniquement certaines images (JPEG, PNG, etc.).
  if (/image\/(jpeg|png|jpg|webp)/.test(file.mimetype)) {    
    callback(null, true);
  } else {
    callback(new Error('Type de fichier non supporté'), false);   
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single('image');   // configure multer pour traiter les téléchargements de fichiers dans les requêtes entrantes, 
                                                                                      // en utilisant une configuration de stockage spécifique et un filtre pour accepter uniquement certains types d'images. 
                                                                                      //Le .single('image') indique que l'API attend un seul fichier à la fois dans le champ nommé image du formulaire.

const imageProcessingMiddleware = (req, res, next) => {                 
  upload(req, res, function (err) {
    if (err) {                                                          // Gérez l'erreur si nécessaire
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) return next();                                      // Vérifiez si un fichier a été téléchargé

    const filename = req.file.originalname.split(' ').join('_');
    const finalFilename = `${filename}${Date.now()}.webp`;

    sharp(req.file.buffer)                                              // Utilisez sharp pour redimensionner l'image
      .resize(220, 320)                                                 // Redimensionnez selon vos besoins
      .toFormat('webp')                                                 // Convertissez toutes les images en .webp
      .toFile(`images/${finalFilename}`, (err, info) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        req.imagePath = `images/${finalFilename}`;            // stockage de l'image dans le dossier images avec le nom finalFilename
        next();                                               // Passez au middleware suivant
      });
  });
};

module.exports = imageProcessingMiddleware;






// const multer = require('multer');   // import de multer pour utilisation 

// const MIME_TYPES = {                    // dictionnaire des différentes extensions possibles
//   'image/jpg': 'jpg',
//   'image/jpeg': 'jpg',
//   'image/png': 'png'
// };

// const storage = multer.diskStorage({                // fonction diskStorage image qui va être chargées dans le backend dossier images (créé) 
//   destination: (req, file, callback) => {           // première objet de la fonction = destination ==> dossier images 
//     callback(null, 'images');
//   },
//   filename: (req, file, callback) => {                  // deuxièle objet de la fonction = nom de l'image afin qu'il soit unqiue 
//     const name = file.originalname.split(' ').join('_');        // fonction filename ==> au nom original, on enlève les espaces et on met des underscores
//     const extension = MIME_TYPES[file.mimetype];                // à l'extension on applique celle du doctionnaire mime-types 
//     callback(null, name + Date.now() + '.' + extension);           // ainsi le nom de l'image enregistrée sear , nom + date du jour + point + extension
//   }
// });

// module.exports = multer({storage: storage}).single('image') // méthode single() crée un middleware qui capture les fichiers d'un certain type (passé en argument), 
//                                                             // et les enregistre au système de fichiers du serveur à l'aide du storage configuré.
//                                                             // on gère uniquement les images 