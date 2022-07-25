//@ts-check
import { APIConnection } from "../APIConnection.js";
import { getElementById } from "../constants/functions.js";
import {
  API_SUCESS_REQUEST,
  GET_METHOD,
  POST_METHOD,
  API_READALL,
  API_READ_EMPLEADOS_USERS,
  SERVER,
  API_LOG_IN,
  DOM_CONTENT_LOADED,
  SUBMIT,
  SESSION_FORM
} from "../constants/api_constant.js";

// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + 'privada/usuario.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
  let APIEndpoint = API_USUARIOS + 'checkSession';
  // haciendo coneccion con la API pormedio del enpoint
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  // valida session activa
  console.log(APIResponse)
  if (APIResponse.session === API_SUCESS_REQUEST) {
    // REENVIA A LA PAGINA ASIGNADA
    location.href = "paginaprivada.html";
  } 
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de iniciar sesión.
getElementById('session-form').addEventListener('submit', async (event) => {
  // EVITA RECARGAR LAS PAGINA DESPUES DE ENVIAR EL FORM
  event.preventDefault();

  let APIEndpoint = API_USUARIOS + API_LOG_IN;
  //@ts-ignore
  let parameters = new FormData(getElementById('session-form'))

  // Petición para revisar si el administrador se encuentra registrado.
  let APIResponse = await APIConnection(
    APIEndpoint,
    POST_METHOD,
    parameters
  );

  if (APIResponse.status) {
    location.href = "paginaprivada.html";
  } else {
    console.log("USER DOESNT EXIST");
  }
});
