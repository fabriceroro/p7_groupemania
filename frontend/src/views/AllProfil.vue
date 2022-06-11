       <template>
       <HeaderAllProfil/>
      <main>
          <div id="hautdepage"></div>
          <router-link class="redirection-message" to="/Message"></router-link>
      <div class="container1">
      <div class = "test"><h1>Team Groupomania</h1>
      <ul id="example-1">
     <li v-for="item in posts" :key="item.id"> 
      <span>Pseudo :</span> {{ item.username }}<br>
      <span>Email :</span> {{ item.email }}<br>
      
      <p v-if="item.attachementuser" > <img :src="item.attachementuser" alt="..."  /></p><br> <!-- j'affiche l'image uniquement si il y en a une  -->
      </li> 
     </ul> 
     </div>
     </div>
      </main>  
</template>
  
<script>
import HeaderAllProfil from '../components/HeaderAllProfil'
import axios from "axios";
   export default {
    name: "AllProfil",
    components :{HeaderAllProfil},
      data() {
        return{
        posts: [] 
        }
        
    },
       mounted() { // je récupère les données du profil connecté
      axios
        .get("http://localhost:3000/api/user/AllProfil",
         {  //je récupère les éléments que je souhaite poster
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token") //je récupère la clé présent dans le local storage
            }
          })
        .then(response => {
          console.log('réponse API',response);
          this.posts = response.data.found
          
        })
        .catch(error => console.log(error));
        }
};
      </script>
     <style scoped>
     template{
      background-image: url("../assets/icon-above-font.png");
     }
img{
 height: 240px;  
 width: 200px;
}
span{
font-weight: bold;
font-size: 20px;
}
header{
background-color: #F2F2F2;
height: 70px;
border-radius: 8px;
}
main{
     display: flex;
     flex-direction: row;
     background-color: #FFFAFA;
}
.container1{
  display: flex;
  justify-content: center;
   width: 400px;
}
#example-1{
  width: 100%;
  padding: 0;
}
.test li{ /*liste contenant les contenus, titre...*/
  background-color:#F2F2F2;
  margin-bottom: 30px;
  margin-left: 5px;
  margin-right: 5px;
  border: 2px solid none;
  border-radius: 8px;
  box-shadow: 1px 1px 2px #555;
  list-style: none;
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
   
}

.cacher{
    display: none;
}
@media (max-width: 767px) {
.redirection-message{
  position: static;
  }
img{
 height: 200px;  
 width: 150px;
}
.test li{
    width: 100%;
}
#example-1{
  margin: auto;
  margin-right: auto;
  margin-left: auto;
  padding: 0px;
}
}   
</style>