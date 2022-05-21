//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
import { readRows, saveRow, searchRows, deleteRow, unDeleteRow } from "../components.js";
import { getElementById } from "../constants/functions.js";
import { API_CREATE, POST_METHOD, API_UPDATE, API_SUCESS_REQUEST, GET_METHOD, SERVER } from "../constants/api_constant.js";
import { APIConnection } from "../APIConnection.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_PRODUCTO = SERVER + 'privada/producto.php?action=';
const API_COMENTARIO = SERVER + 'privada/comentario.php?action=';

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_producto = {
    "id_producto": 0,
    "id_categoria": 0,
    "id_proveedor": 0
}

let datos_comentarios ={
    "id_comentario": 0,
    "comnetario": ' ',
    "id_producto": 0,
    "nombre_producto": ' ',
    "id_cliente": 0,
    "nombre_cliente": ' '
}

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    await readRows(API_PRODUCTO, fillTableProductos)

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
    await fillProveedorCombobox()
    await fillCategoriaComboBox()
});

//LLENAR COMBOBOX
//Combobox Proveedor
async function fillProveedorCombobox() {
    let APIEndpoint = API_PRODUCTO + 'proveedoresCMB'
    let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null)
    if (APIResponse.status == API_SUCESS_REQUEST) {
        APIResponse.dataset.map(element => {
            document.getElementById('listado_de_proveedores').innerHTML += `<option value="${element.id_proveedor}" > ${element.nombre} </option>`
        })
        APIResponse.dataset.map(element => {
            document.getElementById('listado_de_proveedores_u').innerHTML += `<option value="${element.id_proveedor}" > ${element.nombre} </option>`
        })
        return
    }
    console.log("all bad")
}
//Combobox Categoria
async function fillCategoriaComboBox() {
    let APIEndpoint = API_PRODUCTO + 'categoriaCMB'
    let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null)
    if (APIResponse.status == API_SUCESS_REQUEST) {
        console.log(APIResponse)
        APIResponse.dataset.map(element => {
            document.getElementById('listado_categorias').innerHTML += `<option value="${element.id_categoria}" > ${element.nombre_categoria} </option>`
        })
        APIResponse.dataset.map(element => {
            document.getElementById('listado_categorias_u').innerHTML += `<option value="${element.id_categoria}" > ${element.nombre_categoria} </option>`
        })
        return
    }
    console.log("all bad")
}

//GUARDA LOS VALORES DE LOS COMBOBOX
//@ts-ignore
window.selectIdProveedor = (idProveedorCmb) => {
    //@ts-ignore
    datos_producto.id_proveedor = getElementById(idProveedorCmb).value
}

//@ts-ignore
window.selectIdCategoria = (idCategoriaCmb) => {
    //@ts-ignore
    datos_producto.id_categoria = getElementById(idCategoriaCmb).value
}

//@ts-ignore
window.guardardarDatosComboBoxProveedor = (idProveedor) => {
    datos_producto.id_proveedor = idProveedor
}

// FUNCION PARA GUARDAR LOS DATOS DEL PRODUCTO
// @ts-ignore
window.guardarDatosproducto = (id_producto) => {
    datos_producto.id_producto = id_producto
}

// FUNCION PARA GUARDAR LOS DATOS DEL COMENTARIO
// @ts-ignore
window.guardarDatosComentario = (id_comentario) => {
    datos_comentarios.id_comentario = id_comentario
}

//Mandar parametros para realizar search de los comentarios
// @ts-ignore
window.guardarProductoComentario = async (id_producto) => {
    datos_comentarios.id_producto = id_producto;
    let APIEndpoint = API_COMENTARIO

    let parameters = new FormData();
    //Se envian el parametro del id para realizar la busqueda
    //@ts-ignore
    parameters.append('search',datos_comentarios['id_producto'])

    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(APIEndpoint, null, fillTableComentario, parameters);
}

