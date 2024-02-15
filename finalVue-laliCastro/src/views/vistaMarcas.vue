<template>
    <div id="marcasDiv">
      <h1>Marcas</h1>
      <ul>
        <li v-for="marca in marcas" :key="marca.id">
          {{ marca.nombre }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'vistaMarcas',
    data() {
      return {
       
        marcas: [
          { id: '1', nombre: 'Marca A' },
          { id: '2', nombre: 'Marca B' },
          { id: '3', nombre: 'Marca C' },
        ],
      };
    },
  };
  </script>
  
  <style>
  #marcasDiv {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #F5F5F5;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  h1 {
    text-align: center;
    color: #333;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    background-color: #FFF;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    transition: transform 0.2s ease-in-out;
  }
  
  li:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  </style>
  