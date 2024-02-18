<template>
    <div class="vehiculos">
      <h1 class="titulo">Vehículos</h1>
      <div class="select-container">
        <label>Seleccione una marca:</label>
        <select class="select" v-model="marcaSeleccionada" @change="cargarModelos(marcaSeleccionada)">
          <option value="">Todos los vehículos</option>
          <option v-for="marca in marcas" :value="marca.id" :key="marca.id">
            {{ marca.nombre }}
          </option>
        </select>
      </div>
      <div class="select-container">
        <label>Seleccione un modelo:</label>
        <select class="select" v-model="modeloSeleccionado" @change="filtrarVehiculos()" :disabled="!marcaSeleccionada">
          <option value="">Seleccione un modelo</option>
          <option v-for="modelo in modelosPorMarca" :value="modelo.id" :key="modelo.id">
            {{ modelo.modelo }}
          </option>
        </select>
      </div>

      <table class="tabla">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Precio por día</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="modelo in modelosPorMarca" :key="modelo.id">
            <td>{{ modelo.modelo }}</td>
            <td>{{ modelo.precio }}€</td> 
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "VistaVehiculos",
    data() {
      return {
       
      };
    },
    mounted() {
      
    },
    methods: {
      cargarModelos(idMarca) {
       
      },
      filtrarVehiculos() {
        
        this.modelosPorMarca = this.marcaSeleccionada ? this.modelos.filter(modelo => modelo.idMarca === this.marcaSeleccionada) : [];
      },
     
    },
  }
  </script>
  
  <style>
 .vehiculos {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
  }

  .titulo {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .select-container {
    margin-bottom: 20px;
  }

  .select {
    margin-left: 10px;
    padding: 5px;
    border-radius: 5px;
    border: none;
    background-color: #7bb1d5;
    font-size: 1.2rem;
  }

  .tabla {
    width: 60%;
    border-collapse: collapse;
    text-align: center;
  }

  .tabla th,
  .tabla td {
    padding: 10px;
    border: 1px solid black;
  }

  .tabla th {
    background-color: #46c3e9;
    font-size: 1.2rem;
  }
  </style>
  