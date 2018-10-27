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
        width: '5%',
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
          return value === 'montoPendienteDePago' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
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

    this.cuotaAPagar.cuotas.forEach(x => {

      if (nextPag > 0) {
        doc.addPage();
      } else {
        nextPag += 1;
      }

      doc.setFontSize(12);

      doc.setFontType("bold");
      doc.text('CUPON DE PAGO', 80, 30, 'center');
      doc.line(10, 35, 150, 35);   //x, y, largo , y
      doc.setFontSize(8);
      doc.setTextColor(0)

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
          //console.log(element._id);

          //console.log();
          doc.setFontType("normal")

          doc.text('Legajo de Credito: ', 10, 40);
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
          //datos de la cuota usamos x

          doc.text('Nº Cuota: ', 40, 90);
          doc.text('Valor de Cuota:', 40, 95);
          doc.text('Dias mora: ', 40, 100);
          doc.text('Total a Pagar: ', 40, 105);
          doc.text('Pagado: ', 40, 110);
          doc.text('Saldo por cuota: (adeudado):', 40, 115);
          doc.text('Saldo Total del Credito:', 40, 123)
          doc.text('Fecha de Pago: ', 80, 128)
          doc.setFontType("bold");

          doc.text(numeroFactura, 50, 40);
          doc.text(element.titularApellidos + ', ' + element.titularNombres, 50, 50);

          doc.text(element.titularCalle + ' ' + element.titularNumeroCasa + ' ' + element.titularLocalidad + ' - ' + element.titularProvincia, 50, 55);
          doc.text(element.titularDni, 120, 50);


          doc.text(this.datePipe.transform(element.fechaAlta, 'dd/MM/yyyy'), 50, 65);
          doc.text(this.datePipe.transform(fechaCancelacion, 'dd/MM/yyyy'), 120, 65);

          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
            .format(+element.capital), 50, 70);  //Capital

          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
            .format(+element.totalAPagar), 120, 70);   //total a pagar

          //doc.text( Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.montoAPagar), 120, 70);
          doc.text(element.tipoPlan, 50, 75);  //plan de pago es el tipo de plan(semanal, quincenal, etc...)
          doc.text(cantidadCuota, 120, 75);   //cantidad de cuotas 12

          doc.text(element.cuotas.find(t => t._id === x._id).orden.toString(), 120, 90);  //numero de cuota a pagar
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
            .format(+element.cuotas.find(t => t._id === x._id).MontoTotalCuota), 120, 95);  //valor de cuota

          let diasRetraso = String(element.cuotas.find(t => t._id === x._id).diasRetraso);
          doc.text(diasRetraso, 120, 100);

          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
<<<<<<< HEAD
                  .format(+element.cuotas.find(t => t._id === x._id).MontoTotalCuota), 120, 105);  //total a pagar

          let historicoCuotaActual : number=0;
          for(var i=0;i<this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico.length;i++)
          {
=======
            .format(+element.cuotas.find(t => t._id === x._id).MontoTotalCuota), 120, 105);  //total a pagar

          let historicoCuotaActual: number = 0;
          for (var i = 0; i < this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico.length; i++) {
>>>>>>> c05732692914c2be3ef89f8dd7feb7f727bcd519
            historicoCuotaActual += Number(this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico[i]);
          }

          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(x.montoPagado), 120, 110);   //monto pagado

          let montoTotalAdeudadoAnterior = this.utilidades.calcularMontoAdeudado(Number(element.cuotas.find(t => t._id === x._id).orden.toString()), element.cuotas);

          //suma de todas las cuotas anteriores, el pagos individuales de esta cuota y el pago de cuota actual
<<<<<<< HEAD
          let totalPagadoHastaAhora = historicoCuotaActual + montoTotalAdeudadoAnterior + x.montoPagado; //total pagado hasta ahora

          let totalCuotaActual: number =+element.cuotas.find(t => t._id === x._id).MontoTotalCuota -( historicoCuotaActual + x.montoPagado);

console.log(historicoCuotaActual +' montoPagado: ' + x.montoPagado + 'Monto total:' + totalCuotaActual)
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                .format(totalCuotaActual), 120, 115);  //Saldo por cuota: (adeudado)
=======
          let totalPagadoHastaAhora = historicoCuotaActual + montoTotalAdeudadoAnterior + x.montoPagado; //total pagado hasta ahora 

          let totalCuotaActual: number = +element.cuotas.find(t => t._id === x._id).MontoTotalCuota - (historicoCuotaActual + x.montoPagado);

          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
            .format(totalCuotaActual), 120, 115);  //Saldo por cuota: (adeudado)
