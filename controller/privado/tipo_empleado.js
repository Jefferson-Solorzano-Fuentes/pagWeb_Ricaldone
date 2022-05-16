//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow } from "../components.js";
import { SERVER } from "../constants/api_constant.js";
import { getElementById } from "../constants/functions.js";
import { API_CREATE, API_UPDATE } from "../constants/api_constant.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_TIPO_EMPLEADO = SERVER + 'privada/tipo_empleado.php?action=';
// @ts-ignore
const ENDPOINT_TIPO_EMPLEADO = SERVER + 'privada/tipo_empleado.php?action=readAll';
//El nombre del CRUD que es
const CRUD_NAME = "tipo_empleado";

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_tipo_empleado = {
    "id": 0,
    "nombre_tipo_empleado": 'PRUEBA'
}

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    await readRows(API_TIPO_EMPLEADO, CRUD_NAME)
    // Se define una variable para establecer las opciones del componente Modal.
    // @ts-ignore
    let options = {
        dismissible: false, 
        onOpenStart: function () {
            // Se restauran los elementos del formulario.
            // @ts-ignore
            document.getElementById('save-form').reset();
        }
    }
});


//Metodo para llenar las tablas de datos, utiliza la función readRows()

/*export function fillTableTipoEmpleado(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td>${row.id_tipo_empleado}</td>
                <td>${row.nombre_tipo}</td>
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosTipoEmpleado(${row.id_tipo_empleado})"  data-bs-toggle="modal" data-bs-target="#actualizarform" class="btn btn-primary" data-tooltip="Actualizar">
                                <img src="../../resources/img/cards/buttons/edit_40px.png"></a>
                            <a  onclick="guardarDatosTipoEmpleado(${row.id_tipo_empleado})" data-bs-toggle="modal" data-bs-target="#eliminarForm" class="btn btn-primary" data-tooltip="eliminar" 
                            name="search">
                                <img src="../../resources/img/cards/buttons/delete_40px.png"></a>
                        </form>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se muestran cada filas de los registros
    getElementById('tbody-rowsTP').innerHTML = content;
}


/* export function fillUpdateForm(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content +=
            `<div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header" id="formHeader">
                    <h5 class="modal-title" id="actualizarformLabel">Actualizar Tipo de Empleado</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <!-- Formulario para actualizar registro-->

            <!-- EL ID DEL FORMULARIO AL CUAL SE HACE REFERENCIA -->
            <form method="post" id="update-modal">
                <div class="modal-body" id="formModal">
                    <div class="row">
                        <div class="col">
                            <label for="formGroupExampleInput" class="form-label">Tipo de Empleado</label>
                            <input type="text" class="form-control" id="nombre_tipo_empleado"
                                name="nombre_tipo_empleado" placeholder="${row.nombre_tipo}" required>
                        </div>
                    </div>
                    <!-- Fotter del modal -->

                    <div id="UPDATE_MODAL" class="modal-footer">
                        <!-- BOTON DE TIPO SUBMIT QUE EJECUTARA EL EVENTO -->
                        <div class="btn-group" role="group" aria-label="Basic example" id="opcionesModal">
                            <button "guardarDatosTipoEmpleado(${row.id_tipo_empleado})" class="btn btn-light" data-bs-toggle="modal"
                                data-bs-dismiss="modal" href="#actualizarConfirmar" id="btnmenu"><a
                                    class="nav-link"><img
                                        src="../../resources/img/cards/buttons/edit_26px.png"></a></button>
                            <button type="button" class="btn btn-light" id="btnmenu" data-bs-toggle="modal"
                                data-bs-dismiss="modal"><a class="nav-link"><img
                                        src="../../resources/img/cards/buttons/Close_26px.png"></a></button>
                        </div>
                    </div>
            </form>
        </div>
    </div>`;
    });

    // Se muestran cada filas de los registros
    getElementById('tbody-rows').innerHTML = content;
}
*/

// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosTipoEmpleado = (id_tipo_empleado) => {
    datos_tipo_empleado.id = id_tipo_empleado
}



// Método que se ejecuta al enviar un formulario de busqueda
getElementById('search-bar').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(API_TIPO_EMPLEADO, 'search-bar', CRUD_NAME);
});

/*
// Metodo que se ejecuta al enviar un formulario de update
getElementById('read-one').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(API_TIPO_EMPLEADO, 'read-one');
});
*/

// EVENTO PARA INSERT 
// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('agregar_nuevo_registro').addEventListener('submit', async (event) => {

    console.log("EJECUTANDO")

    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    //@ts-ignore
    //OBTIENE LOS DATOS DEL FORMULARIO QUE TENGA COMO ID "'insert-modal'"
    let parameters = new FormData(getElementById('insert-modal'));

    // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
    await saveRow(API_TIPO_EMPLEADO, API_CREATE, parameters);
});



// EVENTO PARA UPDATE
// SE EJECUTARA CUANDO EL BOTON DE TIPO "submit" DEL FORMULARIO CON EL ID 'actualizarConfirmar_buttons' SE CLICKEE
getElementById('update-modal').addEventListener('submit', async (event) => {
    event.preventDefault();

    //@ts-ignore
    let parameters = new FormData(getElementById('update-modal'));
    //@ts-ignore
    parameters.append('id', datos_tipo_empleado['id'])

    // API REQUEST
    await saveRow(API_TIPO_EMPLEADO, API_UPDATE, parameters, CRUD_NAME);
});

//EVENTO PARA DELETE
getElementById('delete-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_tipo_empleado['id'])

    //API REQUEST
    await deleteRow(API_TIPO_EMPLEADO, parameters, CRUD_NAME);
});



