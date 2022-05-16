<?php
//Maneja la tabla de empleado_vehiculo  de la base de datos
//Contiene validaciones de validator

class empleado_vehiculo extends validator
{

    //Declaración de atributos (propiedades)
    private $id_vehiculo_empleado = null;
    private $empleado_id = null;
    private $vehiculo_id = null;
    //Parametros TRUE / FALSE
    private $true = '1';
    private $false = '2';

    //Metodos para setear los valores de los campos
    //Id
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_vehiculo_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id del empleado conductor
    public function setEmpleado($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->empleado_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id del vehiculo
    public function setVehiculo($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->vehiculo_id = $value;
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
        $sql = 'SELECT id_vehiculo_empleado, empleado.id_empleado, nombre, apellido, "DUI", vehiculo.id_vehiculo, placa
        FROM empleado_vehiculo
        INNER JOIN empleado
        ON empleado.id_empleado = empleado_vehiculo.id_empleado
        INNER JOIN vehiculo
        ON vehiculo.id_vehiculo = empleado_vehiculo.id_vehiculo
        WHERE nombre ILIKE ? OR apellido ILIKE ? OR placa ILIKE ? OR "VIN" ILIKE ?
        order by placa';
        $params = array("%$value%","%$value%","%$value%","%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción INSERT
    public function createRow()
    {
        $sql = 'INSERT INTO empleado_vehiculo(
            id_empleado, id_vehiculo)
            VALUES (?, ?)';
        $params = array($this->empleado_id, $this->vehiculo_id);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización UPDATE
    public function updateRow()
    {
        $sql = 'UPDATE empleado_vehiculo
        SET id_empleado=?, id_vehiculo=?
        WHERE id_vehiculo_empleado =?';
        $params = array($this->empleado_id, $this->vehiculo_id,  $this->id_vehiculo_empleado);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación DELETE 
    public function deleteRow()
    {
        $sql = 'DELETE FROM empleado_vehiculo
        WHERE id_vehiculo_empleado = ?';
        $params = array($this->id_vehiculo_empleado);
        return Database::executeRow($sql, $params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT id_vehiculo_empleado, empleado.id_empleado, nombre, "DUI", vehiculo.id_vehiculo, placa
        FROM empleado_vehiculo
        INNER JOIN empleado
        ON empleado.id_empleado = empleado_vehiculo.id_empleado
        INNER JOIN vehiculo
        ON vehiculo.id_vehiculo = empleado_vehiculo.id_vehiculo
        WHERE id_estado_empleado = ?';
        $params = array($this->true);
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_vehiculo_empleado, empleado.id_empleado, nombre, "DUI", vehiculo.id_vehiculo, placa
        FROM empleado_vehiculo
        INNER JOIN empleado
        ON empleado.id_empleado = empleado_vehiculo.id_empleado
        INNER JOIN vehiculo
        ON vehiculo.id_vehiculo = empleado_vehiculo.id_vehiculo
        WHERE id_vehiculo_empleado = ?';
        $params = ($this->id_vehiculo_empleado);
        return Database::getRow($sql, $params);
    }
}
