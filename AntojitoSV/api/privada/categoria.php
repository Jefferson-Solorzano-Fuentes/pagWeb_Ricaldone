<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/categoria.php');

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

// NOMBRES DE PARAMETROS, DEBEN DE SER IGUALES AL ID Y NAME DEL INPUT DE EL FORMULARIO
const CATEGORIA = 'categoria';
const CATEGORIA_ID = 'id';
const CATEGORIA_NOMBRE = 'nombre_categoria';
const CATEGORIA_ARCHIVO = 'archivo';
const TMP_NAME = 'tmp_name';



// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET[ACTION])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $categoria = new categoria;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET[ACTION]) {
            //Leer todo
        case READ_ALL:
            if ($result[DATA_SET] = $categoria->readAll()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case SEARCH:
            $_POST = $categoria->validateSpace($_POST);
            if ($_POST[SEARCH] == '') {
                $result[EXCEPTION] = 'Ingrese un valor para buscar';
            } elseif ($result[DATA_SET] = $categoria->searchRows($_POST[SEARCH])) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Valor encontrado';
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay coincidencias';
            }
            break;
        case CREATE:
            $_POST = $categoria->validateSpace($_POST);
            if (!$categoria->setNombre($_POST[CATEGORIA_NOMBRE])) {
                $result[MESSAGE] = 'Nombre incorrecto';
            } elseif (!is_uploaded_file($_FILES[CATEGORIA_ARCHIVO][TMP_NAME])) {
                $result[EXCEPTION] = 'Seleccione una imagen';
            } elseif (!$categoria->setImagen($_FILES[CATEGORIA_ARCHIVO])) {
                $result[EXCEPTION] = $categoria->getFileError();
            } elseif ($categoria->createRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Categoria creada existosamente';
                if ($categoria->saveFile($_FILES[CATEGORIA_ARCHIVO], $categoria->getRutaImagenes(), $categoria->getImagen())) {
                    $result[MESSAGE] = 'Imagen ingresada correctanente';
                    if ($result[DATA_SET] = $categoria->readAll()) {
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
        case READ_ONE:
            if (!$categoria->setId($_POST[CATEGORIA_ID])) {
                $result[EXCEPTION] = 'Categoria incorrecta';
            } elseif ($result[DATA_SET] = $categoria->readOne()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'Categoria inexistente';
            }
            break;
        case UPDATE:
            $_POST = $categoria->validateSpace($_POST);
            if (!$categoria->setId($_POST[CATEGORIA_ID])) {
                $result[EXCEPTION] = 'Categoría incorrecta';
            } elseif (!$categoria->setNombre($_POST[CATEGORIA_NOMBRE])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } elseif (!is_uploaded_file($_FILES[CATEGORIA_ARCHIVO][TMP_NAME])) {
                $result[EXCEPTION] = 'Seleccione una imagen';
            } elseif (!$categoria->setImagen($_FILES[CATEGORIA_ARCHIVO])) {
                $result[EXCEPTION] = $categoria->getFileError();
            } elseif ($categoria->updateRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Categoria modificada correctamente';
                if ($categoria->saveFile($_FILES[CATEGORIA_ARCHIVO], $categoria->getRutaImagenes(), $categoria->getImagen())) {
                    $result[MESSAGE] = 'Imagen ingresada correctanente';
                    if ($result[DATA_SET] = $categoria->readAll()) {
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
            if (!$categoria->setId($_POST[CATEGORIA_ID])) {
                $result[EXCEPTION] = 'Categoria incorrecta';
            } elseif ($categoria->deleteRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Categoria removida correctamente';
                if ($result[DATA_SET] = $categoria->readAll()) {
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
