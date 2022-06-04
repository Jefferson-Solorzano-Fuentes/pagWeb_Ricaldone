<?php
//Maneja la tabla de compra_existencia de la base de datos
//Contiene validaciones de validator

class compra_exitencia extends validator
{

    //Declaración de atributos (propiedades)
    private $id_compra_existencia = null;
    private $producto_id = null;
    private $stock_comprado = null;
    private $fecha_compra = null;
    private $visibilidad = null;

    //Parametros TRUE / FALSE
    private $true = true;
    private $false = '0';

    //Metodos para setear los valores de los campos
    //Id
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_compra_existencia = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id del producto a comprar
    public function setProducto($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->producto_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //Cantidad a comprar
    public function setCantidad($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->stock_comprado = $value;
            return true;
        } else {
            return false;
        }
    }

    // Fecha en de la compra
    public function setFecha($value)
    {
        if ($this->validateDate($value)) {
            $this->fecha_compra = $value;
            return true;
        } else {
            return false;
        }
    }

    // Visbilidad del registro
    public function setVisibilidad($value)
    {
        if ($this->validateBoolean($value)) {
            $this->visibilidad = $value;
            return true;
        } else {
            return false;
        }
    }

    //Metodos para obtener los valores de los campos
    //Id
    public function getId()
    {
        return $this->id_compra_existencia;
    }

    //Producto comprado
    public function getProducto()
    {
        return $this->producto_id;
    }

    //Cantidad comprada
    public function getCantidad()
    {
        return $this->stock_comprado;
    }

    //Fecha de la compra
    public function getFecha()
    {
        return $this->fecha_compra;
    }

    //Fecha de la compra
    public function getVisibilidad()
    {
        return $this->visibilidad;
    }

    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda SEARCH
    //Utilizaremos los campos o (NOMBRE, APELLIDO, TIPO, ESTADO, TELEFONO, DUI, NIT)
    public function searchRows($value)
    {
        $sql = 'SELECT id_compra_existencia, compra_existencia.id_producto, nombre_producto, producto.id_proveedor, nombre, stock_comprado, fecha_compra, compra_existencia.visibilidad
        FROM compra_existencia
        INNER JOIN producto
        ON producto.id_producto = compra_existencia.id_producto
		INNER JOIN proveedor 
        ON proveedor.id_proveedor = producto.id_proveedor 
        WHERE nombre_producto ILIKE ? OR nombre ILIKE ?
        ORDER BY fecha_compra';
        $params = array("%$value%","%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción INSERT
    public function createRow()
    {
        $sql = 'INSERT INTO compra_existencia(
            id_producto, stock_comprado, fecha_compra, visibilidad)
            VALUES (?, ?, ?, ?)';
        $params = array($this->producto_id, $this->stock_comprado, $this->fecha_compra, $this->true);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización UPDATE
    public function updateRow()
    {
        $sql = 'UPDATE compra_existencia
        SET id_producto=?, stock_comprado=?, fecha_compra=?, visibilidad=?
        WHERE id_compra_existencia =?';
        $params = array($this->producto_id,$this->stock_comprado, $this->fecha_compra, $this->true, $this->id_compra_existencia);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación DELETE 
    public function deleteRow()
    {
        $sql = 'UPDATE compra_existencia
        SET visibilidad=?
        WHERE id_compra_existencia =?';
        $params = array($this->false, $this->id_compra_existencia);
        return Database::executeRow($sql, $params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT id_compra_existencia, compra_existencia.id_producto, nombre_producto, producto.id_proveedor, nombre, stock_comprado, fecha_compra, compra_existencia.visibilidad
        FROM compra_existencia
        INNER JOIN producto
        ON producto.id_producto = compra_existencia.id_producto
		INNER JOIN proveedor 
        ON proveedor.id_proveedor = producto.id_proveedor 
        WHERE compra_existencia.visibilidad = ?
        ORDER BY fecha_compra';
        $params = array($this->true);
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_compra_existencia, id_producto, stock_comprado, fecha_compra, visibilidad
        FROM compra_existencia
        WHERE id_compra_existencia = ?';
        $params = ($this->id_tipo_usuario);
        return Database::getRow($sql, $params);
    }

    //Llenar combobox
    //Combobox de  producto
    public function readProducto()
    {
        $sql = 'SELECT id_producto, nombre_producto
        FROM producto';
        $params = null;
        return Database::getRows($sql, $params);
    }


}
