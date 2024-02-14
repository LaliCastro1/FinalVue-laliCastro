<template>
  <div class="add-modelo">
    <h3>Nuevo Modelo</h3>
    <form @submit.prevent="añadirModelo">
      <div class="form-group">
        <label for="marca">Seleccione la marca:</label>
        <select id="marca" v-model="idMarca">
          <option value="" disabled>Seleccione una marca</option>
          <option v-for="marca in marcas" :key="marca.id" :value="marca.id">{{ marca.nombre }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="modelo">Nombre del modelo:</label>
        <input type="text" id="modelo" v-model="modelo"/>
      </div>
      <div class="form-group">
        <label for="extraPorModelo">Precio extra por modelo:</label>
        <input type="number" id="extraPorModelo" v-model.number="extraPorModelo"/>
      </div>
      <button type="submit">Añadir modelo</button>
    </form>
  </div>
</template>
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        marcas:[],
        idMarca: "",
        modelo: "",
        extraPorModelo: 0
      };
    },
    created() {
    axios.get('./bbdd.json')
      .then(response => {
        this.marcas = response.data.marcas;
      })
      .catch(error => {
        console.log(error);
      });
  },
    computed: {
      nuevoModelo(){
       return{
        idMarca: this.idMarca,
        modelo: this.modelo,
        extraPorModelo: this.extraPorModelo
       }
      }
      
    },
    methods: {
      añadirModelo() {
        axios.post('http://localhost:3000/modelos',this.nuevoModelo)
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.log(error)
        })
      }
    }
  };
  </script>
<style>

</style>