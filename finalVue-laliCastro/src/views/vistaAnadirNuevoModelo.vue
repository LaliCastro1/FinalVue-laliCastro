<template>
  <div class="add-modelo">
    <h3>Nuevo Modelo</h3>
    <form @submit.prevent="anadirModelo">
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
      anadirModelo() {
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
.add-modelo {
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  max-width: 500px;
}

h3 {
  margin-top: 0;
}

.form-group {
  margin: 10px 0;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="number"],
select {
font-family:Georgia, 'Times New Roman', Times, serif;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  display: block;
  width: 100%;
  border-radius: 5px;
  box-sizing: border-box;
}

button[type="submit"] {
  display: block;
  margin-top: 10px;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  background-color: #1105ff;
  color: #fff;
  cursor: pointer;
}
</style>