//Importar las constantes y metodos de components.js y api_constant.js
// @ts-ignore
import { readRows, saveRow, searchRows, deleteRow, generatePDF, obtenerFechaActual } from "../components.js";
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
const API_REPORTE = SERVER + "privada/pdf.php?action=";
const API_USUARIO = SERVER + "publica/usuario.php?action="

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", async () => {
  //Validar que el usuario este en sesión
  validateExistenceOfUserPublic(true);

  await readRows(API_CARRITO, fillCarrito);
});

//Metodo para llenar las tablas de datos, utiliza la función readRows()
export async function fillCarrito(dataset) {
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
                <td> <p id="${row.id_detalle_pedido}subTotal">$ ${row.precio}</p></td>
                <p class="prodCantidad">Cantidad: <input type="number" id="${row.id_detalle_pedido}quantity" onkeypress = "updateSubtotal('${row.id_detalle_pedido}', ${priceProduct})" value="${row.cantidad ?? 1}" >
                <button class="eliminar btn-primary" onclick="deleteDetalePedido('${row.id_detalle_pedido}')">
                    <i class="fa fa-trash" id="eliminarIcon"></i>
                    Eliminar
                </button>
            </tr>
        `;
  });
  getElementById("itemsCarrito").innerHTML = content;
  getSubtotalPedido()
  getElementById('pedidoTotal').innerHTML = String( await getOrderTotal())


}

//@ts-ignore
window.updateSubtotal = async (id_detalle_pedido, priceProduct) => {
  let APIUpdateQuantityEndpoint = API_CARRITO + "updateQuantity";
//@ts-ignore
  let cantidad = getElementById(id_detalle_pedido + "quantity").value;
  let parameters = new FormData();

  getElementById(id_detalle_pedido + "subTotal").innerHTML =  "$ " + cantidad * priceProduct;

  parameters.append("cantidadProducto", cantidad);
  parameters.append("idDetallePedido", id_detalle_pedido);
  parameters.append("subTotalDetallePedido", String(cantidad * priceProduct));
  await APIConnection(APIUpdateQuantityEndpoint, POST_METHOD, parameters);

  getElementById('pedidoTotal').innerHTML = String( await getOrderTotal())
};



//@ts-ignore
 function getSubtotalPedido(setSubTotalPedido) {
  let getSubtotalPedido = 0;
  dataSetArray.forEach((element) => {
    getElementById(element.id_detalle_pedido + "subTotal").innerHTML = element.subtotal ?? element.precio
      getSubtotalPedido += Number(
        //@ts-ignore
        getElementById(element.id_detalle_pedido + "quantity").value *
          element.precio
      );
    
  });
}

//@ts-ignore
window.deleteDetalePedido = async (idDetallePedido) => {
  let APIEndpointDeleteDetallePedido = API_CARRITO + "delete";
  let parameters = new FormData();
  parameters.append("idDetallePedido", idDetallePedido);

  await APIConnection(APIEndpointDeleteDetallePedido, POST_METHOD, parameters); 
};


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

async function getOrderTotal(){
  let pedidoTotal = 0
  let getShoppingCart = await APIConnection(API_CARRITO + 'readAll', GET_METHOD, null)
  getShoppingCart.dataset.forEach(element => {
    pedidoTotal += Number(element.subtotal)
  })

  console.log(pedidoTotal)

  return pedidoTotal
}

getElementById("btnPedidoModal").addEventListener("click", () => {
  $("#pedidoModal").modal("show");
});

getElementById("createPedidoFom").addEventListener("submit", async (event) => {
  event.preventDefault();

  let APICreatePedidoEndpoint = API_CARRITO + "createPedido";
    //@ts-ignore
  let parameters = new FormData(getElementById("createPedidoFom"));



  parameters.append("fecha_creacion", getTodayDate());
  //@ts-ignore
  parameters.append('total',await getOrderTotal())

  let APIResponse = await APIConnection(
    APICreatePedidoEndpoint,
    POST_METHOD,
    parameters
  );


  if (APIResponse.status == API_SUCESS_REQUEST) {
    $("#modalSuccess").modal("show");
    return;
  }
  $("#error_proceso").modal("show");
});


// GENERACION DE PDF
window.createCarritoPDF = async () => {
  let APIEndpointrReadFiles = API_REPORTE + "factura";
  let APIEndpointObtenerUsuarioActual = API_USUARIO + 'getUser';
  let readAllOrderResponse = await APIConnection(APIEndpointrReadFiles, GET_METHOD, null);
  let ObtenerUsuarioActualResponse = await APIConnection(APIEndpointObtenerUsuarioActual, GET_METHOD, null);

  let tableContent = ``;

  readAllOrderResponse.dataset.forEach((element) => {
    tableContent += `
    <tr>
    <td>${element.id_pedido}</td>
    <td>${element.cantidad}</td>
    <td>${element.nombre_producto}</td>
    <td>${element.subtotal}</td>
    </tr>
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
            <a>Factura</a>
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
                <th>Nombre cliente:</th>
                <td>${readAllOrderResponse.dataset[0].nombre_cliente}</td>
            </tr>
                <tr>
                    <th>Codigo</th>
                    <th>Cantidad</th>
                    <th>Nombre del Producto</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
               ${tableContent}
            </tbody>
            <tr>
                <th>Total</th>
                <td id="total">${readAllOrderResponse.dataset[0].monto_total}</td>
            </tr>
        </table>
    </div>
    </main>
</body>

</html>`;

 let res = await generatePDF(generatedHTML,"factura_" + readAllOrderResponse.dataset[0].id_pedido + ".pdf");
 window.open("../../api/reportes/privado/" + "factura_" + readAllOrderResponse.dataset[0].id_pedido + ".pdf");
}