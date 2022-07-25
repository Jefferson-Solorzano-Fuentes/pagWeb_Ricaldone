<?php
//Maneja la tabla de detalle_pedido  de la base de datos
//Contiene validaciones de validator

class Detalle_pedido extends Validator
{

    //Declaración de atributos (propiedades)
    private $id_detalle_pedido = null;
    private $pedido_id = null;
    private $producto_id = null;
    private $cantidad = null;
    private $subtotal = null;


    //Parametros TRUE / FALSE
    private $true = true;
    private $false = '0';

    //Metodos para setear los valores de los campos
    //Id
    public function setId($value)
    {
        $this->id_detalle_pedido = $value;
        return true;
    }

    //Id del pedido en cuestion
    public function setPedido($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->pedido_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id del producto que se vende
    public function setProducto($value)
    {
        $this->producto_id = $value;
        return true;
    }

    //Cantidad del producto que se vende
    public function setCantidad($value)
    {
        $this->cantidad = $value;
        return true;
    }

    //Id del producto que se vende
    public function setSubtotal($value)
    {
        if ($this->validateMoney($value)) {
            $this->subtotal = $value;
            return true;
        } else {
            return false;
        }
    }

    //Metodos para obtener los valores de los campos
    //Id
    public function getId()
    {
        return $this->id_detalle_pedido;
    }

    //Nombre del Proveedor
    public function getPedido()
    {
        return $this->pedido_id;
    }

    //Telefono del Proveedor
    public function getProducto()
    {
        return $this->producto_id;
    }

    //Obtener la ruta para guardar imagenes
    public function getCantidad()
    {
        return $this->cantidad;
    }

    //Obtener la ruta para guardar imagenes
    public function getSubtotal()
    {
        return $this->subtotal;
    }

    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda SEARCH
    //Utilizaremos los campos o (NOMBRE_TIPO)
    public function searchRows($value)
    {
        $sql = 'SELECT id_detalle_pedido, pedido.id_pedido, monto_total, nombre_producto, cantidad, subtotal, detalle_pedido.visibilidad
        FROM detalle_pedido
        INNER JOIN producto
        ON producto.id_producto = detalle_pedido.id_producto
        INNER JOIN pedido
        ON  pedido.id_pedido= detalle_pedido.id_pedido
        WHERE pedido.id_pedido=?
        order by detalle_pedido.id_pedido';
        $params = array($this->pedido_id);
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción INSERT

    //AGREGARLE VALOR BOOLEANO TRUE A ESTADO DE CARRITO
    // SOLO RDEJAR PRODUCTO_ID
    public function createRow()
    {

            $sql = 'INSERT INTO detalle_pedido(id_producto, carrito, visibilidad, id_cliente)
            VALUES (?, ?, ?, ?)';
            $params = array($this->producto_id, 1,  1, $_SESSION['id_cliente']);
            return Database::executeRow($sql, $params);
        
    }

    //Metodo para la actualización UPDATE
    public function updateRow()
    {
        $sql = 'UPDATE detalle_pedido
        SET  id_pedido=?, id_producto=?, cantidad=?, subtotal=?
        WHERE id_detalle_pedido =?';
        $params = array($this->pedido_id, $this->producto_id, $this->cantidad, $this->subtotal, $this->id_detalle_pedido);
        return Database::executeRow($sql, $params);
    }

    //Actualizar la cantidad de productos 
    public function updateQuantity()
    {
        $sql = 'UPDATE detalle_pedido
        SET cantidad = ?,  subtotal=?
        WHERE id_detalle_pedido =?';
        $params = array($this->cantidad, $this->subtotal, $this->id_detalle_pedido);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la eliminación DELETE 
    public function deleteRow()
    {
        $sql = 'UPDATE detalle_pedido
        SET visibilidad =?
        WHERE id_detalle_pedido=?';
        $params = array($this->false, $this->id_detalle_pedido);
        return Database::executeRow($sql, $params);
    }

    //Metodo de activación
    public function unDeleteRow()
    {
        $sql = 'UPDATE detalle_pedido
        SET visibilidad =?
        WHERE id_detalle_pedido=?';
        $params = array($this->true, $this->id_detalle_pedido);
        return Database::executeRow($sql, $params);
    }


    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT  carrito, detalle_pedido.visibilidad, subtotal, precio ,detalle_pedido.id_cliente, id_detalle_pedido, producto.imagen, subtotal, cantidad, nombre_producto, detalle_pedido.id_producto
        FROM detalle_pedido
        INNER JOIN producto
        ON producto.id_producto = detalle_pedido.id_producto
        WHERE detalle_pedido.visibilidad = true AND carrito = true AND detalle_pedido.id_cliente = ?';
        $params = array($_SESSION['id_cliente']);
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_detalle_pedido, pedido.id_pedido, monto_total, nombre_producto, cantidad, subtotal
        FROM detalle_pedido
        INNER JOIN producto
        ON producto.id_producto = detalle_pedido.id_producto
        INNER JOIN pedido
        ON pedido.id_pedido = detalle_pedido.id_pedido
        WHERE id_detalle_pedido = ?
        order by detalle_pedido.id_pedido';
        $params = ($this->id_detalle_pedido);
        return Database::getRow($sql, $params);
    }


    //Combobox de  proveedor
    public function readPedido()
    {
        $sql = 'SELECT id_pedido
        FROM pedido';
        $params = null;
        return Database::getRow($sql, $params);
    }

    //Combobox de producto
    public function readProducto()
    {
        $sql = 'SELECT  id_producto, nombre_producto
        FROM producto';
        $params = null;
        return Database::getRow($sql, $params);
    }
}
