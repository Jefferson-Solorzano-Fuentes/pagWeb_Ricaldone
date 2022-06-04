<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/pedido.php');
require_once('../modelos/detalle_pedido.php');

const READ_ALL = "readAll";
const QUIANTITY_UPDATE = "updateQuantity";
const CREATE = "create";
const STATUS = 'status';
const MESSAGE = 'message';
const DATA_SET = 'dataset';
const EXCEPTION = 'exception';
const SUCESS_RESPONSE = 1;





// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.


if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $pedido = new pedido;
    $detalle_pedido = new detalle_pedido;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET['action']) {
        case READ_ALL:
            if ($result[DATA_SET] = $detalle_pedido->readAll()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case CREATE:
            $_POST = $pedido->validateSpace($_POST);
            if (!$pedido->setDireccion($_POST['direccion'])) {
                $result[EXCEPTION] = 'direccion incorrecta';
            } else if (!$pedido->setDescripcion($_POST['descripcion'])) {
                $result[EXCEPTION] = 'descripcion incorrecta';
            } else if (!$pedido->setCreacion($_POST['fecha_creacion'])) {
                $result[EXCEPTION] = 'fecha creacion incorrecta';
            } else if (!$pedido->setCliente($_POST['cliente_id'])) {
                $result[EXCEPTION] = 'cliente ID incorrecta';
            } elseif ($pedido->createPedido()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'pedido creado existosamente';
                if ($result[DATA_SET] = $pedido->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                }
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case 'updateQuantity':
            $_POST = $pedido->validateSpace($_POST);
            if (!$detalle_pedido->setCantidad($_POST['cantidadProducto'])) {
                $result[EXCEPTION] = 'cantidad incorrecta';
            } elseif (!$detalle_pedido->setId($_POST['idDetallePedido'])) {
                $result[EXCEPTION] = 'id incorrecto';
            } elseif ($detalle_pedido->updateQuantity()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'detalle pedido actualizado existosamente';
                if ($result[DATA_SET] = $pedido->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                    $result[STATUS] = 5;
                }
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case 'delete':
            $_POST = $pedido->validateSpace($_POST);
            if (!$detalle_pedido->setId($_POST['idDetallePedido'])) {
                $result[EXCEPTION] = 'id no seteado';
            } else if ($detalle_pedido->deleteRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'detalle pedido actualizado existosamente';
                if ($result[DATA_SET] = $pedido->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                    $result[STATUS] = 5;
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
