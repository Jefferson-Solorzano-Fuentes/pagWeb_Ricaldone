<?php
//Maneja la tabla de tipo_usuarios  de la base de datos
//Contiene validaciones de validator

class tipo_usuario extends validator
{

    //Declaración de atributos (propiedades)
    private $id_tipo_usuario = null;
    private $nombre_tipo = null;

    //Metodos para setear los valores de los campos
    //Id
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_tipo_usuario = $value;
            return true;
        } else {
            return false;
        }
    }

    //Nombre del tipo usuario
    public function setNombre($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombre_tipo = $value;
            return true;
        } else {
            return false;
        }
    }

    //Metodos para obtener los valores de los campos
    //Id
    public function getId()
    {
        return $this->id_tipo_usuario;
    }

    //Nombre del Tipo
    public function getNombreTipo()
    {
        return $this->nombre_tipo;
    }

    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda SEARCH
    //Utilizaremos los campos o (NOMBRE, APELLIDO, TIPO, ESTADO, TELEFONO, DUI, NIT)
    public function searchRows($value)
    {
        $sql = 'SELECT id_tipo_usuario, nombre_tipo
    FROM tipo_usuario
    WHERE nombre_tipo ILIKE ?';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción INSERT
    public function createRow()
    {
        $sql = 'INSERT INTO tipo_usuario(
            nombre_tipo)
            VALUES (?)';
        $params = array($this->nombre_tipo);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización UPDATE
    public function updateRow()
    {
        $sql = 'UPDATE tipo_usuario
        SET nombre_tipo=?
        WHERE id_tipo_usuario =?';
        $params = array($this->nombre_tipo, $this->id_tipo_usuario);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación DELETE 
    public function deleteRow()
    {
        $sql = 'DELETE FROM tipo_usuario
        WHERE id_tipo_usuario = ?';
        $params = array($this->id_tipo_usuario);
        return Database::executeRow($sql, $params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT id_tipo_usuario, nombre_tipo
        FROM tipo_usuario';
        $params = null;
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_tipo_usuario, nombre_tipo
        FROM tipo_usuario
        WHERE id_tipo_usuario = ?';
        $params = ($this->id_tipo_usuario);
        return Database::getRow($sql, $params);
    }
}
