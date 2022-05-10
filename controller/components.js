//CONTROLADOR GENERAL DE LA PAGINA WEB
//Constante para establecer la ruta del servidor.
const SERVER = 'http://localhost/AntojitoSV/api/';
const POST_METHOD = 'post'
const GET_METHOD = 'get'
//Importar la función de APIconnection


/*function readRows(api){
    body = null;
    APIConnection(api + 'readAll', GET_METHOD, body);
} */

// Metodo para leer todos los registros de una tabla
// API es la api de php de dicha tabla
export function readRows(api) {
    fetch(api + 'readAll', {
        method: 'get'
    }).then(request => request.json().then(response => {
        let data = [];
        console.log(["ALL GOOD"]);

        console.log(response);
        // Se comprueba si la respuesta es satisfactoria para obtener los datos, de lo contrario se muestra un mensaje con la excepción.
        if (response.status) {
            data = response.dataset;
        } else {
            console.log(["ALL BAD"]);

            sweetAlert(4, response.exception, null);
        }
        // Se envían los datos a la función del controlador para llenar la tabla en la vista.
        fillTable(data);
    }));
}


/*function searchRows(api, form) {
    body = new FormData(document.getElementById(form));
    APIConnection(api+'search', POST_METHOD, body);
}*/

// Metodo para obtener los resultados de una busqueda
// API es la api de php de dicha tabla y form es el formulario de la vista que se utiliza
function searchRows(api, form) {
    fetch(api + 'search', {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se envían los datos a la función del controlador para que llene la tabla en la vista y se muestra un mensaje de éxito.
                    fillTable(response.dataset);
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}


// Metodo para crear o actualizar un registro en los mantenimientos de tablas 
// API es la api de php de dicha tabla, la accion ya sea agregar, actulizar o borrar, el form que es el id del formulario y el modal que es el contendor del formulario

function saveRow(api, action, form, modal) {
    fetch(api + action, {
        method: 'post',
        body: new FormData(document.getElementById(form))
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Se cierra la caja de dialogo (modal) del formulario.
                    M.Modal.getInstance(document.getElementById(modal)).close();
                    // Se cargan nuevamente las filas en la tabla de la vista después de guardar un registro y se muestra un mensaje de éxito.
                    readRows(api);
                    sweetAlert(1, response.message, null);
                } else {
                    sweetAlert(2, response.exception, null);
                }
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}

// Metodo para cargar las opciones en un select de formulario.
// endpoint (ruta específica del servidor para obtener los datos), select (identificador del select en el formulario) y selected (valor seleccionado).
function fillSelect(endpoint, select, selected) {
    fetch(endpoint, {
        method: 'get'
    }).then(function (request) {
        // Se verifica si la petición es correcta, de lo contrario se muestra un mensaje en la consola indicando el problema.
        if (request.ok) {
            // Se obtiene la respuesta en formato JSON.
            request.json().then(function (response) {
                let content = '';
                // Se comprueba si la respuesta es satisfactoria, de lo contrario se muestra un mensaje con la excepción.
                if (response.status) {
                    // Si no existe un valor para seleccionar, se muestra una opción para indicarlo.
                    if (!selected) {
                        content += '<option disabled selected>Seleccione una opción</option>';
                    }
                    // Se recorre el conjunto de registros devuelto por la API (dataset) fila por fila a través del objeto row.
                    response.dataset.map(function (row) {
                        // Se obtiene el dato del primer campo de la sentencia SQL (valor para cada opción).
                        value = Object.values(row)[0];
                        // Se obtiene el dato del segundo campo de la sentencia SQL (texto para cada opción).
                        text = Object.values(row)[1];
                        // Se verifica si el valor de la API es diferente al valor seleccionado para enlistar una opción, de lo contrario se establece la opción como seleccionada.
                        if (value != selected) {
                            content += `<option value="${value}">${text}</option>`;
                        } else {
                            content += `<option value="${value}" selected>${text}</option>`;
                        }
                    });
                } else {
                    content += '<option>No hay opciones disponibles</option>';
                }
                // Se agregan las opciones a la etiqueta select mediante su id.
                document.getElementById(select).innerHTML = content;
                // Se inicializa el componente Select del formulario para que muestre las opciones.
                M.FormSelect.init(document.querySelectorAll('select'));
            });
        } else {
            console.log(request.status + ' ' + request.statusText);
        }
    });
}