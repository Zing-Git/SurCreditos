import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
  constructor(public http: HttpClient) { }

  postPagarCuota(cuotas: any[], token: string){

    const paramnetros ={
      token: token,
      cuotas: cuotas
    };
    const newSession = Object.assign({}, paramnetros);
    return this.http.post<any[]>(this.urlPagarCuota, newSession, cudOptions);
  }

}
