import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Clases Usadas
import { TipoDni } from '../../../modelo/negocio/tipoDni';
import { Provincia } from '../../../modelo/negocio/provincia';
import { EstadoCasa } from '../../../modelo/negocio/estado-casa';
import { TipoContacto } from '../../../modelo/negocio/tipo-contacto';
import { Rol } from '../../../modelo/negocio/rol';
import { Session } from 'src/app/modelo/util/session';
import { LoginService } from '../login/login.service';
import { TokenPost } from 'src/app/modelo/util/token';
import { Domicilio } from '../../../modelo/negocio/domicilio';
import { User } from '../../../../../../appWeb3/src/app/user';



const cudOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
const cudOptionsXWWForm = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'})
};
const cudOptionsHtml = {
  headers: new HttpHeaders({ 'Content-Type': 'text/html; charset=utf-8'})
};




@Injectable({
  providedIn: 'root'
})




export class UsuariosService {
  // headers = new Headers();

  // URLs de Credisur
  public urlBase = 'https://ws-sur-creditos.herokuapp.com';
  public postNuevaPersonaUrl = this.urlBase + '/nueva_persona';
  public postNuevaDomicilioUrl = this.urlBase + '/log/nuevo';
  public postNuevoContactoUrl = this.urlBase + '/nuevo_contacto';
  public postNuevoUsuarioUrl = this.urlBase + '/nuevo_usuario';

  public urlGetTiposDni = this.urlBase + '/persona/tipos_dni';
  public urlGetProvincias = this.urlBase + '/domicilio/provincias';
  public urlGetEstadosCasa = this.urlBase + '/domicilio/estadoscasa';
  public urlGetTiposContacto = this.urlBase + '/contacto/tipos';
  public urlGetRoles = this.urlBase + '/usuario/roles_permitidos';
  public urlGetUsuarios = this.urlBase + '/usuario/todos/';

  // POST URLs
  public urlPostTokenLogin = this.urlBase + '/usuario/ingresar';

  public urlDeleteUsuario = this.urlBase + '/usuario/delete/';

  constructor(public http: HttpClient, private loginService: LoginService) {
  }

  // GET SERVICES PARA FORMULARIO DE ALTA DE USUARIO
  getAllTipoDni(): Observable<TipoDni[]> {
    return this.http.get<TipoDni[]>(this.urlGetTiposDni);
  }
  getAllProvincia(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(this.urlGetProvincias);
  }
  getAllEstadoCasa(): Observable<EstadoCasa[]> {
    return this.http.get<EstadoCasa[]>(this.urlGetEstadosCasa);
  }
  getAllTipoContacto(): Observable<TipoContacto[]> {
    return this.http.get<TipoContacto[]>(this.urlGetTiposContacto);
  }

  // LLamada a Webservice Get con parametro en URL
  /* getAllRoles(token: string): Observable<Rol[]> {
    this.urlGetRoles = this.urlGetRoles + '?token=' + token;
    return this.http.get<Rol[]>(this.urlGetRoles);
  } */




  // POST SERVICES PARA LOGIN
  postLogin(session: Session) {
    const newSession = Object.assign({}, session);
    return this.http.post<any>(this.urlPostTokenLogin, newSession, cudOptions);
  }

  postGetRoles(token: TokenPost): Observable<Rol[]> {
    const newContacto = Object.assign({}, token);
    // return this.http.post<Rol[]>(this.urlBase + '/log/nuevo', newContacto, cudOptions);
    return this.http.post<Rol[]>(this.urlGetRoles, newContacto, cudOptions);
  }

  postGetAllUsuarios(token: TokenPost): Observable<any[]> {
    const newSession = Object.assign({}, token);
    return this.http.post<any>(this.urlGetUsuarios, token, cudOptions);

  }


 /*  let tok2 = ({
    campo : 'testCampo',
    valor : 'testValor'
  }); */

}
