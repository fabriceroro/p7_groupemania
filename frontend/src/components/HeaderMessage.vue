<template>
  <nav class="nav-bar">
   <img alt="logo goupemania" src="../assets/icon-above-font.png" />
    <div class="container" id="navbarToggle">
      <ul class="navbar-nav mt-2 mt-lg-0">
        <li>
         <router-link class="nav-link" to="../views/profil">Profil</router-link>
        </li>
        <li>
         <router-link class="nav-link" to="../views/AllProfil">Team</router-link>
        </li>
          <small>
            Bienvenue {{ member.username }} 
            <p v-if="member.attachementuser"> <img class="photoprofil" :src="member.attachementuser" alt="..."  /></p><p class="profilsansphoto" v-else></p>
          </small>
           <p> <button @click.prevent="disconnect" type="submit" class="btn-disconect"><span class="cacher">deconnection</span><i class="fas fa-power-off"></i></button> </p>
          
      </ul> 
        
    </div>
  </nav>
</template>

<script>
import axios from "axios";
export default {
  name: "HeaderHome",
  data(){
    return{
       member: []
    }
   
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
  },
  methods: {
    disconnect() {
      localStorage.clear();
       this.$router.push('/')
    }
  }
}

</script>

<style lang='scss'>
img{
  width: 120px;
}
.photoprofil{
   height: 50px;
  width: 50px;
  border-radius: 50px;
}
.nav-link{
 opacity: 0.8;
  background: red;
  transition-duration: .15s;
   width: 100px;
             display: flex;
             flex-direction: row;
             margin-right: 10px;
             border-radius: 10px;
             background-color: white;
             padding: 5px;
             margin: 10px;
             justify-content: center;
             text-decoration: none;
             color: black;
              background-color: #FFD7D7;
             
}
nav {
  width: 100%;
  border: solid 2px rgba(0, 0, 0, 0.356);
  border-radius: 20px;
  box-shadow: 10px 5px 5px rgba(0, 0, 0, 0.192);
  top: 0;
  padding: 5px;
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

    ul{
      display: flex;
      flex-direction: row;
     
       li{
     list-style: none;
     height: 30px;
      
       }
    }
}

      
  


</style>