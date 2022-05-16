//@ts-check
//Importar las constantes y metodos de components.js y api_constant.js
import { APIConnection } from "./APIConnection.js";
/*import { fillTableTipoEmpleado } from "./privado/tipo_empleado.js";
import { fillTableEmpleado } from "./privado/empleado.js";
import { fillTableProveedor } from "./privado/proveedor.js";
import { fillTableCliente } from "./privado/cliente.js";
import { fillTableCategoria } from "./privado/categoria.js";
import { fillTablePedido } from "./privado/pedido.js";*/
import { fillTableVehiculo } from "./privado/vehiculo.js";

import {
  API_READALL,
  API_SEARCH,
  API_SUCESS_REQUEST,
  GET_METHOD,
  POST_METHOD,
  API_DELETE,
  SERVER,
  API_READONE,
} from "./constants/api_constant.js";
import { getElementById } from "./constants/functions.js";

// LEER REGISTROS
export async function readRows(ENDPOINT, CRUD_NAME) {
  let APIEndpoint = ENDPOINT + API_READALL;
  //Llamar a la función de conexión api para realizar fetch y then
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, CRUD_NAME);
  if (APIResponse.status == API_SUCESS_REQUEST) {
        /*fillTableCliente(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableProveedor(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableEmpleado(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableTipoEmpleado(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTablePedido(APIResponse.dataset);
        console.log(CRUD_NAME);*/
        fillTableVehiculo(APIResponse.dataset);
        console.log(CRUD_NAME);
  }
  // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
  return;
}


// BUSCAR REGISTROS
export async function searchRows(ENDPOINT, formID, CRUD_NAME) {
  let APIEndpoint = ENDPOINT + API_SEARCH;
  //@ts-ignore
  let parameters = new FormData(getElementById(formID));
  //Llamar a la función de conexión api para realizar fetch y then
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
  //Utilizar la respuesta del api para realizar funciones
  if (APIResponse.status == API_SUCESS_REQUEST) {
        /*fillTableCliente(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableProveedor(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableEmpleado(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableTipoEmpleado(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTablePedido(APIResponse.dataset);
        console.log(CRUD_NAME);*/
        fillTableVehiculo(APIResponse.dataset);
        console.log(CRUD_NAME);
    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
    return;
  }
}

/* 
export async function readOne(ENDPOINT, formId){
  let APIEndpoint = ENDPOINT + API_READONE;
  //@ts-ignore
  let parameters = new FormData(getElementById(formId));
  //Llamar a la función de conexión api para realizar fetch y then
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
  //Utilizar la respuesta del api para realizar funciones
  if(APIResponse.status == API_SUCESS_REQUEST){
    fillUpdateForm(APIResponse.dataset);
  // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo"
   return;
  }
}
*/

// GUARDAR REGISTROS
export async function saveRow(ENDPOINT, ACTION, parameters, CRUD_NAME) {
  // ingresando valores a variables
  let APIEndpoint = ENDPOINT + ACTION;

  // ejecutando request hacia la API
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);

  // validando respuesta
  if (APIResponse.status == API_SUCESS_REQUEST) {
        /*fillTableCliente(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableProveedor(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableEmpleado(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableTipoEmpleado(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTablePedido(APIResponse.dataset);
        console.log(CRUD_NAME);*/
        fillTableVehiculo(APIResponse.dataset);
        console.log(CRUD_NAME);
    }
    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
    return;
  }

// ELIMINAR REGISTROS
export async function deleteRow(ENDPOINT, parameters, CRUD_NAME) {
  let APIEndpoint = ENDPOINT + API_DELETE;

  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);

  if (APIResponse.status == API_SUCESS_REQUEST) {
        /*fillTableCliente(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableProveedor(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableEmpleado(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTableTipoEmpleado(APIResponse.dataset);
        console.log(CRUD_NAME);
        fillTablePedido(APIResponse.dataset);
        console.log(CRUD_NAME);*/
        fillTableVehiculo(APIResponse.dataset);
        console.log(CRUD_NAME);
    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
    return;
  }
}


/* SWITCH
switch (CRUD_NAME) {
  case 'cliente':
    fillTableCliente(APIResponse.dataset);
    console.log(CRUD_NAME);
    break;
  case 'proveedor':
    fillTableProveedor(APIResponse.dataset);
    console.log(CRUD_NAME);
  case 'empleado':
    fillTableEmpleado(APIResponse.dataset);
    console.log(CRUD_NAME);
  case 'tipo_empleado':
    fillTableTipoEmpleado(APIResponse.dataset);
    console.log(CRUD_NAME);
  case 'categoria':
    fillTableCategoria(APIResponse.dataset);
    console.log(CRUD_NAME);
  default:
    console.log("ALL BAD");
}*/