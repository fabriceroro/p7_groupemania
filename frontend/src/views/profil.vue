
<template>
<HeaderProfil/>
<div class="profil">
<div id="body-profile"></div>
<div class="container1">
     <span> Pseudo :</span> {{ posts.username }}<br>
     <span> Email :</span> {{ posts.email }}<br>
    
     <p v-if="posts.attachementuser"> <img class="photoprofil" :src="posts.attachementuser" alt="..."  /></p><br>
     <p v-if="posts.isAdmin==true" ><span> Profil administrateur :</span> {{ posts.isAdmin }} <br></p>
      <!-- le profil administrateur ne s'affiche que si la personne connectée est admin -->
      <p>  <button @click.prevent="deleteProfile" type="submit" class="btn-supcompte">Supprimer le compte</button> </p>  
</div>
</div>
</template>

<script>
import HeaderProfil from '@/components/HeaderProfil';
import axios from "axios";
export default {
    components :{HeaderProfil},
    name: "profil",
    data() {
        return{
        posts: [] 
        }
        
    },
       mounted() { 
       
      axios.get("http://localhost:3000/api/user/profil", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        
        .then(response => {
          console.log('réponse API',response);
          this.posts = response.data
          
        })
        
        .catch(error => console.log(error));
        },
       
    methods:{
        deleteProfile() { //me permet de supprimer un profil au click
      if (
        window.confirm("Voulez vous vraiment supprimer votre compte?")
      )
      axios
        .delete("http://localhost:3000/api/user/delete", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
     
        .then(() => {
          localStorage.clear();
          document. location. href="http://localhost:8080/signup";
        })
        }
}   
};
</script>

<style scoped>
img{
  width: 240px;
  height: 50px;
}
.photoprofil{
  height: 200px;
  width: 200px;
}
.profil{
    position:relative;
  background-color: white;
 display: flex;
  width: 500px;
  height: 500px;
  justify-content: center;
  align-items: center;
  border: solid 2px rgba(0, 0, 0, 0.356);
  border-radius: 20px;
  box-shadow: 10px 5px 5px rgba(0, 0, 0, 0.192);
  background-image: url("../assets/icon-above-font.png");
}
.HeaderHom{
  position: absolute;
}
span{
  font-weight: bold;
}
.BoutonDisconect{
  position: absolute;
  right: 12px;
  top: 1px;
}
.btn-supcompte{
  padding: 5px;
  font-size: 15px;
  text-decoration: none;
  color: white;
  border: 0px solid;
  border-radius: 20px;
  cursor:pointer;
}
.btn-supcompte {
  opacity: 0.8;
  background: red;
  text-shadow: 2px 2px 2px black;
  box-shadow: 2px 2px 2px black;
  transition-duration: .15s;
}

@media (max-width: 767px) {
.redirection-message{
  position: static;
}
.BoutonDisconect{
  position: static;
}

}
</style>