
//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow, obtenerFechaActual, generatePDF } from "../components.js";
import { GET_METHOD, SERVER, API_CREATE, API_UPDATE, POST_METHOD } from "../constants/api_constant.js";
import { getElementById, validateExistenceOfUser } from "../constants/functions.js";
import { APIConnection } from "../APIConnection.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_EMPLEADO = SERVER + 'privada/empleado.php?action=';
const API_REPORTE = SERVER + 'privada/pdf.php?action=';
const API_USUARIO = SERVER + 'privada/usuario.php?action=';

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
    //Valida que el usuario este logeado
    await validateExistenceOfUser();
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
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
    //Cargar combo box de estado empleado
    await fillComboxEstadoEmpleado()
    //Cargar combo box de estado empleado
    await fillComboBoxEmpleado()
});


//Obtener los datos de combobox tipo empleado
async function fillComboBoxEmpleado() {
    //Se crea un endpoint especifico para el caso de leer tipo empleado
    let APIEndpoint = SERVER + 'privada/empleado.php?action=readEmpleado'
    //Se utiliza como api connection para realizar la consulta
    let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null)
    //Obtiene todos los valores y los ordena en un array, presentandolos en el select
    console.log(APIResponse);
    APIResponse.dataset.forEach(element => {
        //@ts-ignore 
        getElementById('empleado').innerHTML += `<option value="${element.id_empleado}" > ${element.nombre} </option>`
    })
}

