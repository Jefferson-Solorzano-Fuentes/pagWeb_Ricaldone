<?php
//Maneja la tabla de tipo_empleados  de la base de datos
//Contiene validaciones de validator

class Tipo_empleado extends Validator
{

    //Declaración de atributos (propiedades)
    private $id_tipo_empleado = null;
    private $nombre_tipo = null;

    //Metodos para setear los valores de los campos
    //Id
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_tipo_empleado = $value;
            return true;
        } else {
         return 'nombre incorrecto';
        }
    }

    //Nombre del tipo empleado
    public function setNombre($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombre_tipo = $value;
            return true;
        } else {
            return null;
        }
    }

    //Metodos para obtener los valores de los campos
    //Id
    public function getId()
    {
        return $this->id_tipo_empleado;
    }

    //Nombre del Tipo
    public function getNombreTipo()
    {
        return $this->nombre_tipo;
    }

    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda SEARCH
    //Utilizaremos los campos o (NOMBRE_TIPO)
    public function searchRows($value)
    {
        $sql = 'SELECT id_tipo_empleado, nombre_tipo
        FROM tipo_empleado
        WHERE nombre_tipo ILIKE ?';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción INSERT
    public function createRow()
    {
        $sql = 'INSERT INTO tipo_empleado(
            nombre_tipo, visibilidad)
            VALUES (?, ?)';
        $params = array($this->nombre_tipo, $this->true);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización UPDATE
    public function updateRow()
    {
        $sql = 'UPDATE tipo_empleado
        SET nombre_tipo=?, visibilidad=?
        WHERE id_tipo_empleado =?';
        $params = array($this->nombre_tipo, $this->visibilidad, $this->id_tipo_empleado);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación DELETE 
    public function deleteRow()
    {
        $sql = 'DELETE FROM tipo_empleado
        WHERE id_tipo_empleado = ?';
        $params = array($this->id_tipo_empleado);
        return Database::executeRow($sql,$params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql= 'SELECT id_tipo_empleado, nombre_tipo
        FROM tipo_empleado';
        $params = null;
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_tipo_empleado, nombre_tipo
        FROM tipo_empleado
        WHERE id_tipo_empleado = ?';
        $params = array($this->id_tipo_empleado);
        return Database::getRow($sql, $params);
    }
}
