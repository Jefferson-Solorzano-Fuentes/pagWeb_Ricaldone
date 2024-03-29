<?php
//Maneja la tabla de cliente de la base de datos
//Contiene validaciones de validator

class cliente extends validator
{

    //Declaración de atributos (propiedades)
    private $id_cliente = null;
    private $nombre = null;
    private $telefono = null;
    private $correo = null;
    private $estado = null;

    //Parametros TRUE / FALSE
    private $true = true;
    private $false = '0';

    //Metodos para setear los valores de los campos
    //Id - integer
    public function setId($value)
    {
        //Validaciones de numeros naturales
        if ($this->validateNaturalNumber($value)) {
            $this->id_cliente = $value;
            return true;
        } else {
            return false;
        }
    }

    //Nombre del cliente - varying char
    public function setNombre($value)
    {
        //Validaciones de valores alfabeticos
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombre = $value;
            return true;
        } else {
            return false;
        }
    }

    //Telefono del cliente - char
    public function setTelefono($value)
    {
        //Numero de telefono
        $this->telefono = $value;
        return true;
    }

    //Correo del cliente - varying char
    public function setCorreo($value)
    {
        //Correo Electronico
        $this->correo = $value;
        return true;
    }

    //Estado del cliente - boolean
    public function setEstado($value)
    {
        //Validaciones de booleanos
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
        return $this->id_cliente;
    }

    //Nombre del Cliente
    public function getNombre()
    {
        return $this->nombre;
    }

    //Telefono
    public function getTelefono()
    {
        return $this->telefono;
    }

    //Correo electronico
    public function getCorreo()
    {
        return $this->correo;
    }

    //Estado de Cliente
    public function getEstado()
    {
        return $this->estado;
    }

    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda
    //Utilizaremos los campos o (NOMBRE,  CORREO, TELEFONO)
    public function searchRows($value)
    {
        $sql = 'SELECT id_cliente, nombre_cliente, telefono, correo, estado_cliente
        FROM cliente
        WHERE nombre_cliente ILIKE ? OR telefono ILIKE ? OR correo ILIKE ?';
        $params = array("%$value%", "%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción
    public function createRow()
    {
        $sql = 'INSERT INTO cliente(
            nombre_cliente, telefono, correo, estado_cliente)
            VALUES (?, ?, ?, ?)';
        $params = array($this->nombre, $this->telefono, $this->correo, $this->estado);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización
    public function updateRow()
    {
        $sql = 'UPDATE cliente
        SET nombre_cliente=?, telefono=?, correo=?, estado_cliente=?
        WHERE id_cliente = ?';
        $params = array($this->nombre, $this->telefono, $this->correo, $this->true, $this->id_cliente);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación
    public function deleteRow()
    {
        $sql = 'UPDATE cliente
        SET estado_cliente=?
        WHERE id_cliente = ?';
        $params = array($this->false, $this->id_cliente);
        return Database::executeRow($sql, $params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT id_cliente, nombre_cliente, telefono, correo, estado_cliente
        FROM cliente
        WHERE estado_cliente =?';
        $params = array($this->true);
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_cliente, nombre_cliente, telefono, correo, estado_cliente
        FROM cliente
        WHERE id_cliente = ?';
        $params = ($this->id_cliente);
        return Database::getRow($sql, $params);
    }

    //Leer los clientes para llenar un combobox
    public function readCliente()
    {
        $sql = 'SELECT id_cliente, nombre_cliente
            FROM cliente
            WHERE estado_cliente = true';
        $params = null;
        return Database::getRows($sql, $params);
    }
}
