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
export class OrdenPagoService {
  // public urlBase = 'https://ws-sur-creditos.herokuapp.com';
  public urlBase = 'http://18.223.146.82:3001';
  public urlPostBuscarOrdenPagoPorDni = this.urlBase + '/credito/buscar_orden_pago/';
  public urlPostOrdenPagoVigentePorDni = this.urlBase + '/credito/consultar_plan_pago_vigente/'
  public urlPostPagarOrdenDePago = this.urlBase + '/credito/pagar_orden_pago/';

  constructor(public http: HttpClient) { }

  postGetOrdenPagoPorDni(session: Session, dni: string): Observable<any[]>{
    const parametros= {
      token: session.token,
      dni: dni
    };

    const newSession = Object.assign({}, parametros);
    return this.http.post<any[]>(this.urlPostBuscarOrdenPagoPorDni, newSession, cudOptions);
  }

  postGetOrdenPagoVigentePorDni(session: Session, dni: string): Observable<any[]>{
    const parametros= {
      token: session.token,
      dni: dni
    };

    const newSession = Object.assign({}, parametros);
    return this.http.post<any[]>(this.urlPostOrdenPagoVigentePorDni, newSession, cudOptions);
  }

  postPagarOrdenDePago(idOrden: string, token: string, medioPago: string){

    const paramnetros ={
      token: token,
      idOrden: idOrden,
      medioPago: medioPago
    };
    const newSession = Object.assign({}, paramnetros);
    return this.http.post<any[]>(this.urlPostPagarOrdenDePago, newSession, cudOptions);
  }
}
