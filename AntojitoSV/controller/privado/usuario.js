//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow, unDeleteRow } from "../components.js";
import { SERVER, API_CREATE, API_UPDATE } from "../constants/api_constant.js";
import { getElementById, validateExistenceOfUser } from "../constants/functions.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_USUARIO = SERVER + 'privada/usuario.php?action=';
// @ts-ignore
const ENDPOINT_USUARIO = SERVER + 'privada/usuario.php?action=readAll';

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_usuario = {
    "id": 0,
    "nombre_usuario": '',
    "id_tipio_usuario": '',
    "id_emplado": '',
    "id_cliente": ' ',
    "estado": true
}

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {

    validateExistenceOfUser()

    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    //Declarando cual CRUD es este
    await readRows(API_USUARIO, fillTableUsuario)
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
function fillTableUsuario(dataset) {
    console.log("EXECUTING")

    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td>${row.nombre_usuario}</td>
                <td>${row.nombre_tipo}</td>
                <td>${row.nombre_cliente}</td>
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                    <form method="post" id="read-one">
                        <a onclick="guardarDatosUsuario(${row.id_usuario})"  data-bs-toggle="modal" data-bs-target="#eliminarForm" class="btn btn-primary" data-tooltip="Actualizar">
                        <img src="../../resources/img/cards/buttons/invisible_40px.png"></a>
                        <a onclick="guardarDatosUsuario(${row.id_usuario})" data-bs-toggle="modal" data-bs-target="#reactivarForm" class="btn btn-primary" data-tooltip="eliminar" 
                    name="search">
                        <img src="../../resources/img/cards/buttons/eye_40px.png"></a>
                        </form>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se muestran cada filas de los registros
    getElementById('tbody-rowsUS').innerHTML = content;
}

// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosUsuario = (id_usuario) => {
    datos_usuario.id = id_usuario;
}



// Método que se ejecuta al enviar un formulario de busqueda
getElementById('search-bar').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(API_USUARIO, 'search-bar', fillTableUsuario);
});


//EVENTO PARA DELETE
getElementById('delete-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_usuario['id'])

    //API REQUEST
    await deleteRow(API_USUARIO, parameters, fillTableUsuario);
});

//EVENTO PARA DEACTIVAR
getElementById('reactivate-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('ejecutar');

    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_usuario['id'])

    //API REQUEST
    await unDeleteRow(API_USUARIO, parameters, fillTableUsuario);
});



