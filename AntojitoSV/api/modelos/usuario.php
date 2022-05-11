<?php
//Maneja la tabla de pedido_envio  de la base de datos
//Contiene validaciones de validator

class usuario extends validator
{

    //Declaración de atributos (propiedades)
    private $id_usuario = null;
    private $nombre_usuario = null;
    private $password = null;
    private $tipo_usuario = null;
    private $cliente_id = null;
    private $empleado_id = null;

    //Parametros TRUE / FALSE
    private $tipo_empleado = 2;
    private $tipo_cliente = 3;
    private $false = 4;

    //Metodos para setear los valores de los campos
    //Id
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_usuario = $value;
            return true;
        } else {
            return false;
        }
    }

    //Nombre del usuario
    public function setNombre($value)
    {
        if ($this->validateBoolean($value)) {
            $this->nombre_usuario = $value;
            return true;
        } else {
            return false;
        }
    }
    //Contraseña
    public function setPassword($value)
    {
        if ($this->validatePassword($value)) {
            $this->password = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id del tipo de usuario
    public function setTipoUsuario($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->tipo_usuario = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id del Cliente
    public function setCliente($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->cliente_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id del envio
    public function setEmpleado($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->empleado_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //Metodos para obtener los valores de los campos
    //Id
    public function getId()
    {
        return $this->id_vehiculo_empleado;
    }

    //Nombre del Proveedor
    public function getEmpleado()
    {
        return $this->empleado_id;
    }

    //Telefono del Proveedor
    public function getVehiculo()
    {
        return $this->vehiculo_id;
    }


    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda SEARCH
    //Utilizaremos los campos o (NOMBRE_TIPO)
    public function searchRows($value)
    {
        $sql = 'SELECT id_pedido_envio, id_pedido, id_envio, visibilidad
        FROM pedido_envio
        WHERE id_pedido =? OR id_envio =?';
        $params = array($this->pedido_id, $this->envio_id);
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción INSERT
    public function createRow()
    {
        $sql = 'INSERT INTO usuario(
            nombre_usuario, password, id_tipo_usuario, id_cliente)
            VALUES (?, ?, ?, ?)';
        $params = array($this->nombre_usuario, $this->password, $this->tipo_cliente, $this->cliente_id);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización UPDATE
    public function updateRow()
    {
        $sql = 'UPDATE usuario
        SET nombre_usuario=?, id_tipo_usuario=?, id_empleado=?, id_cliente=?
        WHERE id_usuario=?';
        $params = array($this->nombre_usuario, $this->tipo_usuario, $this->empleado_id, $this->cliente_id, $this-> id_usuario);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación DELETE 
    public function deleteRow()
    {
        $sql = 'UPDATE usuario
        SET id_tipo_usuario=?
        WHERE id_usuario=?';
        $params = array($this->false, $this->id_usuario);
        return Database::executeRow($sql, $params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAllEmpleado()
    {
        $sql = 'SELECT id_usuario, nombre_usuario, password, tipo_usuario.id_tipo_usuario, empleado.id_empleado, nombre, apellido
        FROM public.usuario
        INNER JOIN tipo_usuario
        ON tipo_usuario.id_tipo_usuario = usuario.id_tipo_usuario
        INNER JOIN empleado
        ON empleado.id_empleado = usuario.id_empleado
        WHERE id_tipo_usuario =?';
        $params = array($this->tipo_empleado);
        return Database::getRows($sql, $params);
    }

    public function readAllCliente()
    {
        $sql = 'SELECT id_usuario, nombre_usuario, password, tipo_usuario.id_tipo_usuario, cliente.id_cliente, nombre_cliente
        FROM public.usuario
        INNER JOIN tipo_usuario
        ON tipo_usuario.id_tipo_usuario = usuario.id_tipo_usuario
        INNER JOIN cliente
        ON cliente.id_cliente = usuario.id_cliente
        WHERE id_tipo_usuario =?';
        $params = array($this->tipo_cliente);
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_usuario, nombre_usuario, password, tipo_usuario.id_tipo_usuario, empleado.id_empleado, nombre, apellido
        FROM public.usuario
        INNER JOIN tipo_usuario
        ON tipo_usuario.id_tipo_usuario = usuario.id_tipo_usuario
        INNER JOIN empleado
        ON empleado.id_empleado = usuario.id_empleado
        WHERE id_usuario =?';
        $params = ($this->id_usuario);
        return Database::getRow($sql, $params);
    }
}
