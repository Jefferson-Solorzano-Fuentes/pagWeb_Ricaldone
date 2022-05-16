import { validateExistenceOfUser } from "../constants/functions.js";
import { APIConnection } from "../APIConnection.js";
import { SERVER,POST_METHOD,GET_METHOD,API_SUCESS_REQUEST } from "../constants/api_constant.js";

const API_USUARIOS = SERVER + 'privada/usuario.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    console.log("EJECUTANDO")
    validateExistenceOfUser()
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
