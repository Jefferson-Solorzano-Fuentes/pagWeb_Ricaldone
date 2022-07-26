//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow } from "../components.js";
import { SERVER, API_CREATE, API_UPDATE, DOM_CONTENT_LOADED, SEARCH_BAR, SUBMIT, INSERT_MODAL, UPDATE_MODAL, DELETE_FORM } from "../constants/api_constant.js";
import { getElementById, validateExistenceOfUser } from "../constants/functions.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_VEHICULO = SERVER + 'privada/vehiculo.php?action=';
// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_vehiculo = {
    "id": 0,
    "disponibilidad": true,
    "vin" : ' ',
    "placa" : ' ',
    "imagen" : ' '
}

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    //Validar que el usuario este en sesión
    await validateExistenceOfUser();
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    await readRows(API_VEHICULO, fillTableVehiculo)

});


//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillTableVehiculo(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(row => {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
            <tr>
                <td> <img src="../../api/imagenes/vehiculo/${row.imagen}" width=100></td>
                <td>${row.disponibilidad}</td>
                <td>${row.VIN}</td>
                <td>${row.placa}</td>
                
                
                <td class="d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <form method="post" id="read-one">
                            <a onclick="guardarDatosVehiculoUpdate(${row.id_vehiculo},'${row.VIN}','${row.placa}')" class="btn btn-primary">
                                <img src="../../resources/img/cards/buttons/edit_40px.png"></a>
                            <a  onclick="guardarDatosVehiculoDelete(${row.id_vehiculo})" class="btn btn-primary" name="search" data>
                                <img src="../../resources/img/cards/buttons/delete_40px.png"></a>
                        </form>
                    </div>
                </td>
            </tr>
        `;
    });
    // Se muestran cada filas de los registros
    getElementById('tbody-rowsVehiculo').innerHTML = content;
}


// FUNCION PARA GUARDAR LOS DATOS DEL VEHICULO PARA UPDATE
// @ts-ignore
window.guardarDatosVehiculoUpdate = (id_vehiculo, VIN, placa) => {
    datos_vehiculo.id = id_vehiculo
    $('#actualizarform').modal('show');
    // SE ACTUALIZA EL VALOR DEL INPUT CON EL ID ESPECIFICADO AL VALOR INGRESADO AL PARAMETRO, ASEGURENSE DE QUE ELINPUT TENGA 
    //EL ATRIBUTO "value="""
    //@ts-ignore
    document.getElementById("vin_update").value = String(VIN)
    //@ts-ignore
    document.getElementById("placa_update").value = String(placa)
}

// FUNCION PARA GUARDAR LOS DATOS DEL VEHICULO PARA DELTEE
// @ts-ignore
window.guardarDatosVehiculoDelete = (id_vehiculo) => {
    datos_vehiculo.id = id_vehiculo
    $('#eliminarForm').modal('show');
}



// Método que se ejecuta al enviar un formulario de busqueda
getElementById('search-bar').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(API_VEHICULO, 'search-bar', fillTableVehiculo);
});



// EVENTO PARA INSERT 
// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
document.getElementById('insert-modal').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se cierra el formulario de registro
    $('#agregarform').modal('hide');

    //@ts-ignore
    //OBTIENE LOS DATOS DEL FORMULARIO QUE TENGA COMO ID "'insert-modal'"
    let parameters = new FormData(getElementById('insert-modal'));
    // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
    await saveRow(API_VEHICULO, API_CREATE, parameters, fillTableVehiculo);
});



// EVENTO PARA UPDATE
// SE EJECUTARA CUANDO EL BOTON DE TIPO "submit" DEL FORMULARIO CON EL ID 'actualizarConfirmar_buttons' SE CLICKEE
getElementById('update-modal').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.    
    event.preventDefault()
    // Se cierra el formulario de registro
    $('#actualizarform').modal('hide');
    //@ts-ignore
    let parameters = new FormData(getElementById('update-modal'));
    //@ts-ignore
    parameters.append('id', datos_vehiculo['id'])
    // API REQUEST
    await saveRow(API_VEHICULO, API_UPDATE, parameters, fillTableVehiculo);
}); 

//EVENTO PARA DELETE
getElementById('delete-form').addEventListener('submit', async (event) => {
    // Se evita recargar la página web después de enviar el formulario.
    event.preventDefault();
    // Se cierra el formulario de registro
    $('#eliminarForm').modal('hide');
    // CONVIRTIENDO EL JSON A FORMDATA
    let parameters = new FormData();
    //@ts-ignore
    parameters.append('id', datos_vehiculo['id'])
    //API REQUEST
    await deleteRow(API_VEHICULO, parameters, fillTableVehiculo);
});

