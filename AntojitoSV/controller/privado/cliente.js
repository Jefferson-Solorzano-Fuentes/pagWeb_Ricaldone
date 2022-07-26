
//Importar las constantes y metodos de components.js y api_constant.js
import { APIConnection } from "../APIConnection.js";
import {
  readRows,
  saveRow,
  searchRows,
  deleteRow,
  generatePDF,
  obtenerFechaActual,
} from "../components.js";
import {
  SERVER,
  API_CREATE,
  API_UPDATE,
  GET_METHOD,
  POST_METHOD,
} from "../constants/api_constant.js";
import {
  getElementById,
  validateExistenceOfUser,
} from "../constants/functions.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_CLIENTE = SERVER + "privada/cliente.php?action=";
const API_REPORTE = SERVER + "privada/pdf.php?action=";
const API_USUARIO = SERVER + "publica/usuario.php?action=";

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosCliente"
let datos_cliente = {
  id: 0,
  nombre_cliente: " ",
  telefono: " ",
  correo: " ",
  estado: true,
};

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", async () => {
  //Valida que el usuario este logeado
  await validateExistenceOfUser();
  // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
  await readRows(API_CLIENTE, fillTableCliente);
  //Cargar combo box de estado empleado
  await fillComboBoxCliente();
});

//Obtener los datos de combobox tipo empleado
async function fillComboBoxCliente() {
  //Se crea un endpoint especifico para el caso de leer tipo empleado
  let APIEndpoint = SERVER + "privada/cliente.php?action=readCliente";
  //Se utiliza como api connection para realizar la consulta
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  //Obtiene todos los valores y los ordena en un array, presentandolos en el select
  APIResponse.dataset.map((element) => {
    getElementById(
      "cliente"
    ).innerHTML += `<option value="${element.id_cliente}" > ${element.nombre_cliente} </option>`;
  });
}

//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillTableCliente(dataset) {
  let content = "";
  // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
  dataset.map((row) => {
    // Se crean y concatenan las filas de la tabla con los datos de cada registro.
    content += ` 
            <tr>
                <td>${row.nombre_cliente}</td>
                <td>${row.telefono}</td>
                <td>${row.correo}</td>
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosClienteUpdate(${row.id_cliente},'${row.nombre_cliente}','${row.telefono}','${row.correo}')"  class="btn btn-primary">
                                <img src="../../resources/img/cards/buttons/edit_40px.png"></a>
                            <a onclick="guardarDatosClienteDelete(${row.id_cliente})" class="btn btn-primary" 
                            name="search">
                                <img src="../../resources/img/cards/buttons/delete_40px.png"></a>
                        </form>
                    </div>
                </td>
            </tr>
        `;
  });
  // Se muestran cada filas de los registros
  getElementById("tbody-rowsC").innerHTML = content;
}

//@ts-ignore
window.seleccionarCliente = () => {
  //@ts-ignore
  datos_cliente.id = document.getElementById("cliente").value;
};

// FUNCION PARA GUARDAR LOS DATOS DEL CLIENTE
// @ts-ignore
window.guardarDatosClienteUpdate = (
  id_cliente,
  nombre_cliente,
  telefono,
  correo
) => {
  datos_cliente.id = id_cliente;
  $("#actualizarform").modal("show");
  // SE ACTUALIZA EL VALOR DEL INPUT CON EL ID ESPECIFICADO AL VALOR INGRESADO AL PARAMETRO, ASEGURENSE DE QUE ELINPUT TENGA
  //EL ATRIBUTO "value="""
  //@ts-ignore
  document.getElementById("nombre_cliente_update").value =
    String(nombre_cliente);
  //@ts-ignore
  document.getElementById("telefono_update").value = String(telefono);
  //@ts-ignore
  document.getElementById("correo_update").value = String(correo);
};

// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosClienteDelete = (id_cliente) => {
  datos_cliente.id = id_cliente;
  $("#eliminarForm").modal("show");
};

// Método que se ejecuta al enviar un formulario de busqueda
getElementById("search-bar").addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
  await searchRows(API_CLIENTE, "search-bar", fillTableCliente);
});

// EVENTO PARA INSERT
// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
getElementById("insert-modal").addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se cierra el formulario de registro
  $("#agregarform").modal("hide");
  //@ts-ignore
  //OBTIENE LOS DATOS DEL FORMULARIO QUE TENGA COMO ID "'insert-modal'"
  let parameters = new FormData(getElementById("insert-modal"));
  //@ts-ignore
  parameters.append("estado", true);
  // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
  await saveRow(API_CLIENTE, API_CREATE, parameters, fillTableCliente);
});

