<template>
  <div id="app">
    <div id="nav">
      <router-link class="nav-link" to="/">Inicio</router-link>
        <router-link class="nav-link sub" to="/marcas/nueva-marca">Nueva marca</router-link>
        <router-link class="nav-link sub" to="/modelos/nuevo-modelo">Nuevo Modelo</router-link>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<style>
#nav {
  display: flex;
  text-align: center;
  flex-direction: column;
  background-color: #242424;
 
  float: left;
  height: 100%;
}

.nav-link {
  display: block;
  margin-bottom: 10px;
  text-decoration: none;
  color: white;
}
.sub{
  color: rgb(41, 97, 78);
}

</style>