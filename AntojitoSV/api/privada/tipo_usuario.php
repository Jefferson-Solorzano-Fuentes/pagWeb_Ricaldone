<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/tipo_usuario.php');

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
const SUCESS_RESPONSE = 1;

// NOMBRES DE PARAMETROS, DEBEN DE SER IGUALES AL ID Y NAME DEL INPUT DE EL FORMULARIO
const TIPO_USUARIO = 'tipo_usuario';
const NOMBRE_TIPO_EMPLEADO = 'nombre_tipo_usuario';
const TIPO_USUARIO_ID = 'id';

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET[ACTION])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $tipo_usuario = new tipo_usuario;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET[ACTION]) {
            //Leer todo
        case READ_ALL:
            if ($result[DATA_SET] = $tipo_usuario->readAll()) {
                $result[STATUS] = SUCESS_RESPONSE;
                
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case SEARCH:
            $_POST = $tipo_usuario->validateSpace($_POST);
            if ($_POST[SEARCH] == '') {
                $result[EXCEPTION] = 'Ingrese un valor para buscar';
            } elseif ($result[DATA_SET] = $tipo_usuario->searchRows($_POST[SEARCH])) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Valor encontrado';
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay coincidencias';
            }
            break;
        case CREATE:
            $_POST = $tipo_usuario->validateSpace($_POST);
            if (!$tipo_usuario->setNombre($_POST[NOMBRE_TIPO_EMPLEADO])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } elseif ($tipo_usuario->createRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Tipo de empleado creado existosamente';
                if ($result[DATA_SET] = $tipo_usuario->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE; 
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                }
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case READ_ONE:
            if (!$tipo_usuario->setId($_POST)) {
                $result[EXCEPTION] = 'Tipo de empleado incorrecto';
            } elseif ($result[DATA_SET] = $tipo_usuario->readOne()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'Tipo de empleado inexistente';
            }
            break;
        case UPDATE:
            $_POST = $tipo_usuario->validateSpace($_POST);
            if (!$tipo_usuario->setId($_POST[TIPO_USUARIO_ID])) {
                $result[EXCEPTION] = 'Tipo Usuario incorrecta';
            } elseif (!$tipo_usuario->setNombre($_POST[NOMBRE_TIPO_EMPLEADO])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } elseif ($tipo_usuario->updateRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Cantidad modificada correctamente';
                if ($result[DATA_SET] = $tipo_usuario->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                }
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case DELETE:
            if (!$tipo_usuario->setId($_POST[TIPO_USUARIO_ID])) {
                $result[EXCEPTION] = 'Tipo de empleado incorrecto';
            } elseif ($tipo_usuario->deleteRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Tipo de empleado removido correctamente';
                if ($result[DATA_SET] = $tipo_usuario->readAll()) {
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
