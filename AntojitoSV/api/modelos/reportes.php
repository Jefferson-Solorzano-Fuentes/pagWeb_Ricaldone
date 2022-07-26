<?php
//Maneja la tabla de pedido  de la base de datos
//Contiene validaciones de validator

class Reportes extends Validator
{

    //Declaración de atributos (propiedades)
    private $id_empleado = null;
    private $id_cliente = null;


    //Imagen representativa de la categoria
    public function setPDF($file)
    {
        $this->imagen = $file;
        return true;
    }

    //Metodos para setear los valores de los campos
    //Id - integer
    public function setIdEmpleado($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_empleado = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id - integer
    public function setIdCliente($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_cliente = $value;
            return true;
        } else {
            return false;
        }
    }

    //Metodos para obtener los valores de los campos
    //Obtener el reporte
    public function getRutapdf()
    {
        return '../reportes/privado/';
    }

    //Obtener el id del empleado
    public function getIdEmpleado()
    {
        return $this->id_empleado;
    }

    //Obtener el id del cliente
    public function getIdCliente()
    {
        return $this->id_cliente;
    }


    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda
    //Utilizaremos los campos o (NOMBRE, APELLIDO, TIPO, ESTADO, TELEFONO, DUI, NIT)
    public function readPedido()
    {
        $sql = 'SELECT id_pedido, fecha_creacion, monto_total, nombre_cliente FROM pedido
        INNER JOIN cliente 
        ON cliente.id_cliente = pedido.id_cliente
        WHERE EXTRACT(MONTH FROM fecha_creacion) = EXTRACT(MONTH FROM current_date)
        LIMIT 3';
        $params = null;
        return Database::getRows($sql, $params);
    }

    //Metodo para leer la información de la factura
    public function readFactura()
    {
        $sql = 'SELECT pedido.id_pedido, producto.id_producto ,nombre_producto, cantidad, fecha_creacion, cliente.id_cliente, nombre_cliente, subtotal, monto_total FROM public.detalle_pedido
        INNER JOIN public.pedido
        ON pedido.id_pedido = detalle_pedido.id_pedido
        INNER JOIN public.producto
        ON producto.id_producto = detalle_pedido.id_producto
        INNER JOIN public.cliente
        ON cliente.id_cliente = detalle_pedido.id_cliente
        WHERE pedido.id_pedido = (SELECT MAX(id_pedido) from pedido)';
        $params = null;
        return Database::getRows($sql, $params);
    }

    //Metodo para crear reporte de los envios realizados por un empleado dentro del lapso de un més
    public function readEnviosEmpleados()
    {
        $sql = 'SELECT pedido.id_pedido, fecha_creacion, fecha_envio, direccion, monto_total, empleado.id_empleado, nombre, apellido, "DUI", vehiculo.id_vehiculo, placa from public.envio
        INNER JOIN public.empleado
        ON envio.id_empleado = envio.id_empleado
        INNER JOIN public.pedido_envio
        ON pedido_envio.id_envio = envio.id_envio
        INNER JOIN public.pedido 
        ON pedido.id_pedido = pedido_envio.id_pedido
        INNER JOIN public.empleado_vehiculo
        ON empleado.id_empleado = empleado_vehiculo.id_empleado
        INNER JOIN public.vehiculo
        ON vehiculo.id_vehiculo = empleado_vehiculo.id_vehiculo
        WHERE empleado.id_empleado = ? AND EXTRACT(MONTH FROM fecha_creacion) = EXTRACT(MONTH FROM current_date)';
        $params = array($this->id_empleado);
        return Database::getRows($sql, $params);
    }

    //Metodo para crear reporte de los envios realizados por un empleado dentro del lapso de un més
    public function readTopProductos()
    {
        $sql = 'SELECT SUM(cantidad), nombre_producto, producto.id_producto, precio, proveedor.id_proveedor, nombre FROM detalle_pedido
            INNER JOIN public.pedido 
            ON pedido.id_pedido = detalle_pedido.id_pedido
            INNER JOIN public.producto 
            ON producto.id_producto = detalle_pedido.id_producto
            INNER JOIN public.proveedor
            ON proveedor.id_proveedor = producto.id_proveedor
            WHERE EXTRACT(MONTH FROM fecha_creacion) = EXTRACT(MONTH FROM current_date)
            GROUP BY nombre_producto, producto.id_producto, precio, proveedor.id_proveedor
            ORDER BY SUM(cantidad) 
            LIMIT 5;';
        $params = null;
        return Database::getRows($sql, $params);
    }

    //Metodo para leer el Revastecimiento de stock de productos realizados en el mes actual
    public function readCompraExistencia()
    {
        $sql = 'SELECT producto.id_producto, nombre_producto, proveedor.id_proveedor, nombre, stock_comprado, fecha_compra FROM compra_existencia
        INNER JOIN public.producto 
        ON producto.id_producto = compra_existencia.id_producto
        INNER JOIN public.proveedor
        ON proveedor.id_proveedor = producto.id_proveedor
        WHERE EXTRACT(MONTH FROM fecha_compra) = EXTRACT(MONTH FROM current_date)';
        $params = null;
        return Database::getRows($sql, $params);
    }

    //Metodo para leer el Revastecimiento de stock de productos realizados en el mes actual
    public function readCompraCliente()
    {
        $sql = 'SELECT cliente.id_cliente, nombre_cliente, pedido.id_pedido, fecha_creacion, producto.id_producto, nombre_producto, precio, subtotal FROM detalle_pedido
        INNER JOIN public.producto 
        ON producto.id_producto = detalle_pedido.id_producto
        INNER JOIN public.pedido
        ON pedido.id_pedido = detalle_pedido.id_pedido
        INNER JOIN public.cliente
        ON cliente.id_cliente = pedido.id_cliente
        WHERE cliente.id_cliente = ?
        ORDER BY fecha_creacion';
        $params = array($this->id_cliente);
        return Database::getRows($sql, $params);
    }

    //Metodo para leer el Revastecimiento de stock de productos realizados en el mes actual
    public function readCompraClienteMes()
    {
        $sql = 'SELECT cliente.id_cliente, nombre_cliente, pedido.id_pedido, fecha_creacion, producto.id_producto, nombre_producto, precio, subtotal FROM detalle_pedido
        INNER JOIN public.producto 
        ON producto.id_producto = detalle_pedido.id_producto
        INNER JOIN public.pedido
        ON pedido.id_pedido = detalle_pedido.id_pedido
        INNER JOIN public.cliente
        ON cliente.id_cliente = pedido.id_cliente
        WHERE EXTRACT(MONTH FROM fecha_creacion) = EXTRACT(MONTH FROM current_date)
        ORDER BY fecha_creacion';
        $params = null;
        return Database::getRows($sql, $params);
    }
}
