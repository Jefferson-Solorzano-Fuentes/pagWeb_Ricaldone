//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
import { readRows, searchRows } from "../components.js";
import { SERVER } from "../constants/api_constant.js";
import { getElementById, getFormData } from "../constants/functions.js";
//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_PRODUCTO = SERVER + "publica/producto.php?action=";

let datos_categoria = {
    "id": 0
}

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
    await readRows(API_PRODUCTO, fillProductos)
});

// FUNCION PARA ABRIR CATEGORIAS
// @ts-ignore
window.guardarCategoria = async (id_categoria) => {
    //Captura el id 
    datos_categoria.id = id_categoria
    //Crea el endpoint
    let APIEndpoint = API_PRODUCTO;
    console.log(datos_categoria);
    //Se envian el parametro del id para realizar la busqueda
    let parameters = getFormData(datos_categoria)
    console.log(parameters)
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(APIEndpoint, null, fillProductos, parameters);
}

// FUNCION PARA DESCUENTOS
// @ts-ignore
window.abrirDescuento = async() => {
    await readRows(API_PRODUCTO, fillProductos);
}


//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillProductos(dataset) {
    let content = "";
    // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
    dataset.map((row) => {
      // Se crean y concatenan las filas de la tabla con los datos de cada registro.
      content += ` 
            <div class="col-xl-4 col-md-2 col-lg-4" id="separador">
                <div class="card">
                    <div class="imgBx">
                        <img src="../../api/imagenes/producto/${row.imagen}">
                    </div>
                    <div class="contentBx">
                        <h3>${row.nombre_producto}</h3>
                        <h2 class="precio">$ ${row.precio}</h2>
                        <button class="comprar" >
                            <i class="fa fa-cart-plus"></i>
                            <a href="detalle_producto.html">Pide Ahora</a>
                        </button>
                    </div>
                </div>
            </div>
          `;

    });
    console.log(content);    
    // Se muestran cada filas de los registros
    getElementById("cuerpo_promo").innerHTML = content;
  }
  