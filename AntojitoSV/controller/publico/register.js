//@ts-check
import { APIConnection } from "../APIConnection.js";
import { getElementById } from "../constants/functions.js";
import {
  POST_METHOD,
  GET_METHOD,
  SERVER,
  API_CREATE,
  API_READ_CLIENTE_USERS,
  API_REGISTRAR_CLIENTE_USER
} from "../constants/api_constant.js";
import { saveRow } from "../components.js";

// Constante para establecer la ruta y parámetros de comunicación con la API.
const API_USUARIOS = SERVER + "publica/usuario.php?action=";
const API_CLIENTE = SERVER + "publica/cliente.php?action=";

// Método manejador de eventos que se ejecuta cuando se envía el formulario de iniciar sesión.
getElementById('singUp-form').addEventListener('submit', async (event) => {
    // EVITA RECARGAR LAS PAGINA DESPUES DE ENVIAR EL FORM
    event.preventDefault();
  
    let APIEndpoint = API_USUARIOS + API_REGISTRAR_CLIENTE_USER;
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

// EVENTO PARA INSERT
// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
getElementById("insert-modal").addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  console.log("ejecutando")
  // Se cierra el formulario de registro
  $("#agregarUsuario").modal("show");

  //@ts-ignore
  //OBTIENE LOS DATOS DEL FORMULARIO QUE TENGA COMO ID "'insert-modal'"
  let parameters = new FormData(getElementById("insert-modal"));
  //@ts-ignore
  parameters.append("estado", true);
  // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
  await saveRow(API_CLIENTE, API_CREATE, parameters, null);
});
  