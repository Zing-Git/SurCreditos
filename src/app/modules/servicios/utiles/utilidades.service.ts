import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor() { }
  // Fechas
  formateaDateDDMMAAAA(date: any): String {
    let d = new Date(date);
    return (('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2)) + '-' + d.getFullYear();
  }
  formateaDateAAAAMMDD(date: any): String {
    let d = new Date(date);
    return (d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2));
  }
}
