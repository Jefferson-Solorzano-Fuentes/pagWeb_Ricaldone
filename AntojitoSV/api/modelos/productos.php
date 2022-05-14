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
    private $visiblidad = null;
    private $id_imagen_p = null;
    private $imagen = null;
    private $ruta = '../imagenes/producto';

    //ReadAll True False
    private $true = '1';
    private $false = '0';
    private $cero_stock = 0;

    //Metodos para setear los valores de los campos
    //Id - integer
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_producto = $value;
            return true;
        } else {
            return false;
        }
    }

    //Nombre del producto - varying char
    public function setNombre($value)
    {
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombre_producto = $value;
            return true;
        } else {
            return false;
        }
    }

    //Descripcion del producto  - varying char
    public function setProducto($value)
    {
        if ($this->validateString($value, 1, 100)) {
            $this->descripcion = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id del proveedor - integer
    public function setDUI($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->proveedor_id = $value;
            return true;
        } else {
            return false;
        }
    }

    //Precio del producto - numeric
    public function setPrecio($value)
    {
        if ($this->validateMoney($value)) {
            $this->precio = $value;
            return true;
        } else {
            return false;
        }
    }

    //Stock del producto - integer
    public function setCantidad($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->stock = $value;
            return true;
        } else {
            return false;
        }
    }

    //Desuento del producto - integer
    public function setDescuento($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->descuento = $value;
            return true;
        } else {
            return false;
        }
    }

    //Categoria del producto - char
    public function setCategoria($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->categoria = $value;
            return true;
        } else {
            return false;
        }
    }

    //Visbilidad - boolean
    public function setVisibilidad($value)
    {
        if ($this->validateBoolean($value)) {
            $this->visiblidad = $value;
            return true;
        } else {
            return false;
        }
    }

    //Id de la imagen- integer
    public function setIdImagen($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_imagen_p = $value;
            return true;
        } else {
            return false;
        }
    }

    //Imagen del producto - varying char
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

    //Ruta de imagenes
    public function getRuta()
    {
        return $this->ruta;
    }

    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda
    //Utilizaremos los campos o (NOMBRE, APELLIDO, TIPO, ESTADO, TELEFONO, DUI, NIT)
    public function searchRows($value)
    {
        $sql = 'SELECT producto.id_producto, nombre_producto, descripcion, proveedor.id_proveedor, proveedor.nombre, precio, stock, descuento, categoria.id_categoria, nombre_categoria, imagen
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
            nombre_producto, descripcion, id_proveedor, precio, stock, descuento, id_categoria, visibilidad)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array($this->nombre_producto, $this->descripcion, $this->proveedor_id, $this->precio, $this->stock, $this->descuento, $this->categoria, $this->visiblidad);
        return Database::executeRow($sql, $params);
    }

/*   
    public function createRowImage()
    {
        $sql = 'INSERT INTO imagen_producto(
            id_producto, imagen)
            VALUES (?, ?)';
        $params = array($this->id_producto, $this->imagen);
        return Database::executeRow($sql, $params);
    }
*/
    //Metodo para la actualización
    public function updateRow()
    {
        $sql = 'UPDATE producto
        SET  nombre_producto=?, descripcion=?, id_proveedor=?, precio=?, stock=?, descuento=?, id_categoria=?, visibilidad=?, imagen=?
        WHERE id_producto=?';
        $params = array($this->nombre_producto, $this->descripcion, $this->proveedor_id, $this->precio, $this->stock, $this->descuento, $this->categoria, $this->visiblidad, $this->id_producto);
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
        $sql = 'SELECT producto.id_producto, nombre_producto, descripcion, proveedor.id_proveedor, proveedor.nombre, precio, stock, descuento, categoria.id_categoria, nombre_categoria, imagen
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

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT producto.id_producto, nombre_producto, descripcion, proveedor.id_proveedor, proveedor.nombre, precio, stock, descuento, categoria.id_categoria, nombre_categoria, imagen
        FROM producto
        INNER JOIN categoria
        ON categoria.id_categoria = producto.id_categoria
        INNER JOIN proveedor
        ON proveedor.id_proveedor = producto.id_proveedor
        WHERE producto.id_producto = ?';
        $params = ($this->id_producto);
        return Database::getRow($sql, $params);
    }
}
