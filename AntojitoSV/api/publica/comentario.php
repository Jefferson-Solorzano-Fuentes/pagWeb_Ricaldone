<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/comentario.php');


// constants 
const ACTION = 'action';
const STATUS = 'status';
const MESSAGE = 'message';
const EXCEPTION = 'exception';
const DATA_SET = 'dataset';
const SEARCH = 'search';
const READ_ALL = 'readAll';
const READ_CATEGORIES = 'readCategories';
const SUCESS_RESPONSE = 1;
const CREATE = 'create';
const READ_ONE = 'readOne';
const ID_DETALLE = 'id_detalle';


// NOMBRES DE PARAMETROS, DEBEN DE SER IGUALES AL ID Y NAME DEL INPUT DE EL FORMULARIO
const COMENTARIO_ID = 'cliente';
const COMENTARIO = 'comentario';
const CLIENTE_ID = 'id_cliente';
const PRODUCTO_ID = 'id_producto';
const VISIBILIDAD = 'visibilidad';
const VALORACIONES = 'valoraciones';




// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET[ACTION])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $comentario = new comentario;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET[ACTION]) {
            //create
            case CREATE:
                $_POST = $comentario->validateSpace($_POST);
                if (!$comentario->setComentario($_POST[COMENTARIO])) {
                    $result[EXCEPTION] = 'Nombre incorrecto';
                }  else if (!$comentario->setProducto($_POST[PRODUCTO_ID])) {
                    $result[EXCEPTION] = 'Producto no valido';
                } else if (!$comentario->setValoracion($_POST[VALORACIONES])) {
                    $result[EXCEPTION] = 'Valoracion no valida';
                } elseif ($comentario->createRow()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                    $result[MESSAGE] = 'Comentario creado existosamente';
                    if ($result[DATA_SET] = $comentario->readAll()) {
                        $result[STATUS] = SUCESS_RESPONSE;
                    } else {
                        $result[EXCEPTION] = 'No hay datos registrados';
                    }
                } else {
                    $result[EXCEPTION] = Database::getException();
                }
                break;
        default:
            $result[EXCEPTION] = 'Acción no disponible dentro de la sesión';
    }
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
