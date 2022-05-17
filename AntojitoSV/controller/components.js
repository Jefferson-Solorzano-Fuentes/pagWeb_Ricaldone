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
} from "./constants/api_constant.js";
import { getElementById } from "./constants/functions.js";

// LEER REGISTROS
export async function readRows(ENDPOINT, fillrows) {
  let APIEndpoint = ENDPOINT + API_READALL;
  //Llamar a la función de conexión api para realizar fetch y then
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, null);
  if (APIResponse.status == API_SUCESS_REQUEST) {
    fillrows(APIResponse.dataset)
  }
  // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
  return;
}

// BUSCAR REGISTROS
export async function searchRows(ENDPOINT, formID,fillrows) {
  let APIEndpoint = ENDPOINT + API_SEARCH;
  //@ts-ignore
  let parameters = new FormData(getElementById(formID));
  //Llamar a la función de conexión api para realizar fetch y then
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
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
    return;
  }
  console.log("ALL BAD")
}

// ELIMINAR REGISTROS
export async function deleteRow(ENDPOINT, parameters, fillrows) {
  let APIEndpoint = ENDPOINT + API_DELETE;

  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);

  if (APIResponse.status == API_SUCESS_REQUEST) {
    fillrows(APIResponse.dataset)
    return;
  }
}
