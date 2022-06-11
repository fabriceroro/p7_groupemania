<template>
       <div id="app" class="container-fluid">
       <div id="nav">
      
       </div>
      <router-view />
  </div>
  
</template>

<script>

export default {
  name: 'App',
  components: {
   
  }
};
</script>


<style lang="scss">
.container-fluid{
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  
}
</style>