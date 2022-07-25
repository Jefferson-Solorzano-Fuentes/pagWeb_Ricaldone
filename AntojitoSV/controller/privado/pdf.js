import { APIConnection } from "../APIConnection.js";
import {
  API_CREATE,
  API_READALL,
  GET_METHOD,
  POST_METHOD,
  SERVER,
} from "../constants/api_constant.js";

let pdfEnpoint = SERVER + "privada/pdf.php?action=";

window.createPDF = async () => {
  let APIEndpoint = pdfEnpoint + API_READALL;
  let readAllOrderResponse = await APIConnection(APIEndpoint, GET_METHOD, null);

  let tableContent = ``;

  readAllOrderResponse.dataset.forEach((element) => {
    tableContent += `
    <td>${element.id_pedido}</td>
    <td>${element.fecha_creacion}</td>
    <td>${element.monto_total}</td>
    <td>${element.nombre_cliente}</td>
    `;
  });

  let orderDetails = `
  <!doctype html>
<html lang="es">

<head>
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
          margin-bottom: 10px;

      }

      #tabla-header img {
          max-width: 40px;
      }

      /*Tabla de datos*/
      #tabla_datos {
          margin-top: 2%;
          margin-bottom: 2%;
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

      #tabla_reporte{
          width: 100%;
          height: 60%;
          
      }

      #tabla_reporte th, td{
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
          <img src="resources/img/comojugar1.png">
      </div>
      <table class="table table-responsive table-bordered" id="tabla_reporte">
          <thead>
              <tr>
                  <th>Código</th>
                  <th>Cantidad</th>
                  <th>Nombre del Producto</th>
                  <th>Precio</th>
              </tr>
          </thead>
          <tbody>
              <td>00001</td>
              <td>2</td>
              <td>Producto 1</td>
              <td>3.00</td>
              <td>00001</td>
              <td>2</td>
              <td>Producto 1</td>
              <td>3.00</td>
              <td>00001</td>
              <td>2</td>
              <td>Producto 1</td>
              <td>3.00</td>
          </tbody>
          <tr>
              <th colspan="3">Total</th>
              <td id="total">3.00</td>
          </tr>
      </table>
  </div>
  </main>
</body>

</html>
  `;

  var opt = {
    margin: 1,
    filename: "Reporte.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };
  let buffer = await html2pdf()
    .set(opt)
    .from(orderDetails)
    .outputPdf("arraybuffer");

  let parameters = new FormData();

  const blob = new Blob([buffer]);

  parameters.append("pdf", blob);

  let res = await APIConnection(
    pdfEnpoint + API_CREATE,
    POST_METHOD,
    parameters
  );
  console.log(res);
};
