import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Session } from '../../modelo/util/session';
import { LoginService } from '../../modules/servicios/login/login.service';
import { Router } from '@angular/router';
import { ClientesService } from '../../modules/servicios/clientes/clientes.service';
import { DatePipe } from '@angular/common';
import { OrdenPagoService } from '../../modules/servicios/ordenPago/orden-pago.service';
import { TableOrdenDePago } from '../orden-de-pago/form-orden-de-pago/TableOrdenPago';
import 'jspdf-autotable';
import { CreditosService } from '../../modules/servicios/creditos/creditos.service';
import { EstadoCasa } from '../../modelo/negocio/estado-casa';
import { Estado } from '../../modelo/negocio/estado';

declare let jsPDF;

@Component({
  selector: 'app-cuotas',
  templateUrl: './cuotas.component.html',
  styleUrls: ['./cuotas.component.css']
})
export class CuotasComponent implements OnInit {

  cuotasForm: FormGroup;
  session = new Session();
  characters: TableOrdenDePago;
  clientes: any;
  cuotas: any[];
  charactersOrdenPago: TableOrdenDePago[];
  numeroFactura: string;
  formas: any[];
  estadosCasa: EstadoCasa[];
  estados: Estado[];

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
          name: 'pagarCuotas',
          title: 'Pagar Cuota'
        },
        {
          name: 'imprimirPDF',
          title: 'Generar Cupon'
        }
      ],
    },
    columns: {
      orden: {
        title: 'Num. Orden',
        width: '10%'
      },
      cuotaPagada: {
        title: 'Estado de Cuota',
        width: '15%'
      },

      montoPendienteDePago: {
        title: 'Monto a Pagar',
        width: '30%',
        valuePrepareFunction: (value) => {
          return value === 'montoPedido' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      fechaVencimiento: {
        title: 'Fecha Vencimiento',
        width: '15%',
        valuePrepareFunction: (date) => {
          let raw = new Date(date);
          let formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
          return formatted;
        }
      }
    },
    pager: {
      display: true,
      perPage: 10
    },
    noDataMessage: 'El Cliente no tiene Cuotas...'
  };
  constructor(private fb: FormBuilder,
    private creditosServices: CreditosService,
    private loginService: LoginService,
    private router: Router,
    private datePipe: DatePipe,
    private ordenDePago: OrdenPagoService,
    private clientesServices: ClientesService) { }

  get dni() { return this.cuotasForm.get('dni'); }

  ngOnInit() {

    this.session.token = this.loginService.getTokenDeSession();

    this.cuotasForm = this.fb.group({
      dni: new FormControl('')
    });

    this.cargarControlesCombos();
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
      case 'pagarCuotas': {
        this.pagarCuotas();
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

  buscarCreditoPorDni(dni: string) {
    //let dni = this.dni.value;

    if (this.dni.value !== '') {
      this.ordenDePago.postGetOrdenPagoPorDni(this.session, dni).subscribe((response: TableOrdenDePago[]) => {
        this.charactersOrdenPago = response['ordenDb'];
      });
      console.log(this.charactersOrdenPago);
    }

  }

  pagarCuotas() {
    this.characters.credito.planPagos.cuotas.forEach(p => {

    })
  }

  imprimirPDF(id: string) {
    const doc = new jsPDF();

    this.buscarCreditoPorDni(this.dni.value);

    doc.setFontSize(12);

    doc.setFontType("bold");
    doc.text('CUPON DE PAGO', 80, 30, 'center');
    doc.line(10, 35, 150, 35);   //x, , largo , y
    doc.setFontSize(8);
    doc.setTextColor(0)

    this.charactersOrdenPago.forEach(element => {

      if (element._id == id) {

        let fechaCancelacion: string;

        this.charactersOrdenPago.forEach(element => {
          element.credito.planPagos.cuotas.forEach(plan => {
            fechaCancelacion = plan.fechaVencimiento;
            //montoCapital = plan.montoCapital;
          });  //debo obtener el plan de pago
        });
        this.crearNumeroFactura(element.credito.legajo_prefijo, element.credito.legajo);
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
        doc.text('Cant. de Cuotas: ', 10, 80);
        doc.text('Total a pagar: .....................................................................................', 10, 90);
        doc.text('Forma de pago:  ', 10, 95);
        doc.text('Fecha de Alta: ', 80, 105);
        doc.text('Talón Cliente', 80, 110);

        doc.setFontType("bold");

        doc.text(this.numeroFactura, 50, 40);
        doc.text(element.cliente.titular.apellidos + ', ' + element.cliente.titular.nombres, 50, 50);

        doc.text(element.cliente.titular.domicilio.calle + ' ' + element.cliente.titular.domicilio.numeroCasa + ' ' + element.cliente.titular.domicilio.localidad + ' - ' + element.cliente.titular.domicilio.provincia, 50, 55);
        doc.text(element.cliente.titular.dni, 120, 50);

        if (element.cliente.contactos.numeroCelular != null) {
          doc.text(element.cliente.contactos.numeroCelular, 50, 60);
        }

        doc.text(this.datePipe.transform(element.fechaGeneracion, 'dd/MM/yyyy'), 50, 65);
        doc.text(this.datePipe.transform(fechaCancelacion, 'dd/MM/yyyy'), 120, 65);
        doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.credito.montoPedido), 50, 70);
        //doc.text( Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.montoAPagar), 120, 70);
        doc.text(element.credito.planPagos.tipoPlan.nombre, 50, 75);
        doc.text(element.credito.planPagos.CantidadCuotas.toString(), 50, 80);

        doc.line(10, 85, 150, 85);

        doc.text(Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.credito.montoPedido), 120, 90);
        doc.text(this.formas[0].formaPago.toString(), 50, 95);

        doc.line(10, 100, 150, 100);   //x, , largo , y

        doc.text(this.datePipe.transform(element.fechaPago, 'dd/MM/yyyy'), 120, 105);


        /*Talon para el Cliente*/


        doc.setFontSize(12);
        doc.line(10, 125, 150, 125);
        doc.setFontType("bold");

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

      }
    });
    doc.save('CuponDePago.pdf');
    //doc.output('dataurlnewwindow');  
  }


  crearNumeroFactura(legajo_prefijo: string, legajo: string): string {

    let s = +legajo + "";
    while (s.length < 6) {
      s = "0" + s
    };
    this.numeroFactura = legajo_prefijo + '-' + s;

    return this.numeroFactura;
  }

  private cargarControlesCombos() {

    this.clientesServices.postGetCombos().subscribe(result => {
      //this.provincias = result['respuesta'].provincias;
      this.formas = result['respuesta'].formasPago;
      // this.tiposPlanes = result['respuesta'].tiposPlanes;
      //console.log(this.formas[0].formaPago);
      this.estadosCasa = result['respuesta'].estadosCasa;
      this.estados = result['respuesta'].estadosCredito;
    });

  }

  buscarCuotasPorDni() {
    let dni = this.dni.value;
    this.session.token = this.loginService.getTokenDeSession();
    if (dni !== '') {
      this.ordenDePago.postGetOrdenPagoPorDni(this.session, dni).subscribe((response: TableOrdenDePago[]) => {
        this.characters = response['ordenDb'][0];
        //console.log(this.characters.credito);

      });
    }
    //this.cuotas = this.characters.credito.planPagos.cuotas;

  }

  onRowSelect(event) {
    console.log(event);
  }

}
