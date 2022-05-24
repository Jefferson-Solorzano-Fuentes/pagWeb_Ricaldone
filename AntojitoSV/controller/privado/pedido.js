//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow, unDeleteRow } from "../components.js";
import { GET_METHOD, SERVER, API_CREATE, API_UPDATE } from "../constants/api_constant.js";
import { getElementById, validateExistenceOfUser} from "../constants/functions.js";
import { APIConnection } from "../APIConnection.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_PEDIDO = SERVER + 'privada/pedido.php?action=';
const API_DETALLE_PEDIDO = SERVER + 'privada/detalle_pedido.php?action=';
// @ts-ignore
const ENDPOINT_PEDIDO = SERVER + 'privada/pedido.php?action=readAll';
const ENDPOINT_ID_CLIENTE = SERVER + 'privada/pedido.php?action=readCliente';

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
    validateExistenceOfUser();
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    await readRows(API_PEDIDO, fillTablePedido)
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
        getElementById('id_cliente').innerHTML += `<option value="${element.id_cliente}" > ${element.nombre_cliente} </option>`
    })
    APIResponse.dataset.map(element => {
        getElementById('id_cliente_u').innerHTML += `<option value="${element.id_cliente}" > ${element.nombre_cliente} </option>`
    })
}


//Mandar parametros para realizar search de los comentarios
// @ts-ignore
window.guardarDetallePedido = async (id_pedido) => {
    datos_detalle_pedido.pedido_id = id_pedido;
    let APIEndpoint = API_DETALLE_PEDIDO
    console.log(id_pedido)
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
    dataset.map(function (row) {
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
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td>${row.fecha_entrega}</td>
                <td>${row.monto_total}</td>
                <td>${row.direccion}</td>
                <td>${row.descripcion}</td>
                <td>${row.fecha_creacion}</td>
                <td>${row.id_cliente}</td>
                <td>${row.estado}</td>
                
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosPedido(${row.id_pedido},'${row.fecha_entrega}','${row.monto_total}','${row.direccion}','${row.descripcion}','${row.fecha_creacion}')"  data-bs-toggle="modal" data-bs-target="#actualizarform" class="btn btn-primary" data-tooltip="Actualizar">
                                <img src="../../resources/img/cards/buttons/edit_40px.png"></a>
                            <a  onclick="guardarDatosPedido(${row.id_pedido},'${row.fecha_entrega}','${row.monto_total}','${row.direccion}','${row.descripcion}','${row.fecha_creacion}')" data-bs-toggle="modal" data-bs-target="#eliminarForm" class="btn btn-primary" data-tooltip="eliminar" 
                            name="search">
                                <img src="../../resources/img/cards/buttons/delete_40px.png"></a>
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
window.guardarDatosPedido = (id_pedido, fecha_entrega, monto_total, direccion, descripcion, fecha_creacion) => {
    datos_pedido.id = id_pedido
    // SE ACTUALIZA EL VALOR DEL INPUT CON EL ID ESPECIFICADO AL VALOR INGRESADO AL PARAMETRO, ASEGURENSE DE QUE ELINPUT TENGA 
    //EL ATRIBUTO "value="""
    //@ts-ignore
    document.getElementById("fecha_entrega_update").value = String(fecha_entrega)
    //@ts-ignore
    document.getElementById("monto_update").value = String(monto_total)
    //@ts-ignore
    document.getElementById("direccion_update").value = String(direccion)
    //@ts-ignore
    document.getElementById("descripcion_update").value = String(descripcion)
    //@ts-ignore
    document.getElementById("fecha_creacion_update").value = String(fecha_creacion)   
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


// EVENTO PARA INSERT 
// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('insert-modal').addEventListener('submit', async (event) => {
    console.log("EXECUTING")
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    //@ts-ignore
    //OBTIENE LOS DATOS DEL FORMULARIO QUE TENGA COMO ID "'insert-modal'"
    let parameters = new FormData(getElementById('insert-modal'));

    // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
    await saveRow(API_PEDIDO, API_CREATE, parameters, fillTablePedido);
});



// EVENTO PARA UPDATE
// SE EJECUTARA CUANDO EL BOTON DE TIPO "submit" DEL FORMULARIO CON EL ID 'actualizarConfirmar_buttons' SE CLICKEE
getElementById('update-modal').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("EJECUTANDO")

    //@ts-ignore
    let parameters = new FormData(getElementById('update-modal'));
    //@ts-ignore
    parameters.append('id', datos_pedido['id'])

    var object = {};
    parameters.forEach((value, key) => object[key] = value);
var json = JSON.stringify(object);

    console.log(json)
    // API REQUEST
    await saveRow(API_PEDIDO, API_UPDATE, parameters, fillTablePedido);

});

//EVENTO PARA DELETE
getElementById('delete-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_pedido['id'])

    //API REQUEST
    await deleteRow(API_PEDIDO, parameters, fillTablePedido);
});


//EVENTO PARA DEACTIVAR
getElementById('deactivate-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_detalle_pedido['id'])

    //API REQUEST
    await deleteRow(API_DETALLE_PEDIDO, parameters, fillTableDetallePedido);
});


//EVENTO PARA DEACTIVAR
getElementById('reactivate-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_detalle_pedido['id'])

    //API REQUEST
    await unDeleteRow(API_DETALLE_PEDIDO, parameters, fillTableDetallePedido);
});

