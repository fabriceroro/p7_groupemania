<template>
  <nav class="nav-bar">
  <img alt="logo goupemania" src="../assets/icon-above-font.png" />
    <div class="container" id="navbarToggle">
      <ul class="navbar-nav mt-2 mt-lg-0">
        <li>
         <router-link class="nav-link" to="/Message">home</router-link>
        </li>
          
      </ul> 
        
    </div>
  </nav>
</template>

<script>
export default {
  name: "HeaderProfil",
  
};
</script>

<style lang='scss'>
img{
  width: 120px;

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
             height: 30px
            
} 
        
    }
}

      
  


</style>