import { APIConnection } from "./APIConnection";
import { DELETE, GET_METHOD, POST_METHOD, READALL, SEARCH } from "./models/constants";
import { getElementById } from "./models/constants/functions";

//CONTROLADOR GENERAL DE LA PAGINA WEB
//Constante para establecer la ruta del servidor.
const SERVER = 'http://localhost/AntojitoSV/api/';
//Importar la función de APIconnection



// BUSCAR REGISTROS
export function searchRows(ENDPOINT, formID) {
    let APIEndpoint = SERVER + ENDPOINT + SEARCH
    let parameters = new FormData(getElementById(formID))

    let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters)

    if (APIResponse) {
        fillTable(APIResponse.dataset)
        console.log("ALL GOOD")
        return
    } 
        console.log("ALL BAD")
    
}

// LEER REGISTROS
export function readRows(ENDPOINT) {
    let APIEndpoint = SERVER + ENDPOINT + READALL
    let APIResponse = await APIConnection(APIEndpoint,GET_METHOD, null)

    if (APIResponse.status) {
        fillTable(APIResponse.dataset)
        return
    } 
    console.log("ALL BAD")
}


// GUARDAR REGISTROS
export function saveRow (ENDPOINT, ACTION, formID, modalID) {
    // ingresando valores a variables
    let APIEndpoint = SERVER + ENDPOINT + ACTION
    let parameters = new FormData(getElementById(formID))
    
    // ejecutando request hacia la API 
    let APIResponse = await APIConnection(APIEndpoint,POST_METHOD,parameters)

    // validando respuesta 
    if (APIResponse.status) {
        M.Modal.getInstance(getElementById(modalID)).close()
        readRows(ACTION)
        console.log("ALL GOOD")
        return
    }
        console.log("ALL BAD")
}

// ELIMINAR RETISTROS

export function deleteRow(ENDPOINT, data) {
    let APIEndpoint = SERVER + ENDPOINT + DELETE
    let parameters = new FormData(data) 

    let APIResponse = await APIConnection(APIEndpoint,POST_METHOD,parameters)
 
    if (APIResponse.status) {
        readRows(ENDPOINT);
        console.log("ALL GOOD")
        return 
    }
    console.log("ALL BAD")
}