export function fillTableComentario(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td>${row.comentario}</td>
                <td>${row.nombre_cliente}</td>
                <td>${row.visibilidad}</td>
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosComentario(${row.id_comentario})"  data-bs-toggle="modal" data-bs-target="#deactivarForm" class="btn btn-primary" data-tooltip="Actualizar">
                                <img src="../../resources/img/cards/buttons/invisible_40px.png"></a>
                            <a  onclick="guardarDatosComentario(${row.id_comentario})" data-bs-toggle="modal" data-bs-target="#reactivarForm" class="btn btn-primary" data-tooltip="eliminar" 
                            name="search">
                                <img src="../../resources/img/cards/buttons/eye_40px.png"></a>
                        </form>
                    </div>
                </td>
            </tr>
        `;
    });
    getElementById('tbody-rows-comentario').innerHTML = content;
}


getElementById('search-bar').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
   event.preventDefault();

   let APIEndpoint = API_PRODUCTO 
   // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(APIEndpoint ,'search-bar', fillTableProductos);
});

//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillTableProductos(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td> <img src="../../api/imagenes/producto/${row.imagen}" width=100></td>
                <td>${row.nombre_producto}</td>
                <td>${row.descripcion}</td>
                <td>${row.nombre}</td>
                <td>${row.precio}</td>
                <td>${row.stock}</td>

                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosproducto(${row.id_producto})"  data-bs-toggle="modal" data-bs-target="#actualizarform" class="btn btn-primary" data-tooltip="Actualizar">
                                <img src="../../resources/img/cards/buttons/edit_40px.png"></a>
                            <a  onclick="guardarDatosproducto(${row.id_producto})" data-bs-toggle="modal" data-bs-target="#eliminarForm" class="btn btn-primary" data-tooltip="eliminar" 
                            name="search">
                                <img src="../../resources/img/cards/buttons/delete_40px.png"></a>
                                <form method='post' id='${row.id_producto}'>
                                    <a onclick="guardarProductoComentario(${row.id_producto})" data-bs-toggle="modal"  type="submit"
                                    data-bs-target="#comentarioForm" class="btn btn-primary" data-tooltip="comentario" name="search"><img
                                        src="../../resources/img/cards/buttons/eye_40px.png"></a>
                                </form>        
                        </form>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se muestran cada filas de los registros
    getElementById('tbody-rows-productos').innerHTML = content;
}




// EVENTO PARA INSERT 
// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('insert-form').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    //@ts-ignore
    //OBTIENE LOS DATOS DEL FORMULARIO QUE TENGA COMO ID "'insert-modal'"
    let parameters = new FormData(getElementById('insert-form'));

    // ANADIR LOS DATOS DEL EL JSON A LOS PARAMETROS
    //@ts-ignore
    parameters.append('proveedor_id', datos_producto['id_proveedor'])
    //@ts-ignore
    parameters.append('id_categoria', datos_producto['id_categoria'])

    // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
    await saveRow(API_PRODUCTO, API_CREATE, parameters, fillTableProductos);
});



// EVENTO PARA UPDATE
// SE EJECUTARA CUANDO EL BOTON DE TIPO "submit" DEL FORMULARIO CON EL ID 'actualizarConfirmar_buttons' SE CLICKEE
getElementById('update-modal').addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log('EJECUTANDO')
    //@ts-ignore
    let parameters = new FormData(getElementById('update-modal'));
    //@ts-ignore
    parameters.append('id', datos_producto['id_proveedor'])
    //@ts-ignore
    parameters.append('proveedor_id', datos_producto['id_proveedor'])
    //@ts-ignore
    parameters.append('id_categoria', datos_producto['id_categoria'])

    // API REQUEST
    await saveRow(API_PRODUCTO, API_UPDATE, parameters, fillTableProductos);
});

//EVENTO PARA DELETE
getElementById('delete-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_producto['id_producto'])

    //API REQUEST
    await deleteRow(API_PRODUCTO, parameters, fillTableProductos);
});

//EVENTO PARA DEACTIVAR
getElementById('deactivate-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_comentarios['id_comentario'])

    //API REQUEST
    await deleteRow(API_COMENTARIO, parameters, fillTableComentario);
});


//EVENTO PARA DEACTIVAR
getElementById('reactivate-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_comentarios['id_comentario'])

    //API REQUEST
    await unDeleteRow(API_COMENTARIO, parameters, fillTableComentario);
});