//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
import { readRows, saveRow, searchRows, deleteRow, unDeleteRow, readOne } from "../components.js";
import { getElementById } from "../constants/functions.js";
import { SERVER } from "../constants/api_constant.js";
import { APIConnection } from "../APIConnection.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_PRODUCTO = SERVER + 'publica/detalle_producto.php';
const API_COMENTARIO = SERVER + 'privada/comentario.php?action=';

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_producto = {
    "id_detalle": 0,
    "id_producto": 0,
    "nombre_producto": 0,
    "descripcion": 0,
    "precio": 0
}

//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillTableProductos(dataset) {
    // Se muestran cada filas de los registros
    getElementById('tituloProd').innerHTML = dataset.nombre_producto;
    getElementById('prodInfo').innerHTML = dataset.descripcion;
    getElementById('prodPrecio').innerHTML = dataset.precio;
    getElementById('imgProducto').setAttribute('src', dataset.imagen);

    var comentarios = dataset.comentarios;

    var content = '';

    comentarios.forEach(function(value, key) {
        content = content + `<div class="col-sm-6">
            <div class="card" id="reseñas">
                <div class="card-body">
                        <i class="fa fa-star" id="stars"></i>
                        <i class="fa fa-star" id="stars"></i>
                        <i class="fa fa-star" id="stars"></i>
                        <i class="fa fa-star" id="stars"></i>
                        <i class="fa fa-star" id="stars"></i>
                    <p class="card-text" id="reseñaInfo">${value.comentario}</p>
                    <a class="btn btn-primary"><i class="fa fa-user "></i> ${value.nombre_cliente}</a>
                </div>
            </div>
        </div>`;
    });

    getElementById('comentariosLista').innerHTML = content;
}


// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    
    const paramsx = new URLSearchParams(window.location.search);

    let idProducto = paramsx.get('id_producto');

    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    await readOne(API_PRODUCTO+`?id_detalle=${idProducto}&action=`,null,fillTableProductos)

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









