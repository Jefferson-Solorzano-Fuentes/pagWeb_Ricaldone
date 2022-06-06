//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow } from "../components.js";
import {
  SERVER,
  API_CREATE,
  POST_METHOD,
  GET_METHOD,
  API_SUCESS_REQUEST,
} from "../constants/api_constant.js";
import {
  getElementById,
  validateExistenceOfUserPublic,
} from "../constants/functions.js";
import { APIConnection } from "../APIConnection.js";

let dataSetArray;

//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_CARRITO = SERVER + "publica/carrito.php?action=";

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", async () => {
  //Validar que el usuario este en sesión
  validateExistenceOfUserPublic(true);

  await readRows(API_CARRITO, fillCarrito);
});

//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillCarrito(dataset) {
  let content = "";

  //obteniendo los elementos del carrito actual
  dataSetArray = dataset;
  // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
  dataset.map((row) => {
    let priceProduct = row.precio;
    // Se crean y concatenan las filas de la tabla con los datos de cada registro.
    content += `
            <tr>
                <td> <img src="../../api/imagenes/producto/${row.imagen}" width=100></td>
                <td>${row.nombre_producto}</td>
                <td> <p id="${row.id_detalle_pedido}subTotal">$ ${priceProduct}</p></td>
                <p class="prodCantidad">Cantidad: <input type="number" id="${row.id_detalle_pedido}quantity" onkeypress = "updateSubtotal('${row.id_detalle_pedido}', ${priceProduct})" value="1" name="">
                <button class="eliminar btn-primary" onclick="deleteDetalePedido('${row.id_detalle_pedido}')">
                    <i class="fa fa-trash" id="eliminarIcon"></i>
                    Eliminar
                </button>
            </tr>
        `;
  });
  getElementById("itemsCarrito").innerHTML = content;
}

//@ts-ignore
window.updateSubtotal = (id_detalle_pedido, priceProduct) => {
  //@ts-ignore
  getElementById(id_detalle_pedido + "subTotal").innerHTML =
  //@ts-ignore
   "$ " +( getElementById(id_detalle_pedido + "quantity").value * priceProduct);
};

//@ts-ignore
window.deleteDetalePedido = async (idDetallePedido) => {
  let APIEndpointDeleteDetallePedido = API_CARRITO + 'delete'
  let parameters = new FormData()
  parameters.append('idDetallePedido',idDetallePedido)

  let response = await APIConnection(APIEndpointDeleteDetallePedido, POST_METHOD, parameters);
}

function getTodayDate() {
  var todayDate = new Date();

  var today = new Date(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate()
  );
  //@ts-ignore
  return dateFns.format(today, "YYYY-MM-DD");
}

getElementById("createPedidoFom").addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("HI");

  let APIUpdateQuantityEndpoint = API_CARRITO + "updateQuantity";
  let APICreatePedidoEndpoint = API_CARRITO + API_CREATE;
  let APIGetCurrentClient = SERVER + "publica/usuario.php?action=" + "getUser";

  for (let detallePedido of dataSetArray) {
    //@ts-ignore
    let cantidad = getElementById(detallePedido.id_detalle_pedido + "quantity").value;
    let parameters = new FormData();
    //@ts-ignore
    parameters.append("cantidadProducto", cantidad);
    parameters.append("idDetallePedido", detallePedido.id_detalle_pedido);

    await APIConnection(APIUpdateQuantityEndpoint, POST_METHOD, parameters);
  }

  let clientInformation = await APIConnection(
    APIGetCurrentClient,
    GET_METHOD,
    null
  );

  //@ts-ignore
  let parameters = new FormData(getElementById("createPedidoFom"));
  parameters.append("fecha_creacion", getTodayDate());
  parameters.append("cliente_id", clientInformation.id_cliente);

  // Petición para revisar si el administrador se encuentra registrado.
  let APIResponse = await APIConnection(
    APICreatePedidoEndpoint,
    POST_METHOD,
    parameters
  );

  $("#pedidoModal").modal("hide");
  if (APIResponse.status == API_SUCESS_REQUEST) {
    $("#modalSuccess").modal("show");
    return;
  }

  $("#error_proceso").modal("show");
});
