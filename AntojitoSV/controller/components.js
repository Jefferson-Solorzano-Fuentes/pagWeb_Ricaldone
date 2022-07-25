//Importar las constantes y metodos de components.js y api_constant.js
import { APIConnection } from "./APIConnection.js";
import {
  API_READALL,
  API_SEARCH,
  API_SUCESS_REQUEST,
  GET_METHOD,
  POST_METHOD,
  API_DELETE,
  API_READONE,
  API_UNDELETE,
  SERVER,
} from "./constants/api_constant.js";
import { getElementById } from "./constants/functions.js";

// FUNCIÓN PARA LEER REGISTROS
export async function readRows(ENDPOINT, fillrows) {
  //Aqui se define el endpoint de readAll
  let APIEndpoint = ENDPOINT + API_READALL;
  //Se hace la consulta a la base de datos mediante la función APIConnections
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  //Utilizar la respuesta del api para realizar funciones
  if (APIResponse.status == API_SUCESS_REQUEST) {
    //Realiza la función de llenado de tablas respectivo
    fillrows(APIResponse.dataset);
    //Retorna y termina con la función
    return;
  }
  // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
}

// FUNCIÓN PARA BUSCAR REGISTROS
// parametros, el endpoint, el id del formulario de busqueda, la función de llenar tablas, los parametros de el formulario en json
export async function searchRows(ENDPOINT, formID, fillrows, parametersJson) {
  //Aqui se define el endpoint de searchRow
  let APIEndpoint = ENDPOINT + API_SEARCH;
  // Se verifica de que forma realizara la consulta, si se utiliza formulario para la consulta se utiliza formID, de lo contrario los parametros en JSON
  let parameters = formID
    ? new FormData(getElementById(formID))
    : parametersJson;
  //Se hace la consulta a la base de datos mediante la función APIConnections
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
  //Utilizar la respuesta del api para realizar funciones
  if (APIResponse.status == API_SUCESS_REQUEST) {
    //Realiza la función de llenado de tablas respectivo
    fillrows(APIResponse.dataset);
    // dado caso este if se ejecute con "return" hara que hasta este punto llegue el codigo
    return;
  }
}

// FUNCIÓN PARA GUARDAR REGISTROS
// parametros, el endpoint,la acción (si es update o insert) ,la información del formularios, la función de llenar tablas
export async function saveRow(ENDPOINT, ACTION, parameters, fillrows) {
  //Aqui se define el endpoint de updateRow o createRow, dependiendo del valor ACTION
  let APIEndpoint = ENDPOINT + ACTION;
  //Se hace la consulta a la base de datos mediante la función APIConnections
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
  // validando respuesta
  if (APIResponse.status == API_SUCESS_REQUEST) {
    //Realiza la función de llenado de tablas respectivo
    fillrows(APIResponse.dataset);
    //Mostrar mensaje de exito
    $("#guardado").modal("show");
    //Retorna y termina con la función
    return;
  }
  //En caso de fracaso se abrira un modal de error
  $("#error_proceso").modal("show");
}

// FUNCIÓN PARA ELIMINAR REGISTROS
// parametros, el endpoint, la información del formularios, la función de llenar tablas
export async function deleteRow(ENDPOINT, parameters, fillrows) {
  //Aqui se define el endpoint de deleteRow
  let APIEndpoint = ENDPOINT + API_DELETE;
  //Se hace la consulta a la base de datos mediante la función APIConnections
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
  //Se valida que la consulta de una respuesta positiva
  if (APIResponse.status == API_SUCESS_REQUEST) {
    //Realiza la función de llenado de tablas respectivo
    fillrows(APIResponse.dataset);
    //Mostrar mensaje de exito
    $("#eliminado").modal("show");
    //Retorna y termina con la función
    return;
  }
  //En caso de fracaso se abrira un modal de error
  $("#error_proceso").modal("show");
}

