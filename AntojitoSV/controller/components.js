//@ts-check
//Importar las constantes y metodos de components.js y api_constant.js
import { APIConnection } from "./APIConnection.js";
import {
  API_READALL,
  API_SEARCH,
  API_SUCESS_REQUEST,
  GET_METHOD,
  POST_METHOD,
  API_DELETE,
  SERVER,
  API_READONE,
  API_UNDELETE,
} from "./constants/api_constant.js";
import { getElementById } from "./constants/functions.js";

// LEER REGISTROS
export async function readRows(ENDPOINT, fillrows) {
  let APIEndpoint = ENDPOINT + API_READALL;
  //Llamar a la función de conexión api para realizar fetch y then
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  if (APIResponse.status == API_SUCESS_REQUEST) {
    console.log(APIResponse);
    fillrows(APIResponse.dataset)
    return
  }
  // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
}

// BUSCAR REGISTROS
export async function searchRows(ENDPOINT, formID, fillrows, parametersJson) {
  let APIEndpoint = ENDPOINT + API_SEARCH;
  //@ts-ignore
  let parameters = formID ? new FormData(getElementById(formID)) : parametersJson;

  //Llamar a la función de conexión api para realizar fetch y then
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
  console.log(APIEndpoint);
  //Utilizar la respuesta del api para realizar funciones
  if (APIResponse.status == API_SUCESS_REQUEST) {
    fillrows(APIResponse.dataset)
    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
    return;
  }
}


// GUARDAR REGISTROS
export async function saveRow(ENDPOINT, ACTION, parameters, fillrows) {
  // ingresando valores a variables
  let APIEndpoint = ENDPOINT + ACTION;

  // ejecutando request hacia la API
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
  // validando respuesta 
  if (APIResponse.status == API_SUCESS_REQUEST) {
    fillrows(APIResponse.dataset)
    $('#guardado').modal('show');
    return;
  }
  //En caso de fracaso se abrira un modal de error
  $('#error_proceso').modal('show');

}

// ELIMINAR REGISTROS
export async function deleteRow(ENDPOINT, parameters, fillrows) {
  let APIEndpoint = ENDPOINT + API_DELETE;

  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);

  if (APIResponse.status == API_SUCESS_REQUEST) {
    fillrows(APIResponse.dataset)
    $('#eliminado').modal('show');
    return;
  }
  //En caso de fracaso se abrira un modal de error
  $('#error_proceso').modal('show');
}

// ELIMINAR REGISTROS
export async function unDeleteRow(ENDPOINT, parameters, fillrows) {
  let APIEndpoint = ENDPOINT + API_UNDELETE;

  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);

  if (APIResponse.status == API_SUCESS_REQUEST) {
    fillrows(APIResponse.dataset)
    return;
  }
  //En caso de fracaso se abrira un modal de error
  $('#error_proceso').modal('show');
}
