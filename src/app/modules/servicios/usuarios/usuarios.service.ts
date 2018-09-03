import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Clases Usadas
import { TipoDni } from '../../../modelo/negocio/tipoDni';
import { Provincia } from '../../../modelo/negocio/provincia';
import { EstadoCasa } from '../../../modelo/negocio/estado-casa';
import { TipoContacto } from '../../../modelo/negocio/tipo-contacto';
import { Rol } from '../../../modelo/negocio/rol';
import { Session } from '../../../modelo/util/session';
import { LoginService } from '../login/login.service';
import { TokenPost } from '../../../modelo/util/token';
import { environment } from '../../../../environments/environment.prod';




const cudOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
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
  // public urlBase = environment.URL_BASE_WEBSERVICES;
  // public urlBase = 'https://ws-sur-creditos.herokuapp.com';
  public urlBase = 'http://18.223.146.82:3001';

/*   public postNuevaPersonaUrl = this.urlBase + '/nueva_persona';
  public postNuevaDomicilioUrl = this.urlBase + '/log/nuevo';
  public postNuevoContactoUrl = this.urlBase + '/nuevo_contacto'; */

  // GET URLs
  public urlPostGetPersonaPorDni = this.urlBase + '/persona/obtener_persona/';
  public urlGetTiposDni = this.urlBase + '/persona/tipos_dni';
  public urlGetProvincias = this.urlBase + '/domicilio/provincias';
  public urlGetEstadosCasa = this.urlBase + '/domicilio/estadoscasa';
  public urlGetTiposContacto = this.urlBase + '/contacto/tipos';
  public urlGetRoles = this.urlBase + '/usuario/roles_permitidos';
  public urlGetUsuarios = this.urlBase + '/usuario/todos/';
  // POST URLs
  public postNuevoUsuarioUrl = this.urlBase + '/usuario/nuevo';
  public urlPostTokenLogin = this.urlBase + '/usuario/ingresar';
  public urlPostSearchUsuario = this.urlBase + '/usuario/buscar_por_dni/';
  public urlPostBlanquearClaveUsuario = this.urlBase + '/usuario/blanquear_claves';

  // DELETE URLs
  public urlDeleteUsuario = this.urlBase + '/usuario/deshabilitar/';



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
  // POST SERVICES   emanuel emanuel123 usuario administrador.....
  postLogin(session: Session) {
    const newSession = Object.assign({}, session);
    return this.http.post<any>(this.urlPostTokenLogin, newSession, cudOptions);
  }

  postGetRoles(token: TokenPost): Observable<Rol[]> {
    const newToken = Object.assign({}, token);
    return this.http.post<Rol[]>(this.urlGetRoles, newToken, cudOptions);
  }

  postGetAllUsuarios(token: TokenPost): Observable<any[]> {
    const newSession = Object.assign({}, token);
    return this.http.post<any>(this.urlGetUsuarios, token, cudOptions);
  }

  postAddUsuario(usuario: any): Observable<any[]> {
    const newUsuario = Object.assign({}, usuario);
    return this.http.post<any[]>(this.postNuevoUsuarioUrl, newUsuario, cudOptions);
  }
  postSearchdUsuario(parametros: any): Observable<any> {
    const newUsuario = Object.assign({}, parametros);
    return this.http.post<any>(this.urlPostSearchUsuario, newUsuario, cudOptions);
  }

  // DELETE Services
   deleteUsuario(token: string, idUsuario: string): Observable<any> {
     const url = `${this.urlDeleteUsuario}${idUsuario}/${token}`;
     // const url = `${this.urlDeleteUsuario}`;
     console.log('URL DELETE: ' , url);
    return this.http.delete<any>(url, cudOptions);
  }
  postDeleteUsuario(token: string, idUsuario: string): Observable<any> {
    const parametros = {
      token: token,
      idUsuario:  idUsuario
    };
    const newUsuario = Object.assign({}, parametros);
    return this.http.post<any>(this.urlDeleteUsuario, newUsuario, cudOptions);
  }

  // Este servicio blanque la clave, solo lo puede hacer el usuario ROOT o ADMIN
  postBlanquearClaveUsuario(token: string, idUsuario: string, clave: string): Observable<any> {
    const parametros = {
      token: token,
      usuarios:  [{
        _id: idUsuario,
        clave: clave
      }]
    };

    const newUsuario = Object.assign({}, parametros);
    return this.http.post<any>(this.urlPostBlanquearClaveUsuario, newUsuario, cudOptions);
  }

  postGetPersona(token: string, dni: string): Observable<any> {
    const parametros = {
      token: token,
      dni: dni
    };
    const newUsuario = Object.assign({}, parametros);
    return this.http.post<any>(this.urlPostGetPersonaPorDni, newUsuario, cudOptions);
  }

}
