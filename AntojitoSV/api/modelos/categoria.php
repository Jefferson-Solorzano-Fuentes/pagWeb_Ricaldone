<?php
//Maneja la tabla de categoria  de la base de datos
//Contiene validaciones de validator
<<<<<<< Updated upstream

class categoria extends validator
=======
class Categoria extends Validator
>>>>>>> Stashed changes
{

    //Declaración de atributos (propiedades)
    private $id_categoria = null;
    private $nombre_categoria = null;
    private $imagen = null;
    private $ruta = '../imagenes/categoria';

    //Metodos para setear los valores de los campos
    //Id
    public function setId($value)
    {
        //Validacion de numeros naturales
        if ($this->validateNaturalNumber($value)) {
            $this->id_categoria = $value;
            return true;
        } else {
            return false;
        }
    }

    //Nombre de la Categoria
    public function setNombre($value)
    {
        //Validaciones de valores alfabeticos
        if ($this->validateAlphabetic($value, 1, 50)) {
            $this->nombre_categoria = $value;
            return true;
        } else {
            return false;
        }
    }

    //Imagen representativa de la categoria
    public function setImagen($file)
    {
        //Validación de la Imagen
        if ($this->validateImageFile($file, 500, 500)) {
            $this->imagen = $this->getFileName();
            return true;
        } else {
            return false;
        }
    }


    //Metodos para obtener los valores de los campos
    //Ruta donde se guardan las imagenes
    public function getRutaImagenes()
    {
        return '../imagenes/categoria/';
    }

    //Id
    public function getId()
    {
        return $this->id_categoria;
    }

    //Nombre de categoria
    public function getNombre()
    {
        return $this->nombre_categoria;
    }

    //Imagen de la categoria
    public function getImagen()
    {
        return $this->imagen;
    }



    //Metodos para realizar las operaciones SCRUD(Search, Create, Read, Update, Delete)

    //Metodo para la busqueda SEARCH
    //Utilizaremos los campos o (NOMBRE_TIPO)
    public function searchRows($value)
    {
        $sql = 'SELECT id_categoria, nombre_categoria, imagen
        FROM categoria
        WHERE nombre_categoria ILIKE ? 
        ORDER BY nombre_categoria';
        $params = array("%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción INSERT
    public function createRow()
    {
        $sql = 'INSERT INTO categoria(
            nombre_categoria, imagen)
            VALUES (?, ?)';
        $params = array($this->nombre_categoria, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización UPDATE
    public function updateRow()
    {
        $sql = 'UPDATE categoria
        SET nombre_categoria=?, imagen=?
        WHERE id_categoria =?';
        $params = array($this->nombre_categoria, $this->imagen, $this->id_categoria);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación DELETE 
    public function deleteRow()
    {
        $sql = 'DELETE FROM categoria
        WHERE id_categoria = ?';
        $params = array($this->id_categoria);
        return Database::executeRow($sql, $params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT id_categoria, nombre_categoria, imagen
        FROM categoria';
        $params = null;
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_categoria, nombre_categoria, imagen
        FROM categoria
        WHERE id_categoria = ?';
        $params = ($this->id_categoria);
        return Database::getRow($sql, $params);
    }
}
