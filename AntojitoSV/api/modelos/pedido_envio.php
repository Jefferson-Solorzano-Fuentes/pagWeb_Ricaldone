<?php
//Maneja la tabla de pedido_envio  de la base de datos
//Contiene validaciones de validator

class Empleado_vehiculo extends Validator
{

    //Declaración de atributos (propiedades)
    private $id_pedido_envio = null;
    private $pedido_id = null;
    private $envio_id = null;
    private $visbilidad = null;
    //Parametros TRUE / FALSE
    private $true = '1';
    private $false = '2';

    //Metodos para setear los valores de los campos
    //Id
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_pedido_envio = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id del pedido
    public function setPedido($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->pedido_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id del envio
    public function setEnvio($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->envio_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //Visibilidad del registro
    public function setVisiblidad($value)
    {
        if ($this->validateBoolean($value)) {
            $this->visbilidad = $value;
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
        $sql = 'INSERT INTO pedido_envio(
            id_pedido, id_envio, visibilidad)
            VALUES (?, ?, ?)';
        $params = array($this->pedido_id, $this->envio_id, $this->visbilidad);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización UPDATE
    public function updateRow()
    {
        $sql = 'UPDATE pedido_envio
        SET  id_pedido=?, id_envio=?, visibilidad=?
        WHERE id_pedido_envio=?';
        $params = array($this->pedido_id, $this->envio_id, $this->visbilidad, $this->id_pedido_envio);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación DELETE 
    public function deleteRow()
    {
        $sql = 'UPDATE pedido_envio
        SET  visibilidad=?
        WHERE id_pedido_envio = ?';
        $params = array($this->false,$this->id_pedido_envio);
        return Database::executeRow($sql, $params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT id_pedido_envio, id_pedido, id_envio, visibilidad
        FROM pedido_envio
        WHERE visibilidad = ?';
        $params = array($this->true);
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_pedido_envio, id_pedido, id_envio, visibilidad
        FROM pedido_envio
        WHERE id_pedido_envio = ?';
        $params = ($this->id_pedido_envio);
        return Database::getRow($sql, $params);
    }

    //Llenar combobox
    //Combobox de  pedido
    public function readPedido()
    {
        $sql = 'SELECT id_pedido
        FROM pedido';
        $params = null;
        return Database::getRow($sql, $params);
    }

    //Combobox de envio
    public function readEnvio()
    {
        $sql = 'SELECT id_envio
        FROM envio';
        $params = null;
        return Database::getRow($sql, $params);
    }
}
