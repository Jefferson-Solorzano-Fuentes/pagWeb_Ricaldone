<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/tipo_empleado.php');

// constants 
const ACTION = 'action'
const STATUS = 'status'
const MESSAGE = 'message'
const EXCEPTION = 'exception'
const DATA_SET = 'dataset'
const SEARCH = 'search' 
const READ_ALL = 'readAll'
const TIPO_EMPLEADO = 'tipo_empleado'
const NOMBRE = 'nombre'
const ID = 'id'
const ID_DETALLE = 'id_detalle'
const SUCESS_RESPONSE = 1


// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET[ACTION])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $tipo_empleado = new tipo_empleado;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET[ACTION]) {
            //Leer todo
        case READ_ALL:
            if ($result[DATA_SET] = $tipo_empleado->readAll()) {
                $result[STATUS] = SUCESS_RESPONSE;
                
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case SEARCH:
            $_POST = $tipo_empleado->validateSpace($_POST);
            if ($_POST[SEARCH] == '') {
                $result[EXCEPTION] = 'Ingrese un valor para buscar';
            } elseif ($result[DATA_SET] = $tipo_empleado->searchRows($_POST[SEARCH])) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Valor encontrado';
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay coincidencias';
            }
            break;
        case 'create':
            $_POST = $tipo_empleado->validateSpace($_POST);
            if (!$tipo_empleado->setNombre($_POST[NOMBRE])) {
                $result[TIPO_EMPLEADO] = 'Nombre incorrecto';
            } elseif ($tipo_empleado->createRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Tipo de empleado creado existosamente';
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case 'readOne':
            if (!$tipo_empleado->setId($_POST[ID])) {
                $result[EXCEPTION] = 'Tipo de empleado incorrecto';
            } elseif ($result[DATA_SET] = $tipo_empleado->readOne()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'Tipo de empleado inexistente';
            }
            break;
        case 'update':
            $_POST = $tipo_empleado->validateSpace($_POST);
            if (!$tipo_empleado->setId($_POST[ID])) {
                $result[EXCEPTION] = 'Categoría incorrecta';
            } elseif (!$data = $tipo_empleado->readOne()) {
                $result[EXCEPTION] = 'Categoría inexistente';
            } elseif (!$tipo_empleado->setNombre($_POST[NOMBRE])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } elseif ($tipo_empleado->updateRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Cantidad modificada correctamente';
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case 'delete':
            if (!$tipo_empleado->setId($_POST[ID_DETALLE])) {
                $result[EXCEPTION] = 'Tipo de empleado incorrecto';
            } elseif ($pedido->deleteDetail()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Tipo de empleado removido correctamente';
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