>>>>>>> c05732692914c2be3ef89f8dd7feb7f727bcd519

          const today = Date.now();

          //es la totalGlobal  restado el valor anterior
          let montoAdeudado = +element.totalAPagar - totalPagadoHastaAhora;
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(montoAdeudado), 120, 123);
          doc.text(this.datePipe.transform(today, 'dd/MM/yyyy'), 120, 128)
          //parte de la cuota
          doc.setFontSize(12);
          doc.line(10, 125, 150, 125);
          doc.line(10, 135, 150, 135);
          doc.setFontType("bold");

          //****************************************FIN DE CUPON PARA CAJERO  ******************************************** */
          doc.text('CUPON DE PAGO', 80, 145, 'center');
          doc.line(10, 150, 150, 150);   //x, y, largo , y
          doc.setFontSize(8);
          doc.setTextColor(0)

          doc.setFontType("normal")

          doc.text('Legajo de Credito: ', 10, 160);
          doc.text('Titular: ', 10, 170);
          doc.text('Domicilio: ', 10, 175);
          doc.text('Dni: ', 100, 180);
          doc.text('Telefono:     ', 10, 180);
          doc.text('Fecha de Alta: ', 10, 185);
          doc.text('Fecha de Cancelacion: ', 80, 185);
          doc.text('Capital: ', 10, 190);
          doc.text('Total a Pagar: ', 80, 190);
          doc.text('Plan de Pago: ', 10, 195);
          doc.text('Cant. de Cuotas: ', 80, 195);
          doc.line(10, 200, 150, 200);
          //datos de la cuota usamos x

          doc.text('Nº Cuota: ', 40, 210);
          doc.text('Valor de Cuota:', 40, 215);
          doc.text('Dias mora: ', 40, 220);
          doc.text('Total a Pagar: ', 40, 225);
          doc.text('Pagado: ', 40, 230);
          doc.text('Saldo por cuota: (adeudado):', 40, 235);
          doc.text('Saldo Total del Credito:', 40, 243)
          doc.text('Fecha de Pago: ', 80, 255)
          doc.text('Firma del cajero: ', 10, 255);
          doc.setFontType("bold");

          doc.text(numeroFactura, 50, 160);
          doc.text(element.titularApellidos + ', ' + element.titularNombres, 50, 170);

          doc.text(element.titularCalle + ' ' + element.titularNumeroCasa + ' ' + element.titularLocalidad + ' - ' + element.titularProvincia, 50, 175);
          doc.text(element.titularDni, 120, 180);


          doc.text(this.datePipe.transform(element.fechaAlta, 'dd/MM/yyyy'), 50, 185);
          doc.text(this.datePipe.transform(fechaCancelacion, 'dd/MM/yyyy'), 120, 185);
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.capital), 50, 190);  //monto pedido.
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.totalAPagar), 120, 190);
          //doc.text( Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.montoAPagar), 120, 70);
          doc.text(element.tipoPlan, 50, 195);  //plan de pago es el tipo de plan(semanal, quincenal, etc...)
          doc.text(cantidadCuota, 120, 195);   //cantidad de cuotas es el ultimo orden

          doc.text(element.cuotas.find(t => t._id === x._id).orden.toString(), 120, 210);
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.cuotas.find(t => t._id === x._id).MontoTotalCuota), 120, 215);
          //let diasRetraso = String(element.cuotas.find(t => t._id === x._id).diasRetraso);
          doc.text(diasRetraso, 120, 220);
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.cuotas.find(t => t._id === x._id).MontoTotalCuota), 120, 225);

<<<<<<< HEAD
          let historicoCuotaActual : number=0;
          for(var i=0;i<this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico.length;i++)
          {
            historicoCuotaActual += Number(this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico[i]);
          }

          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(x.montoPagado), 120, 230);

          let montoTotalAdeudadoAnterior = this.utilidades.calcularMontoAdeudado(Number(element.cuotas.find(t => t._id === x._id).orden.toString()), element.cuotas);

          //suma de todas las cuotas anteriores, el pagos individuales de esta cuota y el pago de cuota actual
          let totalPagadoHastaAhora = historicoCuotaActual + montoTotalAdeudadoAnterior + x.montoPagado; //total pagado hasta ahora
          let totalCuotaActual: number = historicoCuotaActual + x.montoPagado;


          let montototalAdeudado = this.utilidades.calcularMontoAdeudado(Number(element.cuotas.find(t => t._id === x._id).orden.toString()), element.cuotas);


          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(totalCuotaActual), 120, 235);
          //doc.line(10, 100, 150, 100);   //x, , largo , y
          const today = Date.now();
=======
          //let historicoCuotaActual: number = 0;
          //for (var i = 0; i < this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico.length; i++) {
           // historicoCuotaActual += Number(this.cuotasSimuladas.find(t => t._id === x._id).montoPagadoHistorico[i]);
          //}

          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(x.montoPagado), 120, 230);   //monto pagado

          //let montoTotalAdeudadoAnterior = this.utilidades.calcularMontoAdeudado(Number(element.cuotas.find(t => t._id === x._id).orden.toString()), element.cuotas);

          //suma de todas las cuotas anteriores, el pagos individuales de esta cuota y el pago de cuota actual
         // let totalPagadoHastaAhora = historicoCuotaActual + montoTotalAdeudadoAnterior + x.montoPagado; //total pagado hasta ahora 

          //let totalCuotaActual: number = +element.cuotas.find(t => t._id === x._id).MontoTotalCuota - (historicoCuotaActual + x.montoPagado);

          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
            .format(totalCuotaActual), 120, 235);  //Saldo por cuota: (adeudado)

          //const today = Date.now();
>>>>>>> c05732692914c2be3ef89f8dd7feb7f727bcd519

          //es la totalGlobal  restado el valor anterior
          //let montoAdeudado = +element.totalAPagar - totalPagadoHastaAhora;
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(montoAdeudado), 120, 243);
          doc.text(this.datePipe.transform(today, 'dd/MM/yyyy'), 120, 255)

          //parte de la cuota
          doc.setFontSize(12);
          doc.line(10, 245, 150, 245);

<<<<<<< HEAD
          //doc.line(10, 235, 150, 235);
=======
>>>>>>> c05732692914c2be3ef89f8dd7feb7f727bcd519

        }
      });     //   x: 10, y: 125
  

    })

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
