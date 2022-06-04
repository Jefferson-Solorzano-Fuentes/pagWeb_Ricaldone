<?php
//Maneja la tabla de productos e imagen_producto  de la base de datos
//Contiene validaciones de validator

class producto extends validator
{

    //Declaración de atributos (propiedades)
    private $id_producto = null;
    private $nombre_producto = null;
    private $descripcion = null;
    private $proveedor_id = null;
    private $precio = null;
    private $stock = null;
    private $descuento = null;
    private $categoria = null;
    private $visiblidad = true;
    private $id_imagen_p = null;
    private $imagen = null;

    //ReadAll True False
    private $true = true;
    private $false = '0';
    private $cero_stock = 0;

    //Metodos para setear los valores de los campos
    //Id - integer
    public function setId($value)
    {
        $this->id_producto = $value;
        return true;
    }

    //Nombre del producto - varying char
    public function setNombre($value)
    {
        $this->nombre_producto = $value;
        return true;
    }

    //Descripcion del producto  - varying char
    public function setDescripcion($value)
    {
        $this->descripcion = $value;
        return true;
    }

    //Id del proveedor - integer
    public function setProveedorId($value)
    {
        $this->proveedor_id = $value;
        return true;
    }

    //Precio del producto - numeric
    public function setPrecio($value)
    {
        $this->precio = $value;
        return true;
    }

    //Stock del producto - integer
    public function setCantidad($value)
    {
        $this->stock = $value;
        return true;
    }

    //Desuento del producto - integer
    public function setDescuento($value)
    {
        $this->descuento = $value;
        return true;
    }

    //Categoria del producto - char
    public function setCategoria($value)
    {
        $this->categoria = $value;
        return true;
    }

    //Visbilidad - boolean
    public function setVisibilidad($value)
    {
        $this->visiblidad = $value;
        return true;
    }

    //Id de la imagen- integer
    public function setIdImagen($value)
    {

        $this->id_imagen_p = $value;
        return true;
    }


    //Imagen representativa de la categoria
    public function setImagen($file)
    {
        if ($this->validateImageFile($file, 500, 500)) {
            $this->imagen = $this->getFileName();
            return true;
        } else {
            return false;
        }
    }

    //Metodos para obtener los valores de los campos

    public function getRutaImagenes()
    {
        return '../imagenes/producto/';
    }

    //Id 
    public function getId()
    {
        return $this->id_producto;
    }

    //Nombre del producto
    public function getNombre()
    {
        return $this->nombre_producto;
    }

    //Descripcion
    public function getDescripción()
    {
        return $this->descripcion;
    }

    //Proveedor
    public function getProveedor()
    {
        return $this->proveedor_id;
    }

    //Precio
    public function getPrecio()
    {
        return $this->precio;
    }

    //Stock
    public function getCantidad()
    {
        return $this->stock;
    }

    //Descuento
    public function getDescuento()
    {
        return $this->descuento;
    }

    //Categoria
    public function getCategoria()
    {
        return $this->categoria;
    }

    //Visibilidad
    public function getVisiblidad()
    {
        return $this->visiblidad;
    }

    //Id de imagen
    public function getIdImagen()
    {
        return $this->id_imagen_p;
    }

