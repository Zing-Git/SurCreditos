import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
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
export class CajaService {
  // public urlBase = 'https://ws-sur-creditos.herokuapp.com';
  public urlBase = 'http://18.223.146.82:3001';

  public urlGetComboCaja = this.urlBase + '/caja/consultar_combos/';
  public urlRegistrarMovimiento = this.urlBase + '/caja/registrar_movimientos/';
  public urlAbrirCaja = this.urlBase + '/caja/abrir/';
  public urlCerrarCaja = this.urlBase + '/caja/cerar/';
  public urlVerificarEstadoCaja = this.urlBase + '/caja/obtener_caja_abierta/';



  constructor(public http: HttpClient) { }

  /* postPagarCuota(pago: Pago): Observable<any[]>{
    const paramnetros ={
      token: pago.token,
      cuotas: pago.cuotas
    };
    const newSession = Object.assign({}, paramnetros);
    return this.http.post<any[]>(this.urlPagarCuota, newSession, cudOptions);
  }
  postGuardarCredito(asignacionDeCobranzas: any): Observable<any> {
    const newSession = Object.assign({}, asignacionDeCobranzas);
    return this.http.post<any[]>(this.urlAsignarCuotasACobrador, newSession, cudOptions);
  } */

  // INGRESO EGRESO DE CAJA
  postGetComboIngresoEgreso(token: any): Observable<any> {
    const parametros = {
      token: token
    };
    const newSession = Object.assign({}, parametros);
    return this.http.post<any[]>(this.urlGetComboCaja, newSession, cudOptions);
  }
  postRegistrarMovimiento(movimiento: any): Observable<any> {
    const newSession = Object.assign({}, movimiento);
    return this.http.post<any>(this.urlRegistrarMovimiento, newSession, cudOptions);
  }
  postAbrirCaja(caja: any): Observable<any> {
    const newSession = Object.assign({}, caja);
    return this.http.post<any>(this.urlAbrirCaja, newSession, cudOptions);
  }
  postCerrarCaja(token: any): Observable<any> {
    const parametros = {
      token: token
    };
    const newSession = Object.assign({}, parametros);
    return this.http.post<any>(this.urlCerrarCaja, newSession, cudOptions);
  }
  postVerificarEstadoDeCaja(idUsuario: string): Observable<any> {
    const parametros = {
      usuario: idUsuario
    };
    const newSession = Object.assign({}, parametros);
    return this.http.post<any>(this.urlVerificarEstadoCaja, newSession, cudOptions);
  }



}
