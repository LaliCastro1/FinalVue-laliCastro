<template>
    <div class="container">
      <div class="select-container">
        <label for="marcas">Seleccione una marca:</label>
        <select id="marcas" v-model="marcaSeleccionada" @change="obtenerModelos">
          <option value="" disabled>Seleccione una marca</option>
          <option v-for="marca in marcas" :key="marca.id" :value="marca.id">{{ marca.nombre }}</option>
        </select>
      </div>
      <table v-if="modeloSeleccionado.length" class="table">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Precio por día</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="model in modeloSeleccionado" :key="model.id">
            <td>{{ model.modelo }}</td>
            <td>{{ precioMedio(model.id) }}€</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        marcas: [],
        modelos: [],
        vehiculos: [],
        marcaSeleccionada: '',
        modeloSeleccionado: [],
      };
    },
    created() {
      axios.get('http://localhost:3000/marcas')
        .then(response => {
          this.marcas = response.data;
        })
        .catch(error => console.log(error));
  
      axios.get('http://localhost:3000/modelos')
        .then(response => {
          this.modelos = response.data;
        })
        .catch(error => console.log(error));
  
      axios.get('http://localhost:3000/vehiculos')
        .then(response => {
          this.vehiculos = response.data;
        })
        .catch(error => console.log(error));
    },
    methods: {
      obtenerModelos() {
        this.modeloSeleccionado = this.modelos.filter(model => model.idMarca === this.marcaSeleccionada);
      },
      precioMedio(id) {
        const vehiculosFiltrados = this.vehiculos.filter(vehiculo => vehiculo.idModelo === id);
        return vehiculosFiltrados.length ? (vehiculosFiltrados.reduce((total, vehiculo) => total + vehiculo.precioDia, 0) / vehiculosFiltrados.length).toFixed(2) : 'N/A';
      },
    },
  }
  </script>
  
  <style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  .select-container {
    margin-bottom: 20px;
  }
  
  label {
    margin-right: 10px;
    font-weight: bold;
  }
  
  select {
    padding: 8px;
    font-size: 16px;
  }
  
  .table {
    border-collapse: collapse;
    width: 100%;
  }
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  tr:hover {
    background-color: #f5f5f5;
  }
  </style>
  