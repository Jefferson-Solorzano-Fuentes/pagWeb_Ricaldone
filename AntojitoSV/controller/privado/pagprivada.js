//@ts-check
import { getElementById } from "../constants/functions.js";
import { APIConnection } from "../APIConnection.js";
import { SERVER,POST_METHOD,GET_METHOD,API_SUCESS_REQUEST } from "../constants/api_constant.js";

const API_USUARIOS = SERVER + 'privada/usuario.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {

    //CODIGO PARA VALIDAR SI HAY UNA SESION ACTIVA
   // SE DEBE DE PEGAR EN TODOS LOS EVENTOS QUE SE EJECUTAN CUANDO SE CARGA LA PAGINA
    let APIEndpoint = API_USUARIOS + 'checkSession'
    let APIResponse = await APIConnection(APIEndpoint,GET_METHOD,null)
    if (APIResponse.status == API_SUCESS_REQUEST) {
        location.href = "index.html";
        return
    }
    console.log("SESION EN PROGRESO")
  });
  

//CREANDO FUNCTION LOGOUT
//@ts-ignore
window.logOut = async () => {
    let APIEndpoint = API_USUARIOS + 'logOut'
    let APIResponse = await APIConnection(APIEndpoint,GET_METHOD,null)

    if (APIResponse.status == API_SUCESS_REQUEST) {
        location.href = "index.html";
        return
    }
    console.log("SOMETING WENT WRONG")
}
