//@ts-ignore

//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow } from "../components.js";
import {
  SERVER,
  API_CREATE,
  API_UPDATE,
  DOM_CONTENT_LOADED,
  SEARCH_BAR,
  SUBMIT,
  INSERT_MODAL,
  UPDATE_MODAL,
  DELETE_FORM,
} from "../constants/api_constant.js";
import {
  getElementById,
  validateExistenceOfUser,
} from "../constants/functions.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_CLIENTE = SERVER + "privada/cliente.php?action=";

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
  validateExistenceOfUser();
  // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
  await readRows(API_CLIENTE, fillTableCliente);
});

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

// FUNCION PARA GUARDAR LOS DATOS DEL CLIENTE
// @ts-ignore
window.guardarDatosClienteUpdate = (id_cliente, nombre_cliente, telefono, correo) => {
  datos_cliente.id = id_cliente;
  $("#actualizarform").modal("show");
  // SE ACTUALIZA EL VALOR DEL INPUT CON EL ID ESPECIFICADO AL VALOR INGRESADO AL PARAMETRO, ASEGURENSE DE QUE ELINPUT TENGA
  //EL ATRIBUTO "value="""
  //@ts-ignore
  document.getElementById("nombre_cliente_update").value = String(nombre_cliente);
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
window.createComprasPDF = async () => {
  let APIEndpointrReadFiles = API_REPORTE + "compra_clientes";
  let APIEndpointObtenerUsuarioActual = API_USUARIO + 'getUser';
  let readAllOrderResponse = await APIConnection(APIEndpointrReadFiles, GET_METHOD, null);
  let ObtenerUsuarioActualResponse = await APIConnection(APIEndpointObtenerUsuarioActual, GET_METHOD, null);

  let tableContent = ``;

  readAllOrderResponse.dataset.forEach((element) => {
    tableContent += `
    <tr>
    <td>${element.id_compra_existencia}</td>
    <td>${element.nombre_producto}</td>
    <td>${element.nombre}</td>
    <td>${element.stock_comprado}</td>
    <td>${element.fecha_compra}</td>
    <tr>
    `;
  });
}
