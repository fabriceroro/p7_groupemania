const { json } = require("body-parser");
let models = require("../models"); // on appel notre modèle de shéma
let jwtUtils = require("../utils/jwtUtils");
let asyncLib = require("async"); //permet de mettre en place des waterfall
const fs = require("fs"); //donne accès aux fonctions qui nous permettent de modifier le système de fichiers (supprimer les images)
const { title } = require("process");

const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 4;

exports.createPost = (req, res, next) => {
  let headerAuth = req.headers["authorization"];
  let userId = jwtUtils.getUserId(headerAuth);;
  // Params à envoyer
  let title = req.body.title;
  let content = req.body.content;
  let attachmentURL;
  if (req.file != undefined) {
    //on vérifie si il y a une image dans la requête
    attachmentURL = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  } else {
    attachmentURL == null;
  }
  if (title == null || content == null) {
    return res.status(400).json({ error: "paramètes manquants" });
  }

  if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
    return res.status(400).json({ error: "paramètes pas ok" });
  }

  asyncLib.waterfall(
    //waterfall permet d'éxécuter des fontions en cascades, rend le code plus lisible
    [
      //créé un tableau qui contient les fonctions
      function (done) {
        //récupère dans la base de donnée notre utilisateur
        console.log(done);
        models.User.findOne({
          where: { id: userId },
        })
          .then(function (userFound) {
            //cas ou l'utilisateur a était trouvé
            done(null, userFound);
          })
          .catch(function (err) {
            return res.status(500).json({ error: "user à vérifier" }); //cas ou l'utilisateur n'est pas trouvé
          });
      },
      function (userFound, done) {
        if (userFound) {
          console.log(userFound.id);
          models.message.create({
            //si tout est ok (utilisateur trouvé et contenu bien rempli) on créé le message
            userId: userFound.id, //relis un message à un utilisateur unique
            title: title,
            content: content,
            attachement: attachmentURL,

          }).then(function (newmessage) {
            done(newmessage);
          });
        } else {
          res.status(404).json({ error: "user pas trouvé" });
        }
      },
    ],
    function (newmessage) {
      if (newmessage) {
        console.log(newmessage);
        return res.status(201).json(newmessage);
      } else {
        return res
          .status(500)
          .json({ error: "message n'a pu être enregistré" });
      }
    }
  );
};

exports.deletePost = (req, res, next) => {
  //identification du demandeur
  let userOrder = req.body.userIdOrder;
  let headerAuth = req.headers["authorization"];
  let userId = jwtUtils.getUserId(headerAuth);
  console.log(userId);
  models.User.findOne({
    attributes: ["id", "email", "username", "isAdmin"],
    where: { id: userId },
  })
    .then((user) => {
      //Vérification que le demandeur est soit l'admin soit le poster
      if (user && (user.isAdmin == true || user.id == userOrder)) {
        //userOrder et l'id de la personne qui créé le message (envouyer par le front)
        console.log("Suppression message avec l'id :", req.params.id); //récupère l'id en provenance de l'url
        models.message.findOne({
          where: { id: req.params.id },
        })
          .then((postFind) => {
            if (postFind.attachement) {
              //une fois le message identifié avec le bon id on vérifie si il y a une images
              const filename = postFind.attachement.split("/images/")[1];
              fs.unlink(`images/${filename}`, () => {
                //si il y en a une on l'a selectionne avant de la supprimer avec le message
                models.comment.destroy({ //supprimie les commentaires en même temps que les messages
                  where: { messageId: postFind.id },
                }),
                
                models.message.destroy({
                  where: { id: postFind.id },
                })
                  .then(() => res.end())
                  .catch((err) => res.status(500).json(err));
              });
            } else {
              //si il n'y a pas d'image on supprime le message simplement
              models.comment.destroy({ //supprimie les commentaires en même temps que les messages
                where: { messageId: postFind.id },
              }),
              models.message.destroy({
                where: { id: postFind.id },
              })
                .then(() => res.end())
                .catch((err) => res.status(500).json(err));
            }
          })
          .catch((err) => res.status(500).json(err));
      } else {
        res.status(403).json("Utilisateur non autorisé à supprimer ce post");
      }
    })
    .catch((error) => res.status(500).json(error));
};

exports.AllPost = (req, res, next) => {
  models.message.findAll({
    include: [
      //inclu la relation direct avec la table message
      {
        model: models.User,
        attributes: ["id", "username", "isAdmin", "attachementuser"], //on ne veut afficher que le username
      },
      {
        model: models.comment,
        attributes: ["id", "messageId", "userId", "content","createdAt"], include: [{model:models.User, attributes: ["id", "username"] }]//on veut afficher le username et l'id
      },//j'inclus la table user dans la table commentaires
    ],
    order: [["createdAt", "DESC"]], //ordre dans lequel on souhaite afficher les msg
  })
    .then((messages) => {
      if (messages.length > null) {
        //on vérifie si le message n'est pas vide
        res.status(200).json(messages); //si tout est ok on formate nos données au format json
      } else {
        res.status(404).json({ error: "Pas de post à afficher" });
      }
    })
    .catch((err) => res.status(500).json(err));
};

exports.creationcomment = (req, res, next) => {
  let headerAuth = req.headers["authorization"];
  let userId = jwtUtils.getUserId(headerAuth);
  console.log(req.body)
  models.comment.create({
    messageId: req.body.messageId,
    userId: userId,
    content: req.body.content,
  })
    .then(
      (
        comment 
      ) => res.status(201).json({ comment })
    )
    .catch((error) => console.log(error));
  //  res.status(500).json(error))
};




exports.supprimecomment = (req, res, next) => { //suppresion commentaire
  //identification du demandeur
  let userOrder = req.body.userIdOrder;
  let headerAuth = req.headers["authorization"];
  let userId = jwtUtils.getUserId(headerAuth);
  console.log(userId);
  models.User.findOne({
    attributes: ["id", "email", "username", "isAdmin"],
    where: { id: userId },
  })
    .then((user) => {
      //Vérification que le demandeur est soit l'admin soit le poster
      if (user && (user.isAdmin == true || user.id == userOrder)) {
        //userOrder et l'id de la personne qui créé le commentaire (envouyer par le front)
        console.log("Suppression commentaire avec l'id :", req.params.id); //récupère l'id en provenance de l'url
        models.comment.findOne({
          where: { id: req.params.id },
        })
          .then((postFind) => {
     
              models.comment.destroy({
                where: { id: postFind.id },
              })
                .then(() => res.end())
                .catch((err) => res.status(500).json(err));
            
          })
          .catch((err) => res.status(500).json(err));
      } else {
        res.status(403).json("Utilisateur non autorisé à supprimer ce commentaire");
      }
    })
    .catch((error) => res.status(500).json(error));
};