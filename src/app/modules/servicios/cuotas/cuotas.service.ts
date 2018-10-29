import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pago } from '../../../components/cuotas/modalCuotasSimuladas/simulador/pago';

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
export class CuotasService {
  // public urlBase = 'https://ws-sur-creditos.herokuapp.com';
  public urlBase = 'http://18.223.146.82:3001';
  public urlPagarCuota = this.urlBase + '/cuota/pagar/';
  public urlAsignarCuotasACobrador = this.urlBase + '/caja/asignar_cobranzas_cobrador/';
  public urlGetNominaCobranza = this.urlBase + '/caja/devolver_cobranzas_cobrador/';
  public urlGuardarCobranzasDeCobrador = this.urlBase + '/cuota/procesar_rendicion_cobrador/';




  constructor(public http: HttpClient) { }

  postPagarCuota(pago: Pago): Observable<any[]>{

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
  }
  postGetNominaDeCobranzas(idNomina: any): Observable<any> {
    const parametros = {
      idAsignacion: idNomina
    };
    const newSession = Object.assign({}, parametros);
    return this.http.post<any>(this.urlGetNominaCobranza, newSession, cudOptions);
  }
  postGuardarNominaDeCobranzas(nomina: any): Observable<any> {
    /* const parametros = {
      idAsignacion: idNomina
    }; */
    const newSession = Object.assign({}, nomina);
    return this.http.post<any>(this.urlGuardarCobranzasDeCobrador, newSession, cudOptions);
  }





}
