<template>
  <div id="app">
    <div id="nav">
      <router-link class="nav-link" to="/">Inicio</router-link>
        <router-link class="nav-link sub" to="/marcas/nueva-marca">Nueva marca</router-link>
        <router-link class="nav-link sub" to="/modelos/nuevo-modelo">Nuevo Modelo</router-link>
        <router-link class="nav-link" to="/marcas">Marcas</router-link>
        <router-link class="nav-link sub" to="/modelos">Modelos</router-link>
        <router-link class="nav-link" to="/vehiculos">Vehículos</router-link>
        <router-link class="nav-link sub" to="/vehiculos/nuevo-vehiculo">Nuevo Vehículo</router-link>
        <router-link class="nav-link" to="/clientes">Clientes</router-link>
        <router-link class="nav-link sub" to="/vehiculos/alquiler">Alquiler</router-link>
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
  width: 20%;
  height: 50%;
  text-align: center;
  flex-direction: column;
  background-color: #2f77e4;
  float: left;

}

.nav-link {
  font-weight: bold;
  display: block;
  margin-bottom: 20px;
  text-decoration: none;
  color: white;
  
}
.sub{
  color: rgb(216, 243, 255);
}

</style>