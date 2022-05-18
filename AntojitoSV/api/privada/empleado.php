<?php
//Llama a otros documentos de php respectivo, el database, el validador, y el respectivo modelo
require_once('../helpers/database.php');
require_once('../helpers/validator.php');
require_once('../modelos/empleado.php');

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
const READ_ESTADO_EMPLEADO = 'readEstadoEmpleado';
const READ_TIPO_EMPLEADO = 'readTipoEmpleado';
const SUCESS_RESPONSE = 1;

// NOMBRES DE PARAMETROS, DEBEN DE SER IGUALES AL ID Y NAME DEL INPUT DE EL FORMULARIO
const EMPLEADO = 'empleado';
const EMPLEADO_ID = 'id';
const EMPLEADO_NOMBRE = 'nombre_empleado';
const EMPLEADO_APELLIDO = 'apellido_empleado';
const EMPLEADO_DUI = 'dui';
const EMPLEADO_NIT = 'nit';
const EMPLEADO_TELEFONO = 'telefono';
const EMPLEADO_CORREO = 'correo';
const EMPLEADO_GENERO = 'genero';
const EMPLEADO_FECHA_NACIMIENTO = 'fecha_nacimiento';
const EMPLEADO_ESTADO = 'estado_empleado';
const EMPLEADO_TIPO = 'tipo_empleado';
const ID_DETALLE = 'id_detalle';
const EMPLEADO_ARCHIVO = 'archivo';
const TMP_NAME = 'tmp_name';


// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET[ACTION])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $empleado = new empleado;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array(STATUS => 0, MESSAGE => null, EXCEPTION => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    switch ($_GET[ACTION]) {
            //Leer todo
        case READ_ALL:
            if ($result[DATA_SET] = $empleado->readAll()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case SEARCH:
            $_POST = $empleado->validateSpace($_POST);
            if ($_POST[SEARCH] == '') {
                $result[EXCEPTION] = 'Ingrese un valor para buscar';
            } elseif ($result[DATA_SET] = $empleado->searchRows($_POST[SEARCH])) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Valor encontrado';
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay coincidencias';
            }
            break;
        case CREATE:
            $_POST = $empleado->validateSpace($_POST); 
            if (!$empleado->setNombre($_POST[EMPLEADO_NOMBRE])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } else if (!$empleado->setApellido($_POST[EMPLEADO_APELLIDO])) {
                $result[EXCEPTION] = 'Apellido incorrecto';
            } else if (!$empleado->setDUI($_POST[EMPLEADO_DUI])) {
                $result[EXCEPTION] = 'DUI no valido';
            } else if (!$empleado->setNIT($_POST[EMPLEADO_NIT])) {
                $result[EXCEPTION] = 'NIT no valido';
            }
            else if (!$empleado->setFechaNacmiento($_POST['fecha_nacimiento'])) {
                $result[EXCEPTION] = 'Número de telefono no valido';
            }
            else if (!$empleado->setTelefono($_POST[EMPLEADO_TELEFONO])) {
                $result[EXCEPTION] = 'Número de telefono no valido';
            } else if (!$empleado->setCorreo($_POST[EMPLEADO_CORREO])) {
                $result[EXCEPTION] = 'Correo electronico no valido';
            } else if (!$empleado->setGenero($_POST[EMPLEADO_GENERO])) {
                $result[EXCEPTION] = 'Genero no disponible';
            } elseif (!is_uploaded_file($_FILES[EMPLEADO_ARCHIVO][TMP_NAME])) {
                $result[EXCEPTION] = 'Seleccione una imagen';
            } elseif (!$empleado->setImage($_FILES[EMPLEADO_ARCHIVO])) {
                $result[EXCEPTION] = $empleado->getFileError();
            } else if (!$empleado->setEstadoEmpleado($_POST[EMPLEADO_ESTADO])) {
                $result[EXCEPTION] = 'Estado incorrecto';
            } else if (!$empleado->setTipoEmpleado($_POST[EMPLEADO_TIPO])) {
                $result[EXCEPTION] = 'Tipo incorrecto';
            } elseif ($empleado->createRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                if ($result[DATA_SET] = $compra_existencia->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                }
                $result[MESSAGE] = 'Empleado creado existosamente';
                if ($empleado->saveFile($_FILES[EMPLEADO_ARCHIVO],$empleado->getRutaImagenes(),$empleado->getImagen())) {
                    $result[MESSAGE] = 'Imagen ingresada correctanente';
                } else {
                    $result[MESSAGE] = 'Imagen no se a ingresado correctanente';
                }
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case READ_ONE:
            if (!$empleado->setId($_POST[EMPLEADO_ID])) {
                $result[EXCEPTION] = 'Empleado incorrecto';
            } elseif ($result[DATA_SET] = $empleado->readOne()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'Empleado inexistente';
            }
            break;
        case UPDATE:
            $_POST = $empleado->validateSpace($_POST);
            if (!$empleado->setId($_POST[EMPLEADO_ID])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } else if (!$empleado->setNombre($_POST[EMPLEADO_NOMBRE])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } else if (!$empleado->setApellido($_POST[EMPLEADO_APELLIDO])) {
                $result[EXCEPTION] = 'Apellido incorrecto';
            } else if (!$empleado->setDUI($_POST[EMPLEADO_DUI])) {
                $result[EXCEPTION] = 'DUI no valido';
            } 
            else if (!$empleado->setFechaNacmiento($_POST['fecha_nacimiento'])) {
                $result[EXCEPTION] = 'Número de telefono no valido';
            }
            else if (!$empleado->setNIT($_POST[EMPLEADO_NIT])) {
                $result[EXCEPTION] = 'NIT no valido';
            } else if (!$empleado->setTelefono($_POST[EMPLEADO_TELEFONO])) {
                $result[EXCEPTION] = 'Número de telefono no valido';
            } else if (!$empleado->setCorreo($_POST[EMPLEADO_CORREO])) {
                $result[EXCEPTION] = 'Correo electronico no valido';
            } else if (!$empleado->setGenero($_POST[EMPLEADO_GENERO])) {
                $result[EXCEPTION] = 'Genero no disponible';
            } else if (!$empleado->setTelefono($_POST[EMPLEADO_FECHA_NACIMIENTO])) {
                $result[EXCEPTION] = 'Fecha incorrecta';
            } elseif (!is_uploaded_file($_FILES[EMPLEADO_ARCHIVO][TMP_NAME])) {
                $result[EXCEPTION] = 'Seleccione una imagen';
            } elseif (!$empleado->setImage($_FILES[EMPLEADO_ARCHIVO])) {
                $result[EXCEPTION] = $empleado->getFileError();
            } else if (!$empleado->setEstadoEmpleado($_POST[EMPLEADO_ESTADO])) {
                $result[EXCEPTION] = 'Estado incorrecto';
            } else if (!$empleado->setTipoEmpleado($_POST[EMPLEADO_TIPO])) {
                $result[EXCEPTION] = 'Tipo incorrecto';
            } elseif ($empleado->updateRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                if ($result[DATA_SET] = $compra_existencia->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                }
                $result[MESSAGE] = 'EMPLEADO modificada correctamente';
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case DELETE:
            if (!$empleado->setId($_POST[EMPLEADO_ID])) {
                $result[EXCEPTION] = 'Empleado incorrecto';
            } elseif ($empleado->deleteRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                if ($result[DATA_SET] = $compra_existencia->readAll()) {
                    $result[STATUS] = SUCESS_RESPONSE;
                } else {
                    $result[EXCEPTION] = 'No hay datos registrados';
                }
                $result[MESSAGE] = 'Empleado removido correctamente';
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case READ_TIPO_EMPLEADO:
            if ($result[DATA_SET] = $empleado->readTipoEmpleado()) {
                $result[STATUS] = SUCESS_RESPONSE;
            } elseif (Database::getException()) {
                $result[EXCEPTION] = Database::getException();
            } else {
                $result[EXCEPTION] = 'No hay datos registrados';
            }
            break;
        case READ_ESTADO_EMPLEADO:
            if ($result[DATA_SET] = $empleado->readEstadoEmpleado()) {
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
