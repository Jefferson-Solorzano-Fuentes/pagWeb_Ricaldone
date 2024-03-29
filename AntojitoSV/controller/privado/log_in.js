//@ts-check
import { APIConnection } from "../APIConnection.js";
import { getElementById } from "../constants/functions.js";
import {
  API_SUCESS_REQUEST,
  GET_METHOD,
  POST_METHOD,
  SERVER,
  API_LOG_IN,

} from "../constants/api_constant.js";

// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + 'privada/usuario.php?action=';

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
  let APIEndpoint = API_USUARIOS + API_READ_EMPLEADOS_USERS;
  // haciendo coneccion con la API pormedio del enpoint
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  // valida session activa
<<<<<<< Updated upstream
  if (APIResponse.session) {
=======
  console.log(APIResponse)
  if (APIResponse.session == API_SUCESS_REQUEST) {
>>>>>>> Stashed changes
    // REENVIA A LA PAGINA ASIGNADA
    location.href = "paginaprivada.html";
    // VALIDA QUE EXISTA UN USUARIO
  } else if (APIResponse.status == API_SUCESS_REQUEST) {
    console.log("SE DEBE AUTENTICAR");
  } else {
    location.href = "register.html";
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

  if (APIResponse.session  == API_SUCESS_REQUEST) {
    location.href = "paginaprivada.html";
  } else {
    console.log("USER DOESNT EXIST");
  }
});
