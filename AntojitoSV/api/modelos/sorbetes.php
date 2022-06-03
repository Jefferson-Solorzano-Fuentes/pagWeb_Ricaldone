<?php
//Maneja la tabla de detalle_pedido  de la base de datos
//Contiene validaciones de validator

class detalle_producto extends validator
{

    //Declaración de atributos (propiedades)
    private $nombre_categoria = null;
    private $nombre_producto = null;
    private $precio = null;

    
    //Parametros TRUE / FALSE
    private $true = true;
    private $false = '0';


    //Nombre del producto
    public function getNombreCategoria()
    {
        return $this->nombre_categoria;
    }

    //descripcion
    public function getNombreProducto()
    {
        return $this->nombre_producto;
    }

    //precio
    public function getPrecio()
    {
        return $this->precio;
    }


    //consultas para leer los datos de la base

    public function readNombreCategoria()
    {
        $sql = 'select nombre_categoria from categoria where id_categoria=4';
        $params = null;
        return Database::getRow($sql, $params);
    }
 

}
