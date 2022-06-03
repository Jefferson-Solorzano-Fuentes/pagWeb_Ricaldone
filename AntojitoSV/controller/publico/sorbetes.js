//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
import { readRows, saveRow, searchRows, deleteRow, unDeleteRow } from "../components.js";
import { getElementById } from "../constants/functions.js";
import { API_CREATE, POST_METHOD, API_UPDATE, API_SUCESS_REQUEST, GET_METHOD, SERVER } from "../constants/api_constant.js";
import { APIConnection } from "../APIConnection.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_PRODUCTO = SERVER + 'publica/sorbetes.php?action=';
const API_COMENTARIO = SERVER + 'privada/comentario.php?action=';

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_producto = {
    "id_categoria": 0,
}



// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    await readRows(API_PRODUCTO, fillTableProductos1)

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
export function fillTableProductos1(dataset) {
    let content = '';
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map(function (row) {
        // Se crean y concatenan las filas de la tabla con los datos de cada registro.
        content += ` 
             <h1>${row.nombre_categoria}</h1>
  
        `;
    });
    // Se muestran cada filas de los registros
    getElementById('titulo').innerHTML = content;
}