// FUNCIÓN PARA CONSULTAR LA INFORMACIÓN DE UN REGISTRO
// parametros, el endpoint, la información del formularios, la función de llenar tablas
export async function readOne(ENDPOINT, parameters, fillrows) {
  //Aqui se define el endpoint de readOne
  let APIEndpoint = ENDPOINT + API_READONE;
  //Se hace la consulta a la base de datos mediante la función APIConnections
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
  //Se valida que la consulta de una respuesta positiva
  if (APIResponse.status == API_SUCESS_REQUEST) {
    //Realiza la función de llenado de tablas respectivo
    fillrows(APIResponse.dataset);
    //Retorna y termina con la función
    return;
  }
}

// FUNCIÓN PARA RESTABLECER DATOS DE UN REGISTROS
// parametros, el endpoint, la información del formularios, la función de llenar tablas
export async function unDeleteRow(ENDPOINT, parameters, fillrows) {
  //Aqui se define el endpoint de undelete
  let APIEndpoint = ENDPOINT + API_UNDELETE;
  //Se hace la consulta a la base de datos mediante la función APIConnections
  let APIResponse = await APIConnection(APIEndpoint, POST_METHOD, parameters);
  //Se valida que la consulta de una respuesta positiva
  if (APIResponse.status == API_SUCESS_REQUEST) {
    //Realiza la función de llenado de tablas respectivo
    fillrows(APIResponse.dataset);
    //Retorna y termina con la función
    return;
  }
  //En caso de fracaso se abrira un modal de error
  $("#error_proceso").modal("show");
}

//Función para generar un gráfico de barras verticales. Requiere el archivo chart.js. Para más información https://www.chartjs.org/*
//Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), legend (etiqueta para los datos) y title (título del gráfico).

export function barGraph(canvas, xAxis, yAxis, legend, title) {
  // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
  let colors = [];
  // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
  xAxis.map(() => {
    colors.push("#" + Math.random().toString(16).substring(2, 8));
  });
  // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
  const context = getElementById(canvas).getContext("2d");
  // Se crea una instancia para generar el gráfico con los datos recibidos.
  const chart = new Chart(context, {
    type: "bar",
    data: {
      labels: xAxis,
      datasets: [
        {
          label: legend,
          data: yAxis,
          borderWidth: 1,
          backgroundColor: [
            "rgba(229, 177, 37, 1)",
            "rgba(163, 55, 55, 1)",
            "rgba(211, 175, 211, 1)",
            "rgba(214, 145, 81, 1)",
            "rgba(255, 102, 255, 0.2)",
            "rgba(146, 185, 220, 1)",
          ],
          barPercentage: 1,
        },
      ],
    },
    options: {
      aspectRatio: 1,
      plugins: {
        title: {
          display: true,
          text: title,
        },
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            beginAtZero: true,
            stepSize: 1,
          },
        },
      },
    },
  });
}

//Función para generar un gráfico de barras verticales. Requiere el archivo chart.js. Para más información https://www.chartjs.org/*
//Parámetros: canvas (identificador de la etiqueta canvas), xAxis (datos para el eje X), yAxis (datos para el eje Y), legend (etiqueta para los datos) y title (título del gráfico).

export function lineGraph(canvas, xAxis, yAxis, legend, title) {
  // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
  let colors = [];
  // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
  xAxis.map(() => {
    colors.push("#" + Math.random().toString(16).substring(2, 8));
  });
  // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
  const context = getElementById(canvas).getContext("2d");
  // Se crea una instancia para generar el gráfico con los datos recibidos.
  const chart = new Chart(context, {
    type: "line",
    data: {
      labels: xAxis,
      datasets: [
        {
          label: legend,
          data: yAxis,
          borderColor: "#AE4747",
          borderWidth: 1,
          backgroundColor: [
            "rgba(229, 177, 37, 1)",
            "rgba(163, 55, 55, 1)",
            "rgba(211, 175, 211, 1)",
            "rgba(214, 145, 81, 1)",
            "rgba(255, 102, 255, 0.2)",
            "rgba(146, 185, 220, 1)",
          ],
          barPercentage: 1,
        },
      ],
    },
    options: {
      aspectRatio: 1,
      plugins: {
        title: {
          display: true,
          text: title,
        },
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          ticks: {
            beginAtZero: true,
            stepSize: 1,
          },
        },
      },
    },
  });
}

//Función para generar un gráfico de pastel. Requiere el archivo chart.js. Para más información https://www.chartjs.org/
//Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título del gráfico).

