<template>
  <HeaderMessage/>
  <main>
    <form>
        <div class="container1">
                  <div class="form-group">
                 <label for="inputTitle"><span>Titre</span> </label><br>
                   <input type="text" class="form-control" id="inputTitle" v-model="dataMessage.title" />
                   </div>
        <div class="form-group">
         
          <label for="inputContent"><span>Exprimez-vous</span></label><br>
  <textarea id="inputContent" v-model="dataMessage.content" style="height:100px"></textarea>
        </div>
       <div class="btn-upload"> <input name="inputFile" type="file" class="upload" id="inputFile" @change="onFileChanged"/></div>
        
        <button @click.prevent="SendMessage" type="submit" class="btn-publier"><span class="cacher">Envoyer</span><i class="fas fa-arrow-circle-up"></i></button>
      
      </div>
      <div class="container2">
      <div class = "test">
      <ul id="example-1">
     <li v-for="item in posts" :key="item.id"> 
      <span>{{ item.title }}<br></span>
     <p v-if="item.User.attachementuser"> <img class="photoprofil" :src="item.User.attachementuser" alt="..."  /><br></p>
      <i>Publié par <strong>{{ item.User.username }}</strong> le {{item.createdAt.split('T')[0]}} à {{item.createdAt.slice(11,16)}}<br><br></i>
      <div class="contenu"> {{ item.content }} <br></div>
      <!-- Id du posteur : {{ item.userId }} -->
      <p v-if="item.attachement" > <img :src="item.attachement" alt="..."  /></p> <!-- j'affiche l'image uniquement si il y en a une-->
      <p v-if="member.id==item.userId || member.isAdmin">  <button @click.prevent="DeleMessage(item.id, item.userId)" id="btn-sup" type="submit" class="btn btn-primary"><span class="cacher">Suprimer</span><i class="fas fa-trash-alt"></i></button> </p>    
      <!--le bouton Supprimer s'affiche uniquement si la personne connectée est la personne qui a publié le message ou un admin-->
      <!--partie création commentaire -->
     
      <textarea type="text" id="comment" name="comment" class="form-control"  v-model="dataComment.content" 
                placeholder="Insérer votre commentaire..."></textarea>
                <a @click.prevent="createComment(item.id)"><span class="envoyer">Envoyer</span><i class="fas fa-comment" title="Envoyer"></i></a>
      <div class="container3">
      <ul id="example-2"> <!--partie affichage commentaire -->
      <li v-for="comment in item.comments" :key="comment.id"> 
       <i><strong>{{ comment.User.username }}</strong> le {{comment.createdAt.split('T')[0]}} à {{comment.createdAt.slice(11,16)}}</i><br>
       {{ comment.content }}<br>
       <p v-if="member.id==comment.userId || member.isAdmin"> <button @click.prevent="DeleteComment(comment.id, comment.userId)" id="btn-sup" type="submit" class="btn btn-primary"><span class="cacher">Supprimer</span><i class="fas fa-trash-alt"></i></button></p>
      </li><!--le bouton Supprimer s'affiche uniquement si la personne connectée est la personne qui a publié le commentaire ou un admin-->
      </ul> 
      </div>
      
      
      </li> 
     </ul> 
     </div>
     </div>
        
    </form>
  
  </main>
</template>

<script>
import HeaderMessage from '@/components/HeaderMessage';
import axios from "axios";
export default {
  name: "Message",
  components :{ HeaderMessage },
  data() {
    return {
      dataMessage: {
        title: null,
        content: null,
        selectedFile: null
      },
      dataComment:{
      content:null,
      },
      
      posts: [], //je récupère les infos des messages
      member: [], //je récupère les infos de la personnes connectée
    };
  },
   
mounted() { // je récupère les données du profil connecté
      axios
        .get("http://localhost:3000/api/user/profil", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        
        .then(response => {
          console.log('réponse API',response);
          this.member = response.data
          
        })
        .catch(error => console.log(error));
        //},
        axios
        .get("http://localhost:3000/api/post/AllPost", //je récupère les messages postés
        
        {  
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token") //je récupère la clé présent dans le local storage
            }
          })
        
        .then(response => {
          console.log(response);
          this.posts = response.data
          
        })
        .catch(error => console.log(error));
},   
  methods: {
 SendMessage() { //je récupère est envoie ce dont j'ai besoin pour créer un message
  const formData = new FormData();
  formData.append('title', this.dataMessage.title); //.append créé une clé de valeur en récupérant la valeur des inputs (name = 'title' value='this.dataMessage...')
  formData.append('content', this.dataMessage.content);
  formData.append('inputFile', this.dataMessage.selectedFile);
if (formData.get("title") !== null && formData.get("content") !== null
     //.get renvoie la valeur associé a une clé créé précédement (ex: valeur de 'title' est le resulat de this.datamessage.title)   
      ) {
        axios
          .post("http://localhost:3000/api/post/createPost", formData,{ //je récupère les éléments que je souhaite poster
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token") //je récupère la clé présent dans le local storage
            }
          })
          .then(response => {
              console.log(response);
              document. location. href="http://localhost:8080/Message"; //si tout est ok je recharge la page et j'affiche ensuite mon message
          })
          .catch(error => console.log(error));
      }  else {
        console.log("oops !");
      }
    },
  onFileChanged (event) { //me permet de charger un fichier (une image) au click
    this.dataMessage.selectedFile = event.target.files[0];
    console.log(this.dataMessage.selectedFile)
  },
  DeleMessage (id, userIdOrder) { //'jenvoie l'id du message selectionné ainsi que l'id de la personne qui a créé le message
    if (
        window.confirm("Voulez vous vraiment supprimer le post?")
      )
    axios
          .delete("http://localhost:3000/api/user/post/"+id,{data:{userIdOrder}, //je récupère les éléments que je souhaite poster
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token") //je récupère la clé présent dans le local storage
            },
        })
        .then(() => {
          window.location.reload();
        })
        .catch(error => console.log(error));
     
  },
    createComment(messageId) {
  
    if (
        this.dataComment.comment !==null 
      )  
      console.log(this.dataComment)
      {   axios
          .post("http://localhost:3000/api/post/comment", 
          {
          content:this.dataComment.content, 
          messageId:messageId
          },
          
          {  //je récupère les éléments que je souhaite poster
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token") //je récupère la clé présent dans le local storage
            }
          })
          .then(response => {
              console.log(response);
              document. location. href="http://localhost:8080/message"; //si tout est ok je recharge la page et j'affiche ensuite le fil d'actualité
          })
          .catch(error => console.log(error));
      }
    },
      DeleteComment (id, userIdOrder) { //'jenvoie l'id du commentaire selectionné ainsi que l'id de la personne qui a créé le commentaire
    if (
        window.confirm("Voulez vous vraiment supprimer le commentaire?")
      )
    axios
          .delete("http://localhost:3000/api/post/comment/"+id,{data:{userIdOrder}, //je récupère les éléments que je souhaite poster
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token") //je récupère la clé présent dans le local storage
            },
        })
        .then(() => {
          window.location.reload();
        })
        .catch(error => console.log(error));
     
  },
  
}
};
</script>

