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
          <th>Extra por modelo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="model in modeloSeleccionado" :key="model.id">
          <td>{{ model.modelo }}</td>
          <td>{{ precioMedio(model.id) }}€</td>
          <td>
            {{ model.extraPorModelo }} €/día
            <template v-if="model.extraPorModelo === 0">
              <input type="number" v-model="nuevoExtra" />
              <button class="btn" @click="actualizarExtra(model.id)">Actualizar</button>
            </template>
          </td>
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
        modeloSeleccionado: []
      };
    },
    created() {
        axios.get('http://localhost:3000/modelos')
            .then(responseModelos => {
                this.modelos = responseModelos.data;
            })
            .catch(error => {
                console.log(error);
            });

        axios.get('http://localhost:3000/vehiculos')
            .then(responseVehiculos => {
                this.vehiculos = responseVehiculos.data;
            })
            .catch(error => {
                console.log(error);
            });
          axios.get('http://localhost:3000/marcas')
            .then(responseMarcas => {
                this.marcas = responseMarcas.data;
            })
            .catch(error => {
                console.log(error);
            });
    },
    methods: {
      obtenerModelos() {
        this.modeloSeleccionado = this.modelos.filter(model => model.idMarca === this.marcaSeleccionada);
      },
      precioMedio(id) {
        const vehiculosFiltrados = this.vehiculos.filter(vehiculo => vehiculo.idModelo === id);
        return vehiculosFiltrados.reduce((total, vehiculo) => total + vehiculo.precioDia, 0) / vehiculosFiltrados.length;
      },
      actualizarExtra(id) {
    const modeloSeleccionado = this.modeloSeleccionado.find(model => model.id === id);
    if (modeloSeleccionado.extraPorModelo === 0) {
      axios.patch(`http://localhost:3000/modelos/${id}`, { extraPorModelo: this.nuevoExtra })
        .then(response => {
          modeloSeleccionado.extraPorModelo = this.nuevoExtra;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
    }
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

table {
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

input[type="number"] {
  width: 70px;
  padding: 5px;
  font-size: 16px;
  margin-right: 5px;
}

.btn {
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 16px;
  cursor: pointer;
}
</style>