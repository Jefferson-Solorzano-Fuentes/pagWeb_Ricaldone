<?php
//Maneja la tabla de proveedor  de la base de datos
//Contiene validaciones de validator

class proovedor extends validator
{

    //Declaración de atributos (propiedades)
    private $id_proovedor = null;
    private $nombre = null;
    private $telefono = null;
    private $correo = null;
    private $direccion = null;
    private $estado = null;

    //Parametros TRUE / FALSE
    private $true = '1';
    private $false = '0';

    //Metodos para setear los valores de los campos
    //Id
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_proovedor = $value;
            return true;
        } else {
            return false;
        }
    }

    //Nombre del tipo proovedor
    public function setNombre($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombre = $value;
            return true;
        } else {
            return false;
        }
    }

    //Numero de Telefono
    public function setTelefono($value)
    {
        if ($this->validatePhone($value)) {
            $this->telefono = $value;
            return true;
        } else {
            return false;
        }
    }

    //Correo Electronico
    public function setCorreo($value)
    {
        if ($this->validateEmail($value)) {
            $this->correo = $value;
            return true;
        } else {
            return false;
        }
    }

    //Numero de Telefono
    public function setDireccion($value)
    {
        if ($this->validateString($value, 1, 200)) {
            $this->direccion = $value;
            return true;
        } else {
            return false;
        }
    }

    //Numero de Telefono
    public function setEstado($value)
    {
        if ($this->validateBoolean($value)) {
            $this->estado = $value;
            return true;
        } else {
            return false;
        }
    }


    //Metodos para obtener los valores de los campos
    //Id
    public function getId()
    {
        return $this->id_proovedor;
    }

    //Nombre del Proveedor
    public function getNombre()
    {
        return $this->nombre;
    }

    //Telefono del Proveedor
    public function getTelefono()
    {
        return $this->telefono;
    }

    //Correo del Proveedor
    public function getCorreo()
    {
        return $this->correo;
    }

    //Dirección del Proveedor
    public function getDireccion()
    {
        return $this->direccion;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda SEARCH
    //Utilizaremos los campos o (NOMBRE_TIPO)
    public function searchRows($value)
    {
        $sql = 'SELECT id_proveedor, nombre, telefono, correo, direccion, estado_proveedor
        FROM proveedor
        WHERE nombre ILIKE ? OR telefono ILIKE ? OR correo ILIKE ? OR dirreccion ILIKE ? 
        ORDER BY nombre';
        $params = array("%$value%", "%$value%", "%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción INSERT
    public function createRow()
    {
        $sql = 'INSERT INTO proveedor(
            nombre, telefono, correo, direccion, estado_proveedor)
            VALUES (?. ?, ?, ?, ?)';
        $params = array($this->nombre, $this->telefono, $this->correo, $this->direccion, $this->estado);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización UPDATE
    public function updateRow()
    {
        $sql = 'UPDATE proveedor
        SET nombre=?, telefono=?, correo=?, direccion=?, estado_proveedor=?
        WHERE id_proveedor =?';
        $params = array($this->nombre, $this->telefono, $this->correo, $this->direccion, $this->estado, $this->id_proovedor);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación DELETE 
    public function deleteRow()
    {
        $sql = 'UPDATE proveedor
        SET estado_proovedor =?
        WHERE id_proveedor = ?';
        $params = array($this->false,$this->id_proovedor);
        return Database::executeRow($sql, $params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT id_proveedor, nombre, telefono, correo, direccion, estado_proveedor
        FROM proveedor
        WHERE estado_proveedor =?';
        $params = array($this->true);
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_proveedor, nombre, telefono, correo, direccion, estado_proveedor
        FROM proveedor
        WHERE id_proveedor = ?';
        $params = ($this->id_proovedor);
        return Database::getRow($sql, $params);
    }
}
