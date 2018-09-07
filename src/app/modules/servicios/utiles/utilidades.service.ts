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

  /*

  //SEGUN BOLEANDO OBIENE SI O NO
   getString(valor: boolean): string {
    if (valor === true) {
      return 'SI';
    } else {
      return 'NO';
    }
  }

  

  // PARA GENERAR EL MONTO EN LETRAS
  private toText(numero: number): string {
    //var entero = Convert.ToInt64(Math.Truncate(value1));
    //double value = Convert.ToDouble(entero);
    let Num2Text: string = "";
    let value = Math.trunc(numero);

    if (value == 0) Num2Text = "CERO";
    else if (value == 1) Num2Text = "UNO";
    else if (value == 2) Num2Text = "DOS";
    else if (value == 3) Num2Text = "TRES";
    else if (value == 4) Num2Text = "CUATRO";
    else if (value == 5) Num2Text = "CINCO";
    else if (value == 6) Num2Text = "SEIS";
    else if (value == 7) Num2Text = "SIETE";
    else if (value == 8) Num2Text = "OCHO";
    else if (value == 9) Num2Text = "NUEVE";
    else if (value == 10) Num2Text = "DIEZ";
    else if (value == 11) Num2Text = "ONCE";
    else if (value == 12) Num2Text = "DOCE";
    else if (value == 13) Num2Text = "TRECE";
    else if (value == 14) Num2Text = "CATORCE";
    else if (value == 15) Num2Text = "QUINCE";
    else if (value < 20) Num2Text = "DIECI" + this.toText(value - 10);
    else if (value == 20) Num2Text = "VEINTE";
    else if (value < 30) Num2Text = "VEINTI" + this.toText(value - 20);
    else if (value == 30) Num2Text = "TREINTA";
    else if (value == 40) Num2Text = "CUARENTA";
    else if (value == 50) Num2Text = "CINCUENTA";
    else if (value == 60) Num2Text = "SESENTA";
    else if (value == 70) Num2Text = "SETENTA";
    else if (value == 80) Num2Text = "OCHENTA";
    else if (value == 90) Num2Text = "NOVENTA";
    else if (value < 100) Num2Text = this.toText(Math.trunc(value / 10) * 10) + " Y " + this.toText(value % 10);
    else if (value == 100) Num2Text = "CIEN";
    else if (value < 200) Num2Text = "CIENTO " + this.toText(value - 100);
    else if ((value == 200) || (value == 300) || (value == 400) || (value == 600) || (value == 800)) Num2Text = this.toText(Math.trunc(value / 100)) + "CIENTOS";
    else if (value == 500) Num2Text = "QUINIENTOS";
    else if (value == 700) Num2Text = "SETECIENTOS";
    else if (value == 900) Num2Text = "NOVECIENTOS";
    else if (value < 1000) Num2Text = this.toText(Math.trunc(value / 100) * 100) + " " + this.toText(value % 100);
    else if (value == 1000) Num2Text = "MIL";
    else if (value < 2000) Num2Text = "MIL " + this.toText(value % 1000);
    else if (value < 1000000) {
      Num2Text = this.toText(Math.trunc(value / 1000)) + " MIL";
      if ((value % 1000) > 0) Num2Text = Num2Text + " " + this.toText(value % 1000);
    }

    else if (value == 1000000) Num2Text = "UN MILLON";
    else if (value < 2000000) Num2Text = "UN MILLON " + this.toText(value % 1000000);
    else if (value < 1000000000000) {
      Num2Text = this.toText(Math.trunc(value / 1000000)) + " MILLONES ";
      if ((value - Math.trunc(value / 1000000) * 1000000) > 0) Num2Text = Num2Text + " " + this.toText(value - Math.trunc(value / 1000000) * 1000000);
    }

    else if (value == 1000000000000) Num2Text = "UN BILLON";
    else if (value < 2000000000000) Num2Text = "UN BILLON " + this.toText(value - Math.trunc(value / 1000000000000) * 1000000000000);

    else {
      Num2Text = this.toText(Math.trunc(value / 1000000000000)) + " BILLONES";
      if ((value - Math.trunc(value / 1000000000000) * 1000000000000) > 0) Num2Text = Num2Text + " " + this.toText(value - Math.trunc(value / 1000000000000) * 1000000000000);
    }
    return Num2Text;

  }

  //CAMBIAR estados
  postAprobarRechazar(id: string, nuevoEstado: string) {
    let idNuevoEstado: string;
    this.estados.forEach(element => {
      if (nuevoEstado == element.nombre) {
        idNuevoEstado = element._id;
      }
    });
    console.log(idNuevoEstado);
    this.characters.forEach(element => {
      if (element._id === id) {
        if (element.estado.nombre === 'PENDIENTE DE REVISION'
          || element.estado.nombre === 'PENDIENTE DE APROBACION'
          || element.estado.nombre === 'APROBADO') {
          let nuevoCredito = {
            idCredito: element._id,
            estado: idNuevoEstado,   // '5b72b281708d0830d07f3562'        // element.estado._id
            nombre_nuevo_estado: nuevoEstado,           // APROBADO RECHASADO OTRO,
            cliente: element.cliente._id,
            monto: element.montoPedido,
            nombre_estado_actual: element.estado.nombre,
            token: this.session.token
          };

          this.creditosService.postCambiarEstadoCredito(nuevoCredito).subscribe(result => {
            let respuesta = result;
            alert('Se actualiso el estado de Credito');
            console.log(respuesta);
          }, err => {
            alert('Ocurrio un problema');
          });
        } else {
          alert('No se puede cambiar el estado');
        }
      }
    });
  }

  */
}
