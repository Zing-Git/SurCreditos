import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../../../modules/servicios/login/login.service';
import { Session } from '../../../../modelo/util/session';
import * as moment from 'moment';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { TableCuotas } from '../../modal-cuotas/TableCuotas';
import { Pago } from './pago';
import { CuotasService } from '../../../../modules/servicios/cuotas/cuotas.service';
import 'jspdf-autotable';
import { TableCreditos } from '../../tableCreditos';
import { UtilidadesService } from '../../../../modules/servicios/utiles/utilidades.service';
import { DatePipe } from '@angular/common';
import { ClientesService } from '../../../../modules/servicios/clientes/clientes.service';
declare let jsPDF;

@Component({
  selector: 'app-simulador',
  templateUrl: './simulador.component.html',
  styleUrls: ['./simulador.component.css']
})
export class SimuladorComponent implements OnInit {

  cuotasModalForm: FormGroup;
  session = new Session();
  cuotasSimuladas: TableCuotas[];
  
  cuotas: any;
  creditos: TableCreditos[];
  cuotaAPagar: Pago;
  idCredito: string;
  
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
        width: '5%'
      },
      montoPagado: {
        title: 'Montos Pagados',
        width: '8%',
        valuePrepareFunction: (value) => {
          return value === 'montoPagado' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      montoPendienteDePago: {
        title: 'Pendiente de pago',
        width: '8%',
        valuePrepareFunction: (value) => {
          return value === 'montoPendienteDePago' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      MontoTotalCuota: {
        title: 'Total a pagar',
        width: '8%',
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
  constructor(public ngxSmartModalService: NgxSmartModalService,
    public loginService: LoginService,
    public cutaService: CuotasService,
    public utilidades: UtilidadesService, private datePipe: DatePipe, private clientesServices: ClientesService) { }

  ngOnInit() {
    //this.cuotas = this.cuotasSimuladas;
  }

  simularPago(misCuotas: TableCuotas[], misCreditos: any[], idCredito: string) {
    
    //this.cuotasSimuladas.lenght = 0;
    this.cuotasSimuladas = misCuotas;
    this.creditos = misCreditos;
    this.idCredito = idCredito;
    console.log(this.cuotasSimuladas);

  }
  cerrarModal(event) {
    this.cuotas.lenght = 0;
    //this.cuotasSimuladas.lenght = 0;
    this.ngxSmartModalService.getModal('simuladorModal').close();
  }

  realizarPago() {
    this.session.token = this.loginService.getTokenDeSession();
    this.cuotaAPagar = new Pago();
    this.cuotas.forEach(element => {
      this.cuotaAPagar.token = this.session.token;
      this.cuotaAPagar.cuota = element;

    });

    if (this.cuotaAPagar != null) {
      //llamar al servicio para realizar el pago
      this.cutaService.postPagarCuota(this.cuotaAPagar).subscribe(result => {
        let respuesta = result;
        console.log(respuesta);
        console.log(result);
        alert('Cuotas Pagadas!!!');

      }, err => {
        alert('Hubo un problema al registrar la solicitud de credito');

      });
    }
  }

  imprimirPDF(id: string) {
     const doc = new jsPDF();
    let numeroFactura: string;
 
    this.cuotaAPagar.cuota.forEach(x=>{

      doc.setFontSize(12);
 
      doc.setFontType("bold");
      doc.text('CUPON DE PAGO', 80, 30, 'center');
      doc.line(10, 35, 150, 35);   //x, , largo , y
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
          numeroFactura= this.utilidades.crearNumeroFactura(element.legajoPrefijo, element.legajo);
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
          //doc.text('Total a Pagar: ', 80, 70);
          doc.text('Plan de Pago: ', 10, 75);
          
          doc.text('Total a pagar: ', 10, 90);
          doc.text('Forma de pago:  ', 10, 95);
          doc.text('Cant. de Cuotas: ', 80, 105);
          doc.text('Fecha de Alta: ', 80, 105);
          doc.text('Talón Cliente', 80, 110);
  
          doc.setFontType("bold");
  
          doc.text(numeroFactura, 50, 40);
          doc.text(element.titularApellidos + ', ' + element.titularNombres, 50, 50);
  
          doc.text(element.titularCalle + ' ' + element.titularNumeroCasa + ' ' + element.titularLocalidad + ' - ' + element.titularProvincia, 50, 55);
          doc.text(element.titularDni, 120, 50);
  
          
          doc.text(this.datePipe.transform(element.fechaAlta, 'dd/MM/yyyy'), 50, 65);
          doc.text(this.datePipe.transform(fechaCancelacion, 'dd/MM/yyyy'), 120, 65);
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.capital), 50, 70);  //monto pedido.
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.totalAPagar), 120, 70);
          //doc.text( Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.montoAPagar), 120, 70);
          doc.text(element.tipoPlan, 50, 75);  //plan de pago es el tipo de plan(semanal, quincenal, etc...)
          doc.text(cantidadCuota, 120, 75);   //cantidad de cuotas es el ultimo orden
  
          doc.line(10, 85, 150, 85);
  
     
         
  
          doc.line(10, 100, 150, 100);   //x, , largo , y
          const today = Date.now();
          doc.text(this.datePipe.transform(today, 'dd/MM/yyyy'), 120, 105);

          //parte de la cuota
          doc.setFontSize(12);
          doc.line(10, 125, 150, 125);
          doc.setFontType("bold");

          doc.text()
          
   /*
  
          //Talon para el Cliente
  
  
          
  
          doc.text('ORDEN DE PAGO', 80, 130, 'center');
          doc.line(10, 135, 150, 135);   //x, , largo , y
          doc.setFontSize(8);
          doc.setTextColor(0)
  
          this.crearNumeroFactura(element.credito.legajo_prefijo, element.credito.legajo);
  
          doc.setFontType("normal")
  
          doc.text('Legajo de Credito: ', 10, 140);
          doc.text('Titular: ', 10, 150);
          doc.text('Domicilio: ', 10, 155);
          doc.text('Dni: ', 100, 150);
          doc.text('Telefono:     ', 10, 160);
          doc.text('Fecha de Alta: ', 10, 165);
          doc.text('Fecha de Cancelacion: ', 80, 165);
          doc.text('Capital: ', 10, 170);
          //doc.text('Total a Pagar: ', 80, 170);
          doc.text('Plan de Pago: ', 10, 175);
          doc.text('Cant. de Cuotas: ', 10, 180);
          doc.text('Total a pagar: .....................................................................................', 10, 190);
          doc.text('Forma de pago:  ', 10, 195);
          doc.text('Fecha de Alta: ', 80, 205);
  
          doc.text('..............................................', 20, 210);
          doc.text('Firma y aclaracion del titular', 20, 215);
          doc.text('Recibí conforme', 20, 220)
          doc.text('Talón Cajero', 80, 210);
  
          doc.setFontType("bold");
  
          doc.text(this.numeroFactura, 50, 140);
          doc.text(element.cliente.titular.apellidos + ', ' + element.cliente.titular.nombres, 50, 150);
  
          doc.text(element.cliente.titular.domicilio.calle + ' ' + element.cliente.titular.domicilio.numeroCasa + ' ' + element.cliente.titular.domicilio.localidad + ' - ' + element.cliente.titular.domicilio.provincia, 50, 155);
          doc.text(element.cliente.titular.dni, 120, 150);
  
          if (element.cliente.contactos.numeroCelular != null) {
            doc.text(element.cliente.contactos.numeroCelular, 50, 160);
          }
  
          doc.text(this.datePipe.transform(element.fechaGeneracion, 'dd/MM/yyyy'), 50, 165);
          doc.text(this.datePipe.transform(fechaCancelacion, 'dd/MM/yyyy'), 120, 165);
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.credito.montoPedido), 50, 170);
          //doc.text( Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.montoAPagar), 120, 170);
          doc.text(element.credito.planPagos.tipoPlan.nombre, 50, 175);
          doc.text(element.credito.planPagos.CantidadCuotas.toString(), 50, 180);
  
          doc.line(10, 185, 150, 185);
  
          doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.credito.montoPedido), 120, 190);
          doc.text(this.formas[0].formaPago.toString(), 50, 195);
  
          doc.line(10, 200, 150, 200);
  
          doc.text(this.datePipe.transform(element.fechaPago, 'dd/MM/yyyy'), 120, 205);
  */
        }
      });




    })
     
     doc.save('CuponDePago.pdf');
     //doc.output('dataurlnewwindow');  
     
   }

   private cargarControlesCombos() {

    this.clientesServices.postGetCombos().subscribe(result => {
      //this.provincias = result['respuesta'].provincias;
      this.formas = result['respuesta'].formasPago;
      // this.tiposPlanes = result['respuesta'].tiposPlanes;
      //console.log(this.formas[0].formaPago);
      //this.estadosCasa = result['respuesta'].estadosCasa;
      //this.estados = result['respuesta'].estadosCredito;
    });

  }
}
