//Importar las constantes y metodos de components.js y api_constant.js
import { APIConnection } from "./APIConnection.js";
import { fillTable } from "./privado/tipo_empleado.js";
import {
  API_READALL,
  API_SEARCH,
  API_SUCESS_REQUEST,
  GET_METHOD,
  POST_METHOD,
  SERVER,
} from "./constants/api_constant.js";
import { getElementById } from "./constants/functions.js";

// LEER REGISTROS
export async function readRows(ENDPOINT) {
  let APIEndpoint = ENDPOINT + API_READALL;
  //Llamar a la función de conexión api para realizar fetch y then
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  if (APIResponse.status == API_SUCESS_REQUEST) {
    fillTable(APIResponse.dataset);
    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
    return;
  }
}

// BUSCAR REGISTROS
export async function searchRows(ENDPOINT, formID) {
  let APIEndpoint = ENDPOINT + API_SEARCH;
  let parameters = new FormData(document.getElementById(formID));
  //Llamar a la función de conexión api para realizar fetch y then
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
  //Utilizar la respuesta del api para realizar funciones
  if (APIResponse.status == API_SUCESS_REQUEST) {
    fillTable(APIResponse.dataset);
    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo

    return;
  }
}

// GUARDAR REGISTROS
export async function saveRow(ENDPOINT, ACTION, formID, modalID) {
  // ingresando valores a variables
  let APIEndpoint = SERVER + ENDPOINT + ACTION;
  let parameters = new FormData(getElementById(formID));

  // ejecutando request hacia la API
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);

  // validando respuesta
  if (APIResponse.status == API_SUCESS_REQUEST) {
    // REEMPLAZAR
    M.Modal.getInstance(getElementById(modalID)).close();
    readRows(ACTION);
    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo

    return;
  }
}

export async function fillSelect(ENDPOINT, selectElement, selectedValue) {
  let APIEndpoint = ENDPOINT + API_SEARCH;

  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);

  if (APIResponse.status == API_SUCESS_REQUEST) {
    if (!selectedValue) {
      content += "<option disabled selected>Seleccione una opción</option>";
    }

    // AQUI DEPENDE DE LOS VALORES QUE SE MANDEN A LLAMAR ASI VA A SER LA CANTIDAD DE VALORES A LOS CUALES SE DEBEN ACCEDER
    response.dataset.map((row) => {
      // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
      value = Object.values(row)[0];
      // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
      text = Object.values(row)[1];
      // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
      if (value != selected) {
        content += `<option value="${value}">${text}</ogit re