<?php
//Maneja la tabla de pedido  de la base de datos
//Contiene validaciones de validator

class pedido extends validator
{

    //Declaración de atributos (propiedades)
    private $id_pedido = null;
    private $fecha_entrega = null;
    private $monto = null;
    private $direccion = null;
    private $descripcion = null;
    private $fecha_creacion = null;
    private $cliente_id = null;
    private $estado = null;

    //ReadAll True False
    private $true = '1';
    private $false = '0';

    //Metodos para setear los valores de los campos
    //Id - integer
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_pedido = $value;
            return true;
        } else {
            return false;
        }
    }

    //Fecha de Entrega - varying char
    public function setEntrega($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_entrega = $value;
            return true;
        } else {
            return false;
        }
    }

    //Direccion del envio  - varying char
    public function setDireccion($value)
    {
        if ($this->validateAlphanumeric($value, 1, 200)) {
            $this->direccion = $value;
            return true;
        } else {
            return false;
        }
    }

    //Descripcion proporcionada por el cliente - varying char
    public function setDescripcion($value)
    {
        if ($this->validateAlphabetic($value, 1, 200)) {
            $this->descripcion = $value;
            return true;
        } else {
            return false;
        }
    }

    //Fecha de Creacion - varying char
    public function setCreacion($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_creacion = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id de CLiente - integer
    public function setCliente($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->cliente_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //Valor Booleano - integer
    public function setEstado($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->cliente_id = $value;
            return true;
        } else {
            return false;
        }
    }


    //Metodos para obtener los valores de los campos

    //Id 
    public function getId()
    {
        return $this->id_pedido;
    }

    //Fecha Entrega
    public function getEntrega()
    {
        return $this->fecha_entrega;
    }

    //monto
    public function getMonto()
    {
        return $this->monto;
    }

    //Direccion de pedido
    public function getDireccion()
    {
        return $this->direccion;
    }

    //Descripcion de pedido
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    //Fecha Creacion
    public function getCreacion()
    {
        return $this->fecha_creacion;
    }

    //Id Cliente
    public function getCliente()
    {
        return $this->cliente_id;
    }

    //Id Cliente
    public function getEstado()
    {
        return $this->estado;
    }

    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda
    //Utilizaremos los campos o (NOMBRE, APELLIDO, TIPO, ESTADO, TELEFONO, DUI, NIT)
    public function searchRows($value)
    {
        $sql = 'SELECT id_pedido, fecha_entrega, monto_total, direccion, descripcion, fecha_creacion, pedido.id_cliente, estado
        FROM pedido
        INNER JOIN cliente
        ON cliente.id_cliente = pedido.id_cliente
        WHERE direccion ILIKE ?  OR nombre_cliente ILIKE ?';
        $params = array("%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción
    public function createRow()
    {
        $sql = 'INSERT INTO pedido(
        fecha_entrega, monto_total, direccion, descripcion, fecha_creacion, id_cliente, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->fecha_entrega, $this->monto, $this->direccion, $this->descripcion, $this->fecha_creacion, $this->cliente_id, $this->estado);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización
    public function updateRow()
    {
        $sql = 'UPDATE pedido
        SET  fecha_entrega=?, monto_total=?, direccion=?, descripcion=?, fecha_creacion=?, id_cliente=?, estado=?
        WHERE id_pedido=?';
        $params = array($this->fecha_entrega, $this->monto, $this->direccion, $this->descripcion, $this->fecha_creacion, $this->cliente_id, $this->estado, $this->id_pedido);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación
    public function deleteRow()
    {
        $sql = 'UPDATE pedido
        SET  estado=?
        WHERE id_pedido=?';
        $params = array($this->false, $this->id_pedido);
        return Database::executeRow($sql, $params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT id_pedido, fecha_entrega, monto_total, direccion, descripcion, fecha_creacion, pedido.id_cliente, estado
        FROM pedido
        INNER JOIN cliente
        ON cliente.id_cliente = pedido.id_cliente
        WHERE estado =?';
        $params = array($this->true);
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_pedido, fecha_entrega, monto_total, direccion, descripcion, fecha_creacion, pedido.id_cliente, estado
        FROM pedido
        INNER JOIN cliente
        ON cliente.id_cliente = pedido.id_cliente
        WHERE id_pedido = ?';
        $params = ($this->id_pedido);
        return Database::getRow($sql, $params);
    }

    //Llenar combobox
    //Combobox de  cliente
    public function readCliente()
    {
        $sql = 'SELECT id_cliente, nombre_cliente 
        FROM cliente';
        $params = null;
        return Database::getRow($sql, $params);
    }
}
