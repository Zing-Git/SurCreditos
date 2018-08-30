import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Session } from '../../../modelo/util/session';

import { CreditosService } from '../../../modules/servicios/creditos/creditos.service';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { Router } from '@angular/router';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { DatePipe } from '@angular/common';
import { Cliente } from '../../../modelo/negocio/cliente';
import { OrdenPagoService } from '../../../modules/servicios/ordenPago/orden-pago.service';
import { TableOrdenDePago } from './TableOrdenPago';
import 'jspdf-autotable';
import { elementEnd } from '@angular/core/src/render3/instructions';
declare let jsPDF;

@Component({
  selector: 'app-form-orden-de-pago',
  templateUrl: './form-orden-de-pago.component.html',
  styleUrls: ['./form-orden-de-pago.component.css']
})
export class FormOrdenDePagoComponent implements OnInit {

  ordenDePagoForm: FormGroup;
  session = new Session();
  characters: TableOrdenDePago[];
  characterAprobados: TableOrdenDePago[];
  cliente: Cliente;
  numeroFactura: string;

  settings = {

    actions: {
      columnTitle: 'Accion',
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,
      position: 'right',
      custom: [
        {
          name: 'imprimirPDF',
          title: 'Generar Cupon'
        }
      ],
    },
    columns: {
      legajo_prefijo: {
        title: 'Num. Orden',
        width: '10%',
        valuePrepareFunction: (cell, row) => row.numeroOrden
      },
      nombre: {
        title: 'Nombre Completo',
        width: '15%',
        valuePrepareFunction: (cell, row) => row.cliente.titular.apellidos + ', ' + row.cliente.titular.Nombres
      },
     
      montoAPagar: {
        title: 'Monto de Credito',
        width: '30%',
        valuePrepareFunction: (value) => {
          return value === 'montoPedido' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      fechaGeneracion: {
        title: 'Fecha Generación',
        width: '15%',
        valuePrepareFunction: (date) => {
          let raw = new Date(date);
          let formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
          return formatted;
        }
      },
      fechaPago: {
        title: 'Fecha de Alta',
        width: '15%',
        filter: false,
        valuePrepareFunction: (date) => {
          let raw = new Date(date);
          let formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
          return formatted;
        }
      },
    },
    pager: {
      display: true,
      perPage: 10
    },
    noDataMessage: 'El Cliente no tiene orden de Pago...'
  };


  constructor(private fb: FormBuilder,
    private clientesService: ClientesService,
    private loginService: LoginService,
    private creditosService: CreditosService,
    private router: Router,
    private datePipe: DatePipe,
    private ordenDePago: OrdenPagoService) { }

  ngOnInit() {

    this.session.token = this.loginService.getTokenDeSession();
    this.ordenDePagoForm = this.fb.group({
      dni: new FormControl('', [Validators.required])
    });

  }

  onCustom(event) {
    //alert(`Custom event '${event.action}' fired on row №: ${event.data._id}`);
    const evento = (`${event.action}`);
    const dni = (`${event.data.dni}`);
    const id = (`${event.data._id}`);

    switch (evento) {
      case 'view': {
        //this.router.navigate(['formclienteviewedit', evento, dni]);
        this, this.router.navigate(['viewcredito', evento, id]);
        break;
      }
      case 'edit': {

        break;
      }

      case 'imprimirPDF': {
        this.imprimirPDF(id);
        break;
      }
      default: {
        console.log('Invalid choice');
        break;
      }
    }
  }

  crearNumeroFactura(legajo_prefijo: string, legajo: string): string {

    let s = +legajo + "";
    console.log(s);
    while (s.length < 6) {

      s = "0" + s
      console.log(s);
    };
    this.numeroFactura = legajo_prefijo + '-' + s;

    return this.numeroFactura;
  }

  imprimirPDF(id: string) {
    const doc = new jsPDF();
    doc.setFontSize(12);
    //doc.setTextColor(255);
    // doc.setFillColor(52, 152, 219)
    //doc.roundedRect(50, 23, 45, 10, 3, 3, 'FD')  //10 inicio, 23 es altura, 182 largo, 10 es
    //doc.setFillColor(1);

    doc.text('ORDEN DE PAGO', 50, 30, 'center');
    doc.line(10, 35, 100, 35);   //x, , largo , y
    doc.setFontSize(10);
    doc.setTextColor(0)
    // doc.text('Vendedor: ' + this.session.nombreUsuario, 130, 20);
    //const today = Date.now();
    //doc.setTextColor(0);
    //doc.text('Fecha: ' + this.datePipe.transform(today, 'dd/MM/yyyy'), 130, 25);
    this.characters.forEach(element => {

      if (element._id == id) {
        this.crearNumeroFactura(element.credito.legajo_prefijo, element.credito.legajo);
        doc.text('Legajo de Credito:          ' + this.numeroFactura, 10, 40)

        doc.text('Titular:      ' + element.cliente.titular.apellidos + ', ' + element.cliente.titular.nombres, 10, 50);
        doc.text('Domicilio:    ' + element.cliente.titular.domicilio.calle + ' ' + element.cliente.titular.domicilio.numeroCasa + ' ' + element.cliente.titular.domicilio.localidad + ' - ' + element.cliente.titular.domicilio.provincia,10,55);
        doc.text('Dni:          ' + element.cliente.titular.dni, 40, 50);
        doc.text('Telefono:     ' + element.cliente.contactos.numeroCelular, 10, 60);

        doc.text('Fecha de Alta:  '+ this.datePipe.transform(element.fechaGeneracion, 'dd/MM/yyyy'), 10, 65);
        let fechaCancelacion : string;
        let montoCapital : string;
        element.credito.planPagos.cuotas.forEach(plan => {
            fechaCancelacion = plan.fechaVencimiento;  
            montoCapital = plan.montoCapital;          
        });  //debo obtener el plan de pago
        doc.text('Fecha de Cancelacion: ' + this.datePipe.transform(fechaCancelacion),40, 65);

        doc.text('Capital:     ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+montoCapital), 10, 70);
        doc.text('Total a Pagar:   '+ Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.montoAPagar), 40, 70);
        doc.text('Plan de Pago:    '+ element.credito.planPagos.tipoPlan.nombre, 10, 75);
        doc.text('Saldo:  ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format((element.montoAPagar - (+montoCapital))),40,75);
        doc.text('Cant. de Cuotas: ' + element.credito.planPagos.CantidadCuotas, 10, 80);
      }
    });

    doc.line(10, 85, 100, 85);   //x, , largo , y

    doc.save('CuponDePago.pdf');
  }

  get dni() { return this.ordenDePagoForm.get('dni'); }

  buscarCreditoPorDni() {
    let dni = this.dni.value;

    if (this.dni.value !== '') {
      this.ordenDePago.postGetOrdenPagoPorDni(this.session, dni).subscribe((response: TableOrdenDePago[]) => {
        this.characters = response['ordenDb'];
      });

    }

  }

}
