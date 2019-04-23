import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';



@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor() { }
  // Fechas
  formateaDateDDMMAAAA(date: any): string {
    let d = new Date(date);
    return (('0' + d.getDate()).slice(-2) + '-' + ('0' + (d.getMonth() + 1)).slice(-2)) + '-' + d.getFullYear();
  }
  formateaDateAAAAMMDD(date: any): string {
    let d = new Date(date);
    return (d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2));
  }

  // CONCATENA LEGAJO

  crearNumeroFactura(legajo_prefijo: string, legajo: string): string{
    let numeroFactura: string;
    let s = +legajo + "";
    //console.log(s);
    while (s.length < 6) {

      s = "0" + s
      //console.log(s);
    };
    numeroFactura = legajo_prefijo + '-' + s;

    return numeroFactura;
  }

  calcularMontoAdeudado(n: number, cuotas: any[]): number{
    let total: number=0;
    n= n-1;
    for(let i=0; i<n; ++i){
      total += Number(cuotas[i].MontoTotalCuota);
    }
    return total;
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});

     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  getDayString(n: any): string{

      return n<10 ? '0'+n : n;

  }

  sumarAFechaUnDia(fecha: Date): Date{
    return new Date(fecha.setDate(fecha.getDate() +1));
  }
}
