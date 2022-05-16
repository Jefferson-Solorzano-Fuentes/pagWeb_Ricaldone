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
const SUCESS_RESPONSE = 1;

// NOMBRES DE PARAMETROS, DEBEN DE SER IGUALES AL ID Y NAME DEL INPUT DE EL FORMULARIO
const EMPLEADO = 'empleado';
const ID = 'id';
const NOMBRE = 'nombre_empleado';
const APELLIDO = 'apellido_empleado';
const DUI = 'dui';
const NIT = 'nit';
const TELEFONO = 'telefono';
const CORREO = 'correo';
const GENERO = 'genero';
const FECHA_NACIMIENTO = 'fecha_nacimiento';
const ESTADO_EMPLEADO = 'estado_empleado';
const TIPO_EMPLEADO = 'tipo_empleado';
const ID_DETALLE = 'id_detalle';
const ARCHIVO = 'archivo';
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
            if (!$empleado->setNombre($_POST[NOMBRE])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } else if (!$empleado->setApellido($_POST[APELLIDO])){
                $result[EXCEPTION] = 'Apellido incorrecto';
            } else if (!$empleado->setDUI($POST[DUI])) {
                $result[EXCEPTION] = 'DUI no valido';
            } else if (!$empleado->setNIT($POST[NIT])){
                $result[EXCEPTION] = 'NIT no valido';
            } else if (!$empleado->setTelefono($POST[TELEFONO])){
                $result[EXCEPTION] = 'Número de telefono no valido';
            } else if (!$empleado->setCorreo($POST[CORREO])){
                $result[EXCEPTION] = 'Correo electronico no valido';
            } else if (!$empleado->setGenero($POST[GENERO])){
                $result[EXCEPTION] = 'Genero no disponible';
            } else if (!$empleado->setTelefono($POST[FECHA_NACIMIENTO])){
                $result[EXCEPTION] = 'Fecha incorrecta';
            } elseif (!is_uploaded_file($_FILES[ARCHIVO][TMP_NAME])) {
                $result[EXCEPTION] = 'Seleccione una imagen';
            } elseif (!$categoria->setImagen($_FILES[ARCHIVO])) {
                $result[EXCEPTION] = $categoria->getFileError();
            } else if (!$empleado->setEstadoEmpleado($POST[ESTADO_EMPLEADO])){
                $result[EXCEPTION] = 'Estado incorrecto';
            } else if (!$empleado->setTipoEmpleado($POST[TIPO_EMPLEADO])){
                $result[EXCEPTION] = 'Tipo incorrecto';
            } elseif ($empleado->createRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Empleado creado existosamente';
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case READ_ONE:
            if (!$empleado->setId($_POST[ID])) {
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
            $_POST = $empleado->validateSpace($_POST[NOMBRE]);
            if (!$empleado->setId($_POST[ID])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } else if (!$empleado->setNombre($_POST[NOMBRE])) {
                $result[EXCEPTION] = 'Nombre incorrecto';
            } else if (!$empleado->setApellido($_POST[APELLIDO])){
                $result[EXCEPTION] = 'Apellido incorrecto';
            } else if (!$empleado->setDUI($POST[DUI])) {
                $result[EXCEPTION] = 'DUI no valido';
            } else if (!$empleado->setNIT($POST[NIT])){
                $result[EXCEPTION] = 'NIT no valido';
            } else if (!$empleado->setTelefono($POST[TELEFONO])){
                $result[EXCEPTION] = 'Número de telefono no valido';
            } else if (!$empleado->setCorreo($POST[CORREO])){
                $result[EXCEPTION] = 'Correo electronico no valido';
            } else if (!$empleado->setGenero($POST[GENERO])){
                $result[EXCEPTION] = 'Genero no disponible';
            } else if (!$empleado->setTelefono($POST[FECHA_NACIMIENTO])){
                $result[EXCEPTION] = 'Fecha incorrecta';
            } elseif (!is_uploaded_file($_FILES[ARCHIVO][TMP_NAME])) {
                $result[EXCEPTION] = 'Seleccione una imagen';
            } elseif (!$empleado->setImagen($_FILES[ARCHIVO])) {
                $result[EXCEPTION] = $empleado->getFileError();
            } else if (!$empleado->setEstadoEmpleado($POST[ESTADO_EMPLEADO])){
                $result[EXCEPTION] = 'Estado incorrecto';
            } else if (!$empleado->setTipoEmpleado($POST[TIPO_EMPLEADO])){
                $result[EXCEPTION] = 'Tipo incorrecto';
            } elseif ($empleado->updateRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Cantidad modificada correctamente';
            } else {
                $result[EXCEPTION] = Database::getException();
            }
            break;
        case DELETE:
            if (!$empleado->setId($_POST[ID])) {
                $result[EXCEPTION] = 'Empleado incorrecto';
            } elseif ($empleado->deleteRow()) {
                $result[STATUS] = SUCESS_RESPONSE;
                $result[MESSAGE] = 'Empleado removido correctamente';
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
