//@ts-check
//Importar las constantes y metodos de components.js y api_constant.js
import { APIConnection } from "./APIConnection.js";
import { fillTable, fillUpdateForm } from "./privado/tipo_empleado.js";
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
  //@ts-ignore
  let parameters = new FormData(getElementById(formID));
  //Llamar a la función de conexión api para realizar fetch y then
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
  //Utilizar la respuesta del api para realizar funciones
  if (APIResponse.status == API_SUCESS_REQUEST) {
    fillTable(APIResponse.dataset);
    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
    return;
  }
}

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

// GUARDAR REGISTROS
export async function saveRow(ENDPOINT, ACTION, parameters) {
  // ingresando valores a variables
  let APIEndpoint = ENDPOINT + ACTION;

  // ejecutando request hacia la API
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);

  // validando respuesta
  if (APIResponse.status == API_SUCESS_REQUEST) {
    console.log("all good")
    readRows(ENDPOINT);
    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
    return;
  }
  console.log("ALL BAD")
}


//NO SE PARA QUE ES FILLSELECT xd, SOLO LO DEJARE COMENTARIADO

// export async function fillSelect(ENDPOINT, selectElement, selectedValue) {
//   let APIEndpoint = ENDPOINT + API_SEARCH;

//   let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);

//   if (APIResponse.status == API_SUCESS_REQUEST) {
//     if (!selectedValue) {
//       content += "<option disabled selected>Seleccione una opción</option>";
//     }

//     // AQUI DEPENDE DE LOS VALORES QUE SE MANDEN A LLAMAR ASI VA A SER LA CANTIDAD DE VALORES A LOS CUALES SE DEBEN ACCEDER
//     response.dataset.map((row) => {
//       // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
//       value = Object.values(row)[0];
//       // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
//       text = Object.values(row)[1];
//       // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
//       if (value != selected) {
//         content += `<option value="${value}">${text}</option>`;
//       } else {
//         content += `<option value="${value}" selected>${text}</option>`;
//       }
//     });
//   } else {
//     content += "<option>No hay opciones disponibles</option>";
//   }
//   // Se agregan las opciones a la etiqueta select mediante su id.
//   getElementById(selectElement).innerHTML = content;

//   // SE TIENE QUE CONFIGURAR EL MODAL PARA QUE SE MUESTREN LAS OPCIONCES
//   M.FormSelect.init(document.querySelectorAll("select"));
// }

// ELIMINAR REGISTROS
export async function deleteRow(ENDPOINT, parameters) {
  let APIEndpoint = ENDPOINT + API_DELETE;

  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);

  if (APIResponse.status == API_SUCESS_REQUEST) {
    readRows(ENDPOINT);
    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
    return;
  }
}


//POSIBLEMENTE YA NO NOS SIRVA
// //Metodo manejado de el formulario al realizar una eliminación
// export function formDelete(id) {
//   // Se abre el formulario de dialogo (el modal de borrar)
//   bootstrap.Modal.getInstance(document.getElementById('eliminarConfirmar')).show();
//   getElementById('id-eliminar').value = id;
// }