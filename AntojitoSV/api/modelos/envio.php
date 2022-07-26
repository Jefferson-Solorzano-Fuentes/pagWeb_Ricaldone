<?php
//Maneja la tabla de envio  de la base de datos
//Contiene validaciones de validator

class envio extends validator
{

    //Declaración de atributos (propiedades)
    private $id_envio = null;
    private $fecha_envio = null;
    private $estado_id = null;
    private $empleado_id = null;

    //Parametros TRUE / FALSE
    private $en_progreso = '1';
    private $enviado = '2';
    private $cancelado = '3';

    //Metodos para setear los valores de los campos
    //Id
    public function setId($value)
    {
        //Validaciones de los numeros naturales
        if ($this->validateNaturalNumber($value)) {
            $this->id_envio = $value;
            return true;
        } else {
            return false;
        }
    }

    //Fecha del envio
    public function setFecha($value)
    {
        //Validacion de las fechas
        if ($this->validateDate($value)) {
            $this->fecha_envio = $value;
            return true;
        } else {
            return false;
        }
    }

    //Estado del envio
    public function setEstado($value)
    {
        //Validaciones de los Numeros Naturales
        if ($this->validateNaturalNumber($value)) {
            $this->estado_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //El emplado encargado del envio
    public function setEmpleado($value)
    {
        //Validaciones de los numeros Naturales
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
        return $this->id_envio;
    }

    //Fecha de envio
    public function getFecha()
    {
        return $this->fecha_envio;
    }

    //Id Estado
    public function getEstado()
    {
        return $this->estado_id;
    }

    //Id Empleado
    public function getEmpleado()
    {
        return $this->empleado_id;
    }

    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda SEARCH
    //Utilizaremos los campos o (NOMBRE_TIPO)
    public function searchRows($value)
    {
        $sql = 'SELECT id_envio, fecha_envio, nombre_estado, estado_envio.id_estado_envio, nombre, apellido, "DUI", empleado.id_empleado
        FROM envio
        INNER JOIN empleado
        ON empleado.id_empleado = envio.id_empleado
        INNER JOIN estado_envio
        ON estado_envio.id_estado_envio = envio.id_estado_envio    
        WHERE nombre_estado ILIKE ? OR nombre ILIKE ? OR apellido ILIKE ? OR "DUI" ILIKE ?
        order by fecha_envio desc';
        $params = array("%$value%","%$value%","%$value%","%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción INSERT
    public function createRow()
    {
        $sql = 'INSERT INTO envio(
            fecha_envio, id_estado_envio, id_empleado)
            VALUES (?, ?, ?)';
        $params = array($this->fecha_envio, $this->estado_id, $this->empleado_id);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización UPDATE
    public function updateRow()
    {
        $sql = 'UPDATE envio
        SET fecha_envio=?, id_estado_envio=?, id_empleado=?
        WHERE id_envio=? ';
        $params = array($this->fecha_envio, $this->estado_id, $this->empleado_id, $this->id_envio);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación DELETE 
    public function deleteRow()
    {
        $sql = 'UPDATE envio
        SET id_estado_envio=?
        WHERE id_envio=?';
        $params = array($this->cancelado, $this->id_envio);
        return Database::executeRow($sql, $params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT id_envio, fecha_envio, nombre_estado, estado_envio.id_estado_envio, nombre, apellido, "DUI", empleado.id_empleado
        FROM envio
        INNER JOIN empleado
        ON empleado.id_empleado = envio.id_empleado
        INNER JOIN estado_envio
        ON estado_envio.id_estado_envio = envio.id_estado_env
        WHERE id_estado_envio = ? or id_estado_envio = ? ';
        $params = array($this->en_progreso, $this->enviado);
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_envio, fecha_envio, nombre_estado, estado_envio.id_estado_envio, nombre, apellido, "DUI", empleado.id_empleado
        FROM envio
        INNER JOIN empleado
        ON empleado.id_empleado = envio.id_empleado
        INNER JOIN estado_envio
        ON estado_envio.id_estado_envio = envio.id_estado_envio    
        WHERE id_envio = ?';
        $params = ($this->id_vehiculo_empleado);
        return Database::getRow($sql, $params);
    }


    //Llenar combobox
    //Combobox de estado envio
    public function readEstadoEnvio()
    {
        $sql = 'SELECT id_estado_envio, nombre_estado 
        FROM estado_envio';
        $params = null;
        return Database::getRow($sql, $params);
    }

    //Combobox de producto
    public function readProducto()
    {
        $sql = 'SELECT id_producto, nombre_producto
        FROM producto';
        $params = null;
        return Database::getRow($sql, $params);
    }
}
