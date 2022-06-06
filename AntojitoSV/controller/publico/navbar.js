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
const API_PRODUCTO = SERVER + "publica/producto.php?action=";
const API_PRODUCTO_P = SERVER + "privada/producto.php?action=";


let datos_categoria = {
  id: 0,
};

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener("DOMContentLoaded", async () => {
  // Se busca en la URL las variables (parámetros) disponibles.
  let params = new URLSearchParams(location.search);
  // Se obtienen los datos localizados por medio de las variables.
  const ID = params.get("id");
  // Se llama a la función que obtiene los registros para llenar la tabla. Se encuentra en el archivo components.js
  await guardarCategoria(ID);
});

// FUNCION PARA ABRIR CATEGORIAS
// @ts-ignore
async function guardarCategoria(id_categoria) {
  //Captura el id
  datos_categoria.id = id_categoria;
  if(id_categoria){
    //Crea el endpoint
    console.log(datos_categoria.id);
    let APIEndpoint = API_PRODUCTO;
    //Se envian el parametro del id para realizar la busqueda
    let parameters = getFormData(datos_categoria);
    // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(APIEndpoint, null, fillProductos, parameters);    
  } else{
    abrirDescuento();
  }

}

// FUNCION PARA DESCUENTOS
// @ts-ignore
async function abrirDescuento() {
  await readRows(API_PRODUCTO, fillProductos);
}; 

//Metodo para llenar las tablas de datos, utiliza la función readRows()
export function fillProductos(dataset) {
  let content = "";
  // Se recorre el conjunto de registros (dataset) fila por fila a través del objeto row.
  dataset.map((row) => {
    // Se crean y concatenan las filas de la tabla con los datos de cada registro.
    content += ` 
            <div class="col-xl-4 col-md-2 col-lg-4" id="separador">
                <div class="card" id="promociones">
                    <div class="imgBx">
                        <img src="../../api/imagenes/producto/${row.imagen}">
                    </div>
                    <div class="contentBx">
                        <h3>${row.nombre_producto}</h3>
                        <h2 class="precio">$ ${row.precio}</h2>
                        <button class="comprar" name="${row.id_producto}">
                            <i class="fa fa-cart-plus"></i>
                            <a href="detalle_producto.html?id_producto=${row.id_producto}">Pide Ahora</a>
                        </button>
                    </div>
                </div>
            </div>
          `; 
  });
  // Se muestran cada filas de los registros
  getElementById("cuerpo_promo").innerHTML = content;
}
// Método que se ejecuta al enviar un formulario de busqueda
getElementById("search-bar").addEventListener("submit", async (event) => {
  // Se evita recargar la página web después de enviar el formulario.
  event.preventDefault();
  // Se llama a la función que realiza la búsqueda. Se encuentra en el archivo components.js
    await searchRows(API_PRODUCTO_P, "search-bar", fillProductos);
});
