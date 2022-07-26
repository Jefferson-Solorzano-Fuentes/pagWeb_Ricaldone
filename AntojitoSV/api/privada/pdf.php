<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/reportes.php');

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

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET[ACTION])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $reporte = new Reportes;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET[ACTION]) {
            //Leer todo
        case 'factura':
            if ($result[DATA_SET] = $reporte->readFactura()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case 'envios_empleado':
            if (!$reporte->setIdEmpleado($_POST['id_empleado'])) {
                $result[EXCEPTION] = 'identificador empleado incorrecto';
            } else if ($result[DATA_SET] = $reporte->readEnviosEmpleados()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case 'compra_clientes':
            if (!$reporte->setIdCliente($_POST['id_cliente'])) {
                $result[EXCEPTION] = 'identificador empleado incorrecto';
            } else if ($result[DATA_SET] = $reporte->readCompraCliente()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case 'compra_existencia':
            if ($result[DATA_SET] = $reporte->readCompraExistencia()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case 'compras_clientes_mensual':
            if ($result[DATA_SET] = $reporte->readCompraClienteMes()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case 'productos':
            if ($result[DATA_SET] = $reporte->readTopProductos()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case 'create_pdf':
            $_POST = $reporte->validateSpace($_POST);
            //FALTA GUARDAR NOMBRE EN DB
            // FALTA LA GENERACION DEL NOMBRE
            if (!is_uploaded_file($_FILES['pdf']['tmp_name'])) {
                $result[EXCEPTION] = 'Seleccione pdf';
            } elseif (!$reporte->setPDF($_FILES['pdf'])) {
                $result[EXCEPTION] = $producto->getFileError();
            }
            if ($reporte->saveFile($_FILES['pdf'], $reporte->getRutapdf(), $_POST['nombreReporte'])) {
                $result[MESSAGE] = 'Imagen ingresada correctanente';
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
