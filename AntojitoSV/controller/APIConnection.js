export async function APIConnection (APIEndpoint, Metodo, parametrosDePeticion) {
    //NOTAS:
    //lOS PARAMETROS DE PETICION YA DEBEN DE VENIR EN UNA INSTANCIA DEL OBJETO "FormData()"
    
        try {
            //Connectando a la API y guardando respuesta en variable "response"
            let response = await fetch(APIEndpoint, {
                method: Metodo,
                body: parametrosDePeticion
            });   
    
            // Se convierte la respuesta a formato "JSON", este devuelve una promesa asi que se usa el keyword "await"
           let responseJSON = await response.json();

            //Retorno la respuesta convertida a JSON que me da la consulta de la API
            return responseJSON;
    
        } catch (error) {
            //Caso de error retorno el error.
            console.log(error);
            return error;
        }
    } 