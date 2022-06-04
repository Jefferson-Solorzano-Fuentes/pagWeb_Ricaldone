//@ts-check
//Importar las constantes y metodos de components.js y api_constant.js
import { readRows, searchRows } from "../components.js";
import { SERVER } from "../constants/api_constant.js";
import {
  getElementById,
  getFormData,
  validateExistenceOfUserPublic,
} from "../constants/functions.js";
//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_CATEGORIA = SERVER + "publica/categoria.php?action=";

let datos_categoria = {
  id: 0,
};

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", async () => {
  validateExistenceOfUserPublic(null);
  // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
  await readRows(API_CATEGORIA, fillCategorias);
});


//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillCategorias(dataset) {
    let content = "";
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map((row) => {
      // Se crean y concatenan las filas de la tabla con los datos de cada registro.
      content += ` 
      <div class="col-3">
      <!-- Contenedor individual de los productos -->
      <div class="container text-center">
          <div class="row">
              <div class="col-10" id="colImg">
                <img src="../../api/imagenes/categoria/${row.imagen}">
              </div>
              <div class="col-10">
                  <a href="categoria.html" id="hyperlink">
                      <h3>${row.nombre_categoria}</h3>
                  </a>
              </div>
          </div>
      </div>
        </div>
            `;
    });
    // Se muestran cada filas de los registros
    getElementById("cuerpo_promo").innerHTML = content;
  }