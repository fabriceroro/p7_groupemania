<template>
<Header/>
  <div class="first-page">
    <div class="home">
      <img alt="logo goupemania" src="../assets/icon-above-font.png" />
      <h1>Groupomania</h1>
      <h2>Connection</h2>
      <div classe="body-input">
        <input
          type="text"
          placeholder="Username"
          v-model="datalogin.username"
          name="username"
          id="username"
        />
        <input
          type="password"
          placeholder="Password"
          v-model="datalogin.password"
          name="password"
          id="password"
        />
       <button @click.prevent="login" type="submit" class="btn-connexion">Connexion</button>
        <p class="incorrect-password"></p>
      </div>
      
      
     <p>
     vous n'avez pas de compte?
      <router-link to="../views/Signup" class="link"
        >Inscrivez-vous!
      </router-link>
     </p>
    </div>
  </div>
</template>

<script>
import Header from "../components/Header"
import axios from "axios";
export default {
  name: "login",
  components : { Header },
  data() {
    return {
      datalogin: {
        username: null,
        password: null,
      },
      msg:""
    };
  },
  methods: {
    login() {
  
    if (
        this.datalogin.username ==null ||
        this.datalogin.password ==null 
      )
      { this.msg ="ERREUR DE SAISIE"}
      {
        axios
          .post("http://localhost:3000/api/user/login", this.datalogin)
          .then(response => {
              console.log(response);
              localStorage.setItem('token',response.data.token)
              document.location.href="http://localhost:8080/views/Message"; 
          })
          .catch(error => console.log(error));
      } 
    }
  }
};
</script>
<style lang="scss" scoped>
.first-page {
  display: flex;
  justify-content: center;
}
.home {
  img {
    width: 120px;
  }
  
  margin-top: 250px;
  background-color: white;
 display: flex;
 flex-direction: column;
  width: 500px;
  height: 500px;
  justify-content: center;
  align-items: center;
  border: solid 2px rgba(0, 0, 0, 0.356);
  border-radius: 20px;
  box-shadow: 10px 5px 5px rgba(0, 0, 0, 0.192);
  
  
    button {
      margin-left: 10px;
      margin-top: 5px;
      background-color: #FFD7D7 ;
      border-radius: 30px;
      height: 2rem;
      width: 80px;
      border:none;
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
.body-input{
  display: flex;
  flex-direction: column;
}
.incorrect-password {
  color: rgb(196, 26, 26);
  font-size: 90%;
}

@media screen and (max-width: 1150px) {
  .first-page {
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