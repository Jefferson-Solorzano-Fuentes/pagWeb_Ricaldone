import { APIConnection } from "../APIConnection.js";
import {
    API_CREATE,
    API_READALL,
    GET_METHOD,
    POST_METHOD,
    SERVER,
} from "../constants/api_constant.js";

const API_COMPRA_EXISTENCIA = SERVER + "privada/compra_existencia.php?action=";
const API_REPORTE = SERVER + "privada/pdf.php?action=";

window.createComprasPDF = async () => {
    let APIEndpointrReadFiles = API_COMPRA_EXISTENCIA + "Compras";
    let APIEndpointObtenerUsuarioActual = API_USUARIO + 'getUser';
    let readAllOrderResponse = await APIConnection(APIEndpointrReadFiles, GET_METHOD, null);
    let ObtenerUsuarioActualResponse = await APIConnection(APIEndpointObtenerUsuarioActual, GET_METHOD, null);

    let tableContent = ``;

    readAllOrderResponse.dataset.forEach((element) => {
        tableContent += `
    <tr>
    <td>${element.nombre_producto}</td>
    <td>${element.nombre}</td>
    <td>${element.stock_comprado}</td>
    <td>${element.fecha_compra}</td>
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
                    <th>Nombre del producto</th>
                    <th>Nombre del proveedor</th>
                    <th>Stock</th>
                    <th>Fecha de compra</th>
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

}