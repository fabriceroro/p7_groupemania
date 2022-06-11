
//le dossier ne contient que le chemin principal des routes, le contenu de la fonction des routes et dans le dossier controllers

const express = require("express");

const router = express.Router(); //on enregistre les routes dans notre routeur Express(on vient de créer), puis enregistrer celui-ci dans l'application
const post = require('../controllers/post')
const auth = require("../middleware/auth"); // on importe la fonction qui permet de vérifier les tokens et sécuriser les différentes routes
const multer = require("../middleware/multer-config"); // on importe la fonction multer de récupérer les fichiers images provenant du frontend



router.post("/createPost", auth, multer, post.createPost); // on place en argument la fonction qui sécurisera les différentes routes (auth)
router.delete("/:id", auth, post.deletePost);
router.get("/AllPost", auth, post.AllPost);
router.post("/comment", auth, post.creationcomment);
router.delete("/comment/:id", auth, post.supprimecomment);

module.exports = router;