//@ts-check

import {
  SERVER,
  GET_METHOD,
  API_SUCESS_REQUEST,
  API_CHECK_SESSION,
} from "../../controller/constants/api_constant.js";
import { APIConnection } from "../APIConnection.js";


const API_USUARIOS = SERVER + "privada/usuario.php?action=";
const API_USUARIOS_PUBLIC = SERVER + "publica/usuario.php?action=";

export function getElementById(elementID) {
  return document.getElementById(elementID);
}

export async function validateExistenceOfUser() {
  //CODIGO PARA VALIDAR SI HAY UNA SESION ACTIVA
  // SE DEBE DE PEGAR EN TODOS LOS EVENTOS QUE SE EJECUTAN CUANDO SE CARGA LA PAGINA
  let APIEndpoint = API_USUARIOS + "checkSession";
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  console.log(APIResponse)
  if (APIResponse.status == API_SUCESS_REQUEST) {
    // location.href = "index.html";
    return;
  }

  APIEndpoint = API_USUARIOS + "getUser";
    await APIConnection(APIEndpoint, GET_METHOD, null);
}

export async function validateExistenceOfUserPublic(es_pagina_carrito) {
  //CODIGO PARA VALIDAR SI HAY UNA SESION ACTIVA
  // SE DEBE DE PEGAR EN TODOS LOS EVENTOS QUE SE EJECUTAN CUANDO SE CARGA LA PAGINA
  let APIEndpoint = API_USUARIOS_PUBLIC + API_CHECK_SESSION;
  let APIResponse = await APIConnection(APIEndpoint, GET_METHOD, null);
  // Se define una variable para asignar el encabezado del documento.
  let content = "";

  if (es_pagina_carrito && APIResponse.session != API_SUCESS_REQUEST) {
    location.href = "login.html";
  } else if (APIResponse.session == API_SUCESS_REQUEST) {
    //Se le asigna un valor al header
    content = `
            <!-- Boton de registrarse-->
                <button onclick="logOut()" class="btn btn-danger" type="submit" id="registrate"><img
                        src="../../resources/img/navbar/user_25px.png"> Cerrar Sesión</button>
            <!-- Imagenes para ordenes/recibo -->
                <img class="redesSociales" src="../../resources/img/navbar/shopping_cart_with_money_35px.png"
                usemap="#carrito">
                <img class="redesSociales" src="../../resources/img/navbar/bill_35px.png" usemap="#historial">
                <map name="historial">
                    <area shape="rect" coords="15,0,35,35" href="historial_compras.html">
                </map>
                <map name="carrito">
                    <area shape="rect" coords="15,0,35,35" href="carrito.html">
                </map>
                <!-- Dropdown de idiomas -->
                <div class="btn-group">
                    <button class="btn btn-secondary btn-sm dropdown-toggle" type="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="../../resources/img/navbar/el_salvador_35px.png">
                    </button>
                    <ul class="dropdown-menu">
                        <a class="dropdown-item" href="#">Español</a>
                        <a class="dropdown-item" href="#">Ingles</a>
                   </ul>
                </div>

    `;
  } else {
    content  = `
        <!-- Boton de registrarse-->
        <a class="btn btn-danger" href="login.html" id="registrate"><img 
            src="../../resources/img/navbar/user_25px.png"> Registrate</a>
        <!-- Imagenes para ordenes/recibo -->
        <img class="redesSociales" src="../../resources/img/navbar/shopping_cart_with_money_35px.png"
            usemap="#carrito">
        <img class="redesSociales" src="../../resources/img/navbar/bill_35px.png" usemap="#historial">
        <map name="historial">
            <area shape="rect" coords="15,0,35,35" href="historial_compras.html">
        </map>
        <map name="carrito">
            <area shape="rect" coords="15,0,35,35" href="carrito.html">
        </map>
        <!-- Dropdown de idiomas -->
        <div class="btn-group">
        <button class="btn btn-secondary btn-sm dropdown-toggle" type="button"
            data-bs-toggle="dropdown" aria-expanded="false">
                <img src="../../resources/img/navbar/el_salvador_35px.png">
            </button>
        <ul class="dropdown-menu">
        <a class="dropdown-item" href="#">Español</a>
        <a class="dropdown-item" href="#">Ingles</a>
        </ul>
        </div>

    `;
  }
  // Se asigna a la página web el contenido del encabezado.
  //@ts-ignore
  getElementById("segunda_mitad_navbar").innerHTML = content;
  return;
}

export async function getUser(){
  let APIEndpoint = API_USUARIOS_PUBLIC + "getUser";
  let APIResponseGetUset = await APIConnection(APIEndpoint, GET_METHOD, null);
  if(APIResponseGetUset == API_SUCESS_REQUEST){

  }
  return;
}


//Convierte el datos del id de json a formData
export function getFormData(object) {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  console.log(formData);
  return formData;
}


//CREANDO FUNCTION LOGOUT
//@ts-ignore
window.logOut = async () => {
    let APIEndpoint = API_USUARIOS + 'logOut'
    let APIResponse = await APIConnection(APIEndpoint,GET_METHOD,null)

    if (APIResponse.status == API_SUCESS_REQUEST) {
        location.href = "index.html";
        return 
    }
    console.log("SOMETING WENT WRONG")
}
