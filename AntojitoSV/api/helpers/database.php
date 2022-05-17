<?php
// Crear clase database, para operar con la BD

class Database
{
    // Propiedades de la clase para manejar las acciones respectivas.
    private static $connection = null;
    private static $statement = null;
    private static $error = null;

    // Metodo para establecer conexión con la base de datos
    private static function connect()
    {
        // Declarando las credenciales para conectar con la BD.
        $server = 'localhost';
        $database = 'AntojitoSVBD';
        $username = 'postgres';
        $password = 'ganglyPie44311';

        //Se crea una sentencia usando la extensión PDO y el controlador para PostgreSQL
        self::$connection = new PDO('pgsql:host=' . $server . ';dbname=' . $database . ';port=5432', $username, $password);
    }

    // Metodo para ejecutrar sentencias SQL que manipulan los datos Insert, Update, Delete
    // $query = $sql || $values = $params, que son los la setencia sql y los campos a utilizar
    public static function executeRow($query, $values)
    {
        try {
            self::connect();
            self::$statement = self::$connection->prepare($query);
            $state = self::$statement->execute($values);
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return $state;
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            return false;
        }
    }

    // Metodo para obtener registros de una Tabla utilizando SELECT
    // Parametros a utilizar es $sql que consiste en la sentencia sql y $params, que son los campos a utilizar para la busqueda de datos
    // Retorna: arreglo asociativo de los registros si la sentencia SQL se ejecuta satisfactoriamente o false en caso contrario.

    //Retorna solamente una Fila de Registro
    //$query = $sql || $values = $params
    public static function getRow($query, $values)
    {
        try {
            //Realiza conexión con BD
            self::connect();
            //Inserta la sentencia sql
            self::$statement = self::$connection->prepare($query);
            //A la sentencia le agrega los parametros
            self::$statement->execute($values);
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return self::$statement->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $error) {
            //Se obtiene el codigo de error, y obtiene el mensaje personalizado.
            self::setException($error->getCode(), $error->getMessage());
            die(self::getException());
        }
    }

    //Retorna varias Filas de Registros
    //$query = $sql || $values = $params
    public static function getRows($query, $values)
    {
        try {
            //Realiza conexión con BD
            self::connect();
            //Inserta la sentencia sql
            self::$statement = self::$connection->prepare($query);
            //A la sentencia le agrega los parametros
            self::$statement->execute($values);
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return self::$statement->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            die(self::getException());
        }
    }

    

    //Retorna la ultima fila de registro creada
    public static function getLastRow($query, $values)
    {
        try {
            //Realiza conexión con BD
            self::connect();
            //Inserta la sentencia sql
            self::$statement = self::$connection->prepare($query);
            //Hacer una condición donde si recibe registro de retorno, saca el id del ultimo registro para terminar la consulta
            if (self::$statement->execute($values)) {
                $id = self::$connection->lastInsertId();
            } else {
                $id = 0;
            }
            // Se anula la conexión con el servidor de base de datos.
            self::$connection = null;
            return $id;
        } catch (PDOException $error) {
            // Se obtiene el código y el mensaje de la excepción para establecer un error personalizado.
            self::setException($error->getCode(), $error->getMessage());
            die(self::getException());
        }
    }

    // Establecer el mensaje de error personalizado en caso de exepción
    // Los parametros, son el codigo y el mensaje de error que provee la Base de datos
    private static function setException($code, $message)
    {
        // El codigo de error original
        self::$error = utf8_encode($message);
        // Se toman los errores existentes y se añaden a este switch para generar el mensaje personalizado
        switch ($code) {
            default:
                self::$error =  strval($code) . strval($message);
        }
    }

    //Obtener el mensaje de error personalizado en caso de exepción,
    //No hay parametros, solo retorna error personalizado de la sentencia SQL o de la conexión con el servidor de base de datos.
    public static function getException()
    {
        return self::$error;
    }
}
