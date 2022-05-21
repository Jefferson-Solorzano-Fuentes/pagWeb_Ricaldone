<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/detalle_pedido.php');

// constants 
const ACTION = 'action';
const STATUS = 'status';
const MESSAGE = 'message';
const EXCEPTION = 'exception';
const DATA_SET = 'dataset';
const SEARCH = 'search';
const READ_ALL = 'readAll';
const READ_ONE = 'readOne';
const CREATE = 'create';
const UPDATE = 'update';
const DELETE = 'delete';
const UNDELETE = 'unDelete';
const READ_PEDIDO = 'readPedido';
const READ_PRODUCTO = 'readProducto';
const SUCESS_RESPONSE = 1;

// NOMBRES DE PARAMETROS, DEBEN DE SER IGUALES AL ID Y NAME DEL INPUT DE EL FORMULARIO
const DETALLE_PEDIDO = 'detalle_pedido';
const DETALLE_PEDIDO_ID = 'id';
const DETALLE_PEDIDO_PEDIDO = 'pedido_id';
const DETALLE_PEDIDO_PRODUCTO = 'producto_id';
const DETALLE_PEDIDO_CANTIDAD = 'cantidad';
const DETALLE_PEDIDO_SUBTOTAL = 'subtotal';
const DETALLE_PEDIDO_VISIBILIDAD = 'visibilidad';

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET[ACTION])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $detalle_pedido = new detalle_pedido;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET[ACTION]) {
            //Leer todo
        case READ_ALL:
            if ($result[DATA_SET] = $detalle_pedido->readAll()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case SEARCH:
            $_POST = $detalle_pedido->validateSpace($_POST);
            if ($_POST[SEARCH] == ' ') {
                $result[EXCEPTION] = 'Ingrese un valor para buscar';
            } elseif (!$detalle_pedido->setPedido($_POST[SEARCH])) {
                $result[EXCEPTION] = 'identificador Comentario incorrecto';
            } elseif ($result[DATA_SET] = $detalle_pedido->searchRows($_POST[SEARCH])) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Valor encontrado';
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay coincidencias';
            }
            break;
            /*case CREATE:
            $_POST = $comentario->validateSpace($_POST);
            if (!$comentario->setComentario($_POST[COMENTARIO_DESCRIPCION])) {
                $result[EXCEPTION] = 'Comentario incorrecto';
            } else if (!$comentario->setCliente($_POST[COMENTARIO_CLIENTE])) {
                $result[EXCEPTION] = 'Cliente incorrecto';
            } else if (!$comentario->setProducto($POST[COMENTARIO_PRODUCTO])) {
                $result[EXCEPTION] = 'Empleado no valido';
            } elseif ($empleado->createRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Empleado creado existosamente';
                if ($result[DATA_SET] = $compra_existencia->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                    if ($result[DATA_SET] = $compra_existencia->readAll()) {
                        $result[STATUS] = SUCESS_RESPONSE;
                    } else {
                        $result[EXCEPTION] = 'No hay datos registrados';
                    }
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                }
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;*/
        case READ_ONE:
            if (!$detalle_pedido->setId($_POST[DETALLE_PEDIDO_ID])) {
                $result[EXCEPTION] = 'identificador Comentario incorrecto';
            } elseif ($result[DATA_SET] = $detalle_pedido->readOne()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'Detalle de pedido inexistente';
            }
            break;
            /*case UPDATE:
            $_POST = $comentario->validateSpace($_POST);
            if (!$comentario->setId($_POST[COMENTARIO_ID])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } else if (!$comentario->setComentario($_POST[COMENTARIO_DESCRIPCION])) {
                $result[EXCEPTION] = 'Comentario incorrecto';
            } else if (!$comentario->setCliente($_POST[COMENTARIO_CLIENTE])) {
                $result[EXCEPTION] = 'Cliente incorrecto';
            } else if (!$comentario->setProducto($POST[COMENTARIO_PRODUCTO])) {
                $result[EXCEPTION] = 'Empleado no valido';
            } else if ($comentario->updateRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Cantidad modificada correctamente';
                if ($result[DATA_SET] = $compra_existencia->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                }
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;*/
        case DELETE:
            if (!$detalle_pedido->setId($_POST[DETALLE_PEDIDO_ID])) {
                $result[EXCEPTION] = 'Detalle de Pedido incorrecto';
            } elseif ($detalle_pedido->deleteRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Detalle de Pedido removido correctamente';
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case UNDELETE:
            if (!$detalle_pedido->setId($_POST[DETALLE_PEDIDO_ID])) {
                $result[EXCEPTION] = 'Detalle de Pedido incorrecto';
            } elseif ($detalle_pedido->unDeleteRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Detall de Pedido reactivado correctamente';
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case READ_PEDIDO:
            if ($result[DATA_SET] = $detalle_pedido->readPedido()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case READ_PRODUCTO:
            if ($result[DATA_SET] = $detalle_pedido->readProducto()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
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
