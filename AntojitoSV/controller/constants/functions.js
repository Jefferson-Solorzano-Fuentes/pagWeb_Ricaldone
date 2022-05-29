//@ts-check

import { SERVER,POST_METHOD,GET_METHOD,API_SUCESS_REQUEST } from "../../controller/constants/api_constant.js";
import { APIConnection } from "../APIConnection.js";

const API_USUARIOS = SERVER + 'privada/usuario.php?action=';
const API_USUARIOS_PUBLIC = SERVER + 'publica/usuario.php?action=';

export function getElementById(elementID) {
    return document.getElementById(elementID)
}

export async function validateExistenceOfUser() {
        //CODIGO PARA VALIDAR SI HAY UNA SESION ACTIVA
    // SE DEBE DE PEGAR EN TODOS LOS EVENTOS QUE SE EJECUTAN CUANDO SE CARGA LA PAGINA
    let APIEndpoint = API_USUARIOS + 'checkSession'
    let APIResponse = await APIConnection(APIEndpoint,GET_METHOD,null)
    if (APIResponse.status == API_SUCESS_REQUEST) {
       location.href = "index.html";
       return
<<<<<<< Updated upstream
   }
   console.log("SESION EN PROGRESO")
} 
=======
    }

    APIEndpoint = API_USUARIOS + "getUser"
   let APIResponseGetUset = await APIConnection(APIEndpoint,GET_METHOD,null)
}  


export async function validateExistenceOfUserPublic() {
//CODIGO PARA VALIDAR SI HAY UNA SESION ACTIVA
// SE DEBE DE PEGAR EN TODOS LOS EVENTOS QUE SE EJECUTAN CUANDO SE CARGA LA PAGINA
let APIEndpoint = API_USUARIOS_PUBLIC + 'checkSession'
let APIResponse = await APIConnection(APIEndpoint,GET_METHOD,null)
if (APIResponse.status == API_SUCESS_REQUEST) {
   location.href = "login.html";
   return
}

APIEndpoint = API_USUARIOS_PUBLIC + "getUser"
let APIResponseGetUset = await APIConnection(APIEndpoint,GET_METHOD,null)
}  
>>>>>>> Stashed changes
