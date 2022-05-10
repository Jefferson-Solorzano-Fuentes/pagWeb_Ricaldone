//Importar las constantes y metodos de components.js y api_constant.js
import { readRows, saveRow, searchRows } from "../components.js";
import { SERVER } from "../constants/api_constant.js";
import { getElementById } from "../constants/functions.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_PROVEEDORES = SERVER + "privada/proveedores.php?action=";

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", async () => {
  // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
  await readRows(API_PROVEEDORES);
  // Se define una variable para establecer las opciones del componente Modal.
  let options = {
    dismissible: false,
    onOpenStart: function () {
      // Se restauran los elementos del formulario.
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
getElementById("search-bar").addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
  await searchRows(API_PROVEEDORES, "search-bar");
});

//Metodo manejador de el fomrulario al realizar inserción.
function formCreate() {
  // Se abre el formulario de dialogo (el modal de inserción)
  M.Modal.getInstance(getElementById("agregarform")).open();
  // Se hacen todos los campos del modal requeridos
  getElementById("archivo").required = true;
}

//Metodo manejador de el formulario al realizar actualización
function formUpdate(id_tipo_empleado) {
  // Se abre el formulario de dialogo (el modal de actualización)
  M.Modal.getInstance(getElementById("actualizarform")).open();
  // Se hacen todos los campos del modal no requeridos
  getElementById("archivo").required = false;
  // Se define un obkjeto con los datos seleccionados.
  const DATA = new FormData();
  DATA.append("id_tipo_empleado", id_tipo_empleado);
  // Peticion para obtener los datos del registro solicitado
  //    await searchRows(API_TIPO_EMPLEADO,)
  fetch(API_PROVEEDORES + "readOne", {
    method: "post",
    body: DATA,
  }).then(function (request) {
    // Se verifica si la peticion es correcta.
    if (request.ok) {
      //Se obtiene respuesta en JSON
      request.json().then(function (response) {
        //Se comprueba la respuesta, si es satifactoria se deja pasar, si no , muestra error
        if (response.status) {
          // Se inicializan los campos del formulario con los datos del registro seleccionado.
          getElementById("id_tipo_empleado").value =
            response.dataset.id_tipo_empleado;
          getElementById("nombre_tipo").value = response.dataset.nombre_tipo;
          //Se actualizan los campos para que las etiquetas labels no esten encima de los datos
          M.updateTextFields();
        } else {
          M.Modal.getInstance(getElementById("procesoFallido")).open();
        }
      });
    }
  });
}

//Metodo manejado de el formulario al realizar una eliminación
function formDelete(id_tipo_empleado) {
  // Se define un objeto con los datos del registro seleccionado.
  const DATA = new FormData();
  DATA.append("id_tipo_empleado", id_tipo_empleado);
  // Se abre el formulario de dialogo (el modal de borrar)
  M.Modal.getInstance(document.getElementById("eliminarConfirmar")).open();
}

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document
  .getElementById("agregarform")
  .addEventListener("submit", function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = "";
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    getElementById("id_tipo_empleado").value
      ? (action = "create")
      : (action = "update");
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_CATEGORIAS, action, "-", "save-modal");
  });
