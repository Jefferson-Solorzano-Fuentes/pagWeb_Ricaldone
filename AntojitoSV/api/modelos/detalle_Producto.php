<?php
//Maneja la tabla de detalle_pedido  de la base de datos
//Contiene validaciones de validator

class detalle_producto extends validator
{

    //Declaración de atributos (propiedades)
    private $id_detalle = null;
    private $nombre_producto = null;
    private $descripcion = null;
    private $precio = null;

    
    //Parametros TRUE / FALSE
    private $true = true;
    private $false = '0';

    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_detalle = $value;
            return true;
        } else {
            return false;
        }
    }


    //Nombre del producto
    public function getNombre()
    {
        return $this->nombre_producto;
    }

    //descripcion
    public function getDescripcion()
    {
        return $this->descripcion;
    }

    //precio
    public function getPrecio()
    {
        return $this->precio;
    }


    //consultas para leer los datos de la base

    public function readNombre()
    {
        $sql = 'SELECT id_pedido
        FROM nombre_producto';
        $params = null;
        return Database::getRow($sql, $params);
    }

    public function readDescripcion()
    {
        $sql = 'SELECT id_producto
        FROM descripcion';
        $params = null;
        return Database::getRow($sql, $params);
    }

    public function readPrecio()
    {
        $sql = 'SELECT id_producto
        FROM precio';
        $params = null;
        return Database::getRow($sql, $params);
    }

    public function readOne()
    {
        $sql = 'SELECT nombre_producto, descripcion, precio, imagen from producto 
        WHERE  id_producto =?';
        $params = [$this->id_detalle];
        $response = Database::getRow($sql, $params);

        $response['imagen'] = "/AntojitoSV/api/imagenes/producto/{$response['imagen']}";

        $response['comentarios'] = Database::getRows("SELECT comentario.comentario, cliente.nombre_cliente FROM comentario INNER JOIN cliente ON cliente.id_cliente = comentario.id_cliente WHERE  comentario.id_producto = ? AND comentario.visibilidad = true", [
            $this->id_detalle
        ]);

        

        return $response;
    }






}
