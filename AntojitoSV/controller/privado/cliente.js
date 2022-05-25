//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow } from "../components.js";
import { SERVER, API_CREATE, API_UPDATE } from "../constants/api_constant.js";
import { getElementById, validateExistenceOfUser } from "../constants/functions.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_CLIENTE = SERVER + 'privada/cliente.php?action=';
// @ts-ignore
const ENDPOINT_TIPO_EMPLEADO = SERVER + 'privada/tipo_empleado.php?action=readAll';
//El nombre del CRUD que es
const CRUD_NAME = "cliente";

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosCliente"
let datos_cliente = {
    "id": 0,
    "nombre_cliente": ' ',
    "telefono": ' ',
    "correo": ' ',
    "estado": true
}

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
   
    validateExistenceOfUser()
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    await readRows(API_CLIENTE, fillTableCliente)
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

export function fillTableCliente(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td>${row.nombre_cliente}</td>
                <td>${row.telefono}</td>
                <td>${row.correo}</td>
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosCliente(${row.id_cliente},'${row.nombre_cliente}','${row.telefono}','${row.correo}')"  data-bs-toggle="modal" data-bs-target="#actualizarform" class="btn btn-primary" data-tooltip="Actualizar">
                                <img src="../../resources/img/cards/buttons/edit_40px.png"></a>
                            <a  onclick="guardarDatosCliente(${row.id_cliente},'${row.nombre_cliente}','${row.telefono}','${row.correo}')" data-bs-toggle="modal" data-bs-target="#eliminarForm" class="btn btn-primary" data-tooltip="eliminar" 
                            name="search">
                                <img src="../../resources/img/cards/buttons/delete_40px.png"></a>
                        </form>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se muestran cada filas de los registros
    getElementById('tbody-rowsC').innerHTML = content;
}

// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosCliente = (id_cliente, nombre_cliente, telefono, correo) => {
    datos_cliente.id = id_cliente
    // SE ACTUALIZA EL VALOR DEL INPUT CON EL ID ESPECIFICADO AL VALOR INGRESADO AL PARAMETRO, ASEGURENSE DE QUE ELINPUT TENGA 
    //EL ATRIBUTO "value="""
    //@ts-ignore
    document.getElementById("nombre_cliente_update").value = String(nombre_cliente)
    //@ts-ignore
    document.getElementById("telefono_update").value = String(telefono)
    //@ts-ignore
    document.getElementById("correo_update").value = String(correo)
}



// Método que se ejecuta al enviar un formulario de busqueda
getElementById('search-bar').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(API_CLIENTE, 'search-bar', fillTableCliente);
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
    parameters.append('estado',true)
    // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
    await saveRow(API_CLIENTE, API_CREATE, parameters, fillTableCliente);
});



// EVENTO PARA UPDATE
// SE EJECUTARA CUANDO EL BOTON DE TIPO "submit" DEL FORMULARIO CON EL ID 'actualizarConfirmar_buttons' SE CLICKEE
getElementById('update-modal').addEventListener('submit', async (event) => {
    event.preventDefault();

    //@ts-ignore
    let parameters = new FormData(getElementById('update-modal'));
    //@ts-ignore
    parameters.append('id', datos_cliente['id'])

    // API REQUEST
    await saveRow(API_CLIENTE, API_UPDATE, parameters, fillTableCliente);
});

//EVENTO PARA DELETE
getElementById('delete-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_cliente['id'])

    //API REQUEST
    await deleteRow(API_CLIENTE, parameters, fillTableCliente);
});



