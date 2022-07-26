import { validateExistenceOfUser } from "../constants/functions.js";
import { APIConnection } from "../APIConnection.js";
<<<<<<< Updated upstream
import { SERVER,POST_METHOD,GET_METHOD,API_SUCESS_REQUEST, DOM_CONTENT_LOADED } from "../constants/api_constant.js";

const API_USUARIOS = SERVER + 'privada/usuario.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    //Valida que el usuario este logeado
    validateExistenceOfUser()
  });
  
=======
import {
  SERVER,
  GET_METHOD,
  API_SUCESS_REQUEST,
} from "../constants/api_constant.js";
import {
  barGraph,
  generatePDF,
  lineGraph,
  obtenerFechaActual,
  pieGraph,
  polarAreaGraph,
} from "../components.js";

//Crear constantes de los endpoints que se utilizaran para las funciones
const API_USUARIOS = SERVER + "privada/usuario.php?action=";
const API_PRODUCTOS = SERVER + "privada/producto.php?action=";
const API_EMPLEADO = SERVER + "privada/empleado.php?action=";
const API_COMENTARIOS = SERVER + "privada/comentario.php?action=";
const API_REPORTE = SERVER + "privada/pdf.php?action=";
const API_USUARIO = SERVER + "privada/usuario.php?action=";

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
>>>>>>> Stashed changes

//CREANDO FUNCTION LOGOUT
//@ts-ignore
window.logOut = async () => {
    let APIEndpoint = API_USUARIOS + 'logOut'
    let APIResponse = await APIConnection(APIEndpoint,GET_METHOD,null)

<<<<<<< Updated upstream
    if (APIResponse.status == API_SUCESS_REQUEST) {
        location.href = "index.html";
        return
    }
    console.log("SOMETING WENT WRONG")
}
=======
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

// GENERACION DE PDF
window.createProductosPDF = async () => {
  let APIEndpointrReadFiles = API_REPORTE + "productos";
  let APIEndpointObtenerUsuarioActual = API_USUARIO + "getUser";
  let readAllOrderResponse = await APIConnection(
    APIEndpointrReadFiles,
    GET_METHOD,
    null
  );
  let ObtenerUsuarioActualResponse = await APIConnection(
    APIEndpointObtenerUsuarioActual,
    GET_METHOD,
    null
  );
  console.log(ObtenerUsuarioActualResponse);
  let tableContent = ``;
  readAllOrderResponse.dataset.forEach((element) => {
    tableContent += `
    <tr>
    <td>${element.nombre_producto}</td>
    <td>${element.precio}</td>
    <td>${element.nombre}</td>
    </tr>
    `;
  });

  let generatedHTML = `
  <!doctype html>
<html lang="es">

<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <style>
        body {
            display: flex;
            justify-content: center;
            text-align: center;

        }

        #tabla-header {
            background-color: #872323;
            color: aliceblue;
            padding: 10px;
            font-size: 40px;
            padding-bottom: 20px;
            margin-bottom: 10px;

        }

        #tabla-header img {
            max-width: 65px;
        }

        /*Tabla de datos*/
        #tabla_datos {
            margin-top: 3%;
            margin-bottom: 3%;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            
        }

        /*Colores al encabezado*/
        #tabla_datos th {
            color: white;
            background-color: #872323;
        }

        /*Colores al cuerpo*/
        #tabla_datos tr {
            border: solid black 1px;
            background-color: #F6E3D5;
        }

        #tabla_reporte {
            width: 100%;
            height: 60%;
            margin-top: 20px;

        }

        #tabla_reporte th,
        td {
            text-align: left;
            padding-left: 5px;
        }
    </style>
    <title>AntojitoSV</title>

</head>

<body>
    <!-- Tabla de Datos -->
    <div class="container-fluid" id="tabla_datos" style="width: 100%">
        <div class="container-fluid" id="tabla-header">
            <a>AntojitoSV</a>
            <img src="../../resources/img/navbar_publico/logoCut.png">
        </div>
        <div class="container-fluid" id="tabla-header">
            <a>Productos menos vendidos del mes</a>
        </div>
        <table class="table table-responsive table-bordered" id="tabla_reporte">
            <thead>
                <tr>
                    <th>Creado por:</th>
                    <td>${ObtenerUsuarioActualResponse?.username || ""}</td>
                </tr>
                <tr>
                    <th>Fecha:</th>
                    <td>${obtenerFechaActual()}</td>
                </tr>
                <tr>
            </tr>
                <tr>
                    <th>Producto</th>
                    <th>precio</th>
                    <th>proveedor</th>
                </tr>
            </thead>
            <tbody>
               ${tableContent}
            </tbody>
        </table>
    </div>
    </main>
</body>

</html>`;

  let res = await generatePDF(generatedHTML, "reporte_productos_del_mes.pdf");
  window.open("../../api/reportes/privado/reporte_productos_del_mes.pdf");
};
>>>>>>> Stashed changes
