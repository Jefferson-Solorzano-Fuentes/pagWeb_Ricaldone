//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow } from "../components.js";
import { GET_METHOD, SERVER, API_CREATE, API_UPDATE } from "../constants/api_constant.js";
import { getElementById, validateExistenceOfUser } from "../constants/functions.js";
import { APIConnection } from "../APIConnection.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_EMPLEADO = SERVER + 'privada/empleado.php?action=';
// @ts-ignore
const ENDPOINT_TIPO_EMPLEADO = SERVER + 'privada/empleado.php?action=readTipoEmpleado';

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_empleado = {
    "id": 0,
    "nombre_empleado": ' ',
    "apellido_empleado": ' ',
    "dui": ' ',
    "nit": ' ',
    "telefono": ' ',
    "correo": ' ',
    "genero": ' ',
    "fecha_nacimiento": ' ',
    "imagen": ' ',
    "id_estado_empleado": 0,
    "nombre_estado_empleado": "",
    "id_tipo_empleado": 0,
    "nombre_tipo_empleado": ""
}

let datos_estado_empleado = {
    'id_estado_empleado': 0,
    'nombre_estado': ' '
}

let datos_tipo_empleado = {
    'id_tipo_empleado': 0,
    'nombre_tipo': ' '
}


// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    validateExistenceOfUser();
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    //Declarando cual CRUD es este
    await readRows(API_EMPLEADO, fillTableEmpleado)
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
    //Cargar combo box de tipo empleado
    await fillComboBoxTipoEmpleado()
    //Carfar combo box de estado empleado
    await fillComboxEstadoEmpleado()

});

//Obtener los datos de combobox tipo empleado
async function fillComboBoxTipoEmpleado() {
    //Se crea un endpoint especifico para el caso de leer tipo empleado
    let APIEndpoint = SERVER + 'privada/empleado.php?action=readTipoEmpleado'
    //Se utiliza como api connection para realizar la consulta
    let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null)
    //Obtiene todos los valores y los ordena en un array, presentandolos en el select
    APIResponse.dataset.map(element => {
        getElementById('tipo_empleado').innerHTML += `<option value="${element.id_tipo_empleado}" > ${element.nombre_tipo} </option>`
    })
    APIResponse.dataset.map(element => {
        getElementById('tipo_empleado_update').innerHTML += `<option value="${element.id_tipo_empleado}" > ${element.nombre_tipo} </option>`
    })
}

//Obtener los datos de combobox estado empleado
async function fillComboxEstadoEmpleado() {
    //Se crea un endpoint especifico para el caso de leer tipo empleado
    let APIEndpoint = SERVER + 'privada/empleado.php?action=readEstadoEmpleado'
    //Se utiliza como api connection para realizar la consulta
    let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null)
    //Obtiene todos los valores y los ordena en un array, presentandolos en el select
    APIResponse.dataset.map(element => {
        getElementById('estado_empleado').innerHTML += `<option value="${element.id_estado_empleado}" > ${element.nombre_estado} </option>`
    })
    APIResponse.dataset.map(element => {
        getElementById('estado_empleado_update').innerHTML += `<option value="${element.id_estado_empleado}" > ${element.nombre_estado} </option>`
    })
}

//@ts-ignore
window.seleccionarTipoEmpleado = () => {
    //@ts-ignore
    datos_empleado.id_tipo_empleado = document.getElementById('tipo_empleado').value
}

//@ts-ignore
window.seleccionarEstadoEmpleado = () => {
    //@ts-ignore
    datos_empleado.id_estado_empleado = document.getElementById('estado_empleado').value
}


