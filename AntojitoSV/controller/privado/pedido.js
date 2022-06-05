//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow, unDeleteRow } from "../components.js";
import { GET_METHOD, SERVER, API_CREATE, API_UPDATE, DOM_CONTENT_LOADED, SEARCH_BAR, SUBMIT, INSERT_MODAL, UPDATE_MODAL, DELETE_FORM, DEACTIVATE_FORM, REACTIVATE_FORM } from "../constants/api_constant.js";
import { getElementById, validateExistenceOfUser} from "../constants/functions.js";
import { APIConnection } from "../APIConnection.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_PEDIDO = SERVER + 'privada/pedido.php?action=';
const API_DETALLE_PEDIDO = SERVER + 'privada/detalle_pedido.php?action=';

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_pedido = {
    "id": 0,
    "fecha_entrega": ' ',
    "monto": ' ',
    "direccion": ' ',
    "descripcion": ' ',
    "fecha_creacion": ' ',
    "id_cliente": 0,
    "estado": true,
    "imagen": ' '
}

let datos_id_cliente = {
    'id_cliente': 0,
    'nombre_cliente': ' '
}

let datos_detalle_pedido ={
    "id": 0,
    "pedido_id": 0,
    "producto_id":0,
    "cantidad":0,
    "subtotal":0,
    "visibilidad": true
}

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    //Valida que el usuario este logeado
    validateExistenceOfUser();
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    await readRows(API_PEDIDO, fillTablePedido)
    //Cargar combo box de id cliente
    await fillComboBoxCliente();

});

//Obtener los datos de combobox ID CLIENTE
async function fillComboBoxCliente() {
    //Se crea un endpoint especifico para el caso de leer tipo empleado
    let APIEndpoint = SERVER + 'privada/pedido.php?action=readCliente'
    //Se utiliza como api connection para realizar la consulta
    let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null)
    //Obtiene todos los valores y los ordena en un array, presentandolos en el select
    APIResponse.dataset.map(element => {
        getElementById('id_cliente_update').innerHTML += `<option value="${element.id_cliente}" > ${element.nombre_cliente} </option>`
    })
    APIResponse.dataset.map(element => {
        getElementById('id_cliente_u').innerHTML += `<option value="${element.id_cliente}" > ${element.nombre_cliente} </option>`
    })
}


//Mandar parametros para realizar search de los comentarios
// @ts-ignore
window.guardarDetallePedido = async (id_pedido) => {
    //Captura el dato y lo envia al JSON
    datos_detalle_pedido.pedido_id = id_pedido;
    //Define el endpoint que se enviara 
    let APIEndpoint = API_DETALLE_PEDIDO
    let parameters = new FormData();
    //Se envian el parametro del id para realizar la busqueda
    //@ts-ignore
    parameters.append('search',datos_detalle_pedido['pedido_id'])

    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(APIEndpoint, null, fillTableDetallePedido, parameters);
}

//Llenar las tablas de detallePedido
export function fillTableDetallePedido(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(row => {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td>${row.nombre_producto}</td>
                <td>${row.cantidad}</td>
                <td>${row.subtotal}</td>
                <td>${row.visibilidad}</td>
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosDetallePedido(${row.id_detalle_pedido})"  data-bs-toggle="modal" data-bs-target="#deactivarForm" class="btn btn-primary">
                                <img src="../../resources/img/cards/buttons/invisible_40px.png"></a>
                            <a  onclick="guardarDatosDetallePedido(${row.id_detalle_pedido})" data-bs-toggle="modal" data-bs-target="#reactivarForm" class="btn btn-primary"  
                            name="search">
                                <img src="../../resources/img/cards/buttons/eye_40px.png"></a>
                        </form>
                    </div>
                </td>
            </tr>
        `;
    });
    getElementById('tbody-rows-detalle-pedido').innerHTML = content;
}


//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillTablePedido(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map( row => {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td>${row.fecha_entrega}</td>
                <td>${row.monto_total}</td>
                <td>${row.direccion}</td>
                <td>${row.descripcion}</td>
                <td>${row.fecha_creacion}</td>
                <td>${row.nombre_cliente}</td>
                <td>${row.estado}</td>
                
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosPedidoDeactivar(${row.id_pedido})" class="btn btn-primary" >
                                <img src="../../resources/img/cards/buttons/edit_40px.png"></a>
                            <a  onclick="guardarDatosPedidoReactivar(${row.id_pedido})"  class="btn btn-primary" name="search">
                                <img src="../../resources/img/cards/buttons/delete_40px.png"></a>
                        </form>
                        <form method='post' id='${row.id_pedido}'>
                        <a onclick="guardarDetallePedido(${row.id_pedido})" data-bs-toggle="modal"  type="submit"
                        data-bs-target="#detallePedidoForm" class="btn btn-primary"  name="search"><img
                            src="../../resources/img/cards/buttons/eye_40px.png"></a>
                    </form>        
                    </div>
                </td>
            </tr>
        `;
    });
    // Se muestran cada filas de los registros
    getElementById('tbody-rowsPedido').innerHTML = content;
}


// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosPedidoDeactivar = (id_pedido) => {
    datos_pedido.id = id_pedido
    $("#eliminarForm").modal("show");
}

// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosPedidoReactivar = (id_pedido) => {
    datos_pedido.id = id_pedido
    $("#reactivarForm").modal("show");
}

// FUNCION PARA GUARDAR LOS DATOS DEL COMENTARIO
// @ts-ignore
window.guardarDatosDetallePedido = (id_detalle_pedido) => {
    datos_detalle_pedido.id = id_detalle_pedido
}

//@ts-ignore
window.seleccionarCliente = () => {
    //@ts-ignore
    datos_id_cliente.id_cliente = document.getElementById('id_cliente').value
}



// Método que se ejecuta al enviar un formulario de busqueda
getElementById('search-bar').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(API_PEDIDO, 'search-bar', fillTablePedido);
});

//EVENTO PARA DELETE
getElementById('delete-form').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();    
    // Se cierra el formulario de registro
    $("#eliminarForm").modal("hide");
    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_pedido['id'])

    //API REQUEST
    await deleteRow(API_PEDIDO, parameters, fillTablePedido);
});


//EVENTO PARA DEACTIVAR
getElementById('deactivate-form').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.    
    event.preventDefault();
    // Se cierra el formulario de registro
    $("eliminarForm").modal("hide");
    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_detalle_pedido['id'])

    //API REQUEST
    await deleteRow(API_DETALLE_PEDIDO, parameters, fillTableDetallePedido);
});


//EVENTO PARA DEACTIVAR
getElementById('reactivate-form').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.    
    event.preventDefault();
    // Se cierra el formulario de registro
    $("reactivarForm").modal("hide");
    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_detalle_pedido['id'])
    //API REQUEST
    await unDeleteRow(API_DETALLE_PEDIDO, parameters, fillTableDetallePedido);
});

