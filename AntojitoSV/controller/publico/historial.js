//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow } from "../components.js";
import { SERVER, API_CREATE, API_UPDATE, DOM_CONTENT_LOADED, SEARCH_BAR, SUBMIT, INSERT_MODAL, UPDATE_MODAL, DELETE_FORM } from "../constants/api_constant.js";
import { getElementById, validateExistenceOfUserPublic } from "../constants/functions.js";
import { APIConnection } from "../APIConnection.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_PEDIDO_HISTORIAL = SERVER + 'privada/pedido.php?action=';
const API_DETALLE_PEDIDO_HISTORIAL = SERVER + 'privada/detalle_pedido.php?action=';
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
    //Validar que el usuario este en sesión
    validateExistenceOfUserPublic()
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    await readRows(API_PEDIDO_HISTORIAL, fillTableHistorial)

});

//Mandar parametros para realizar search de los comentarios
// @ts-ignore
window.guardarDetallePedido = async (id_pedido) => {
    //Captura el dato y lo envia al JSON
    datos_detalle_pedido.pedido_id = id_pedido;
    //Define el endpoint que se enviara 
    let APIEndpoint = API_DETALLE_PEDIDO_HISTORIAL
    let parameters = new FormData();
    //Se envian el parametro del id para realizar la busqueda
    //@ts-ignore
    parameters.append('search',datos_detalle_pedido['pedido_id'])

    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(APIEndpoint, null, fillTableDetallePedido, parameters);
}

export function fillTableHistorial(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(row => {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
        <div class="col 4">
                <div class="card" id="historial">
                            <div class="card-body">
                            <div class="row g-0">
                                <div class="col-md-9">
                                    <a href="carrito.html" id="comprasProd">
                                        <h2 class="card-title">$${row.monto_total}</h2>
                                    </a>
                                    <p class="historialCardText">Dirección: ${row.direccion}</p>
                                    <p class="historialCardText">Descripción: ${row.descripcion}</p>
                                    <p class="historialCardText" id="cantidad">Estado: ${row.estado}</p>
                                    <p class="historialCardText">Cliente: ${row.nombre_cliente}</p>
                                    <p class="historialCardText"><small class="text-muted">Fecha de Entrega: ${row.fecha_entrega}</small></p>
                                    <p class="historialCardText"><small class="text-muted">Fecha de Creación: ${row.fecha_creacion}</small></p>
                                </div>
                                <div class="col-md-3"> 
                                    <form method='post' id='${row.id_pedido}' class="btnHistorial">
                                        <a onclick="guardarDetallePedido(${row.id_pedido})" data-bs-toggle="modal"  type="submit"
                                            data-bs-target="#detallePedidoForm" class="btn btn-primary"  name="search"><img
                                            src="../../resources/img/cards/buttons/eye_40px.png"></a>
                                    </form> 
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        `;
    });
    getElementById('historial').innerHTML = content;
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
            </tr>
        `;
    });
    getElementById('historialDetalle').innerHTML = content;
}

// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosPedido = (id_pedido) => {
    datos_pedido.id = id_pedido
}

// FUNCION PARA GUARDAR LOS DATOS DEL COMENTARIO
// @ts-ignore
window.guardarDatosDetallePedido = (id_detalle_pedido) => {
    datos_detalle_pedido.id = id_detalle_pedido
}

