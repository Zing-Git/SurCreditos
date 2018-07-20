import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

// Clases Usadas
import { TipoDni } from "../../../modelo/negocio/tipoDni";
import { Provincia } from "../../../modelo/negocio/provincia";
import { EstadoCasa } from "../../../modelo/negocio/estado-casa";
import { TipoContacto } from "../../../modelo/negocio/tipo-contacto";
import { Rol } from "../../../modelo/negocio/rol";
import { Session } from "src/app/modelo/util/session";
import { LoginService } from "../login/login.service";

const cudOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
@Injectable({
  providedIn: "root"
})
export class UsuariosService {
  // headers = new Headers();

  // URLs de Credisur
  public urlBase = "https://ws-sur-creditos.herokuapp.com";
  public postNuevaPersonaUrl = this.urlBase + "/nueva_persona";
  public postNuevaDomicilioUrl = this.urlBase + '/nuevo_domicilio';
  public postNuevoContactoUrl = this.urlBase + '/nuevo_contacto';
  public postNuevoUsuarioUrl = this.urlBase + '/nuevo_usuario';

  public urlGetTiposDni = this.urlBase + '/persona/tipos_dni';
  public urlGetProvincias = this.urlBase + '/domicilio/provincias';
  public urlGetEstadosCasa = this.urlBase + '/domicilio/estadoscasa';
  public urlGetTiposContacto = this.urlBase + '/contacto/tipos';
  public urlGetRoles = this.urlBase + '/usuario/roles_permitidos';
  // public urlGetRoles = this.urlBase + '/usuario/roles';
  public urlGetUsuarios = this.urlBase + '/usuario/getAllUsers_';

  // POST URLs
  public urlPostTokenLogin = this.urlBase + '/usuario/ingresar';

  public urlDeleteUsuario = this.urlBase + '/usuario/delete/';

  constructor(private http: HttpClient, private loginService: LoginService) {
    // tslint:disable-next-line:max-line-length
    // this.headers.append('token',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7ImVzdGFkbyI6dHJ1ZSwiY29udGFjdG9zIjpbIjViMmQwNDU1ZGE2MzRmMDAxNDMxYWIxMSIsIjViMmQwNDU1ZGE2MzRmMDAxNDMxYWIxMyIsIjViMmQwNDU1ZGE2MzRmMDAxNDMxYWIxNSJdLCJfaWQiOiI1YjJkMDQ1NmRhNjM0ZjAwMTQzMWFiMTciLCJwZXJzb25hIjoiNWIyZDA0NTVkYTYzNGYwMDE0MzFhYjEwIiwibm9tYnJlVXN1YXJpbyI6ImVtYW51ZWwiLCJjbGF2ZSI6IiQyYiQxMCRxUlFHUk1NNVhhWWpEV1FJWFBYSEFlQm1xS0MxZnRoTkdHcWNCbWtIREFTZkdveG5OMDFiZSIsInJvbCI6eyJfaWQiOiI1YjIxMWZlY2JhYzM5NTI5ODhjYTkyYjAiLCJwcmVjZWRlbmNpYSI6Mn0sImZlY2hhQWx0YSI6IjIwMTgtMDYtMjJUMTQ6MTQ6NDYuMjYwWiIsIl9fdiI6MH0sImlhdCI6MTUzMTE1MjkzOCwiZXhwIjoxNTMzNzQ0OTM4fQ.kEi4EboioEEddww3wnmdyqSiJ6ey7Gf9PBnRGLYCrBU");
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
  getAllRol(): Observable<Rol[]> {
    // let head = new HttpHeaders().set('token', this.loginService.getTokenDeSession());
     /* head.append('token', this.loginService.getTokenDeSession());

      console.log('CONTENT:  ', head.get('Content-Type'));
      console.log('HEADER CONTIENE:  ', head.get('token'));
 */
    let headers = new HttpHeaders().set ('token', sessionStorage.getItem ('token'));

    console.log('HEADER CONTIENE:  ', headers.get('token'));
    return this.http.get<Rol[]>(this.urlGetRoles, {
      // headers: new HttpHeaders().set('token', this.loginService.getTokenDeSession())
      headers: headers
    });
  }

  // POST SERVICES PARA LOGIN
  postLogin(session: Session) {
    const newSession = Object.assign({}, session);
    return this.http.post<any>(this.urlPostTokenLogin, newSession, cudOptions);
  }
}
