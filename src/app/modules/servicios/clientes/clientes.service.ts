import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Session } from '../../../modelo/util/session';


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
export class ClientesService {
  public urlBase = 'http://18.223.146.82:3001';
  // public urlBase = 'https://ws-sur-creditos.herokuapp.com';

  // GET URLs
  public urlPostBuscarPorDni = this.urlBase + '/cliente/buscar_por_dni/';  ///credito/buscar_orden_pago/
  public urlPostGetTodos = this.urlBase + '/cliente/todos';
  public urlPostGetCombos = this.urlBase + '/cliente/combos/';
  public urlPostBuscarComercioPorCuit = this.urlBase + '/comercio/buscar/';
  public urlPostGuardarCliente = this.urlBase + '/cliente/nuevo/';
  public urlPostGuardarComercio = this.urlBase + '/cliente/agregar_comercio/';
  public urlPostAgregarReferenciaComercio = this.urlBase + '/comercio/agregar_referencia/';
  public urlPostAgregarReferenciaCliente = this.urlBase + '/cliente/agregar_referencia/';
  public urlPostGetClientesActivos = this.urlBase + '/credito/listar_clientes_activos/';



  constructor(public http: HttpClient) { }

  // POST: Obtiene todos los clientes
  postGetClientes(session: Session): Observable<any[]> {
    const newSession = Object.assign({}, session);
    return this.http.post<any[]>(this.urlPostGetTodos, newSession, cudOptions);
  }

  // POST: Busca por Dni
  postGetClientePorDni(session: Session, dni: string): Observable<any[]> {
    const parametros = {
      token: session.token,
      dni: dni
    };
    const newSession = Object.assign({}, parametros);
    return this.http.post<any[]>(this.urlPostBuscarPorDni, newSession, cudOptions);
  }

  // POST: Obtiene todos los combos a cargar en pantalla de creditos
  postGetCombos(): Observable<any[]> {
    // const newSession = Object.assign({}, session);
    return this.http.post<any[]>(this.urlPostGetCombos, cudOptions);
  }
  postGetComercioPorCuit(session: Session, cuit: string): Observable<any[]> {
    const parametros = {
      token: session.token,
      cuit: cuit
    };
    const newSession = Object.assign({}, parametros);
    return this.http.post<any[]>(this.urlPostBuscarComercioPorCuit, newSession, cudOptions);
  }
  postGuardarCliente(cliente: any): Observable<any[]> {
    const newSession = Object.assign({}, cliente);
    return this.http.post<any[]>(this.urlPostGuardarCliente, newSession, cudOptions);
  }
  postGuardarComercio(comercio: any): Observable<any[]> {
    const newSession = Object.assign({}, comercio);
    return this.http.post<any[]>(this.urlPostGuardarComercio, newSession, cudOptions);
  }

  postAgregarReferenciaCliente(referencia: any): Observable<any[]> {
    const newSession = Object.assign({}, referencia);
    return this.http.post<any[]>(this.urlPostAgregarReferenciaCliente, newSession, cudOptions);
  }
  postAgregarReferenciaComercio(comercio: any): Observable<any[]> {
    const newSession = Object.assign({}, comercio);
    return this.http.post<any[]>(this.urlPostAgregarReferenciaComercio, newSession, cudOptions);
  }
  // Clientes Activos son los que tienen un credito pendiente de cobro
  postGetClientesActivos(session: Session): Observable<any[]> {
    const newSession = Object.assign({}, session);
    return this.http.post<any[]>(this.urlPostGetClientesActivos, newSession, cudOptions);
  }

}
