import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Session } from '../../../modelo/util/session';
import { Observable } from 'rxjs';
import { NewSession } from '../../../modelo/util/newSession';
import { TableCreditos } from '../../../components/creditos/crud-creditos/TableCreditos';


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
export class CreditosService {
  // public urlBase = 'https://ws-sur-creditos.herokuapp.com';
  public urlBase = 'http://18.223.146.82:3001';

   // GET URLs
   public urlPostGetPlanDePago = this.urlBase + '/credito/calcular_plan_pago/';

   public urlPostGetAllCreditos2 = this.urlBase + '/credito/listar_creditos/';

   public urlPostGetAllCreditos = this.urlBase + '/credito/listar_creditos_admin/';
   public urlPostGuardarCredito = this.urlBase + '/credito/guardar/';
   public urlPostCambiarEstadoCredito = this.urlBase + '/credito/cambiar_estado/';
   public urlPostGetCreditoPorId = this.urlBase + '/credito/buscar_credito/';
   public urlPostGetAllCreditosTodosLosUsuarios = this.urlBase + '/credito/listar_todos/';
   public urlPostGetCreditoVitenge = this.urlBase + '/credito/consultar_plan_pago_vigente/';

   public Storage : TableCreditos;
  constructor(public http: HttpClient) { }

  // POST: Obtiene todos los clientes
  postGetPlanDePago(plan: any): Observable<any[]> {
    const newSession = Object.assign({}, plan);
    return this.http.post<any[]>(this.urlPostGetPlanDePago, newSession, cudOptions);
  }

  // Obtiene creditos que tiene el Admin para aprobar/rechazar
  postGetAllCreditos(session: Session): Observable<any[]> {
    const newSession = Object.assign({}, session);
    return this.http.post<any[]>(this.urlPostGetAllCreditos, newSession, cudOptions);
  }

  // Pbtiene creditos de un usuario particular, solo los que genero el usuario
  postGetAllCreditos2(session: Session): Observable<any[]> {
    const newSession = Object.assign({}, session);
    return this.http.post<any[]>(this.urlPostGetAllCreditos2, newSession, cudOptions);
  }

  // Obtiene todos los creditos generados por cualquier usuario, lo puede ver el admisnitrador o root
    postGetAllCreditosTodosLosUsuarios(session: Session): Observable<any[]> {
    const newSession = Object.assign({}, session);
    return this.http.post<any[]>(this.urlPostGetAllCreditosTodosLosUsuarios, newSession, cudOptions);
  }


  postGuardarCredito(credito: any): Observable<any[]> {
    const newSession = Object.assign({}, credito);
    return this.http.post<any[]>(this.urlPostGuardarCredito, newSession, cudOptions);
  }

  postCambiarEstadoCredito(credito: any): Observable<any[]>{
    const newSession = Object.assign({}, credito);
    return this.http.post<any[]>(this.urlPostCambiarEstadoCredito, newSession, cudOptions);
  }
  postGetCreditoPorId(idCredito: string, token: string): Observable<any[]>{
    let credito = {
      _id : idCredito,
      token: token
    };
    const newSession = Object.assign({}, credito);
    return this.http.post<any[]>(this.urlPostGetCreditoPorId, newSession, cudOptions);
  }

  postGetCreditosVigentes(session : Session, dni : string): Observable<any[]>{
    let parameters = {
      token : session.token,
      dni : dni
    };

    const newSessio = Object.assign({},parameters);
    return this.http.post<any[]>(this.urlPostGetCreditoVitenge,newSessio,cudOptions);
  }
}
