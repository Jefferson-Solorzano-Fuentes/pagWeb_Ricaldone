//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow } from "../components.js";
import { GET_METHOD, SERVER,  API_CREATE, API_UPDATE, DOM_CONTENT_LOADED, SEARCH_BAR, SUBMIT, INSERT_MODAL, UPDATE_MODAL, DELETE_FORM } from "../constants/api_constant.js";
import { getElementById, validateExistenceOfUser} from "../constants/functions.js";
import { APIConnection } from "../APIConnection.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_COMPRA_EXISTENCIA = SERVER + 'privada/compra_existencia.php?action=';

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_compra_existencia = {
    "id": 0,
    "producto_id": 0,
    "cantidad": 0,
    "fecha_compra": ' ',
    "false": true 
}

let datos_productos = {
    'id_producto': 0,
    'nombre_producto': ' '
}


// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    //Valida que el usuario este logeado
    validateExistenceOfUser();
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    //Declarando cual CRUD es este
    await readRows(API_COMPRA_EXISTENCIA, fillTableCompraExistencia)
    //Carfar combo box de estado empleado
    await fillComboxProducto()
});


//Obtener los datos de combobox de producto
async function fillComboxProducto(){
    //Se crea un endpoint especifico para el caso de leer producto
    let APIEndpoint = SERVER + 'privada/compra_existencia.php?action=readProducto'
    //Se utiliza como api connection para realizar la consulta
    let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null)
    //Obtiene todos los valores y los ordena en un array, presentandolos en el select
    APIResponse.dataset.map(element => {
       getElementById('producto_id').innerHTML += `<option value="${element.id_producto}" > ${element.nombre_producto} </option>`
    })
    APIResponse.dataset.map(element => {
        getElementById('producto_id_u').innerHTML += `<option value="${element.id_producto}" > ${element.nombre_producto} </option>`
     })
}

//Obtener el producto para usarlo para rellenar el Combobox
//@ts-ignore
window.selectProduct=() => {
    //@ts-ignore
    datos_productos.id_producto = document.getElementById('producto_id').value
}



//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillTableCompraExistencia(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(row =>{
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td>${row.id_compra_existencia}</td>
                <td>${row.nombre_producto}</td>
                <td>${row.nombre}</td>
                <td>${row.stock_comprado}</td>
                <td>${row.fecha_compra}</td>
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosCompraUpdate(${row.id_compra_existencia}, ${row.fecha_compra}, ${row.stock_comprado})"  data-bs-toggle="modal" data-bs-target="#actualizarform" class="btn btn-primary" data-tooltip="Actualizar">
                                <img src="../../resources/img/cards/buttons/edit_40px.png"></a>
                            <a  onclick="guardarDatosCompraDelete(${row.id_compra_existencia})" data-bs-toggle="modal" data-bs-target="#eliminarForm" class="btn btn-primary" data-tooltip="eliminar" 
                            name="search">
                                <img src="../../resources/img/cards/buttons/delete_40px.png"></a>
                        </form>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se muestran cada filas de los registros
    getElementById('tbody-rowsCS').innerHTML = content;
}



// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosCompraUpdate = (id_compra_existencia, fecha_compra, stock_comprado) => {
    datos_compra_existencia.id = id_compra_existencia
    $("#actualizarform").modal("show");
    // SE ACTUALIZA EL VALOR DEL INPUT CON EL ID ESPECIFICADO AL VALOR INGRESADO AL PARAMETRO, ASEGURENSE DE QUE ELINPUT TENGA
    //EL ATRIBUTO "value="""
    //@ts-ignore
    document.getElementById("fecha_compra_update").value = String(fecha_compra);
    //@ts-ignore
    document.getElementById("cantidad_update").value = String(stock_comprado);
}

// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosCompraDelete = (id_compra_existencia) => {
    datos_compra_existencia.id = id_compra_existencia
    $("#eliminarForm").modal("show");
}


// Método que se ejecuta al enviar un formulario de busqueda
getElementById('search-bar').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(API_COMPRA_EXISTENCIA, 'search-bar', fillTableCompraExistencia);
});


// EVENTO PARA INSERT 
// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
getElementById('insert-modal').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se cierra el formulario de registro
    $("#agregarform").modal("hide");
    //@ts-ignore
    //OBTIENE LOS DATOS DEL FORMULARIO QUE TENGA COMO ID "'insert-modal'"
    let parameters = new FormData(getElementById('insert-modal'));
    // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
    await saveRow(API_COMPRA_EXISTENCIA, API_CREATE, parameters, fillTableCompraExistencia);
});



// EVENTO PARA UPDATE
// SE EJECUTARA CUANDO EL BOTON DE TIPO "submit" DEL FORMULARIO CON EL ID 'actualizarConfirmar_buttons' SE CLICKEE
getElementById('update-modal').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se cierra el formulario de registro
    $("#actualizarform").modal("hide");
    //@ts-ignore
    let parameters = new FormData(getElementById('update-modal'));
    //@ts-ignore
    parameters.append('id', datos_compra_existencia['id'])

    // API REQUEST
    await saveRow(API_COMPRA_EXISTENCIA, API_UPDATE, parameters, fillTableCompraExistencia);
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
    parameters.append('id', datos_compra_existencia['id'])
    //API REQUEST
    await deleteRow(API_COMPRA_EXISTENCIA, parameters, fillTableCompraExistencia);
});



