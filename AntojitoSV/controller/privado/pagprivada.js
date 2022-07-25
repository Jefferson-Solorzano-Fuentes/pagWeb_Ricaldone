import { validateExistenceOfUser } from "../constants/functions.js";
import { APIConnection } from "../APIConnection.js";
import {
  SERVER,
  GET_METHOD,
  API_SUCESS_REQUEST,
} from "../constants/api_constant.js";
import { barGraph, lineGraph, pieGraph, polarAreaGraph } from "../components.js";

//Crear constantes de los endpoints que se utilizaran para las funciones
const API_USUARIOS = SERVER + "privada/usuario.php?action=";
const API_PRODUCTOS = SERVER + "privada/producto.php?action=";
const API_EMPLEADO = SERVER + "privada/empleado.php?action=";
const API_COMENTARIOS = SERVER + "privada/comentario.php?action=";

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", async () => {
  //Valida que el usuario este logeado
  await validateExistenceOfUser();
  //Crear los diferentes graficos
  //"Top 5 de productos vendidos del mes actual, por stock"
  await graphPieTopVentas();
  //"Leer Cantidad de Productos por Marca"
  await graphPieProductosProveedores();
  //"Ventas por categorias del mes actual"
  await graphBarCategoria();
   //"emplado con mas evios"
   await graphlineEmpleado();
  //"valoraciones"
  await graphPieTopValoracion();
});

//CREANDO FUNCTION LOGOUT
window.logOut = async () => {
  let APIEndpoint = API_USUARIOS + "logOut";
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);

  if (APIResponse.status == API_SUCESS_REQUEST) {
    location.href = "index.html";
    return;
  }
  console.log("SOMETING WENT WRONG");
};

// Función para crear el grafico que, "Top 5 de productos vendidos del mes actual, por stock"
export async function graphPieTopVentas() {
  //Obtener los datos del grafico
  //Crear endpoint
  let APIEndpoint = API_PRODUCTOS + "Graph1";
  //Se realiza la consulta con el endpoint, el metodo "get" y no requiere parametros
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  //Se verifica si la consulta retorna un valor positivo
  if (APIResponse.status == API_SUCESS_REQUEST) {
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (APIResponse.status) {
      // Se declaran los arreglos para guardar los datos a gráficar.
      let ventas = [];
      let producto = [];
      // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
      APIResponse.dataset.map(function (row) {
        // Se agregan los datos a los arreglos.
        ventas.push(row.sum);
        producto.push(row.nombre_producto);
      });
      // Se llama a la función que genera y muestra un gráfico de pastel. Se encuentra en el archivo components.js
      pieGraph(
        "chart1",
        producto,
        ventas,
        "Top 5 de productos más vendidos en el mes actual (por cantidad)"
      );
    } else {
      document.getElementById("chart1").remove();
      console.log(response.exception);
    }
  }
}

// Función para crear el grafico que, "Leer Cantidad de Productos por Marca"
export async function graphPieProductosProveedores() {
  //Obtener los datos del grafico
  //Crear endpoint
  let APIEndpoint = API_PRODUCTOS + "Graph2";
  //Se realiza la consulta con el endpoint, el metodo "get" y no requiere parametros
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  //Se verifica si la consulta retorna un valor positivo
  if (APIResponse.status == API_SUCESS_REQUEST) {
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (APIResponse.status) {
      // Se declaran los arreglos para guardar los datos a gráficar.
      let proveedores = [];
      let productos = [];
      // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
      APIResponse.dataset.map(function (row) {
        // Se agregan los datos a los arreglos.
        proveedores.push(row.nombre);
        productos.push(row.count);
      });
      // Se llama a la función que genera y muestra un gráfico de pastel. Se encuentra en el archivo components.js
      pieGraph(
        "chart2",
        proveedores,
        productos,
        "Cantidad de Productos por Marca"
      );
    } else {
      document.getElementById("chart2").remove();
      console.log(response.exception);
    }
  }
}

