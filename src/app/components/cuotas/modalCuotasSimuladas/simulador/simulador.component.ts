import { Component, OnInit } from '@angular/core';


import { LoginService } from '../../../../modules/servicios/login/login.service';
import { Session } from '../../../../modelo/util/session';

import { NgxSmartModalService } from 'ngx-smart-modal';
//import { TableCuotas } from '../../modal-cuotas/TableCuotas';
import { Pago } from './pago';
import { CuotasService } from '../../../../modules/servicios/cuotas/cuotas.service';
import 'jspdf-autotable';
import { TableCreditos } from '../../tableCreditos';
import { UtilidadesService } from '../../../../modules/servicios/utiles/utilidades.service';
import { DatePipe } from '@angular/common';
import { ClientesService } from '../../../../modules/servicios/clientes/clientes.service';

import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CreditosService } from '../../../../modules/servicios/creditos/creditos.service';
declare let jsPDF;

@Component({
  selector: 'app-simulador',
  templateUrl: './simulador.component.html',
  styleUrls: ['./simulador.component.css']
})
export class SimuladorComponent implements OnInit {

  cuotasModalForm: FormGroup;
  session = new Session();
  cuotasSimuladas: any[];
  token: string;
  cuotas: any;
  creditos: TableCreditos[];
  cuotaAPagar: Pago;
  idCredito: string;
  todosMontosPagados: string;
  miOrdenDePago: any;
  formas: any[];
  settings = {

    actions: {
      columnTitle: 'Accion',
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,
      position: 'right',

    },
    columns: {
      orden: {
        title: 'Orden',
        width: '3%',
        filter: false,
      },
      montoPagado: {
        title: 'Monto Pagado',
        width: '8%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'montoPagado' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      montoPendienteDePago: {
        title: 'Pendiente de pago',
        width: '8%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'montoPendienteDePago' ? value :
          Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      montoInteresPorMora: {
        title: 'Interes x Mora',
        width: '8%',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          /* let totalInteres = 0;
          console.log(row.montoInteresPorMora);
          console.log(row.pagoInteres);
          if (row.pagoInteres === true) {
            totalInteres = row.montoInteresPorMora;
            console.log(row.montoInteresPorMora);
          } */
          return Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(row.montoInteresPorMora);
        }
      },
      MontoTotalCuota: {
        title: 'Total a pagar',
        width: '8%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'MontoTotalCuota' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },

    },
    pager: {
      display: true,
      perPage: 6
    },
    noDataMessage: 'El Cliente no tiene Cuotas...'
  };

  constructor(private router: Router, public ngxSmartModalService: NgxSmartModalService,
    public loginService: LoginService,
    public cutaService: CuotasService,
    public utilidades: UtilidadesService,
    private datePipe: DatePipe,
    private clientesServices: ClientesService,
    private creditoServices: CreditosService) { }

  ngOnInit() {
    //this.cuotas = this.cuotasSimuladas;
  }

  simularPago(misCuotas: any[], misCreditos: any[], idCredito: string, miToken: string) {




    //this.cuotasSimuladas.lenght = 0;
    this.cuotasSimuladas = misCuotas;

    console.log(this.cuotasSimuladas);

    this.creditos = misCreditos;
    this.idCredito = idCredito;
    this.token = miToken;
    this.cargarControlesCombos();

  }
  cerrarModal(event) {
    this.cuotas.lenght = 0;
    //this.cuotasSimuladas.lenght = 0;
    this.ngxSmartModalService.getModal('simuladorModal').close();
  }

  realizarPago() {

    this.cuotaAPagar = new Pago();
    this.cuotaAPagar.token = this.token;

    let miCuota: any[] = new Array();

    //console.log('XXXXXXXXXXXXXXXX' + this.cuotasSimuladas);
    this.cuotasSimuladas.forEach(element => {

      let cuota = {
        _id: element._id,
        diasRetraso: element.diasRetraso,
        montoInteresMora: element.montoInteresPorMora,
        montoPagado: element.montoPagado,
        porcentajeInteresPorMora: element.porcentajeInteresPorMora,
        comentario: element.comentario,
        montoPagadoHistorico: element.montoPagadoHistorico
      }

      miCuota.push(cuota);

    });
    this.cuotaAPagar.cuotas = miCuota;

    //console.log('JSON PARA POSTMAN' + this.cuotaAPagar);


    if (this.cuotaAPagar != null) {
      //llamar al servicio para realizar el pago
      this.cutaService.postPagarCuota(this.cuotaAPagar).subscribe(result => {
        let respuesta = result;

        if (result) {
          //console.log(respuesta);
          //console.log(result);
          swal('Pagado!!', 'Cuotas Pagadas!!!', 'success');
          this.ngxSmartModalService.getModal('simuladorModal').close();
          this.ngxSmartModalService.getModal('cuotaModal').close();
          this.router.navigate(['/cuotas']);
          /* setTimeout(() => {
             this.router.navigate(['/cuotas']);
           },
             5000);*/
        }
      }, err => {
        //alert('Hubo un problema al registrar la solicitud de credito');
        swal('Error', 'Hubo un problema al registrar el pago', 'warning');
      });
    }
  }

  imprimirPDF() {
    const doc = new jsPDF();
    let numeroFactura: string;
    let nextPag = 0;
    let lineaDetalleFila = 100;
    let incrementoFila = 10;
    let columnaDetalle = 20;
    let escribirEncabezado = true;
    // let montoAdeudado = 0;

    this.cuotaAPagar.cuotas.forEach(x => {
      doc.setFontSize(12);
      doc.setFontType("bold");
      doc.text('CUPON DE PAGO', 80, 30, 'center');
      doc.line(10, 35, 150, 35);   //x, y, largo , y
      doc.setFontSize(8);
      doc.setTextColor(0);

      this.creditos.forEach(element => {
        if (element._id == this.idCredito) {
          let fechaCancelacion: string;
          let cantidadCuota: string;  //es el orden
          this.creditos.forEach(element => {
            element.cuotas.forEach(plan => {
              fechaCancelacion = plan.fechaVencimiento;
              cantidadCuota = plan.orden.toString();
            });
          });
          numeroFactura = this.utilidades.crearNumeroFactura(element.legajoPrefijo, element.legajo);
          doc.setFontType("normal");

          if (escribirEncabezado) {
                doc.text('Legajo de Credito: ', 10, 40);
                doc.text('Fecha: ', 100, 40);
                doc.text('Titular: ', 10, 50);
                doc.text('Domicilio: ', 10, 55);
                doc.text('Dni: ', 100, 50);
                doc.text('Telefono:     ', 10, 60);
                doc.text('Fecha de Alta: ', 10, 65);
                doc.text('Fecha de Cancelacion: ', 80, 65);
                doc.text('Capital: ', 10, 70);
                doc.text('Total a Pagar: ', 80, 70);
                doc.text('Plan de Pago: ', 10, 75);
                doc.text('Cant. de Cuotas: ', 80, 75);
                doc.line(10, 80, 150, 80);

                doc.setFontType("bold");
                let today = Date.now();
                doc.text(numeroFactura, 50, 40);
                doc.text(this.datePipe.transform(today, 'dd/MM/yyyy'), 110, 40);
                doc.text(element.titularApellidos + ', ' + element.titularNombres, 50, 50);
                // tslint:disable-next-line:max-line-length
                doc.text(element.titularCalle + ' ' + element.titularNumeroCasa + ' ' + element.titularLocalidad + ' - ' + element.titularProvincia, 50, 55);
                doc.text(element.titularDni, 120, 50);
                doc.text(this.datePipe.transform(element.fechaAlta, 'dd/MM/yyyy'), 50, 65);
                doc.text(this.datePipe.transform(fechaCancelacion, 'dd/MM/yyyy'), 120, 65);
                doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                  .format(+element.capital), 50, 70);  //Capital
                doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                  .format(+element.totalAPagar), 120, 70);   //total a pagar
                doc.text(element.tipoPlan, 50, 75);  //plan de pago es el tipo de plan(semanal, quincenal, etc...)
                doc.text(cantidadCuota, 120, 75);   //cantidad de cuotas 12


                 // tslint:disable-next-line:max-line-length
                 doc.text('Nº Cuota        Valor de Cuota        Dias mora             Total a Pagar          Pagado         Saldo por cuota    Interes', 15, 90);



                 doc.setFontType("normal");

                 // tslint:disable-next-line:max-line-length
                 doc.text(element.cuotas.find(t => t._id === x._id).orden.toString(), columnaDetalle, lineaDetalleFila);  //numero de cuota a pagar
                 doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                   // tslint:disable-next-line:max-line-length
                   .format(+element.cuotas.find(t => t._id === x._id).MontoTotalCuota), columnaDetalle + 20, lineaDetalleFila);  //valor de cuota
                 let diasRetraso = String(element.cuotas.find(t => t._id === x._id).diasRetraso);
                 doc.text(diasRetraso, columnaDetalle + 50, lineaDetalleFila);





                 // tslint:disable-next-line:max-line-length
                let montoTotalAPagarConInteres = element.cuotas.find(t => t._id === x._id).montoInteresPorMora + element.cuotas.find(t => t._id === x._id).MontoTotalCuota;
                 // tslint:disable-next-line:max-line-length
                 doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(montoTotalAPagarConInteres), columnaDetalle + 70, lineaDetalleFila);  //total a pagar






                   let historicoCuotaActual = 0;
                 for (var i = 0; i < this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico.length; i++) {
                   historicoCuotaActual += Number(this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico[i]);
                 }
                 // tslint:disable-next-line:max-line-length
                 doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(x.montoPagado), columnaDetalle + 90, lineaDetalleFila);   //monto pagado
                 // tslint:disable-next-line:max-line-length
                 let montoTotalAdeudadoAnterior = this.utilidades.calcularMontoAdeudado(Number(element.cuotas.find(t => t._id === x._id).orden.toString()), element.cuotas);
                 let totalPagadoHastaAhora = historicoCuotaActual + montoTotalAdeudadoAnterior + x.montoPagado; //total pagado hasta ahora
                 // tslint:disable-next-line:max-line-length
                 let totalCuotaActual: number =+element.cuotas.find(t => t._id === x._id).MontoTotalCuota -( historicoCuotaActual + x.montoPagado);
                 let totalSaldoPorCuotaActual = totalCuotaActual; // PUSE ESTO POR SE QUE NO TIRABA BIEN EL VALOR DE LA COPIA

                 if (totalCuotaActual < 0) {
                  totalCuotaActual = 0;
                 }

                 console.log(historicoCuotaActual +' montoPagado: ' + x.montoPagado + 'Monto total:' + totalCuotaActual);
                 doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                       .format(totalCuotaActual), columnaDetalle + 110, lineaDetalleFila);  //Saldo por cuota: (adeudado)

                 //es la totalGlobal  restado el valor anterior


                 // let montoAdeudado = +element.totalAPagar - totalPagadoHastaAhora;
                 // tslint:disable-next-line:max-line-length
                 // doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(montoAdeudado), columnaDetalle + 130 , lineaDetalleFila);
                 // tslint:disable-next-line:max-line-length
                 doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.cuotas.find(t => t._id === x._id).montoInteresPorMora), columnaDetalle + 130 , lineaDetalleFila);


