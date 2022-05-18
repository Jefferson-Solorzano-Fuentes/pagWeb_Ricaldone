<?php
//Maneja la tabla de compra_existencia de la base de datos
//Contiene validaciones de validator

class comentario extends validator
{

    //Declaración de atributos (propiedades)
    private $id_comentario = null;
    private $comentario = null;
    private $cliente_id = null;
    private $producto_id = null;
    private $visibilidad = null;

    //Parametros TRUE / FALSE
    private $true = true;
    private $false = '0';

    //Metodos para setear los valores de los campos
    //Id
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_comentario = $value;
            return true;
        } else {
            return false;
        }
    }

    //comentario
    public function setComentario($value)
    {
        if ($this->validateAlphabetic($value, 1, 200)) {
            $this->comentario = $value;
            return true;
        } else {
            return false;
        }
    }

    //Cliente que hizo el comentario
    public function setCliente($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->cliente_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //Producto que tiene el comentario
    public function setProducto($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->producto_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //Visibilidad
    public function setVisibilidad($value)
    {
        if ($this->validateBoolean($value)) {
            $this->setVisibilidad = $value;
            return true;
        } else {
            return false;
        }
    }
    
    //Metodos para obtener los valores de los campos
    //Id
    public function getId()
    {
        return $this->id_comentario;
    }

    //comentario
    public function getComentario()
    {
        return $this->comentario;
    }


    //Cliente
    public function getCliente()
    {
        return $this->cliente_id;
    }

    //Producto
    public function getProducto()
    {
        return $this->producto_id;
    }

    //Visbilidad
    public function getVisbilidad() 
    {
        return $this->visibilidad;
    }

    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda SEARCH
    //Utilizaremos los campos o (NOMBRE, APELLIDO, TIPO, ESTADO, TELEFONO, DUI, NIT)
    public function searchRows($value)
    {
        $sql = 'SELECT id_compra_existencia, compra_existencia.id_producto, nombre_producto, id_proveedores, nombre, stock_comprado, fecha_compra, compra_existencia.visibilidad
        FROM compra_existencia
        INNER JOIN proveedor 
        ON proveedor.id_proveedor = compra_existencia.id_proveedores 
        INNER JOIN producto
        ON producto.id_producto = compra_existencia.id_producto
        WHERE nombre_producto ILIKE ? OR nombre ILIKE ?
        ORDER BY fecha_compra';
        $params = array("%$value%","%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la actualización UPDATE
    public function updateRow()
    {
        $sql = 'UPDATE comentario
        SET comentario=?, id_cliente=?, id_producto=?
        WHERE id_comentario=?';
        $params = array($this->comentario, $this->cliente_id, $this->producto_id, $this->id_comentario);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la eliminación DELETE 
    public function deleteRow()
    {
        $sql = 'UPDATE comentario
        SET visibilidad =?
        WHERE id_comentario=?';
        $params = array($this->false, $this->id_comentario);
        return Database::executeRow($sql, $params);
    }

    public function unDeleteRow()
    {
        $sql = 'UPDATE comentario
        SET visibilidad =?
        WHERE id_comentario=?';
        $params = array($this->true, $this->id_comentario);
        return Database::executeRow($sql, $params);
    }


    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT comentario, comentario.id_cliente, comentario.id_producto, nombre_producto, nombre_cliente
        FROM comentario
        INNER JOIN cliente
        ON cliente.id_cliente = comentario.id_cliente
        INNER JOIN producto
        ON producto.id_producto = comentario.id_producto';
        $params = null;
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT comentario, comentario.id_cliente, comentario.id_producto, nombre_producto, nombre_cliente
        FROM comentario
        INNER JOIN cliente
        ON cliente.id_cliente = comentario.id_cliente
        INNER JOIN producto
        ON producto.id_producto = comentario.id_producto
        WHERE id_comentario=?';
        $params = ($this->id_comentario);
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

    //Combobox de producto
    public function readProducto()
    {
        $sql = 'SELECT  id_producto, producto
        FROM producto';
        $params = null;
        return Database::getRow($sql, $params);
    }
}
