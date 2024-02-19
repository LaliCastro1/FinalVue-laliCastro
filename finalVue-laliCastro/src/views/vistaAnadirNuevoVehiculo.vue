<template>
    <div class="add-modelo">
      <h3>Nuevo Vehículo</h3>
      <form @submit.prevent="añadirVehiculo">
        <div class="form-group">
          <label for="modelo">Seleccione el modelo:</label>
          <select id="modelo" v-model="idModelo">
            <option value="" disabled>Seleccione un modelo</option>
            <option v-for="modelo in modelos" :key="modelo.id" :value="modelo.id">{{ modelo.modelo }}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="precioPorDia">Precio por día:</label>
          <input type="text" id="precioDia" v-model.number="precioDia"/>
        </div>
        <div class="form-group">
          <label for="puertas">Puertas:</label>
          <input type="number" id="puertas" v-model.number="puertas"/>
        </div>
        <div class="form-group">
        <label for="sillaInfantil">¿Silla infantil?</label>
        <input type="checkbox" id="sillaInfantil" v-model="sillaInfantil"/>
      </div>
        <button type="submit">Añadir vehículo</button>
      </form>
    </div>
  </template>
    <script>
    import axios from 'axios';

    export default {
      data() {
        return {
          modelos:[],
          idModelo:"",
          precioDia: 0,
          puertas: 0,
          sillaInfantil: false
        };
      },
      created() {
      axios.get('./bbdd.json')
        .then(response => {
          this.modelos = response.data.modelos;
          console.log(this.modelos)
        })
        .catch(error => {
          console.log(error);
        });
    },
      computed: {
        nuevoVehiculo(){
         return{
          idModelo: this.idModelo,
          precioDia: this.precioDia,
          puertas: this.puertas,
          sillaInfantil: this.sillaInfantil
         }
        }
        
      },
      methods: {
        añadirVehiculo() {
          axios.post('http://localhost:3000/vehiculos',this.nuevoVehiculo)
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
    display: block;
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
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
    background-color: #439feb;
    color: #fff;
    cursor: pointer;
  }
  </style>