                escribirEncabezado = false;
          } else {


                // tslint:disable-next-line:max-line-length
                doc.text(element.cuotas.find(t => t._id === x._id).orden.toString(), columnaDetalle, lineaDetalleFila + incrementoFila);  //numero de cuota a pagar
                doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                  // tslint:disable-next-line:max-line-length
                  .format(+element.cuotas.find(t => t._id === x._id).MontoTotalCuota), columnaDetalle + 20, lineaDetalleFila+ incrementoFila);  //valor de cuota
                let diasRetraso = String(element.cuotas.find(t => t._id === x._id).diasRetraso);
                doc.text(diasRetraso, columnaDetalle + 50, lineaDetalleFila+ incrementoFila);



                 // tslint:disable-next-line:max-line-length
                 let montoTotalAPagarConInteres = element.cuotas.find(t => t._id === x._id).montoInteresPorMora + element.cuotas.find(t => t._id === x._id).MontoTotalCuota;
                 // tslint:disable-next-line:max-line-length
                 doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(montoTotalAPagarConInteres), columnaDetalle + 70, lineaDetalleFila + incrementoFila);  //total a pagar




                let historicoCuotaActual = 0;
                for (var i = 0; i < this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico.length; i++) {
                  historicoCuotaActual += Number(this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico[i]);
                }
                // tslint:disable-next-line:max-line-length
                doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(x.montoPagado), columnaDetalle + 90, lineaDetalleFila+ incrementoFila);   //monto pagado
                // tslint:disable-next-line:max-line-length
                let montoTotalAdeudadoAnterior = this.utilidades.calcularMontoAdeudado(Number(element.cuotas.find(t => t._id === x._id).orden.toString()), element.cuotas);
                let totalPagadoHastaAhora = historicoCuotaActual + montoTotalAdeudadoAnterior + x.montoPagado; //total pagado hasta ahora
                // tslint:disable-next-line:max-line-length
                let totalCuotaActual: number =+element.cuotas.find(t => t._id === x._id).MontoTotalCuota -( historicoCuotaActual + x.montoPagado);
                let totalSaldoPorCuotaActual = totalCuotaActual; // PUSE ESTO POR SE QUE NO TIRABA BIEN EL VALOR DE LA COPIA
                console.log(historicoCuotaActual +' montoPagado: ' + x.montoPagado + 'Monto total:' + totalCuotaActual);
                doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                      .format(totalCuotaActual), columnaDetalle + 110, lineaDetalleFila+ incrementoFila);  //Saldo por cuota: (adeudado)

                //es la totalGlobal  restado el valor anterior
                // let montoAdeudado = +element.totalAPagar - totalPagadoHastaAhora;
                // tslint:disable-next-line:max-line-length
                // doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(montoAdeudado), columnaDetalle + 130 , lineaDetalleFila + incrementoFila);
                // tslint:disable-next-line:max-line-length
                doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.cuotas.find(t => t._id === x._id).montoInteresPorMora), columnaDetalle + 130 , lineaDetalleFila);

                incrementoFila = incrementoFila + 10;
          }
        }
      });
    });

 // ------------------ COPIA

 doc.addPage();

 this.cuotaAPagar.cuotas.forEach(x => {
  doc.setFontSize(12);
  doc.setFontType("bold");
  doc.text('CUPON DE PAGO', 80, 30, 'center');
  doc.line(10, 35, 150, 35);   //x, y, largo , y
  doc.setFontSize(8);
  doc.setTextColor(0);

  this.creditos.forEach(element => {
    if (element._id == this.idCredito) {
      let fechaCancelacion: string;
      let cantidadCuota: string;  //es el orden
      this.creditos.forEach(element => {
        element.cuotas.forEach(plan => {
          fechaCancelacion = plan.fechaVencimiento;
          cantidadCuota = plan.orden.toString();
        });
      });
      numeroFactura = this.utilidades.crearNumeroFactura(element.legajoPrefijo, element.legajo);
      doc.setFontType("normal");

      if (escribirEncabezado) {
            doc.text('Legajo de Credito: ', 10, 40);
            doc.text('Fecha: ', 100, 40);
            doc.text('Titular: ', 10, 50);
            doc.text('Domicilio: ', 10, 55);
            doc.text('Dni: ', 100, 50);
            doc.text('Telefono:     ', 10, 60);
            doc.text('Fecha de Alta: ', 10, 65);
            doc.text('Fecha de Cancelacion: ', 80, 65);
            doc.text('Capital: ', 10, 70);
            doc.text('Total a Pagar: ', 80, 70);
            doc.text('Plan de Pago: ', 10, 75);
            doc.text('Cant. de Cuotas: ', 80, 75);
            doc.line(10, 80, 150, 80);

            doc.setFontType("bold");
            let today = Date.now();
            doc.text(numeroFactura, 50, 40);
            doc.text(this.datePipe.transform(today, 'dd/MM/yyyy'), 110, 40);
            doc.text(element.titularApellidos + ', ' + element.titularNombres, 50, 50);
            // tslint:disable-next-line:max-line-length
            doc.text(element.titularCalle + ' ' + element.titularNumeroCasa + ' ' + element.titularLocalidad + ' - ' + element.titularProvincia, 50, 55);
            doc.text(element.titularDni, 120, 50);
            doc.text(this.datePipe.transform(element.fechaAlta, 'dd/MM/yyyy'), 50, 65);
            doc.text(this.datePipe.transform(fechaCancelacion, 'dd/MM/yyyy'), 120, 65);
            doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
              .format(+element.capital), 50, 70);  //Capital
            doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
              .format(+element.totalAPagar), 120, 70);   //total a pagar
            doc.text(element.tipoPlan, 50, 75);  //plan de pago es el tipo de plan(semanal, quincenal, etc...)
            doc.text(cantidadCuota, 120, 75);   //cantidad de cuotas 12


             // tslint:disable-next-line:max-line-length
             doc.text('Nº Cuota        Valor de Cuota        Dias mora             Total a Pagar          Pagado         Saldo por cuota    Interes', 15, 90);



             doc.setFontType("normal");

             // tslint:disable-next-line:max-line-length
             doc.text(element.cuotas.find(t => t._id === x._id).orden.toString(), columnaDetalle, lineaDetalleFila);  //numero de cuota a pagar
             doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
               // tslint:disable-next-line:max-line-length
               .format(+element.cuotas.find(t => t._id === x._id).MontoTotalCuota), columnaDetalle + 20, lineaDetalleFila);  //valor de cuota
             let diasRetraso = String(element.cuotas.find(t => t._id === x._id).diasRetraso);
             doc.text(diasRetraso, columnaDetalle + 50, lineaDetalleFila);





             // tslint:disable-next-line:max-line-length
            let montoTotalAPagarConInteres = element.cuotas.find(t => t._id === x._id).montoInteresPorMora + element.cuotas.find(t => t._id === x._id).MontoTotalCuota;
             // tslint:disable-next-line:max-line-length
             doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(montoTotalAPagarConInteres), columnaDetalle + 70, lineaDetalleFila);  //total a pagar






               let historicoCuotaActual = 0;
             for (var i = 0; i < this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico.length; i++) {
               historicoCuotaActual += Number(this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico[i]);
             }
             // tslint:disable-next-line:max-line-length
             doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(x.montoPagado), columnaDetalle + 90, lineaDetalleFila);   //monto pagado
             // tslint:disable-next-line:max-line-length
             let montoTotalAdeudadoAnterior = this.utilidades.calcularMontoAdeudado(Number(element.cuotas.find(t => t._id === x._id).orden.toString()), element.cuotas);
             let totalPagadoHastaAhora = historicoCuotaActual + montoTotalAdeudadoAnterior + x.montoPagado; //total pagado hasta ahora
             // tslint:disable-next-line:max-line-length
             let totalCuotaActual: number =+element.cuotas.find(t => t._id === x._id).MontoTotalCuota -( historicoCuotaActual + x.montoPagado);
             let totalSaldoPorCuotaActual = totalCuotaActual; // PUSE ESTO POR SE QUE NO TIRABA BIEN EL VALOR DE LA COPIA

             if (totalCuotaActual < 0) {
              totalCuotaActual = 0;
             }

             console.log(historicoCuotaActual +' montoPagado: ' + x.montoPagado + 'Monto total:' + totalCuotaActual);
             doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                   .format(totalCuotaActual), columnaDetalle + 110, lineaDetalleFila);  //Saldo por cuota: (adeudado)


             doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.cuotas.find(t => t._id === x._id).montoInteresPorMora), columnaDetalle + 130 , lineaDetalleFila);


            escribirEncabezado = false;
      } else {


            // tslint:disable-next-line:max-line-length
            doc.text(element.cuotas.find(t => t._id === x._id).orden.toString(), columnaDetalle, lineaDetalleFila + incrementoFila);  //numero de cuota a pagar
            doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
              // tslint:disable-next-line:max-line-length
              .format(+element.cuotas.find(t => t._id === x._id).MontoTotalCuota), columnaDetalle + 20, lineaDetalleFila+ incrementoFila);  //valor de cuota
            let diasRetraso = String(element.cuotas.find(t => t._id === x._id).diasRetraso);
            doc.text(diasRetraso, columnaDetalle + 50, lineaDetalleFila+ incrementoFila);



             // tslint:disable-next-line:max-line-length
             let montoTotalAPagarConInteres = element.cuotas.find(t => t._id === x._id).montoInteresPorMora + element.cuotas.find(t => t._id === x._id).MontoTotalCuota;
             // tslint:disable-next-line:max-line-length
             doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(montoTotalAPagarConInteres), columnaDetalle + 70, lineaDetalleFila + incrementoFila);  //total a pagar




            let historicoCuotaActual = 0;
            for (var i = 0; i < this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico.length; i++) {
              historicoCuotaActual += Number(this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico[i]);
            }
            // tslint:disable-next-line:max-line-length
            doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(x.montoPagado), columnaDetalle + 90, lineaDetalleFila+ incrementoFila);   //monto pagado
            // tslint:disable-next-line:max-line-length
            let montoTotalAdeudadoAnterior = this.utilidades.calcularMontoAdeudado(Number(element.cuotas.find(t => t._id === x._id).orden.toString()), element.cuotas);
            let totalPagadoHastaAhora = historicoCuotaActual + montoTotalAdeudadoAnterior + x.montoPagado; //total pagado hasta ahora
            // tslint:disable-next-line:max-line-length
            let totalCuotaActual: number =+element.cuotas.find(t => t._id === x._id).MontoTotalCuota -( historicoCuotaActual + x.montoPagado);
            let totalSaldoPorCuotaActual = totalCuotaActual; // PUSE ESTO POR SE QUE NO TIRABA BIEN EL VALOR DE LA COPIA
            console.log(historicoCuotaActual +' montoPagado: ' + x.montoPagado + 'Monto total:' + totalCuotaActual);
            doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                  .format(totalCuotaActual), columnaDetalle + 110, lineaDetalleFila+ incrementoFila);  //Saldo por cuota: (adeudado)

            //es la totalGlobal  restado el valor anterior
            // let montoAdeudado = +element.totalAPagar - totalPagadoHastaAhora;
            // tslint:disable-next-line:max-line-length
            // doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(montoAdeudado), columnaDetalle + 130 , lineaDetalleFila + incrementoFila);
            // tslint:disable-next-line:max-line-length
            doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.cuotas.find(t => t._id === x._id).montoInteresPorMora), columnaDetalle + 130 , lineaDetalleFila);

            incrementoFila = incrementoFila + 10;
      }
    }
  });
});





    doc.save('CuponDePago.pdf');
    let pdfImprimir = doc.output("blob"); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
    window.open(URL.createObjectURL(pdfImprimir)); // Abre una nueva ventana para imprimir en el navegador


  }



  private cargarControlesCombos() {
    this.clientesServices.postGetCombos().subscribe(result => {
      this.formas = result['respuesta'].formasPago;
    });
  }

  pagar() {
    this.realizarPago();
    this.imprimirPDF();
  }
}
