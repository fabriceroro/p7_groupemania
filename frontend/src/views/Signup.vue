<template>
<Header/>
   <main classe="page-signup">
    <form class="home">
    <img alt="logo goupemania" src="../assets/icon-above-font.png" />
      <div class="container1">
        <span class="msg">{{ msg }}</span>
        
      </div>
      <div class="container2">
        <div class="form-group">
          <label for="inputEmail"><span>Email </span></label>
          <input type="email" class="form-control" id="inputEmail" v-model="dataSignup.email" />
        </div>
        <div class="form-group">
          <label for="inputUsername"><span>Username </span></label>
          <input type="text" class="form-control" id="inputUsername" v-model="dataSignup.username" placeholder="entre 5 et 12 caractères" />
        </div>
        <div class="form-group">
          <label for="inputPassword"><span>Password </span></label>
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            v-model="dataSignup.password"
            placeholder="1min, 1maj, 1spéc, 8car(min)"
          />
        </div>
        <label for="inputFile"><span class="cacher">aaaa</span></label>
       <div class="btn-upload"> <input name="inputFile" type="file" class="upload" id="inputFile" @change="onFileChanged"/></div><br>
        <button @click.prevent="sendSignup" type="submit" class="btn-signup">Enregistrez-vous</button>
      </div>
      <p>
         <small>
            Vous avez déjà un compte,
            <router-link class="redirection-singup" to="../views/login">connecter-vous</router-link>
          </small>
        </p>
    </form>
    
  </main>
</template>
<script>
import Header from "../components/Header"
import axios from "axios";
export default {
  name: "SignUp",
  components: { Header},
  data() {
    return {
      dataSignup: { //on initialise les éléments suivants qui sont vides pour le moment et seront "remplis" grâce à v-model
        username: null,
        email: null,
        password: null,
        selectedFile:null
      },
      msg:""
    };
  },
  methods: {
    sendSignup() {
      const formData = new FormData();
  formData.append('username', this.dataSignup.username);
  formData.append('email', this.dataSignup.email);
  formData.append('password', this.dataSignup.password);
  formData.append('inputFile', this.dataSignup.selectedFile);
if (formData.get("email") !== null & formData.get("username") !== null & formData.get("password") !== null) 
 { this.msg ="ERREUR DE SAISIE"}

 {
        axios
          .post("http://localhost:3000/api/user/signup", formData)
          .then(response => {
            console.log(response); //une fois le compte enregistré on remet les inputs "à 0"
            //Réinitialisation
            this.dataSignup.email = null;
            this.dataSignup.username = null;
            this.dataSignup.password = null;
            document. location. href="http://localhost:8080/views/login";
          })
          
         
          
          .catch(error => console.log(error));
      } 
    },
   
  onFileChanged (event) { //me permet de charger un fichier (une image) au click
    this.dataSignup.selectedFile = event.target.files[0];
    console.log(this.dataSignup.selectedFile)
  }
}
};
</script>
<style lang="scss" scoped>
.page-signup {
  display: flex;
  justify-content: center;

}
img{
  width: 120px;
}
.home {
 
  margin-top: 250px;
  background-color: white;
 display: flex;
 flex-direction: column;
 justify-content: center;
  width: 500px;
  height: 550px;
  align-items: center;
  border: solid 2px rgba(0, 0, 0, 0.356);
  border-radius: 20px;
  box-shadow: 10px 5px 5px rgba(0, 0, 0, 0.192);
  
   
    button {
      cursor: pointer;
    
  }
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
}
.cacher{ /*je cache le texte du bouton pour WAVE*/
    display: none;
}
.btn-signup{
  padding: 5px;
  font-size: 15px;
  text-decoration: none;
  border: 0px solid;
  border-radius: 20px;
 

  cursor:pointer;
}

#inputEmail, #inputPassword, #inputUsername{
  border: 2px solid none;
  border-radius: 10px;
  border: none;
  outline: none;
  box-shadow: 1px 1px 1px black;
  margin: 5px;
}
img{
  width: 150px;
}
.conteair1{
  display: flex;
  justify-content: center;
}
@media screen and (max-width: 1150px) {
  .page-signup {
    display: flex;
    justify-content: center;
  
  }
 
}
@media screen and (max-width: 520px) {
  .home {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 550px;
   
  }
}
</style>