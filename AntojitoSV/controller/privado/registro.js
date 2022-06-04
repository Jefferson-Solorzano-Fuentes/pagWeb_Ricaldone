//@ts-check
import { APIConnection } from "../APIConnection.js";
import { getElementById } from "../constants/functions.js";
import {
  POST_METHOD,
  GET_METHOD,
  API_SUCESS_REQUEST,
  API_REGISTRAR_EMPLEADO_USER,
  API_READ_EMPLEADOS_USERS,
  SERVER,
  DOM_CONTENT_LOADED,
  SIGNUP_FORM,
  SUBMIT,
} from "../constants/api_constant.js";

// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + "privada/usuario.php?action=";


// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
  let APIEndpoint = API_USUARIOS + API_READ_EMPLEADOS_USERS;
  // haciendo coneccion con la API pormedio del enpoint
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);

  // valida session activa
  if (APIResponse.session) {
    // REENVIA A LA PAGINA ASIGNADA
    location.href = "paginaprivada.html";
    // VALIDA QUE EXISTA UN USUARIO
  } else if (APIResponse.status == API_SUCESS_REQUEST) {
    location.href = "index.html";

  }
  console.log("somwthing went wrhot")
});

  // Método manejador de eventos que se ejecuta cuando se envía el formulario de iniciar sesión.
document.getElementById('singUp-form').addEventListener('submit', async (event) => {
    // EVITA RECARGAR LAS PAGINA DESPUES DE ENVIAR EL FORM
    event.preventDefault();
  
    let APIEndpoint = API_USUARIOS + API_REGISTRAR_EMPLEADO_USER;
    //@ts-ignore
    let parameters = new FormData(getElementById('singUp-form'))
  
    // Petición para revisar si el administrador se encuentra registrado.
    let APIResponse = await APIConnection(
      APIEndpoint,
      POST_METHOD,
      parameters
    );
  
    if (APIResponse.status) {
      console.log("REGISTRADO")
      location.href = "index.html";
    } else {
      console.log("no se pudo registrar usuario");
    }
  });
  