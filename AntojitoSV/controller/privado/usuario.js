//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import {
  readRows,
  saveRow,
  searchRows,
  deleteRow,
  unDeleteRow,
} from "../components.js";
import {
  SERVER,
  API_CREATE,
  API_UPDATE,
  DOM_CONTENT_LOADED,
  SUBMIT,
  SEARCH_BAR,
  DELETE_FORM,
  REACTIVATE_FORM,
} from "../constants/api_constant.js";
import {
  getElementById,
  validateExistenceOfUser,
} from "../constants/functions.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_USUARIO = SERVER + "privada/usuario.php?action=";

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_usuario = {
  id: 0,
  nombre_usuario: "",
  id_tipio_usuario: "",
  id_emplado: "",
  id_cliente: " ",
  estado: true,
};

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", async () => {
  //Validar que el usuario este en sesión
  await validateExistenceOfUser();
  // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
  //Declarando cual CRUD es este
  await readRows(API_USUARIO, fillTableUsuario);
});

//Metodo para llenar las tablas de datos, utiliza la función readRows()
function fillTableUsuario(dataset) {
  let content = "";
  // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
  dataset.map((row) => {
    // Se crean y concatenan las filas de la tabla con los datos de cada registro.
    content += ` 
            <tr>
                <td>${row.nombre_usuario}</td>
                <td>${row.nombre_tipo}</td>
                <td>${row.nombre_cliente}</td>
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                    <form method="post" id="read-one">
                        <a onclick="guardarDatosUsuarioDeactivar(${row.id_usuario})" class="btn btn-primary">
                        <img src="../../resources/img/cards/buttons/invisible_40px.png"></a>
                        <a onclick="guardarDatosUsuarioReactivar(${row.id_usuario})" class="btn btn-primary"
                    name="search">
                        <img src="../../resources/img/cards/buttons/eye_40px.png"></a>
                        </form>
                    </div>
                </td>
            </tr>
        `;
  });
  // Se muestran cada filas de los registros
  getElementById("tbody-rowsUS").innerHTML = content;
}

// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosUsuarioDeactivar = (id_usuario) => {
  datos_usuario.id = id_usuario;
  $("#eliminarForm").modal("show");
};

// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosUsuarioReactivar = (id_usuario) => {
  datos_usuario.id = id_usuario;
  $("#reactivarForm").modal("show");
};

// Método que se ejecuta al enviar un formulario de busqueda
getElementById("search-bar").addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
  await searchRows(API_USUARIO, "search-bar", fillTableUsuario);
});

//EVENTO PARA DELETE
getElementById("delete-form").addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se cierra el formulario de registro
  $("#eliminarForm").modal("hide");
  // CONVIRTIENDO EL JSON A FORMDATA
  let parameters = new FormData();
  //@ts-ignore
  parameters.append("id", datos_usuario["id"]);

  //API REQUEST
  await deleteRow(API_USUARIO, parameters, fillTableUsuario);
});

//EVENTO PARA DEACTIVAR
getElementById("reactivate-form").addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se cierra el formulario de registro
  $("#reactivarForm").modal("hide");
  // CONVIRTIENDO EL JSON A FORMDATA
  let parameters = new FormData();
  //@ts-ignore
  parameters.append("id", datos_usuario["id"]);

  //API REQUEST
  await unDeleteRow(API_USUARIO, parameters, fillTableUsuario);
});
