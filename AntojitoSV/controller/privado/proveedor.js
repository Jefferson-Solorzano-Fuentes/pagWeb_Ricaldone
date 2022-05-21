//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow } from "../components.js";
import { SERVER, API_CREATE, API_UPDATE } from "../constants/api_constant.js";
import { getElementById, validateExistenceOfUser } from "../constants/functions.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_PROOVEDOR = SERVER + 'privada/proveedor.php?action=';
// @ts-ignore
const ENDPOINT_PROOVEDOR = SERVER + 'privada/proveedor.php?action=readAll';

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_proveedor = {
    "id": 0,
    "nombre_proveedor": '',
    "telefono": '',
    "correo": '',
    "direccion": ' ',
    "estado": true
}

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    //Validar que el usuario este en sesión
    validateExistenceOfUser()

    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    //Declarando cual CRUD es este
    await readRows(API_PROOVEDOR, fillTableProveedor)
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
function fillTableProveedor(dataset) {
    console.log("EXECUTING")

    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td>${row.nombre}</td>
                <td>${row.telefono}</td>
                <td>${row.correo}</td>
                <td>${row.direccion}</td>
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosProveedor(${row.id_proveedor},'${row.nombre}','${row.telefono}','${row.correo}','${row.direccion}')"  data-bs-toggle="modal" data-bs-target="#actualizarform" class="btn btn-primary" data-tooltip="Actualizar">
                                <img src="../../resources/img/cards/buttons/edit_40px.png"></a>
                            <a  onclick="guardarDatosProveedor(${row.id_proveedor},'${row.nombre}','${row.telefono}','${row.correo}','${row.direccion}')" data-bs-toggle="modal" data-bs-target="#eliminarForm" class="btn btn-primary" data-tooltip="eliminar" 
                            name="search">
                                <img src="../../resources/img/cards/buttons/delete_40px.png"></a>
                        </form>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se muestran cada filas de los registros
    getElementById('tbody-rowsPro').innerHTML = content;
}

// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosProveedor = (id_proveedor, nombre_proveedor, telefono, correo, direccion) => {
    datos_proveedor.id = id_proveedor;
    // SE ACTUALIZA EL VALOR DEL INPUT CON EL ID ESPECIFICADO AL VALOR INGRESADO AL PARAMETRO, ASEGURENSE DE QUE ELINPUT TENGA 
    //EL ATRIBUTO "value="""
    //@ts-ignore
    document.getElementById("nombre_proveedor_update").value = String(nombre_proveedor)
    //@ts-ignore
    document.getElementById("telefono_update").value = String(telefono)
    //@ts-ignore
    document.getElementById("correo_proveedor_update").value = String(correo)
    //@ts-ignore
    document.getElementById("direccion_update").value = String(direccion)
}



// Método que se ejecuta al enviar un formulario de busqueda
getElementById('search-bar').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(API_PROOVEDOR, 'search-bar', fillTableProveedor);
});


// EVENTO PARA INSERT 
// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('insert-modal').addEventListener('submit', async (event) => {

    console.log("ejecutando insercion")

    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    //@ts-ignore
    //OBTIENE LOS DATOS DEL FORMULARIO QUE TENGA COMO ID "'insert-modal'"
    let parameters = new FormData(getElementById('insert-modal'));
    //@ts-ignore
    parameters.append('estado', true)

    // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
    await saveRow(API_PROOVEDOR, API_CREATE, parameters, fillTableProveedor);
});



// EVENTO PARA UPDATE
// SE EJECUTARA CUANDO EL BOTON DE TIPO "submit" DEL FORMULARIO CON EL ID 'actualizarConfirmar_buttons' SE CLICKEE
getElementById('update-modal').addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log("executing")

    //@ts-ignore
    let parameters = new FormData(getElementById('update-modal'));
    //@ts-ignore
    parameters.append('id', datos_proveedor['id'])

//    var object = {};
//   parameters.forEach(function (value, key) {
//        object[key] = value;
//    });
//    var json = JSON.stringify(object);
//    console.log(json)

    // API REQUEST
    await saveRow(API_PROOVEDOR, API_UPDATE, parameters, fillTableProveedor);
});

//EVENTO PARA DELETE
getElementById('delete-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_proveedor['id'])

    //API REQUEST
    await deleteRow(API_PROOVEDOR, parameters, fillTableProveedor);
});



