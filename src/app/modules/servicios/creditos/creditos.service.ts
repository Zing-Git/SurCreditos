import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Session } from '../../../modelo/util/session';
import { Observable } from 'rxjs';


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
  public urlBase = 'https://ws-sur-creditos.herokuapp.com';
   // GET URLs
   public urlPostGetPlanDePago = this.urlBase + '/credito/calcular_plan_pago/';
   public urlPostGetAllCreditos = this.urlBase + '/credito/listar_creditos/';
   public urlPostGuardarCredito = this.urlBase + '/credito/guardar/';
   public urlPostCambiarEstadoCredito = this.urlBase + '/credito/cambiar_estado';

  constructor(public http: HttpClient) { }

  // POST: Obtiene todos los clientes
  postGetPlanDePago(plan: any): Observable<any[]> {
    const newSession = Object.assign({}, plan);
    return this.http.post<any[]>(this.urlPostGetPlanDePago, newSession, cudOptions);
  }

  postGetAllCreditos(session: Session): Observable<any[]> {
    const newSession = Object.assign({}, session);
    return this.http.post<any[]>(this.urlPostGetAllCreditos, newSession, cudOptions);
  }

  postGuardarCredito(credito: any): Observable<any[]> {
    const newSession = Object.assign({}, credito);
    return this.http.post<any[]>(this.urlPostGuardarCredito, newSession, cudOptions);
  }

  postCambiarEstadoCredito(credito: any):Observable<any[]>{
    const newSession = Object.assign({}, credito);
    return this.http.post<any[]>(this.urlPostCambiarEstadoCredito, newSession,cudOptions);
  }
}
