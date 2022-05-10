//Importar las constantes y metodos de components.js y api_constant.js
import { APIConnection } from "../APIConnection.js";
import { readRows, saveRow, searchRows } from "../components.js";
import { getElementById } from "../constants/functions.js";
import { DOM_CONTENT_LOAD, SUBMIT } from "../constants/htmlConstants.js";
import {
  API_CREATE,
  API_READONE,
  API_SUCESS_REQUEST,
  API_UPDATE,
  POST_METHOD,
  SERVER,
} from "../constants/api_constant.js";


//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_TIPO_EMPLEADO = SERVER + "privada/tipo_empleado.php?action=";

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener(DOM_CONTENT_LOAD, async () => {
  // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
  await readRows(API_TIPO_EMPLEADO);
  // Se define una variable para establecer las opciones del componente Modal.
  let options = {
    dismissible: false,
    onOpenStart: function () {
      // Se restauran los elementos del formulario.
      getElementById("SAVE-FORG").reset();
      document.getElementById("save-form").reset();
    },
  };

});

//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillTable(dataset) {
  let content = "";
  // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
  dataset.map((row) => {
    // Se crean y concatenan las filas de la tabla con los datos de cada registro.

    // ESTAS SE TIENEN QUE ESTRUCTURAR DE FORMA EN QUE SE ADAPTE A COMO SE MOSTRARA LA DATA
    content += ` 
            <tr>
                <td>${row.id_tipo_empleado}</td>
                <td>${row.nombre_tipo}</td>
                <td class="d-flex justify-content-center">
                    <a onclick="formUpdate(${row.id_tipo_empleado})" class="btn btn-primary" href="#" id="button_ver_mas" data-bs-toggle="modal"
                        data-bs-target="#actualizarform"><img
                            src="../../resources/img/cards/buttons/edit_40px.png"></a>
                </td>
            </tr>
        `;
  });

  // Se muestran cada filas de los registros
  getElementById("tbody-rows").innerHTML = content;
}

// Método que se ejecuta al enviar un formulario de busqueda
getElementById("search-bar").addEventListener(SUBMIT, async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
  await searchRows(API_TIPO_EMPLEADO, "search-bar");
});

//Metodo manejador de el fomrulario al realizar inserción.
function formCreate() {
  // Se abre el formulario de dialogo (el modal de inserción)
  M.Modal.getInstance(getElementById("agregarform")).open();
  // Se hacen todos los campos del modal requeridos
  getElementById("archivo").required = true;

  
}

//Metodo manejador de el formulario al realizar actualización
async function formUpdate(id_tipo_empleado) {
  let APIEndpoint = API_TIPO_EMPLEADO + API_READONE;

  // Se abre el formulario de dialogo (el modal de actualización)
  M.Modal.getInstance(getElementById("actualizarform")).open();

  // Se hacen todos los campos del modal no requeridos
  getElementById("archivo").required = false;

  let data = new FormData();
  data.append("id_tipo_empleado", id_tipo_empleado);

  let obtenerTipoEmpleado = await APIConnection(APIEndpoint, POST_METHOD, data);

  if (obtenerTipoEmpleado.status == API_SUCESS_REQUEST) {
    getElementById("id_tipo_empleado").value =
      obtenerTipoEmpleado.dataset.id_tipo_empleado;

    getElementById("nombre_tipo").value =
      obtenerTipoEmpleado.dataset.nombre_tipo;

    M.updateTextFields();

    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
    return;
  }
  M.Modal.getInstance(getElementById("procesoFallido")).open();
}

//Metodo manejado de el formulario al realizar una eliminación

// EN ESTE EL NOMBRE DE SU PARAMETRO DEPENDE DEL CRUD QUE SE ESTE UTILIZANDO

function formDelete(id_tipo_empleado) {
  // Se define un objeto con los datos del registro seleccionado.
  let data = new FormData();
  data.append("id_tipo_empleado", id_tipo_empleado);
  // Se abre el formulario de dialogo (el modal de borrar)
  M.Modal.getInstance(getElementById("eliminarConfirmar")).open();
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
getElementById("agregarform").addEventListener(SUBMIT, async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se define una variable para establecer la acción a realizar en la API.
  let action = "";
  // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
  getElementById("id_tipo_empleado").value
    ? (action = API_CREATE)
    : (action = API_UPDATE);

  await saveRow(API_TIPO_EMPLEADO, action, "-", "save-modal");
});
