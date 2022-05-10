import { readRows } from "../components";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_TIPO_EMPLEADO = SERVER + 'privada/tipo_empleado.php?action=';
const ENDPOINT_TIPO_EMPLEADO = SERVER + 'privada/tipo_empleado.php?action=readAll';


// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', function () {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    readRows(API_TIPO_EMPLEADO);
    // Se define una variable para establecer las opciones del componente Modal.
    let options = {
        dismissible: false,
        onOpenStart: function () {
            // Se restauran los elementos del formulario.
            document.getElementById('save-form').reset();
        }
    }
});


//Metodo para llenar las tablas de datos, utiliza la función readRows()
function fillTable(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
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
    document.getElementById('tbody-rows').innerHTML = content;
}


// Método que se ejecuta al enviar un formulario de busqueda
document.getElementById('search-bar').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    searchRows(API_TIPO_EMPLEADO, 'search-bar');
});

//Metodo manejador de el fomrulario al realizar inserción.
function formCreate(){
    // Se abre el formulario de dialogo (el modal de inserción)
    M.Modal.getInstance(document.getElementById('agregarform')).open();
    // Se hacen todos los campos del modal requeridos
    document.getElementById('archivo').required = true;
}

//Metodo manejador de el formulario al realizar actualización
function formUpdate(id_tipo_empleado){
    // Se abre el formulario de dialogo (el modal de actualización)
    M.Modal.getInstance(documento.getElementById('actualizarform')).open();
    // Se hacen todos los campos del modal no requeridos
    document.getElementById('archivo').required = false;
    // Se define un obkjeto con los datos seleccionados.
    const DATA = new FormData();
    DATA.append('id_tipo_empleado', id_tipo_empleado);
    // Peticion para obtener los datos del registro solicitado
    fetch(API_TIPO_EMPLEADO + 'readOne', {
        method: 'post',
        body: DATA
    }).then(function (request) {
        // Se verifica si la peticion es correcta.
        if(request.ok) {
            //Se obtiene respuesta en JSON
            request.json().then( function (response) {
                //Se comprueba la respuesta, si es satifactoria se deja pasar, si no , muestra error
                if (response.status) {
                    // Se inicializan los campos del formulario con los datos del registro seleccionado.
                    document.getElementById('id_tipo_empleado').value = response.dataset.id_tipo_empleado;
                    document.getElementById('nombre_tipo').value = response.dataset.nombre_tipo;
                    //Se actualizan los campos para que las etiquetas labels no esten encima de los datos
                    M.updateTextFields();
                } else{
                    M.Modal.getInstance(documento.getElementById('procesoFallido')).open();
                }
            });
        }
    });

}

/*//Metodo manejado de el formulario al realizar una eliminación
function formDelete(){
    // Se abre el formulario de dialogo (el modal de inserción)
    M.Modal.getInstance(document.getElementById('eliminarConfirmar')).open();
}


// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('agregarform').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id_tipo_empleado').value) ? action = 'create';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_CATEGORIAS, action, '-', 'save-modal');
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('actualizarform').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id_tipo_empleado').value) ? action = 'update';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_CATEGORIAS, action, 'save-form', 'save-modal');
});

// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('eliminarConfirmar').addEventListener('submit', function (event) {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se define una variable para establecer la acción a realizar en la API.
    let action = '';
    // Se comprueba si el campo oculto del formulario esta seteado para actualizar, de lo contrario será para crear.
    (document.getElementById('id_tipo_empleado').value) ? action = 'delete';
    // Se llama a la función para guardar el registro. Se encuentra en el archivo components.js
    saveRow(API_CATEGORIAS, action, 'save-form', 'save-modal');
})*/