export function pieGraph(canvas, legends, values, title) {
  // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
  let colors = [];
  // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
  values.map(() => {
    colors.push("#" + Math.random().toString(16).substring(2, 8));
  });
  // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
  const context = document.getElementById(canvas).getContext("2d");
  // Se crea una instancia para generar el gráfico con los datos recibidos.
  const chart = new Chart(context, {
    type: "pie",
    data: {
      labels: legends,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "rgba(229, 177, 37, 1)",
            "rgba(163, 55, 55, 1)",
            "rgba(211, 175, 211, 1)",
            "rgba(214, 145, 81, 1)",
            "rgba(255, 102, 255, 0.2)",
            "rgba(146, 185, 220, 1)",
          ],
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
    },
  });
}

//Función para generar un gráfico de dona. Requiere el archivo chart.js. Para más información https://www.chartjs.org/
//Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título del gráfico).

export function doughnutGraph(canvas, legends, values, title) {
  // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
  let colors = [];
  // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
  values.map(() => {
    colors.push("#" + Math.random().toString(16).substring(2, 8));
  });
  // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
  const context = getElementById(canvas).getContext("2d");
  // Se crea una instancia para generar el gráfico con los datos recibidos.
  const chart = new Chart(context, {
    type: "doughnut",
    data: {
      labels: legends,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "rgba(229, 177, 37, 1)",
            "rgba(163, 55, 55, 1)",
            "rgba(211, 175, 211, 1)",
            "rgba(214, 145, 81, 1)",
            "rgba(255, 102, 255, 0.2)",
            "rgba(146, 185, 220, 1)",
          ],
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
    },
  });
}

//Función para generar un gráfico de dona. Requiere el archivo chart.js. Para más información https://www.chartjs.org/
//Parámetros: canvas (identificador de la etiqueta canvas), legends (valores para las etiquetas), values (valores de los datos) y title (título del gráfico).

export function polarAreaGraph(canvas, legends, values, title) {
  // Se declara un arreglo para guardar códigos de colores en formato hexadecimal.
  let colors = [];
  // Se generan códigos hexadecimales de 6 cifras de acuerdo con el número de datos a mostrar y se agregan al arreglo.
  values.map(() => {
    colors.push("#" + Math.random().toString(16).substring(2, 8));
  });
  // Se establece el contexto donde se mostrará el gráfico, es decir, se define la etiqueta canvas a utilizar.
  const context = getElementById(canvas).getContext("2d");
  // Se crea una instancia para generar el gráfico con los datos recibidos.
  const chart = new Chart(context, {
    type: "polarArea",
    data: {
      labels: legends,
      datasets: [
        {
          data: values,
          backgroundColor: [
            "rgba(229, 177, 37, 1)",
            "rgba(163, 55, 55, 1)",
            "rgba(211, 175, 211, 1)",
            "rgba(214, 145, 81, 1)",
            "rgba(255, 102, 255, 0.2)",
            "rgba(146, 185, 220, 1)",
          ],
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
    },
  });
}

// SE TIENE QUE PASAR EL HTML QUE SE QUIERE IMPRIMIR A PDF
export async function generatePDF(stingHTML,nombreReporte) {
  let APIEndpointCreatePDF = SERVER + "privada/pdf.php?action=create_pdf";
  // OPCIONES PARA LA GENERACION DE EL PDF
  var opt = {
    margin: 1,
    filename: "Reporte.pdf",
    image: { type: "jpeg", quality: 1 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  // OBTENIENDO BUFFER QUE RETORNA EL METODO
  let buffer = await html2pdf()
    .set(opt)
    .from(stingHTML)
    .outputPdf("arraybuffer");

  // CONVIRTIENDO "BUFFER" A "BLOB"
  const blob = new Blob([buffer]);

  let parameters = new FormData();

  parameters.append("pdf", blob);
  parameters.append("nombreReporte", nombreReporte);


 await APIConnection(APIEndpointCreatePDF, POST_METHOD, parameters);

}

// OBTIENE LA FECHA DE HOY
export function obtenerFechaActual() {
  const tiempoTranscurrido = Date.now();
  const hoy = new Date(tiempoTranscurrido);

  return hoy.toLocaleDateString();
}