// Función para crear el grafico que, "Ventas por categorias del mes actual"
export async function graphBarCategoria() {
  //Obtener los datos del grafico
  //Crear endpoint
  let APIEndpoint = API_PRODUCTOS + "Graph3";
  //Se realiza la consulta con el endpoint, el metodo "get" y no requiere parametros
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  //Se verifica si la consulta retorna un valor positivo
  if (APIResponse.status == API_SUCESS_REQUEST) {
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (APIResponse.status) {
      // Se declaran los arreglos para guardar los datos a graficar.
      let ventas = [];
      let categoria = [];
      // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
      APIResponse.dataset.map(function (row) {
        // Se agregan los datos a los arreglos.
        categoria.push(row.nombre_categoria);
        ventas.push(row.sum);
      });
      // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
      barGraph(
        "chart3",
        categoria,
        ventas,
        "Cantidad de Ventas",
        "Top 5 categorias más vendidas del mes actual, por stock"
      );
    } else {
      document.getElementById("chart3").remove();
      console.log(response.exception);
    }
  }
}

// Función para crear el grafico que, "Ventas por categorias del mes actual"
export async function graphlineCategoria() {
    //Obtener los datos del grafico
    //Crear endpoint
    let APIEndpoint = API_PRODUCTOS + "Graph3";
    //Se realiza la consulta con el endpoint, el metodo "get" y no requiere parametros
    let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
    //Se verifica si la consulta retorna un valor positivo
    if (APIResponse.status == API_SUCESS_REQUEST) {
      // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
      if (APIResponse.status) {
        // Se declaran los arreglos para guardar los datos a graficar.
        let ventas = [];
        let categoria = [];
        // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
        APIResponse.dataset.map(function (row) {
          // Se agregan los datos a los arreglos.
          categoria.push(row.nombre_categoria);
          ventas.push(row.sum);
        });
        // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
        lineGraph(
          "chart3",
          categoria,
          ventas,
          "Cantidad de Ventas",
          "Top 5 categorias más vendidas del mes actual, por stock"
        );
      } else {
        document.getElementById("chart3").remove();
        console.log(response.exception);
      }
    }
  }
  
    // Función para crear el grafico que, "empleado con mas envios"
export async function graphlineEmpleado() {
  //Obtener los datos del grafico
  //Crear endpoint
  let APIEndpoint = API_EMPLEADO + "Graph1";
  //Se realiza la consulta con el endpoint, el metodo "get" y no requiere parametros
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  //Se verifica si la consulta retorna un valor positivo
  if (APIResponse.status == API_SUCESS_REQUEST) {
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (APIResponse.status) {
      // Se declaran los arreglos para guardar los datos a graficar.
      let ventas = [];
      let categoria = [];
      // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
      APIResponse.dataset.map(function (row) {
        // Se agregan los datos a los arreglos.
        categoria.push(row.nombre);
        ventas.push(row.count);
      });
      // Se llama a la función que genera y muestra un gráfico de barras. Se encuentra en el archivo components.js
      lineGraph(
        "chart4",
        categoria,
        ventas,
        "Cantidad de envios",
        "Empleados con mayor cantidad de envios"
      );
    } else {
      document.getElementById("chart4").remove();
      console.log(response.exception);
    }
  }
}

// Función para crear el grafico que, "Productos mejor valorados, según las calificaciones de clientes"
export async function graphPieTopValoracion() {
  //Obtener los datos del grafico
  //Crear endpoint
  let APIEndpoint = API_COMENTARIOS + "graph1";
  //Se realiza la consulta con el endpoint, el metodo "get" y no requiere parametros
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  //Se verifica si la consulta retorna un valor positivo
  if (APIResponse.status == API_SUCESS_REQUEST) {
    // Se comprueba si la respuesta es satisfactoria, de lo contrario se remueve la etiqueta canvas.
    if (APIResponse.status) {
      // Se declaran los arreglos para guardar los datos a gráficar.
      let ventas = [];
      let producto = [];
      // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
      APIResponse.dataset.map(function (row) {
        // Se agregan los datos a los arreglos.
        ventas.push(row.round);
        producto.push(row.nombre_producto);
      });
      // Se llama a la función que genera y muestra un gráfico de pastel. Se encuentra en el archivo components.js
      polarAreaGraph(
        "chart5",
        producto,
        ventas,
        "Productos mejor valorados, según las calificaciones de clientes"
      );
    } else {
      document.getElementById("chart5").remove();
      console.log(response.exception);
    }
  }
}