//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillTableEmpleado(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td> <img src="../../api/imagenes/empleado/${row.imagen}" width=100></td>
                <td>${row.nombre}</td>
                <td>${row.apellido}</td>
                <td>${row.telefono}</td>
                <td>${row.correo}</td>
                <td>${row.nombre_estado}</td>
                <td>${row.DUI}</td>
                <td>${row.NIT}</td>
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosTipoEmpleado(${row.id_empleado},'${row.nombre}','${row.apellido}','${row.DUI}','${row.NIT}','${row.telefono}','${row.correo}','${row.genero}','${row.fecha_nacimiento}',${row.id_estado_empleado},${row.id_tipo_empleado})"  data-bs-toggle="modal" data-bs-target="#actualizarform" class="btn btn-primary" data-tooltip="Actualizar">
                                <img src="../../resources/img/cards/buttons/edit_40px.png"></a>
                            <a onclick="guardarDatosTipoEmpleado(${row.id_empleado},'${row.nombre}','${row.apellido}','${row.DUI}','${row.NIT}','${row.telefono}','${row.correo}','${row.genero}','${row.fecha_nacimiento}',${row.id_estado_empleado},${row.id_tipo_empleado})" data-bs-toggle="modal" data-bs-target="#eliminarForm" class="btn btn-primary" data-tooltip="eliminar" 
                            name="search">
                                <img src="../../resources/img/cards/buttons/delete_40px.png"></a>
                        </form>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se muestran cada filas de los registros
    getElementById('tbody-rowsE').innerHTML = content;
}



// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosTipoEmpleado = (id_empleado, nombre_empleado, apellido_empleado, dui, nit, telefono, correo, genero, fecha_nacimiento, id_estado_empleado,id_tipo_empleado) => {
    datos_empleado.id = id_empleado
    // datos_empleado.nombre_estado_empleado = nombre_estado
    // getElementById('tipo_empleado').value = nombre_tipo
    //@ts-ignore
    document.getElementById("nombre_empleado_update").value = String(nombre_empleado)
    //@ts-ignore
    document.getElementById("apellido_empleado_update").value = String(apellido_empleado)
    //@ts-ignore
    document.getElementById("dui_update").value = String(dui)
    //@ts-ignore
    document.getElementById("nit_update").value = String(nit)
    //@ts-ignore
    document.getElementById("telefono_update").value = String(telefono)
    //@ts-ignore
    document.getElementById("correo_update").value = String(correo)
    //@ts-ignore
    document.getElementById("genero_update").value = String(genero)
    //@ts-ignore
    document.getElementById("genero_update").value = String(genero)
    //@ts-ignore
    document.getElementById("fecha_nacimiento_update").value = String(fecha_nacimiento)
    //@ts-ignore
    console.log(getElementById('tipo_empleado_update').value)
    //@ts-ignore
    console.log(getElementById('estado_empleado_update').value)
}



// Método que se ejecuta al enviar un formulario de busqueda
getElementById('search-bar').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(API_EMPLEADO, 'search-bar', fillTableEmpleado);
});


// EVENTO PARA INSERT 
// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('insert-modal').addEventListener('submit', async (event) => {
    console.log("INSERTANDO")
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();

    //@ts-ignore
    //OBTIENE LOS DATOS DEL FORMULARIO QUE TENGA COMO ID "'insert-modal'"
    let parameters = new FormData(getElementById('insert-modal'));
    // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
    await saveRow(API_EMPLEADO, API_CREATE, parameters, fillTableEmpleado);
});



// EVENTO PARA UPDATE
// SE EJECUTARA CUANDO EL BOTON DE TIPO "submit" DEL FORMULARIO CON EL ID 'actualizarConfirmar_buttons' SE CLICKEE
getElementById('update-modal').addEventListener('submit', async (event) => {
    event.preventDefault();
    //@ts-ignore
    let parameters = new FormData(getElementById('update-modal'));
    //@ts-ignore
    parameters.append('id', datos_empleado['id'])

    // API REQUEST
    await saveRow(API_EMPLEADO, API_UPDATE, parameters, fillTableEmpleado);
});

//EVENTO PARA DELETE
getElementById('delete-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    console.log("ELIMINANDO EMPLEADO")

    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_empleado['id'])

    //API REQUEST
    await deleteRow(API_EMPLEADO, parameters, fillTableEmpleado);
});



