<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/compra_existencia.php');

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
const READ_PRODUCTO = 'readProducto';

const SUCESS_RESPONSE = 1;

// NOMBRES DE PARAMETROS, DEBEN DE SER IGUALES AL ID Y NAME DEL INPUT DE EL FORMULARIO
const COMPRA_EXISTENCIA = 'compra_existencia';
const COMPRA_EXISTENCIA_ID = 'id';
const COMPRA_EXISTENCIA_PRODUCTO = 'producto_id';
const COMPRA_EXISTENCIA_CANTIDAD = 'cantidad';
const COMPRA_EXISTENCIA_FECHA = 'fecha_compra';
const COMPRA_EXISTENCIA_VISIBILIDAD = 'visibilidad';


// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET[ACTION])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $compra_existencia = new Compra_exitencia;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET[ACTION]) {
            //Leer todo
        case READ_ALL:
            if ($result[DATA_SET] = $compra_existencia->readAll()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case SEARCH:
            $_POST = $compra_existencia->validateSpace($_POST);
            if ($_POST[SEARCH] == '') {
                $result[EXCEPTION] = 'Ingrese un valor para buscar';
            } elseif ($result[DATA_SET] = $compra_existencia->searchRows($_POST[SEARCH])) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Valor encontrado';
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay coincidencias';
            }
            break;
        case CREATE:
            $_POST = $compra_existencia->validateSpace($_POST);
            if (!$compra_existencia->setProducto($_POST[COMPRA_EXISTENCIA_PRODUCTO])) {
                $result[EXCEPTION] = 'Producto incorrecto';
            } else if (!$compra_existencia->setCantidad($_POST[COMPRA_EXISTENCIA_CANTIDAD])) {
                $result[EXCEPTION] = 'Cantidad incorrecta';
            } else if (!$compra_existencia->setFecha($_POST[COMPRA_EXISTENCIA_FECHA])) {
                $result[EXCEPTION] = 'Fecha no valido';
            } elseif ($compra_existencia->createRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Compra creada existosamente';
                if ($result[DATA_SET] = $compra_existencia->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                }
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case READ_ONE:
            if (!$compra_existencia->setId($_POST[COMPRA_EXISTENCIA_ID])) {
                $result[EXCEPTION] = 'Empleado incorrecto';
            } elseif ($result[DATA_SET] = $compra_existencia->readOne()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'Empleado inexistente';
            }
            break;
        case UPDATE:
            $_POST = $compra_existencia->validateSpace($_POST);
            if (!$compra_existencia->setId($_POST[COMPRA_EXISTENCIA_ID])) {
                $result[EXCEPTION] = 'id incorrecto';
            } else if (!$compra_existencia->setProducto($_POST[COMPRA_EXISTENCIA_PRODUCTO])) {
                $result[EXCEPTION] = 'Producto incorrecto';
            } else if (!$compra_existencia->setCantidad($_POST[COMPRA_EXISTENCIA_CANTIDAD])) {
                $result[EXCEPTION] = 'Cantidad incorrecta';
            } else if (!$compra_existencia->setFecha($_POST[COMPRA_EXISTENCIA_FECHA])) {
                $result[EXCEPTION] = 'Fecha no valido';
            } elseif ($compra_existencia->updateRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Compra modificada correctamente';
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
            break;
        case DELETE:
            if (!$compra_existencia->setId($_POST[COMPRA_EXISTENCIA_ID])) {
                $result[EXCEPTION] = 'Empleado incorrecto';
            } elseif ($compra_existencia->deleteRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Empleado removido correctamente';
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
            break;
        case READ_PRODUCTO:
            if ($result[DATA_SET] = $compra_existencia->readProducto()) {
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
