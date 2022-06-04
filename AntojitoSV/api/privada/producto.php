<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/productos.php');

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



// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET[ACTION])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $producto = new producto;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET[ACTION]) {
            //Leer todo
        case READ_ALL:
            if ($result[DATA_SET] = $producto->readAll()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case SEARCH:
            $_POST = $producto->validateSpace($_POST);
            if ($_POST[SEARCH] == '') {
                $result[EXCEPTION] = 'Ingrese un valor para buscar';
            } elseif ($result[DATA_SET] = $producto->searchRows($_POST[SEARCH])) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Valor encontrado';
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay coincidencias';
            }
            break;
        case CREATE:
            $_POST = $producto->validateSpace($_POST);
            if ( !$producto->setNombre($_POST['nombre_producto'])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } if (!$producto->setDescripcion($_POST['descripcion_producto'])) {
                $result[EXCEPTION] = 'Descripcion no valida';
            } else if (!$producto->setProveedorId($_POST['proveedor_id'])) {
                $result[EXCEPTION] = 'Proveedor ID no valido';
            } else if (!$producto->setPrecio($_POST['precio_producto'])) {
                $result[EXCEPTION] = 'Direccion incorrecta';
            } else if (!$producto->setCantidad($_POST['stock_producto'])) {
                $result[EXCEPTION] = 'Stock incorrecto';
            } else if (!$producto->setDescuento($_POST['descuento_producto'])) {
                $result[EXCEPTION] = 'descuento incorrecto';
            } else if (!$producto->setCategoria($_POST['id_categoria'])) {
                $result[EXCEPTION] = 'categoria incorrecto';
            } elseif (!is_uploaded_file($_FILES['archivo']['tmp_name'])) {
                $result[EXCEPTION] = 'Seleccione una imagen';
            } elseif (!$producto->setImagen($_FILES['archivo'])) {
                $result[EXCEPTION] = $producto->getFileError();
            } else if ($producto->createRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'producto creado existosamente';
                if ($producto->saveFile($_FILES['archivo'], $producto->getRutaImagenes(), $producto->getImagen())) {
                    $result[MESSAGE] = 'Imagen ingresada correctanente';
                    if ($result[DATA_SET] = $producto->readAll()) {
                        $result[STATUS] = SUCESS_RESPONSE;
                    } else {
                        $result[EXCEPTION] = 'No hay datos registrados';
                    }
                } else {
                    $result[MESSAGE] = 'Imagen no se a ingresado correctanente';
                }
               
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case UPDATE:
            $_POST = $producto->validateSpace($_POST);
            print_r($_POST);
            if (!$producto->setId($_POST['id'])) {
                $result[EXCEPTION] = 'id incorrecto';
            } else if (!$producto->setNombre($_POST['nombre_producto'])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } else if (!$producto->setDescripcion($_POST['descripcion_producto'])) {
                $result[EXCEPTION] = 'Descripcion no valida';
            } else if (!$producto->setProveedorId($_POST['proveedor_id'])) {
                $result[EXCEPTION] = 'Proveedor ID no valido';
            } else if (!$producto->setPrecio($_POST['precio_producto'])) {
                $result[EXCEPTION] = 'precio incorrecta';
            } else if (!$producto->setCantidad($_POST['stock_producto'])) {
                $result[EXCEPTION] = 'Stock incorrecto';
            } else if (!$producto->setDescuento($_POST['descuento_producto'])) {
                $result[EXCEPTION] = 'descuento incorrecto';
            } else if (!$producto->setCategoria($_POST['id_categoria'])) {
                $result[EXCEPTION] = 'categoria incorrecto';
            } elseif (!is_uploaded_file($_FILES['archivo']['tmp_name'])) {
                $result[EXCEPTION] = 'Seleccione una imagen';
            } elseif (!$producto->setImagen($_FILES['archivo'])) {
                $result[EXCEPTION] = $producto->getFileError();
            } elseif ($producto->updateRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Cantidad modificada correctamente';
                if ($producto->saveFile($_FILES['archivo'], $producto->getRutaImagenes(), $producto->getImagen())) {
                    $result[MESSAGE] = 'Imagen ingresada correctanente';
                    if ($result[DATA_SET] = $producto->readAll()) {
                        $result[STATUS] = SUCESS_RESPONSE;
                    } else {
                        $result[EXCEPTION] = 'No hay datos registrados';
                    }
                } else {
                    $result[MESSAGE] = 'Imagen no se a ingresado correctanente';
                }
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case DELETE:
            print_r($_POST);
            if (!$producto->setId($_POST['id'])) {
                $result[EXCEPTION] = 'id no seteado correctamente';
            } elseif ($producto->deleteRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Proveedor removido correctamente';
                if ($result[DATA_SET] = $producto->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                } elseif (Database::getException()) { 
                    $result[EXCEPTION] = Database::getException();
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                }
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case 'proveedoresCMB':
            if ($result[DATA_SET] = $producto->readProveedor()) {
                $result[MESSAGE] = 'proveedor leido';
                $result[STATUS] = SUCESS_RESPONSE;
            } else {
                $result[EXCEPTION] = 'Algo salio mal';
            }
            break;
        case 'categoriaCMB':
            if ($result[DATA_SET] = $producto->readCategoria()) {
                $result[MESSAGE] = 'proveedor leido';
                $result[STATUS] = SUCESS_RESPONSE;
            } else {
                $result[EXCEPTION] = 'Algo salio mal';
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
