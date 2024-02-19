<template>
  <div id="marcasDiv">
    <h1>Marcas</h1>
    <ul>
      <li v-for="marca in marcas" :key="marca.id" @click="mostrarModelos(marca.id)">
        {{ marca.nombre }} - {{ calcularPrecioMedioPorMarca(marca.id) }}€
      </li>
    </ul>
    <h2 v-if="mostrarListaModelos">Modelos de {{ nombreMarcaSeleccionada }}</h2>
    <ul v-if="mostrarListaModelos">
      <li v-for="modelo in modelosPorMarca" :key="modelo.id">
        {{ modelo.modelo }} - {{ calcularPrecioMedioPorModelo(modelo.id) }}€/día
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Marcas',
  data() {
      return {
          marcas: [],
          modelos: [],
          vehiculos: [],
          mostrarListaModelos: false,
          nombreMarcaSeleccionada: ""
      };
  },
  mounted() {
      axios.get('http://localhost:3000/marcas')
          .then(responseMarcas => {
              this.marcas = responseMarcas.data;
              //ordena el precio medio de mayor a menor
              this.marcas.sort((a, b) => {
                //calcula el precio medio de cada marca
                  const precioMedioA = this.calcularPrecioMedioPorMarca(a.id);
                  const precioMedioB = this.calcularPrecioMedioPorMarca(b.id);
                  return precioMedioB - precioMedioA;
              });
          })
          .catch(error => {
              console.log(error);
          });

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
  },
  methods: {

      mostrarModelos(idMarca) {
          this.nombreMarcaSeleccionada = this.marcas.find(marca => marca.id == idMarca).nombre;
          this.modelosPorMarca = this.modelos.filter(modelo => modelo.idMarca == idMarca);
          this.mostrarListaModelos = true;
      },
      calcularPrecioMedioPorMarca(idMarca) {
          let sumaPrecio = 0;  //acumular la suma de los precios de alquiler por día de todos los vehículos que pertenecen a la marca
          let contadorVehiculos = 0; //contar el número de vehículos que se encuentran para la marca dada.
          let precioMedio = 0; //almacenará el precio medio de alquiler por día calculado para los vehículos de la marca.

          this.vehiculos.forEach(vehiculo => {
              let idModelo = vehiculo.idModelo;
              let modelo = this.modelos.find(modelo => modelo.id == idModelo);
              let idMarcaModelo = modelo.idMarca;

              if (idMarcaModelo == idMarca) {
                  sumaPrecio += vehiculo.precioDia;
                  contadorVehiculos++;
              }
          });

          if (contadorVehiculos > 0) {
              precioMedio = sumaPrecio / contadorVehiculos;
          } else {
              precioMedio = "No hay vehículos para esta marca";
          }

          return precioMedio;
      },
      calcularPrecioMedioPorModelo(idModelo) {
          let sumaPrecio = 0;  //total de los precios de alquiler por día de los vehículos
          let contadorVehiculos = 0; //número de vehículos que se han encontrado para la marca especificada.
          let precioMedio = 0; //almacenará el resultado final del cálculo del precio medio de alquiler por día
          this.vehiculos.forEach(vehiculo => {
              let idModeloVehiculo = vehiculo.idModelo;

              if (idModeloVehiculo == idModelo) {
                  sumaPrecio += vehiculo.precioDia;
                  contadorVehiculos++;
              }
          });

          if (contadorVehiculos > 0) {
              precioMedio = sumaPrecio / contadorVehiculos;
          } else {
              precioMedio = "No hay vehículos para este modelo";
          }

          return precioMedio;
      }


  }
};
</script>
<style>
#marcasDiv {
max-width: 800px;
margin: 0 auto;
padding: 20px;
font-family: Arial, sans-serif;
background-color: #F5F5F5;
border-radius: 10px;
}

h1 {
font-size: 36px;
margin-bottom: 20px;
text-align: center;
color: #333333;
}

h2 {
font-size: 28px;
margin-top: 40px;
margin-bottom: 20px;
color: #333333;
}

ul {
list-style: none;
padding: 0;
margin: 0;
}

li {
font-size: 20px;
margin-bottom: 10px;
padding: 10px;
background-color: #FFFFFF;
border-radius: 5px;
box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
cursor: pointer;
transition: all 0.3s ease;
}

li:hover {
background-color: #CCCCCC;
}
</style>