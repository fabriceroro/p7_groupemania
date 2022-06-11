
const express = require("express"); //toujours besoin d'express avant de créer un routeur
const router = express.Router(); //on enregistre les routes dans notre routeur Express(on vient de créer), puis enregistrer celui-ci dans l'application
const Userctrl = require("../controllers/user"); //on associe le controller a la routes
const auth = require("../middleware/auth"); // on importe la fonction qui permet de vérifier les tokens et sécuriser les différentes routes
const multer = require("../middleware/multer-config"); // on importe la fonction multer de récupérer les fichiers images provenant du frontend

router.post("/signup",multer, Userctrl.signup); // on utilise des routes post car le frontend envoie des informations des utilisateurs
router.post("/login", Userctrl.login);
router.get("/profil" ,auth , Userctrl.profil);
router.get("/AllProfil", auth, Userctrl.AllProfil);
router.delete("/delete", auth, Userctrl.deleteProfile);
module.exports = router;