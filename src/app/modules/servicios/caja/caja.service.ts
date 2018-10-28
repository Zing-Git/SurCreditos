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
  public urlPagarCuota = this.urlBase + '/cuota/pagar/';

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
  postGetComboIngresoEgreso(token: any): any {
    const parametros = {
      token: token
    };
    const newSession = Object.assign({}, parametros);
    // return this.http.post<any[]>(this.urlAsignarCuotasACobrador, newSession, cudOptions);


    const comboIngresoEgreso = {
      ingresos: [
        'INGRESO CAPITAL PARA CREDITOS',
        'INGRESO POR AJUSTE',
        'INGRESO VENTA DE PRODUCTOS',
        'INGRESO POR COBRANZAS ATRASADAS DE COBRADOR',
        'INGRESO OTRO',
      ],
      egresos:[
        'EGRESO PAGO DE CREDITOS',
        'EGRESO POR AJUSTE',
        'EGRESO POR COMPRA DE INSUMOS',
        'EGRESO POR PAGO DE HONORARIOS',
        'EGRESO POR PAGO DE COMPRA DE EQUIPOS',
        'EGRESO POR PAGO DE IMPUESTOS',
        'EGRESO POR PAGO DE SERVICIOS',
        'EGRESO OTRO',
      ]
    };
    return comboIngresoEgreso;

  }


}
