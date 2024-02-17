import { createRouter, createWebHashHistory } from 'vue-router'

import logoEmpresa from '../views/vistaLogoEmpresa.vue'
import nuevaMarca from '../views/vistaAnadirNuevaMarca.vue' 
import nuevoModelo from '../views/vistaAnadirNuevoModelo.vue'
import marcasLista from '../views/vistaMarcas.vue'
import modelosLista from '../views/vistaModelos.vue'

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

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
