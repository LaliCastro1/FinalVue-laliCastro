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
      <select class="select" v-model="modeloSeleccionado" @change="filtrarVehiculos()" :disabled="marcaSeleccionada === null">
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
          <th>Clientes que lo han alquilado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vehiculo in modelosConAlquileres" :key="vehiculo.id">
          <td>{{ vehiculo.nombre }}</td>
          <td>{{ vehiculo.precio }}€</td>
          <td>{{ vehiculo.alquileres }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "Vehiculos",
  data() {
    return {
      marcas: [],
      modelos: [],
      vehiculos: [],
      clientes: [],
      marcaSeleccionada: null,
      modeloSeleccionado: null,
      modelosPorMarca: [],
      modelosConAlquileres: [],

  
    };
  },
  mounted() {
    axios.get('http://localhost:3000/marcas')
    .then(response => {
        this.marcas = response.data;
    })
    .catch(error => {
        console.log(error);
    });

axios.get('http://localhost:3000/modelos')
    .then(response => {
        this.modelos = response.data;
    })
    .catch(error => {
        console.log(error);
    });

axios.get('http://localhost:3000/vehiculos')
    .then(response => {
        this.vehiculos = response.data;
        this.vehiculosFiltrados = this.vehiculos;
        this.modelosConAlquileres = this.filtrarModelosConAlquileres();
    })
    .catch(error => {
        console.log(error);
    });

axios.get('http://localhost:3000/clientes')
    .then(response => {
        this.clientes = response.data;
    })
    .catch(error => {
        console.log(error);
    });

  },  
  methods: {
    cargarModelos(idMarca) {
      if (!idMarca) {
        this.modelosPorMarca = this.modelos;
        this.modeloSeleccionado = null;
      } else {
        this.modelosPorMarca = this.modelos.filter(
          (modelo) => modelo.idMarca === idMarca
        );
        this.modeloSeleccionado = null;
      }
      this.filtrarVehiculos();
    },
    filtrarVehiculos() {
  // Filtrar vehículos por marca seleccionada o tomar todos si no se seleccionó marca
  let vehiculosFiltradosPorMarca = this.marcaSeleccionada
    ? this.vehiculos.filter((vehiculo) => {
        // Encuentra el modelo del vehículo para verificar la marca
        const modelo = this.modelos.find((modelo) => modelo.id === vehiculo.idModelo);
        return modelo.idMarca === this.marcaSeleccionada;
      })
    : this.vehiculos;

  // Filtrar por modelo seleccionado si hay uno, o preparar lista agregada si no
  if (this.modeloSeleccionado) {
    // Filtrar vehículos por modelo seleccionado y mapear a estructura deseada
    this.modelosConAlquileres = vehiculosFiltradosPorMarca.filter(vehiculo => vehiculo.idModelo === this.modeloSeleccionado)
      .map((vehiculo) => {
        // Obtener alquileres para cada vehículo
        const alquileres = this.obtenerClientesDeVehiculo(vehiculo.id);
        return {
          nombre: this.modelos.find((modelo) => modelo.id === vehiculo.idModelo).modelo,
          precio: vehiculo.precioDia,
          alquileres: alquileres.join(", "),
        };
      });
  } else {
    // Agregar vehículos por modelo y actualizar lista de modelos con alquileres
    this.modelosConAlquileres = vehiculosFiltradosPorMarca.reduce((acc, vehiculo) => {
      const modelo = this.modelos.find((modelo) => modelo.id === vehiculo.idModelo);
      const modeloIndex = acc.findIndex((item) => item.nombre === modelo.modelo);
      if (modeloIndex === -1) {
        // Si el modelo no está en acumulador, agregarlo
        acc.push({
          nombre: modelo.modelo,
          precio: vehiculo.precioDia,
          alquileres: this.obtenerClientesDeVehiculo(vehiculo.id).join(", "),
        });
      } else {
        // Si ya está, actualizar precio y alquileres si es necesario
        acc[modeloIndex].precio = Math.min(acc[modeloIndex].precio, vehiculo.precioDia);
        acc[modeloIndex].alquileres += `, ${this.obtenerClientesDeVehiculo(vehiculo.id).join(", ")}`;
      }
      return acc;
    }, []);
  }
},


    obtenerClientesDeVehiculo(idVehiculo) {
      const clientesDeVehiculo = [];

      this.clientes.forEach((cliente) => {
        const alquileres = cliente.alquileres.filter(
          (alquiler) => alquiler.vehiculo === idVehiculo
        );

        if (alquileres.length > 0) {
          clientesDeVehiculo.push(cliente.nombre);
        }
      });

      return clientesDeVehiculo;
    },

    filtrarModelosConAlquileres() {

  this.modelos.forEach((modelo) => {
    // Filtra los vehículos que corresponden al modelo actual
    let vehiculosModelo = this.vehiculos.filter(
      (vehiculo) => vehiculo.idModelo === modelo.id
    );

    
    let alquileresClientes = [];

   
    vehiculosModelo.forEach((vehiculo) => {
      // Obtiene los nombres de los clientes que han alquilado el vehículo y los añade al array de alquileresClientes
      alquileresClientes.push(...this.obtenerClientesDeVehiculo(vehiculo.id));
    });

    // Calcula el precio del modelo basado en el primer vehículo encontrado o lo establece en 0 si no hay vehículos
    let precio = vehiculosModelo.length > 0 ? vehiculosModelo[0].precioDia : 0;

    // Crea un objeto con la información del modelo, incluyendo nombre, precio, y los alquileres (nombres de clientes)
    let modeloConAlquileres = {
      nombre: modelo.modelo, 
      precio: precio, 
      alquileres: alquileresClientes.join(", "), 
    };

    // Añade el objeto del modelo a la lista de modelos con alquileres
    this.modelosConAlquileres.push(modeloConAlquileres);
  });

  // Devuelve la lista actualizada de modelos con alquileres
  return this.modelosConAlquileres;
},

  },
};
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