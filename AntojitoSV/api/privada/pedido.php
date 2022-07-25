<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/pedido.php');

// constants 
const ACTION = 'action';
const STATUS = 'status';
const MESSAGE = 'message';
const EXCEPTION = 'exception';
const DATA_SET = 'dataset';
const SEARCH = 'search';
const READ_ALL = 'readAll';
const READ_ONE = 'readOne';
const DELETE = 'delete';
const CREATE = 'create';
const UPDATE = 'update';
const SUCESS_RESPONSE = 1;
const READ_CLIENTE = 'readCliente';

// NOMBRES DE PARAMETROS, DEBEN DE SER IGUALES AL ID Y NAME DEL INPUT DE EL FORMULARIO
const PEDIDO = 'pedido';
const PEDIDO_ID = 'id';
const FECHA_ENTREGA = 'fecha_entrega';
const PEDIDO_MONTO = 'monto';
const PEDIDO_DIRECCION = 'direccion';
const PEDIDO_DESCRIPCION = 'descripcion';
const FECHA_CREACION = 'fecha_creacion';
const CLIENTE_ID = 'id_cliente';
const PEDIDO_ESTADO = 'estado';



// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET[ACTION])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $pedido = new Pedido;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET[ACTION]) {
            //Leer todo
        case READ_ALL:
            if ($result[DATA_SET] = $pedido->readAll()) {
                $result[STATUS] = SUCESS_RESPONSE;
                
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case SEARCH:
            $_POST = $pedido->validateSpace($_POST);
            if ($_POST[SEARCH] == '') {
                $result[EXCEPTION] = 'Ingrese un valor para buscar';
            } elseif ($result[DATA_SET] = $pedido->searchRows($_POST[SEARCH])) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Valor encontrado';
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay coincidencias';
            }
            break;
        case CREATE:
            $_POST = $pedido->validateSpace($_POST);
            if (!$pedido->setId($_POST['id'])) {
                $result[EXCEPTION] = 'id incorrecta';
            } elseif (!$pedido->setEntrega($_POST['fecha_entrega'])) {
                $result[EXCEPTION] = 'Fecha entrega  incorrecta';
            } elseif (!$pedido->setMonto($_POST[PEDIDO_MONTO])) {
                $result[EXCEPTION] = 'Monto incorrecto';
            } elseif (!$pedido->setDireccion($_POST['direccion'])) {
                $result[EXCEPTION] = 'Dirección incorrecta';
            } elseif (!$pedido->setDescripcion($_POST[PEDIDO_DESCRIPCION])) {
                $result[EXCEPTION] = 'Descripcion incorrecta';
            } elseif (!$pedido->setCreacion($_POST[FECHA_CREACION])) {
                $result[EXCEPTION] = 'Fecha incorrecta no ingresada ';
            } elseif (!$pedido->setCliente($_POST[CLIENTE_ID])) {
                $result[EXCEPTION] = 'Cliente incorrecto';
            } elseif ($pedido->createRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Categoria creada existosamente';
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case READ_ONE:
            if (!$pedido->setId($_POST[ID])) {
                $result[EXCEPTION] = 'Categoria incorrecto';
            } elseif ($result[DATA_SET] = $pedido->readOne()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'Categoria inexistente';
            }
            break;
        case UPDATE:
            $_POST = $pedido->validateSpace($_POST);
            if (!$pedido->setId($_POST['id'])) {
                $result[EXCEPTION] = 'id incorrecta';
            } elseif (!$pedido->setEntrega($_POST['fecha_entrega'])) {
                $result[EXCEPTION] = 'Fecha entrega  incorrecta';
            } elseif (!$pedido->setMonto($_POST[PEDIDO_MONTO])) {
                $result[EXCEPTION] = 'Monto incorrecto';
            } elseif (!$pedido->setDireccion($_POST['direccion'])) {
                $result[EXCEPTION] = 'Dirección incorrecta';
            } elseif (!$pedido->setDescripcion($_POST[PEDIDO_DESCRIPCION])) {
                $result[EXCEPTION] = 'Descripcion incorrecta';
            } elseif (!$pedido->setCreacion($_POST[FECHA_CREACION])) {
                $result[EXCEPTION] = 'Fecha incorrecta no ingresada ';
            } elseif (!$pedido->setCliente($_POST[CLIENTE_ID])) {
                $result[EXCEPTION] = 'Cliente incorrecto';
            } elseif ($pedido->updateRow()) {
                if ($result[DATA_SET] = $pedido->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;  
                }else {
                    $result[STATUS] = 0;
                }
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Cantidad modificada correctamente';
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case DELETE:
            if (!$pedido->setId($_POST[ID])) {
                $result[EXCEPTION] = 'Categoria incorrecta';
            } elseif ($pedido->deleteRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Categoria removida correctamente';
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case READ_CLIENTE:
                if ($result[DATA_SET] = $pedido->readCliente()) {
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