// EVENTO PARA UPDATE
// SE EJECUTARA CUANDO EL BOTON DE TIPO "submit" DEL FORMULARIO CON EL ID 'actualizarConfirmar_buttons' SE CLICKEE
getElementById("update-modal").addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se cierra el formulario de registro
  $("#actualizarform").modal("hide");
  //@ts-ignore
  let parameters = new FormData(getElementById("update-modal"));
  //@ts-ignore
  parameters.append("id", datos_cliente["id"]);
  // API REQUEST
  await saveRow(API_CLIENTE, API_UPDATE, parameters, fillTableCliente);
});

//EVENTO PARA DELETE
getElementById("delete-form").addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se cierra el formulario de registro
  $("#eliminarForm").modal("hide");
  // CONVIRTIENDO EL JSON A FORMDATA
  let parameters = new FormData();
  //@ts-ignore
  parameters.append("id", datos_cliente["id"]);

  //API REQUEST
  await deleteRow(API_CLIENTE, parameters, fillTableCliente);
});

//CREACIÓN DE PDF
window.createClientePDF = async () => {
  let APIEndpointReadCliente = API_REPORTE + "compra_clientes";
  let APIEndpointObtenerUsuarioActual = API_USUARIO + "getUser";
  let ObtenerUsuarioActualResponse = await APIConnection(
    APIEndpointObtenerUsuarioActual,
    GET_METHOD,
    null
  );

  let parametersCliente = new FormData();
  parametersCliente.append("id_cliente", getElementById("cliente").value);
  let readClienteResponse = await APIConnection( APIEndpointReadCliente, POST_METHOD, parametersCliente
);

console.log(readClienteResponse.dataset)


  let tableContent = ``;

  readClienteResponse.dataset.forEach((element) => {
    tableContent += `
  <tr>
  <td>${element.nombre_cliente}</td>
  <td>${element.id_pedido}</td>
  <td>${element.fecha_creacion}</td>
  <td>${element.nombre_producto}</td>
  <td>${element.precio}</td>
  <td>${element.subtotal}</td>
  <tr>
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
        <table class="table table-responsive table-bordered" id="tabla_reporte">
            <thead>
                <tr>
                    <th>Creado por:</th>
                    <td>${ObtenerUsuarioActualResponse.username}</td>
                </tr>
                <tr>
                    <th>Fecha:</th>
                    <td>${obtenerFechaActual()}</td>
                </tr>
                <tr>
                    <th>Nombre del cliente</th>
                    <th>Numero del pedido</th>
                    <th>Fecha de creacion</th>
                    <th>Nombre del producto</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
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
  let res = await generatePDF(
    generatedHTML,
    "cliente_" + readClienteResponse.dataset[0].id_cliente + ".pdf"
  );

  window.open(
    "../../api/reportes/privado/cliente_" +
    readClienteResponse.dataset[0].id_cliente +
      ".pdf"
  );
};

//CREACIÓN DE PDF
window.createClienteMesPDF = async () => {
  let APIEndpointReadFiles = API_REPORTE + "compras_clientes_mensual";
  let APIEndpointObtenerUsuarioActual = API_USUARIO + "getUser";
  let readAllOrderResponse = await APIConnection(APIEndpointReadFiles, GET_METHOD, null);
  let ObtenerUsuarioActualResponse = await APIConnection(APIEndpointObtenerUsuarioActual, GET_METHOD, null);

  let tableContent = ``;

  readAllOrderResponse.dataset.forEach((element) => {
    tableContent += `
  <tr>
  <td>${element.nombre_cliente}</td>
  <td>${element.id_pedido}</td>
  <td>${element.fecha_creacion}</td>
  <td>${element.nombre_producto}</td>
  <td>${element.precio}</td>
  <td>${element.subtotal}</td>
  <tr>
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
            <a>Pedidos realizados por clientes del mes</a>
        </div>
        <table class="table table-responsive table-bordered" id="tabla_reporte">
            <thead>
                <tr>
                    <th>Creado por:</th>
                    <td>${ObtenerUsuarioActualResponse.username}</td>
                </tr>
                <tr>
                    <th>Fecha:</th>
                    <td>${obtenerFechaActual()}</td>
                </tr>
                <tr>
                    <th>Nombre del cliente</th>
                    <th>Numero del pedido</th>
                    <th>Fecha de creacion</th>
                    <th>Nombre del producto</th>
                    <th>Precio</th>
                    <th>Subtotal</th>
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
  let res = await generatePDF(
    generatedHTML,
    "clienteMensual_" + readAllOrderResponse.dataset[0].id_cliente + ".pdf"
  );

  window.open(
    "../../api/reportes/privado/clienteMensual_" +
    readAllOrderResponse.dataset[0].id_cliente +
      ".pdf"
  );
};
