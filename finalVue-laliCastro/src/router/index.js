import { createRouter, createWebHashHistory } from 'vue-router'

import logoEmpresa from '../views/vistaLogoEmpresa.vue'
import nuevaMarca from '../views/vistaAnadirNuevaMarca.vue' 
import nuevoModelo from '../views/vistaAnadirNuevoModelo.vue'
import marcasLista from '../views/vistaMarcas.vue'
import modelosLista from '../views/vistaModelos.vue'
import vehiculo from '../views/vistaVehiculos.vue'
import nuevoVehiculo from '../views/vistaAnadirNuevoVehiculo.vue'
import clientes from '../views/vistaClientes.vue'
import alquileres from '../views/vistaAlquiler.vue'

const routes = [
  {
    path: '/',
    name: 'logoEmpresa',
    component: logoEmpresa
  },
  {
    path: '/marcas',
    name: 'marcas',
    component: marcasLista
  },

  {
    path: '/modelos',
    name:'modelos',
    component: modelosLista
  },
 
  {
    path: '/marcas/nueva-marca',
    name:'nuevaMarca',
    component: nuevaMarca
  },
  {
    path:'/modelos/nuevo-modelo',
    name:'modelosañadir',
    component: nuevoModelo
  },

  {
    path:'/vehiculos',
    name:'vehiculos',
    component:vehiculo
  },

  {
    path:'/vehiculos/nuevo-vehiculo',
    name:'vehiculosanadir',
    component:nuevoVehiculo
  },

  {
    path:'/clientes',
    name:'clientes',
    component:clientes
  },

  {
    path:'/vehiculos/alquiler',
    name:'alquileres',
    component:alquileres
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
