<template>
  <div class="new-brand">
    <h1>Nueva Marca</h1>
    <form @submit.prevent="agregarMarca">
      <div class="form-group">
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="nombre">
      </div>
      <div class="form-group">
        <label for="anioFundacion">Año de Fundación:</label>
        <input type="number" id="anioFundacion" v-model="anioFundacion">
      </div>
      <div class="form-group">
        <label for="paisOrigen">País de Origen:</label>
        <input type="text" id="paisOrigen" v-model="origen">
      </div>
      <button class="btn-submit" type="submit">Agregar Marca</button>
    </form>
  </div>
</template>
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        nombre: "",
        anioFundacion: "",
        origen: ""
      };
    },
    computed: {
      nuevaMarca() {
        return {
          nombre: this.nombre,
          anioFundacion: this.anioFundacion,
          paisOrigen: this.origen
        }
      }
    },
    methods: {
      agregarMarca() {
        axios.post('http://localhost:3000/marcas', this.nuevaMarca)
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
  .new-brand {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 5px;
    font-size: 16px;
    border: 1px solid #d6d6d6;
    border-radius: 4px;
  }

  .btn-submit {
    background-color: #c1451c;
    color: white;
    border-radius: 4px;
    border: none;
    padding: 11px 15px;
    font-size: 15px;
  }

  .btn-submit:hover {
    background-color: #4395e2;
  }
</style>