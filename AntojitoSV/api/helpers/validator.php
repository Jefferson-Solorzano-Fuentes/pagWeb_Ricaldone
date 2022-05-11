<?php
// Validar la entradas de datos desde los formularios hasta la base de datos
// Es padre de los modelos ya que estos utilizando las validaciones de esta clase

class Validator
{

    // Propiedades para las algunas validaciones
    private $passwordError = null;
    private $fileError = null;
    private $fileName = null;

    //Método para obtener el error al validar una contraseña.

    public function getPasswordError()
    {
        return $this->passwordError;
    }


    //Método para obtener el nombre del archivo validado previamente.

    public function getFileName()
    {
        return $this->fileName;
    }


    //Método para obtener el error al validar un archivo.

    public function getFileError()
    {
        return $this->fileError;
    }

    // Función Trim, eliminar los espacios en blanco que estan antes y después de una consulta.
    // Utiliza como parametro "$fields" que es un array con los campos del formulario escritos
    public function validateSpace($fields)
    {
        // Por cada campo, se realiza un trim, hasta llegar al ultimo campo
        foreach ($fields as $index => $value) {
            $value = trim($value);
            $fields[$index] = $value;
        }
        // Retorna el arreglo de campos ya trimmeados
        return $fields;
    }

    // Función para que el numero sea natural, para cosas como llaves primarias y foraneas
    // Utiliza como parametro "$value" que es UN solo valor a validar
    public function validateNaturalNumber($value)
    {
        // Validar si el valor es mayor o igual 1 positivo
        if (filter_var($value, FILTER_VALIDATE_INT, array('min_range' => 1))) {
            return true;
        } else {
            return false;
        }
    }

    // Función para validar que el archivo sea una imagen
    // Parámetros: $file (archivo de un formulario), $maxWidth (ancho máximo para la imagen) y $maxHeigth (alto máximo para la imagen).
    public function validateImageFile($file, $maxWidth, $maxHeigth)
    {
        // Verifica si el archivi existe, si no muestra un error
        if ($file) {
            // Se comprueba si el archivo tiene un tamaño menor o igual a 2MB, de lo contrario se establece el mensaje de error correspondiente.
            if ($file['size'] <= 2097152) {
                // Se obtienen las dimensiones de la imagen y su tipo.
                list($width, $height, $type) = getimagesize($file['tmp_name']);
                // Se verifica si la imagen cumple con las dimensiones máximas, de lo contrario se establece el mensaje de error correspondiente.
                if ($width <= $maxWidth && $height <= $maxHeigth) {
                    // Se comprueba si el tipo de imagen es permitido (2 - JPG y 3 - PNG), de lo contrario se establece el mensaje de error correspondiente.
                    if ($type == 2 || $type == 3) {
                        // Se obtiene la extensión del archivo y se convierte a minúsculas.
                        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                        // Se utiliza una extensión para hacer unico el archivo.
                        $this->fileName = uniqid() . '-' . $extension;
                        return true;
                    } else {
                        $this->fileError = 'El tipo de imagen debe ser jpg o png';
                        return false;
                    }
                } else {
                    $this->fileError = 'La dimensión de la imagen es incorrecta';
                    return false;
                }
            } else {
                $this->fileError = 'El tamaño de la imagen debe ser menor a 2MB';
                return false;
            }
        } else {
            $this->fileError = 'El archivo de la imagen no existe';
            return false;
        }
    }

    // Validar que en los campos de correo electronico, sean correos verificables
    // Utiliza el parametro "$value" que es valor del campo a validar
    public function validateEmail($value)
    {
        //Valida si existe el correo y retorna un valor booleano
        if (filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return true;
        } else {
            return false;
        }
    }

    // Validar que los campos sean booleanos
    // Utiliza el parametro "$value" que es valor del campo a validar
    public function validateBoolean($value)
    {
        //Valida si el valor es en efecto, un booleano, retornando un booleano
        if ($value == 1 || $value == 0 || $value == true || $value == false) {
            return true;
        } else {
            return false;
        }
    }

