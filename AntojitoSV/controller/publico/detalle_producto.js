//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
import {
  readRows,
  saveRow,
  searchRows,
  deleteRow,
  unDeleteRow,
  readOne,
} from "../components.js";
import {
  getElementById,
  validateExistenceOfUserPublic,
} from "../constants/functions.js";
import {
  API_CREATE,
  POST_METHOD,
  API_UPDATE,
  API_SUCESS_REQUEST,
  GET_METHOD,
  SERVER,
} from "../constants/api_constant.js";
import { APIConnection } from "../APIConnection.js";

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_PRODUCTO = SERVER + "publica/producto.php";
const API_COMENTARIO = SERVER + "publica/comentario.php?action=";
const API_CARRITO = SERVER + "publica/carrito.php?action=";

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", async () => {
  validateExistenceOfUserPublic(false);
  const paramsx = new URLSearchParams(window.location.search);
  let idProducto = paramsx.get("id_producto");
  datos_producto.id_producto = parseInt(paramsx.get("id_producto"));

  // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
  await readOne(
    API_PRODUCTO + `?id_detalle=${idProducto}&action=`,
    null,
    fillTableProductos
  );
});

// JSON EN EN CUAL SE GUARDA INFORMACION DE EL TIPO DE EMPLEADO, ESTA INFORMACION
// SE ACTUALIZA CUANDO SE DA CLICK EN ELIMINAR O HACER UN UPDATE, CON LA FUNCION "guardarDatosTipoEmpleado"
let datos_producto = {
  id_detalle: 0,
  id_producto: 0,
  nombre_producto: 0,
  descripcion: 0,
  precio: 0,
};

let datos_comentario = {
  id_detalle: 0,
  id_producto: 0,
  nombre_producto: 0,
  descripcion: 0,
  precio: 0,
};

//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillTableProductos(dataset) {
  // Se muestran cada filas de los registros
  getElementById("tituloProd").innerHTML = dataset.nombre_producto;
  getElementById("prodInfo").innerHTML = dataset.descripcion;
  getElementById("prodPrecio").innerHTML = dataset.precio;
  getElementById("imgProducto").setAttribute("src", dataset.imagen);

  datos_producto.id_producto = dataset.id_producto;

  var comentarios = dataset.comentarios;

  var content = "";

  comentarios.forEach(function (value, key) {
    content =
      content +
      `<div class="col-sm-6">
            <div class="card" id="reseñas">
                <div class="card-body">
                    <p class="card-text" id="reseñaInfo">VALORACION:${value.valoracion}</p>
                    <p class="card-text" id="reseñaInfo">${value.comentario}</p>
                    <a class="btn btn-primary"><i class="fa fa-user "></i> ${value.nombre_cliente}</a>
                </div>
            </div>
        </div>`;
  });

  getElementById("comentariosLista").innerHTML = content;
}

getElementById("agregarACarrito").addEventListener("click", async () => {
  let APIEndpoint = API_CARRITO + "create";
  let parameters = new FormData();

  console.log(datos_producto);
  //@ts-ignore
  parameters.append("producto_id", Number (datos_producto["id_producto"]));
  await APIConnection(APIEndpoint, POST_METHOD, parameters);

});

// EVENTO PARA INSERT
// Método manejador de eventos que se ejecuta cuando se envía el formulario de guardar.
getElementById("insert").addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  //@ts-ignore
  //OBTIENE LOS DATOS DEL FORMULARIO QUE TENGA COMO ID "'insert-modal'"
  let parameters = new FormData(getElementById("insert"));

  //@ts-ignore
  //parameters.append('id', datos_tipo_usuario['id'])
  parameters.append("id_producto", datos_producto["id_producto"]);

  // PETICION A LA API POR MEDIO DEL ENPOINT, Y LOS PARAMETROS NECESARIOS PARA LA INSERSION DE DATOS
  await saveRow(API_COMENTARIO, API_CREATE, parameters, fillTableProductos);
});
