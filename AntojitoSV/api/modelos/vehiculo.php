 <?php
//Maneja la tabla de vehiculo  de la base de datos
//Contiene validaciones de validator

class vehiculo extends validator
{

    //Declaración de atributos (propiedades)
    private $id_vehiculo = null;
    private $disponibilidad = null;
    private $vin = null;
    private $placa = null;
    private $imagen = null;
    private $ruta = '../imagenes/vehiculo';

    //ReadAll True False
    private $true = '1';
    private $false = '0';

    //Metodos para setear los valores de los campos
    //Id - integer
    public function setId($value)
    {
        if ($this->validateNaturalNumber($value)) {
            $this->id_vehiculo = $value;
            return true;
        } else {
            return false;
        }
    }

    //Nombre del producto - varying char
    public function setDisponibilidad($value)
    {
        if ($this->validateBoolean($value)) {
            $this->disponibilidad = $value;
            return true;
        } else {
            return false;
        }
    }

    //Descripcion del producto  - varying char
    public function setVIN($value)
    {
            $this->vin = $value;
            return true;
    }

    //Id del proveedor - integer
    public function setPlaca($value)
    {
        if ($this->validatePlaca($value)) {
            $this->placa = $value;
            return true;
        } else {
            return false;
        }
    }

    //Imagen del producto - varying char
    public function setImagen($file)
    {
        if ($this->validateImageFile($file, 5000, 5000)) {
            $this->imagen = $this->getFileName();
            return true;
            } else { 
                return false;
            }
    }

    //Metodos para obtener los valores de los campos

    //Ruta img
    public function getRutaImagenes(){
        return '../imagenes/vehiculo/';
    }
    
    //Id 
    public function getId()
    {
        return $this->id_vehiculo;
    }

    //Disponibilidad
    public function getDisponibilidad()
    {
        return $this->disponibilidad;
    }

    //VIN
    public function getVIN()
    {
        return $this->vin;
    }

    //Placa
    public function getPlaca()
    {
        return $this->placa;
    }


    //Imagen empleado
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
        $sql = 'SELECT id_vehiculo, disponibilidad, "VIN", placa, imagen
        FROM vehiculo
        WHERE "VIN" ILIKE ? OR placa ILIKE ? ';
        $params = array("%$value%", "%$value%");
        return Database::getRows($sql, $params);
    }

    //Metodo para la inserción
    public function createRow()
    {
        $sql = 'INSERT INTO vehiculo(
            disponibilidad, "VIN", placa, imagen)
            VALUES (?, ?, ?, ?)';
        $params = array($this->true, $this->vin, $this->placa, $this->imagen);
        return Database::executeRow($sql, $params);
    }

    //Metodo para la actualización
    public function updateRow()
    {
        $sql = 'UPDATE vehiculo
        SET disponibilidad=?, "VIN"=?, placa=?, imagen=?
        WHERE id_vehiculo=?';
        $params = array($this->true, $this->vin, $this->placa, $this->imagen, $this->id_vehiculo);
        return Database::executeRow($sql, $params);
    }


    //Metodo para la eliminación
    public function deleteRow()
    {
        $sql = 'UPDATE vehiculo
        SET  disponibilidad=?
        WHERE id_vehiculo=?';
        $params = array($this->false,$this->id_vehiculo);
        return Database::executeRow($sql, $params);
    }

    //Metodo para leer READ
    //Leer todas las filas de la Tabla
    public function readAll()
    {
        $sql = 'SELECT id_vehiculo, disponibilidad, "VIN", placa, imagen
        FROM vehiculo
        WHERE disponibilidad =?';
        $params = array($this->true);
        return Database::getRows($sql, $params);
    }

    //Leer solamente una fila de la Tabla
    public function readOne()
    {
        $sql = 'SELECT id_vehiculo, disponibilidad, "VIN", placa, imagen
        FROM vehiculo
        WHERE id_vehiculo = ?';
        $params = ($this->id_vehiculo);
        return Database::getRow($sql, $params);
    }
}