//Obtener los datos de combobox tipo empleado
async function fillComboBoxTipoEmpleado() {
    //Se crea un endpoint especifico para el caso de leer tipo empleado
    let APIEndpoint = SERVER + 'privada/empleado.php?action=readTipoEmpleado'
    //Se utiliza como api connection para realizar la consulta
    let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null)
    //Obtiene todos los valores y los ordena en un array, presentandolos en el select
    APIResponse.dataset.map(element => {
        //@ts-ignore 
        getElementById('tipo_empleado').innerHTML += `<option value="${element.id_tipo_empleado}" > ${element.nombre_tipo} </option>`
    })
    APIResponse.dataset.map(element => {
        //@ts-ignore 
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
<<<<<<< Updated upstream
=======
        //@ts-ignore 
>>>>>>> Stashed changes
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

//@ts-ignore
window.seleccionarEmpleado = () => {
    //@ts-ignore
    datos_empleado.id_estado_empleado = document.getElementById('empleado').value
}


//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillTableEmpleado(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(row => {
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
                            <a onclick="guardarDatosEmpleadoUpdate(${row.id_empleado},'${row.nombre}','${row.apellido}','${row.DUI}','${row.NIT}','${row.telefono}','${row.correo}','${row.genero}','${row.fecha_nacimiento}',${row.id_estado_empleado},${row.id_tipo_empleado})" class="btn btn-primary">
                                <img src="../../resources/img/cards/buttons/edit_40px.png"></a>
                            <a onclick="guardarDatosEmpleadoDelete(${row.id_empleado})" class="btn btn-primary"  
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
window.guardarDatosEmpleadoUpdate = (id_empleado, nombre_empleado, apellido_empleado, dui, nit, telefono, correo, genero, fecha_nacimiento, id_estado_empleado,id_tipo_empleado) => {
    datos_empleado.id = id_empleado
    $("#actualizarform").modal("show");
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

// FUNCION PARA GUARDAR LOS DATOS DEL TIPO DE EMPLEADO
// @ts-ignore
window.guardarDatosEmpleadoDelete = (id_empleado) => {
    datos_empleado.id = id_empleado
    $("#eliminarForm").modal("show");
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
getElementById('insert-modal').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se cierra el formulario de registro
    $("#agregarform").modal("hide");
    //@ts-ignore
    //OBTIENE LOS DATOS DEL FORMULARIO QUE TENGA COMO ID "'insert-modal'"
    let parameters = new FormData(getElementById('insert-modal'));
    // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
    await saveRow(API_EMPLEADO, API_CREATE, parameters, fillTableEmpleado);
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
    parameters.append('id', datos_empleado['id'])

    // API REQUEST
    await saveRow(API_EMPLEADO, API_UPDATE, parameters, fillTableEmpleado);
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
    parameters.append('id', datos_empleado['id'])

    //API REQUEST
    await deleteRow(API_EMPLEADO, parameters, fillTableEmpleado);
});



//CREACIÓN DE PDF
window.createEmpleadoPDF = async () => {
    let APIEnpointReadEmpleado = API_REPORTE + "envios_empleado";
    let APIEndpointObtenerUsuarioActual = API_USUARIO + 'getUser';

    let parametersEmpleado = new FormData()
    parametersEmpleado.append("id_empleado", getElementById('empleado').value)
    let readEmpleadoResponse = await APIConnection(APIEnpointReadEmpleado, POST_METHOD, parametersEmpleado);
    let ObtenerUsuarioActualResponse = await APIConnection(APIEndpointObtenerUsuarioActual, GET_METHOD, null);

    let tableContent = ``;

    readEmpleadoResponse.dataset.forEach((element) => {
        tableContent += `
    <tr>
    <td>${element.fecha_creacion}</td>
    <td>${element.fecha_envio}</td>
    <td>${element.direccion}</td>
    <td>${element.monto_total}</td>
    <td>${element.placa}</td>
    <tr>
    `;
    });

    

    let generatedHTML = `
<!doctype html>
<html lang="es">

<head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <style>
        body {
            display: flex;
            justify-content: center;
            text-align: center;

        }

        #tabla-header {
            background-color: #872323;
            color: aliceblue;
            padding: 10px;
            font-size: 40px;
            padding-bottom: 20px;
            margin-bottom: 10px;

        }

        #tabla-header img {
            max-width: 65px;
        }

        /*Tabla de datos*/
        #tabla_datos {
            margin-top: 3%;
            margin-bottom: 3%;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;

        }

        /*Colores al encabezado*/
        #tabla_datos th {
            color: white;
            background-color: #872323;
        }

        /*Colores al cuerpo*/
        #tabla_datos tr {
            border: solid black 1px;
            background-color: #F6E3D5;
        }

        #tabla_reporte {
            width: 100%;
            height: 60%;
            margin-top: 20px;

        }

        #tabla_reporte th,
        td {
            text-align: left;
            padding-left: 5px;
        }
    </style>
    <title>AntojitoSV</title>

</head>

<body>
    <!-- Tabla de Datos -->
    <div class="container-fluid" id="tabla_datos" style="width: 100%">
        <div class="container-fluid" id="tabla-header">
            <a>AntojitoSV</a>
            <img src="../../resources/img/navbar_publico/logoCut.png">
        </div>
        <div class="container-fluid" id="tabla-header">
            <a>Envios realizados por un empleado en el mes</a>
        </div>
        <table class="table table-responsive table-bordered" id="tabla_reporte">
            <thead>
                <tr>
                    <th>Creado por:</th>
                    <td>${ObtenerUsuarioActualResponse.username}</td>
                </tr>
                <tr>
                    <th>Fecha:</th>
                    <td>${obtenerFechaActual()}</td>
                </tr>
                <tr>
                <th>nombre:</th>
                <td>${readEmpleadoResponse.dataset[0].nombre}</td>
                <th>apellido:</th>
                <td>${readEmpleadoResponse.dataset[0].apellido}</td>
                <th>DUI:</th>
                <td>${readEmpleadoResponse.dataset[0].DUI}</td>
            </tr>
                <tr>
                    <th>Fecha de creacion</th>
                    <th>Fecha de envio</th>
                    <th>Direccion</th>
                    <th>monto total</th>
                    <th>placa</th>
                </tr>
            </thead>
            <tbody>
               ${tableContent}
            </tbody>
        </table>
    </div>
    </main>
</body>

</html>`;
    let res = await generatePDF(generatedHTML, "envio_" + readEmpleadoResponse.dataset[0].id_empleado + obtenerFechaActual().replace("/", "-").replace("/", "-") + ".pdf")

    window.open("../../api/reportes/privado/" +  "envio_" + readEmpleadoResponse.dataset[0].id_empleado + obtenerFechaActual().replace("/", "-").replace("/", "-") + ".pdf");
}





