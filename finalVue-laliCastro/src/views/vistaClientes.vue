<template>
    <div class="container">
      <div class="clientes-container">
        <h2>Clientes</h2>
        <ul class="clientes-list">
          <li
            v-for="cliente in clientes"
            :key="cliente.id"
            @click="seleccionarCliente(cliente)"
          >
            {{ cliente.nombre }}
          </li>
        </ul>
        <form class="alta-cliente-form" @submit.prevent="crearCliente">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              v-model="nombreCliente"
              required
            />
          </div>
          <div class="form-group">
            <label for="dni">DNI:</label>
            <input
              type="text"
              id="dni"
              v-model="dniCliente"
              required
            />
          </div>
          <button type="submit" class="btn">Crear Cliente</button>
        </form>
      </div>
      <div class="cliente-detalle-container">
        <h2>{{ clienteSeleccionado.nombre }}</h2>
        <table>
          <thead>
            <tr>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Precio Final</th>
            </tr>
          </thead>
          <tbody>
    <tr v-for="vehiculo in modelosConAlquileres" :key="vehiculo.id">
      <td>{{ vehiculo.nombre }}</td>
      <td></td>
      <td>{{ calcularPrecioFinal(vehiculo) }}</td>
    </tr>
  </tbody>
        </table>
        <form class="actualizar-cliente-form" @submit.prevent="actualizarCliente">
          <div class="form-group">
            <label for="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              v-model="clienteSeleccionado.nombre"
              required
            />
          </div>
          <div class="form-group">
            <label for="dni">DNI:</label>
            <input
              type="text"
              id="dni"
              v-model="clienteSeleccionado.dni"
              required
            />
          </div>
          <button type="submit" class="btn">Actualizar Cliente</button>
          <button type="button" class="btn eliminar-btn" @click="eliminarCliente">
            Eliminar Cliente
          </button>
        </form>
      </div>
    </div>
  </template>
  
  
  
  <script>
  export default {
    data() {
      return {
        clientes: [],
        nombreCliente: "",
        dniCliente: "",
        clienteSeleccionado: {},
        vehiculosCliente: [],
        marcas: [],
        modelos: [],
        modelosConAlquileres:[]
      };
    },
    mounted() {
      this.cargarClientes();
      this.cargarMarcas();
      this.cargarModelos();
  
    },
    methods: {
          obtenerMarcaPorIdModelo(idModelo) {
    const modelo = this.modelos.find(modelo => modelo.id === idModelo)
    if (modelo) {
      const marca = this.marcas.find(marca => marca.id === modelo.idMarca)
      if (marca) {
        return marca.nombre
      } else {
        return 'Marca no encontrada'
      }
    } else {
      return 'Modelo no encontrado'
    }
  },
    obtenerModeloPorIdModelo(idModelo) {
      const modelo = this.modelos.find((modelo) => modelo.id === idModelo);
      return modelo.modelo;
    },
      cargarClientes() {
        fetch("http://localhost:3000/clientes")
          .then((response) => response.json())
          .then((data) => {
            this.clientes = data;
          });
      },
      cargarMarcas() {
        fetch("http://localhost:3000/marcas")
          .then((response) => response.json())
          .then((data) => {
            this.marcas = data;
          });
      },
      cargarModelos() {
        fetch("http://localhost:3000/modelos")
          .then((response) => response.json())
          .then((data) => {
            this.modelos = data;
          });
      },
      seleccionarCliente(cliente) {
                this.clienteSeleccionado = cliente;
        this.cargarVehiculosCliente(cliente.id);
      },
      cargarVehiculosCliente(idCliente) {
    fetch(`http://localhost:3000/vehiculos?idCliente=${idCliente}`)
      .then((response) => response.json())
      .then((data) => {
        this.vehiculosCliente = data;
      });
  },
      crearCliente() {
        fetch("http://localhost:3000/clientes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: this.nombreCliente,
            dni: this.dniCliente,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            this.clientes.push(data);
            this.nombreCliente = "";
            this.dniCliente = "";
          });
      },
      actualizarCliente() {
        fetch(`http://localhost:3000/clientes/${this.clienteSeleccionado.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.clienteSeleccionado),
        })
          .then((response) => response.json())
          .then((data) => {
            const index = this.clientes.findIndex(
              (cliente) => cliente.id === data.id
            );
            this.clientes.splice(index, 1, data);
          });
      },
      eliminarCliente() {
        fetch(`http://localhost:3000/clientes/${this.clienteSeleccionado.id}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then(() => {
            const index = this.clientes.findIndex(
              (cliente) => cliente.id === this.clienteSeleccionado.id
            );
            this.clientes.splice(index, 1);
            this.clienteSeleccionado = {};
            this.vehiculosCliente = [];
          });
      },
      calcularPrecioFinal(vehiculo) {
        const marca = this.marcas.find((marca) => marca.id === vehiculo.idMarca);
        const modelo = this.modelos.find(
          (modelo) => modelo.id === vehiculo.idModelo
        );
        const precioFinal =
          vehiculo.precioDia + modelo.extraPorModelo
        return precioFinal.toFixed(3);
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
          let vehiculosModelo = this.vehiculos.filter(
            (vehiculo) => vehiculo.idModelo === modelo.id
          );
          let alquileres = "";
          vehiculosModelo.forEach((vehiculo) => {
            alquileres += this.obtenerClientesDeVehiculo(vehiculo.id);
          });
          let precio =
            vehiculosModelo.length > 0 ? vehiculosModelo[0].precioDia : 0;
          let modeloConAlquileres = {
            nombre: modelo.modelo,
            precio: precio,
            alquileres: alquileres,
          };
          this.modelosConAlquileres.push(modeloConAlquileres);
        });
  
        return this.modelosConAlquileres;
      }
    },
  };
  </script>
  <style>
  .container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem;
  }
  
  .clientes-container {
    width: 30%;
    margin-right: 1rem;
  }
  
  .clientes-container h2 {
    margin-bottom: 1rem;
  }
  
  .clientes-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }
  
  .clientes-list li {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 0.5rem;
    cursor: pointer;
  }
  
  .alta-cliente-form {
    margin-top: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .cliente-detalle-container {
    width: 60%;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .cliente-detalle-container h2 {
    margin-bottom: 1rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th,
  td {
    padding: 0.5rem;
    border: 1px solid #ccc;
  }
  
  .actualizar-cliente-form {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
  }
  
  .actualizar-cliente-form .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .actualizar-cliente-form .form-group label {
    margin-bottom: 0.5rem;
  }
  
  .actualizar-cliente-form .btn {
    margin-top: 1rem;
  }
  
  .eliminar-btn {
    background-color: #e74c3c;
    color: #fff;
  }
  
  </style>