    // Validar una cadena de texto (letras, digitos, espacios en blanco y signos de puntuación).
    // Utilizar parametros "$value" que es el valor del campo a validar, "$minimum" para la longitud de caracteres más corto y "$maximum" para el maximo.
    public function validateString($value, $minimum, $maximum)
    {
        //Se valida el contenido y longitud segun la base de datos
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s\,\;\.]{' . $minimum . ',' . $maximum . '}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    // Validar una cadena de texto (Solo valores Alfabeticos y espacios)
    // Utilizar parametros "$value" que es el valor del campo a validar, "$minimum" para la longitud de caracteres más corto y "$maximum" para el maximo.
    public function validateAlphabetic($value, $minimum, $maximum)
    {
        //Se valida el contenido y longitud segun la base de datos
        if (preg_match('/^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s]{' . $minimum . ',' . $maximum . '}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    // Validar una cadena de texto (Solo valores Alfabeticos, numericos y espacios)
    // Utilizar parametros "$value" que es el valor del campo a validar, "$minimum" para la longitud de caracteres más corto y "$maximum" para el maximo.
    public function validateAlphanumeric($value, $minimum, $maximum)
    {
        //Se valida el contenido y longitud segun la base de datos
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s]{' . $minimum . ',' . $maximum . '}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    // Validar una cadena de texto (Solo valores monetarios)
    // Utilizar parametros "$value" que es el valor del campo a validar.   
    public function validateMoney($value)
    {
        // Se verifica que el número tenga una parte entera y como máximo dos cifras decimales.
        if (preg_match('/^[0-9]+(?:\.[0-9]{1,2})?$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    // Validar una contraseña
    // Utilizar parametros "$value" que es el valor del campo a validar.   
    public function validatePassword($value)
    {
        //Se verifica la longitud minima y maxima
        if (strlen($value) >= 6 && strlen($value) <= 72) {
            return true;
        } else {
            $this->passwordError = "Clave afuera de rango, menor a 6 o mayor a 72";
            return false;
        }
    }

    // Validar una cadena de texto (Que sea para un VIN)
    // Utilizar parametros "$value" que es el valor del campo a validar, "$minimum" para la longitud de caracteres más corto y "$maximum" para el maximo.
    public function validateVIN($value)
    {
        //Se valida el contenido y longitud segun la base de datos
        if (preg_match('/^[P][A-Z]{4}[0-9]{2}[A-Z]{4}[0-9]{6}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    // Validar una cadena de texto (Que sea para un VIN)
    // Utilizar parametros "$value" que es el valor del campo a validar, "$minimum" para la longitud de caracteres más corto y "$maximum" para el maximo.
    public function validatePlaca($value)
    {
        //Se valida el contenido y longitud segun la base de datos
        if (preg_match('/^[P][0-9]{6}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    // Utilizar parametros "$value" que es el valor del campo a validar.  
    public function validateNIT($value)
    {
        //Se verifica el formato de 0000-000000-000-0
        if (preg_match('/^[0-9]{4}[-][0-9]{6}[-][0-9]{3}[-][0-9]{1}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    // Utilizar parametros "$value" que es el valor del campo a validar.  
    public function validateDUI($value)
    {
        //Se verifica el formato de 0000-000000-000-0
        if (preg_match('/^[0-9]{8}[-][0-9]{1}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }

    // Validar un numero de telefono
    // Utilizar parametros "$value" que es el valor del campo a validar.  
    public function validatePhone($value)
    {
        //Se verifica el formato de +00000000000
        if (preg_match('/^[+][0-9]{3}[0-9]{8}$/', $value)) {
            return true;
        } else {
            return false;
        }
    }


    // Validar una fecha
    // Utilizar parametros "$value" que es el valor del campo a validar.  
    public function validateDate($value)
    {
        // Se dividen las partes de la fecha y se guardan en un arreglo en el siguiene orden: año, mes y día.
        $date = explode('-', $value);
        if (checkdate($date[1], $date[2], $date[0])) {
            return true;
        } else {
            return false;
        }
    }

    // Validar la ubicación de un archivo antes de subirlo al servidor.
    // Utilizar parametros $file (archivo), $path (ruta del archivo) y $name (nombre del archivo)
    public function saveFile($file, $path, $name)
    {
        // Se comprueba que la ruta en el servidor exista.
        if (file_exists($path)) {
            // Se verifica que el archivo sea movido al servidor.
            if (move_uploaded_file($file['tmp_name'], $path . $name)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }


    // Validar la ubicación de un archivo antes de borrarlo del servidor.
    // Utilizar parametros $file (archivo), $path (ruta del archivo) y $name (nombre del archivo)
    public function deleteFile($path, $name)
    {
        // Se verifica que la ruta exista.
        if (file_exists($path)) {
            // Se comprueba que el archivo sea borrado del servidor.
            if (@unlink($path . $name)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}
