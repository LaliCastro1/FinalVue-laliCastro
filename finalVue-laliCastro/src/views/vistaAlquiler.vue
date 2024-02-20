<template>
    <div class="alquileres">
      <h1>Alquileres</h1>
      <div>
        <label>Seleccione una marca:</label>
        <select v-model="marcaSeleccionada" @change="cargarModelos(marcaSeleccionada)">
          <option value="">Todos los vehículos</option>
          <option v-for="marca in marcas" :value="marca.id" :key="marca.id">
            {{ marca.nombre }}
          </option>
        </select>
      </div>
      <div>
        <label>Seleccione un modelo:</label>
        <select v-model="modeloSeleccionado" @change="filtrarVehiculos()" :disabled="marcaSeleccionada === null">
          <option value="">Seleccione un modelo</option>
          <option v-for="modelo in modelosPorMarca" :value="modelo.id" :key="modelo.id">
            {{ modelo.modelo }}
          </option>
        </select>
      </div>
      <button class="alquiler-button" :disabled="!marcaSeleccionada || !modeloSeleccionado" @click="mostrarFormulario()">Proceder a
        alquilar</button>
      <div v-if="mostrarForm">
        <form @submit.prevent="alquilar" class="alquiler-form">
          <label>Seleccione un vehículo:</label>
          <select v-model="selectedVehiculo" name="selectedVehiculo">
            <option v-for="vehiculo in vehiculosFiltrados" :value="vehiculo" :key="vehiculo.id">
              {{ vehiculo.nombre }} - {{ vehiculo.precioDia }}€/día
            </option>
          </select>
          <br>
          <label>Seleccione un cliente:</label>
          <select v-model="selectedCliente" class="select-cliente">
            <option value="" disabled>Seleccione un cliente</option>
            <option v-for="cliente in clientes" :value="cliente.id" :key="cliente.id">
              {{ cliente.nombre }}
            </option>
          </select>
          <label>Número de días:</label>
          <input type="number" v-model.number="numDias" required class="input-number">
  
          <label>Fecha de inicio:</label>
          <input type="date" v-model="fechaInicio" required class="input-date">
  
          <button type="submit" class="submit-button">Alquilar</button>
        </form>
      </div>
    </div>
    <table class="alquiler-table">
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
        selectedCliente: null,
        selectedVehiculo: null,
        modelosPorMarca: [],
        modelosConAlquileres: [],
        mostrarForm: false,
        vehiculosDisponibles: [],
        vehiculosFiltrados:[],
        numDias: 0,
        fechaInicio: '',
        mostrarForm: false,
        alquileres: []
      };
    },
    computed: {
      nuevoAlquilerCliente() {
        return {
          vehiculo: this.selectedVehiculo,
          numDias: this.numDias,
          fechaInic: new Date().toISOString()
        }
      }
    },
    mounted() {
      axios.get('http://localhost:3000/vehiculos')
        .then(response => {
          this.vehiculos = response.data
          this.vehiculosFiltrados = this.vehiculos;
        }
        )
        .catch(error => console.log(error));
      axios.get('http://localhost:3000/clientes')
        .then(response => this.clientes = response.data)
        .catch(error => console.log(error));
      axios.get('http://localhost:3000/marcas')
        .then(response => this.marcas = response.data)
        .catch(error => console.log(error));
      axios.get('http://localhost:3000/modelos')
        .then(response => {
          this.modelos = response.data
          this.modelosConAlquileres = this.filtrarModelosConAlquileres();
        })
        .catch(error => console.log(error));
  
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
        let vehiculosFiltradosPorMarca = [];
        if (this.marcaSeleccionada) {
          vehiculosFiltradosPorMarca = this.vehiculos.filter((vehiculo) => {
            const idModelo = vehiculo.idModelo;
            const modelo = this.modelos.find((modelo) => modelo.id == idModelo);
            const idMarcaModelo = this.marcas.find((marca) => marca.id == modelo.idMarca)
            return idMarcaModelo == this.marcaSeleccionada;
          });
        } else {
          vehiculosFiltradosPorMarca = this.vehiculos;
        }
        if (this.modeloSeleccionado) {
          this.modelosConAlquileres = vehiculosFiltradosPorMarca.filter((vehiculo) => {
            return vehiculo.idModelo == this.modeloSeleccionado;
          }).map((vehiculo) => {
            const alquileres = this.obtenerClientesDeVehiculo(vehiculo.id);
            return {
              nombre: this.modelos.find((modelo) => modelo.id == vehiculo.idModelo).modelo,
              precio: vehiculo.precioDia,
              alquileres: alquileres.join(", "),
            };
          });
        } else {
          this.modelosConAlquileres = vehiculosFiltradosPorMarca.reduce((acc, vehiculo) => {
            const modelo = this.modelos.find((modelo) => modelo.id == vehiculo.idModelo);
            const modeloIndex = acc.findIndex((item) => item.nombre == modelo.modelo);
            if (modeloIndex == -1) {
              acc.push({
                nombre: modelo.modelo,
                precio: vehiculo.precioDia,
                alquileres: this.obtenerClientesDeVehiculo(vehiculo.id).join(", "),
              });
            } else {
              acc[modeloIndex].precio = Math.min(acc[modeloIndex].precio, vehiculo.precioDia);
              acc[modeloIndex].alquileres += `, ${this.obtenerClientesDeVehiculo(vehiculo.id).join(", ")}`;
            }
            return acc;
          }, []);
        }
      },
  
      obtenerClientesDeVehiculo(idVehiculo) {
  const clientesDeVehiculo = [];

  if (this.clientes && this.clientes.length > 0) {
    this.clientes.forEach((cliente) => {
      if (cliente.alquileres && cliente.alquileres.length > 0) {
        const alquileres = cliente.alquileres.filter(
          (alquiler) => alquiler.vehiculo === idVehiculo
        );

        if (alquileres.length > 0) {
          clientesDeVehiculo.push(cliente.nombre);
        }
      }
    });
  }

  return clientesDeVehiculo;
},

  
      filtrarModelosConAlquileres() {
            this.modelos.forEach((modelo) => {
          let vehiculosModelo = this.vehiculos.filter(
            (vehiculo) => vehiculo.idModelo == modelo.id
          );
  
          let alquileres = "";
          vehiculosModelo.forEach((vehiculo) => {
            alquileres += this.obtenerClientesDeVehiculo(vehiculo.id);
          });
  
  
          let precio = 0;
          
          vehiculosModelo.forEach((vehiculo) =>{
            precio = vehiculo.precioDia;
          })
  
          
          let modeloConAlquileres = {
            nombre: modelo.modelo,
            precio: precio,
            alquileres: alquileres,
          };
          this.modelosConAlquileres.push(modeloConAlquileres);
        });
  
        return this.modelosConAlquileres;
      },
      mostrarFormulario() {
  
    this.vehiculosFiltrados = this.vehiculos.filter((vehiculo) => {
      return vehiculo.idModelo == this.modeloSeleccionado;
    });
  
  
  
    this.mostrarForm = true;
  
    this.selectedVehiculo = null;
    this.numDias = null;
    this.fechaInicio = null;
  
  
  }
  ,
  alquilar(event) {
    event.preventDefault();

    const cliente = this.clientes.find(c => c.id == this.selectedCliente);
    const vehiculoId = this.selectedVehiculo.id;

    // Asegúrate de que alquileres sea inicializado como un array si aún no lo está
    if (!cliente.alquileres) {
        cliente.alquileres = [];
    }

    cliente.alquileres.push({
        vehiculo: vehiculoId,
        numDias: this.numDias,
        fechaInic: this.fechaInicio,
    });
    console.log("CLIENTE A INSERTAR "+ JSON.stringify(cliente))

    axios.put(`http://localhost:3000/clientes/${cliente.id}`, cliente)
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
    .alquileres {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-family: Arial, sans-serif;
    }
  
    select {
      padding: 5px;
      font-size: 16px;
      margin: 10px;
      border-radius: 5px;
      border: 1px solid #ccc;
      width: 200px;
    }
  
    .alquiler-button {
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      font-size: 18px;
      border-radius: 5px;
      border: none;
      cursor: pointer;
      margin: 1rem 0 2rem 0;
    }
  </style>