<style scoped>

.container1{ /*contient les inputs*/
  background-color:#F2F2F2;
  font-family: Arial, Helvetica, sans-serif;
  border: 2px solid none;
  border-radius: 8px;
  box-shadow: 1px 1px 2px #555;
  display: flex;
  justify-content: center;
  width: 500px;
  flex-direction: column;
  align-items: center;
}

.container1 .photoprofil{ /*photo profil de la page profil perso*/
   height: 50px;
  width: 50px;
  border-radius: 50px;
}
.container2 .photoprofil{ /*photo profil de la personne qui poste le message*/
  height: 65px;
  width: 65px;
  border-radius: 50px;
  margin-top: 8px;
}

span { /*titre, contenu... en gras */
  font-weight: bold;
  font-size: 20px;
}
.contenu{ /*texte des messages*/
  font-size: 20px;
}
.test{ /*contient le fil d'actualités et le reste des infos*/
  display: flex;
  flex-direction: column;
  background-color: #FFFAFA;
  background-position: center;
  background-size: 25%;
}
.profilsansphoto{
  color: blue;
  position: absolute;
  right: 60px;
}
.fa-arrow-circle-up{
  font-size: 30px;
}
.fas-fa-users{
  size: 40px;
}
.test li{ /*liste contenant les contenus, titre...*/
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color:#F2F2F2;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid none;
  border-radius: 8px;
  box-shadow: 1px 1px 2px #555;
  list-style: none;
  font-family: Arial, Helvetica, sans-serif;
  width: 500px;
  height: auto;

}
.envoyer{
  padding: 5px;
  margin: 10px;
  justify-content: center;
  display: flex;
  font-size: 15px;
  background: red;
  text-decoration: none;
  color: white;
  border: 0px solid;
  border-radius: 20px;
  cursor:pointer;
}
#example-1{
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
#example-2{
    padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.container3 li{
  margin-top: 10px;
background-color: white;
}
.container1 img{ /*logo principal*/
  width: 250px;
  height: 50px;
  position: absolute;
  left: 10px;
}
.container2 img{ /*image publié par les utilisateurs */
  width: 350px;
  height: 340px;
  border: 2px solid none;
  border-radius: 20px;
}
small{ /*redirection vers la page profil*/
  position: absolute;
  right: 10px;
  top: 26px;
}
.redirection-allprofil{
   position: absolute;
  right: 150px;
  top: 66px;
  font-size: 35px;
}
#inputContent, #inputTitle, textarea{
  border: 2px solid ;

}
.fa-trash-alt{ /*logo corbeille*/
font-size: 30px;
}
.fa-comment{ /*envoie de commentaire*/
  font-size: 30px;
  margin-left: 10px;
  width: 50px;
  cursor: pointer;
}
#btn-sup{
margin-bottom: 10px;
}
#btn-sup, .btn-publier, .envoyer{
  padding: 5px;
  margin: 10px;
  justify-content: center;
  display: flex;
  font-size: 15px;
  background: red;
  text-decoration: none;
  color: white;
  border: 0px solid;
  border-radius: 20px;
  cursor:pointer;
}

@media (max-width: 767px) {
 .container1 img{
  width: 250px;
  height: 50px;
  position: static;
} 
.container2 img{
  width: 150px;
  height: 140px;
  border: 2px solid none;
  border-radius: 20px;
}
#example-1, #example-2{
  margin: auto;
  margin-right: auto;
  margin-left: auto;
  padding: 0px;
}
.test li{
  width: 100%;
}
.profilsansphoto{
  position: static;
}
.redirection-allprofil{
  position: static;
  right: 150px;
  top: 66px;
  font-size: 35px;
}
small{
  position: static;
}

}
</style>