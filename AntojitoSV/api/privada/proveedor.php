<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/proveedor.php');

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
const PROVEEDOR = 'proveedor';
const PROVEEDOR_ID = 'id';
const PROVEEDOR_NOMBRE = 'nombre_proveedor';
const PROVEEDOR_TELEFONO = 'telefono';
const PROVEEDOR_CORREO = 'correo_proveedor';
const PROVEEDOR_DIRECCION = 'direccion';
const PROVEEDOR_ESTADO = 'estado';


// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET[ACTION])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $proveedor = new proveedor;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET[ACTION]) {
            //Leer todo
        case READ_ALL:
            if ($result[DATA_SET] = $proveedor->readAll()) {
                $result[STATUS] = SUCESS_RESPONSE;
                
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case SEARCH:
            $_POST = $proveedor->validateSpace($_POST);
            if ($_POST[SEARCH] == '') {
                $result[EXCEPTION] = 'Ingrese un valor para buscar';
            } elseif ($result[DATA_SET] = $proveedor->searchRows($_POST[SEARCH])) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Valor encontrado';
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay coincidencias';
            }
            break;
        case CREATE:
            $_POST = $proveedor->validateSpace($_POST);
            if (!$proveedor->setNombre($_POST[PROVEEDOR_NOMBRE])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } else if (!$proveedor->setTelefono($_POST[PROVEEDOR_TELEFONO])){
                $result[EXCEPTION] = 'Número de Telefono no valido';
            } else if (!$proveedor->setCorreo($_POST['correo_proveedor'])) {
                $result[EXCEPTION] = 'Correo electronico no valido';
            } else if (!$proveedor->setDireccion($_POST['direccion'])){
                $result[EXCEPTION] = 'Direccion incorrecta';
            } else if (!$proveedor->setEstado($_POST['estado'])){
                $result[EXCEPTION] = 'estado incorrecta';
            } else if ($proveedor->createRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Proveedor creado existosamente';
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
            if (!$proveedor->setId($_POST[PROVEEDOR_ID])) {
                $result[EXCEPTION] = 'Proveedor incorrecto';
            } elseif ($result[DATA_SET] = $proveedor->readOne()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'Proveedor inexistente';
            }
            break;
        case UPDATE:
            $_POST = $proveedor->validateSpace($_POST);
            if (!$proveedor->setId($_POST[PROVEEDOR_ID])) {
                $result[EXCEPTION] = 'Proveedor NO ES CORRECTO';
            } else if(!$proveedor->setNombre($_POST[PROVEEDOR_NOMBRE])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } else if (!$proveedor->setTelefono($_POST[PROVEEDOR_TELEFONO])){
                $result[EXCEPTION] = 'Número de Telefono no valido';
            } else if (!$proveedor->setCorreo($_POST['correo_proveedor'])) {
                $result[EXCEPTION] = 'Correo electronico no valido';
            } else if (!$proveedor->setDireccion($_POST['direccion'])){
                $result[EXCEPTION] = 'Direccion incorrecta';
            } elseif ($proveedor->updateRow()) {
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
            break;
        case DELETE:
            if (!$proveedor->setId($_POST[PROVEEDOR_ID])) {
                $result[EXCEPTION] = 'id no seteado correctamente';
            } elseif ($proveedor->deleteRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Proveedor removido correctamente';
                if ($result[DATA_SET] = $compra_existencia->readAll()) {
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
