//@ts-check

//Importar las constantes y metodos de components.js y api_constant.js
import { readRows, searchRows } from "../components.js";
import { SERVER } from "../constants/api_constant.js";
import { getElementById, getFormData, validateExistenceOfUserPublic } from "../constants/functions.js";
//Constantes que establece la comunicación entre la API y el controller utilizando parametros y rutas
const API_PRODUCTO = SERVER + "publica/producto.php?action=";

let datos_categoria = {
    "id": 0
}

// Método manejador de eventos que se ejecuta cuando el documento ha cargado.
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar la existencia de usuario
    await validateExistenceOfUserPublic(false);
});