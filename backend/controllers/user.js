const bcrypt = require("bcrypt");
const utils = require("../utils/jwtUtils");
const jwt = require("jsonwebtoken");
const models = require("../models");
const asyncLib = require("async");


// Constants
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@/$!%*?&])[A-Za-z\d@/$!%*?&]{8,}$/; //au moins 8 caractères, 1 lettre minuscule, 1 majuscule 1 chiffre 1carac spécial

// Routes
exports.signup = (req, res, next) => {
  // Params
  console.log('ok');
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;

  let attachmentURL;
  if (req.file != undefined) {
    //on vérifie si il y a une image dans la requête
    attachmentURL = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  } else {
    attachmentURL == null;
  }

  if (email == null || username == null || password == null) {
    return res.status(400).json({ error: "paramètres manquant" });
  }

  if (username.length >= 13 || username.length <= 4) {
    return res.status(400).json({
      error: "erreur saisie username (nombres de caractères requis 5 - 12)",
    });
    
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "email pas ok" });
  }

  if (!PASSWORD_REGEX.test(password)) {
    return res.status(400).json({
      error:
        "password invalid (au moins 8 caractères, 1 lettre minuscule, 1 majuscule et 1 chiffre)",
    });
  }

  asyncLib.waterfall(
    [
      function (done) {
        models.User.findOne({
          //on vérifie si l'utilisateur est présent dans la base de donnée
          attributes: ["email"],
          where: { email: email },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res
              .status(500)
              .json({ error: "vérifier info de l'utilisateur" });
          });
      },
      function (userFound, done) {
        if (!userFound) {
          //on vérifie si le paramètre userFound existe ou non
          bcrypt.hash(password, 10, function (err, bcryptedPassword) {
            //si c'est ok on hash le mdp dans la variable bcryptePassword
            done(null, userFound, bcryptedPassword);
          }); //on place toujours done(null) tant qu'on est toujours dans le waterfall
        } else {
          return res.status(409).json({ error: "utilisateur existe déjà" });
        }
      },
      function (userFound, bcryptedPassword, done) {
        let newUser = models.User.create({
          //si tout est on créé le nouvel utilisateur en récupérant les paramètres utilisé avant
          email: email,
          username: username,
          password: bcryptedPassword,
          isAdmin: 0,
          attachementuser: attachmentURL,
        })
          .then(function (newUser) {
            done(newUser);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "cannot add user" });
          });
      },
    ],
    function (newUser) {
      if (newUser) {
        // on vérifie si newUser a bien était créé
        return res.status(201).json({
          userId: newUser.id, //si tout est on créé l'utilisateur avec son identifiant
        });
      } else {
        return res
          .status(500)
          .json({ error: "utilisateur impossible a créer" });
      }
    }
  );
};
exports.login = (req, res, next) => {
  //Récupération et validation des paramètres

  let username = req.body.username;
  let password = req.body.password;
  if (username == null || password == null) {
    return res.status(400).json({ error: "paramètres manquant" });
  }

  asyncLib.waterfall(
    [
      function (done) {
        models.User.findOne({
          where: { username: username },
        })
          .then(function (userFound) {
            done(null, userFound);
          })
          .catch(function (err) {
            return res
              .status(500)
              .json({ error: "vérifiter info de l'utilisateur" });
          });
      },
      function (userFound, done) {
        if (userFound) {
          bcrypt.compare(
            //on compare le mot de passe saisie dans le frontend au mot de passe de la base de donnée
            // on vérifie si l'utilisateur a saisie le bon mdp
            password,
            userFound.password,
            function (errBycrypt, resBycrypt) {
              done(null, userFound, resBycrypt);
            }
          );
        } else {
          return res
            .status(404)
            .json({ error: "utilisateur existe pas dans la base de donnée" });
        }
      },
      function (userFound, resBycrypt, done) {
        if (resBycrypt) {
          done(userFound);
        } else {
          return res.status(403).json({ error: "password faux" });
        }
      },
    ],
    function (userFound) {
      if (userFound) {
        return res.status(201).json({
          userId: userFound.id,
          token: utils.generateToken(userFound),
        });
      } else {
        return res
          .status(500)
          .json({ error: "impossible de connecter l'utilisateur" });
      }
    }
  );
};

exports.profil = (req, res, next) => {
  let headerAuth = req.headers["authorization"];
  console.log(headerAuth);
  let id = utils.getUserId(headerAuth);
console.log(headerAuth);
  console.log(id);
  //let userId = utils.getUserId(req.headers.authorization);
  models.User.findOne({
    attributes: ["id", "email", "username", "isAdmin", "attachementuser"], //les éléments que l'on souhaite afficher
    where: { id: id }, // récupère les infos grâce l'user id précisé dans le token
  })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(500).json(error));
};

exports.AllProfil = (req, res, next) => {
  models.User.findAll({
    include: [
      //inclu la relation direct avec la table Message
      {
        model: models.message,
        attributes: ["id"], //on ne veut afficher que l'id
      },
    ],
  })
    .then((found) => {
      res.status(200).json({ found });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteProfile = (req, res) => {
  //récupération de l'id de l'user dans le token
  let headerAuth = req.headers["authorization"];
  let userId = utils.getUserId(headerAuth);
  if (userId != null) {
    //on vérfite si il y a bien un id
    models.User.findOne({
      where: { id: userId }, //on compare l'id reçu à celui dans la base de donnée
    }).then((user) => {
      if (user != null) {
        //si l'utilisateur a était correctement identifié
  models.message.findAll({
  where : { userId:user.id}
}).then ((messages) => {
  messages.forEach((message) => {
    const messageId = message.id;
    models.Comment.destroy({
      where: { messageId:messageId }
    });
  });
}),

        
        models.message.destroy({ //supprime les messages posté par la personne connecté
          where: { userId: user.id },
        })
          .then(() => {
            //Suppression de l'utilisateur
            models.User.destroy({
              //on supprime l'utilisateur trouvé dans la BDD
              where: { id: user.id },
            })
              .then(() => res.end()) //arrêt de la response sans fournir de donnée
              .catch((err) => console.log(err));
          })
          .catch((err) => res.status(500).json(err));
      } else {
        res.status(401).json({ error: "Cet user n'existe pas" });
      }
    });
  } else {
    res.status(500).json({
      error: "Impossible de supprimer ce compte",
    });
  }
};