    //Imagen
    public function getImagen()
    {
        return $this->imagen;
    }

    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda
    //Utilizaremos los campos o (NOMBRE, APELLIDO, TIPO, ESTADO, TELEFONO, DUI, NIT)
    public function searchRows($value)
    {
        $sql = 'SELECT producto.id_producto, nombre_producto, descripcion, proveedor.id_proveedor, proveedor.nombre, precio, stock, descuento, categoria.id_categoria, nombre_categoria, producto.imagen
        FROM producto
        INNER JOIN categoria
        ON categoria.id_categoria = producto.id_categoria
        INNER JOIN proveedor
        ON proveedor.id_proveedor = producto.id_proveedor
        WHERE nombre_producto ILIKE ? OR proveedor.nombre ILIKE ? OR nombre_categoria ILIKE ? 
        ORDER BY id_categoria ';
        $params = array("%$value%", "%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción
    public function createRow()
    {
        $sql = 'INSERT INTO producto(
            nombre_producto, descripcion, id_proveedor, precio, stock, descuento, id_categoria, visibilidad, imagen)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre_producto, $this->descripcion, $this->proveedor_id, $this->precio, $this->stock, $this->descuento, $this->categoria, $this->true, $this->imagen);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la actualización
    public function updateRow()
    {
        $sql = 'UPDATE producto
        SET nombre_producto=?, descripcion=?, id_proveedor=?, precio=?, stock=?, descuento=?, id_categoria=?, imagen=?
        WHERE id_producto=?';
        $params = array($this->nombre_producto, $this->descripcion, $this->proveedor_id, $this->precio, $this->stock, $this->descuento, $this->categoria, $this->imagen, $this->id_producto);
        return Database::executeRow($sql, $params);
    }

    /*  
    public function updateRowImage()
    {
        $sql = 'UPDATE imagen_producto
        SET  id_producto=?, imagen=?
        WHERE id_imagen_producto=?';
        $params = array($this->id_producto, $this->imagen, $this->id_imagen_p);
        return Database::executeRow($sql, $params);
    }
*/

    //Metodo para la eliminación
    public function deleteRow()
    {
        $sql = 'UPDATE producto
        SET  visibilidad=?
        WHERE id_producto=?';
        $params = array($this->false, $this->id_producto);
        return Database::executeRow($sql, $params);
    }

    /*  
    public function deleteRowImage()
    {
        $sql = 'DELETE FROM imagen_producto
        WHERE id_imagen_producto=?';
        $params = array($this->id_imagen_p);
        return Database::executeRow($sql, $params);
    }
*/
    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT producto.id_producto, nombre_producto, descripcion, proveedor.id_proveedor, proveedor.nombre, precio, stock, descuento, categoria.id_categoria, nombre_categoria, producto.imagen
        FROM producto
        INNER JOIN categoria
        ON categoria.id_categoria = producto.id_categoria
        INNER JOIN proveedor
        ON proveedor.id_proveedor = producto.id_proveedor
        WHERE stock > ? AND visibilidad = ?
        ORDER BY id_categoria';
        $params = array($this->cero_stock, $this->true);
        return Database::getRows($sql, $params);
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
    
    //Buscar por medio de categoria
    public function readCategories()
    {
        $sql = 'SELECT producto.id_producto, nombre_producto, descripcion, proveedor.id_proveedor, proveedor.nombre, precio, stock, descuento, categoria.id_categoria, nombre_categoria, producto.imagen
        FROM producto
        INNER JOIN categoria
        ON categoria.id_categoria = producto.id_categoria
        INNER JOIN proveedor
        ON proveedor.id_proveedor = producto.id_proveedor
        WHERE producto.id_categoria = ? AND visibilidad = true';
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }

    //Buscar por medio de categoria
    public function readDiscount()
    {
        $sql = 'SELECT producto.id_producto, nombre_producto, descripcion, proveedor.id_proveedor, proveedor.nombre, precio, stock, descuento, categoria.id_categoria, nombre_categoria, producto.imagen
        FROM producto
        INNER JOIN categoria
        ON categoria.id_categoria = producto.id_categoria
        INNER JOIN proveedor
        ON proveedor.id_proveedor = producto.id_proveedor
        WHERE descuento > 0';
        $params = null;
        return Database::getRows($sql, $params);
    }

    //Llenar combobox
    //Combobox de  proveedor
    public function readProveedor()
    {
        $sql = 'SELECT id_proveedor, nombre
        FROM proveedor';
        $params = null;
        return Database::getRows($sql, $params);
    }

    //Combobox de categoria
    public function readCategoria()
    {
        $sql = 'SELECT id_categoria, nombre_categoria
        FROM categoria';
        $params = null;
        return Database::getRows($sql, $params);
    }
}
