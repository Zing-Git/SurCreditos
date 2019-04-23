import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Session } from '../../../modelo/util/session';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { Router } from '@angular/router';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { DatePipe } from '@angular/common';
import { Cliente } from '../../../modelo/negocio/cliente';
import { OrdenPagoService } from '../../../modules/servicios/ordenPago/orden-pago.service';
import { TableOrdenDePago } from './TableOrdenPago';
import 'jspdf-autotable';
import { CreditosService } from '../../../modules/servicios/creditos/creditos.service';
import { EstadoCasa } from '../../../modelo/negocio/estado-casa';
import { Estado } from '../../../modelo/negocio/estado';
import { TableCreditos } from '../../creditos/crud-creditos/TableCreditos';
declare let jsPDF;
import Swal from'sweetalert2';

@Component({
  selector: 'app-form-orden-de-pago',
  templateUrl: './form-orden-de-pago.component.html',
  styleUrls: ['./form-orden-de-pago.component.css']
})
export class FormOrdenDePagoComponent implements OnInit {

  ordenDePagoForm: FormGroup;
  session = new Session();
  characters: TableOrdenDePago[];
  charactersCreditos: TableCreditos[];
  characterAprobados: TableOrdenDePago[];
  cliente: Cliente;
  numeroFactura: string;
  formas: any[];
  estadosCasa: EstadoCasa[];
  estados: Estado[];
  confirmarAlerta: string= '';

  yaPagoAUnCliente = false;


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
          title: 'Generar Cupon/ '
        },
        {
          name: 'pagarOrdenDePago',
          title: 'Pagar Orden de Pago'
        }
      ],
    },
    columns: {
      legajo_prefijo: {
        title: 'Orden',
        width: '6%',
        filter: false,
        valuePrepareFunction: (cell, row) => row.numeroOrden
      },
      nombre: {
        title: 'Cliente',
        width: '20%',
        filter: false,
        valuePrepareFunction: (cell, row) => row.cliente.titular.apellidos + ', ' + row.cliente.titular.nombres
      },

      montoAPagar: {
        title: 'Monto de Credito',
        width: '15%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'montoPedido' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      fechaGeneracion: {
        title: 'Fecha Crédito',
        width: '15%',
        filter: false,
        valuePrepareFunction: (date) => {
          let raw = new Date(date);
          let formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
          return formatted;
        }
      },
      fechaPago: {
        title: 'Fecha Pago',
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
    private clientesServices: ClientesService,
    private loginService: LoginService,
    private router: Router,
    private datePipe: DatePipe,
    private ordenDePago: OrdenPagoService,
    private creditoService : CreditosService) { }

  ngOnInit() {

    this.session.token = this.loginService.getTokenDeSession();
    this.ordenDePagoForm = this.fb.group({
      dni: new FormControl('', [Validators.required])
    });

    this.cargarControlesCombos();

  }

  lanzarPopup(id: string){
    Swal({
      title: 'Estas seguro?',
      text: 'Estas por realizar el pago de una Orden de Pago!!!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, Pagar!',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {

      if (result.value) {

        console.log(id);


        this.pagarOrdenDePago(id);



        Swal(
          'Pagado!',
          'La Orden de Pago fue Pagada!!',
          'success'
        )
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal(
          'Cancelado',
          'Cancelo el pago',
          'error'
        )
      }
    })
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
      case 'pagarOrdenDePago':{
        // console.log('ide que se manda a pagar' + id);

        this.lanzarPopup(id);

        //this.pagarOrdenDePago(id);
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
    while (s.length < 6) {
      s = "0" + s
    };
    this.numeroFactura = legajo_prefijo + '-' + s;

    return this.numeroFactura;
  }

  imprimirPDF(id: string) {
    const doc = new jsPDF();
    doc.setFontSize(12);

    doc.setFontType("bold");
    doc.text('ORDEN DE PAGO', 80, 30, 'center');
    doc.line(10, 35, 150, 35);   //x, , largo , y
    doc.setFontSize(8);
    doc.setTextColor(0)

    this.characters.forEach(element => {

      if (element._id == id) {

        let fechaCancelacion: string;

        this.characters.forEach(element => {
          element.credito.planPagos.cuotas.forEach(plan => {
            fechaCancelacion = plan.fechaVencimiento;
            //montoCapital = plan.montoCapital;
          });  //debo obtener el plan de pago
        });
        this.crearNumeroFactura(element.credito.legajo_prefijo, element.credito.legajo);
        // console.log(element._id);


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
    let pdfImprimir = doc.output("blob"); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
    window.open(URL.createObjectURL(pdfImprimir)); // Abre una nueva ventana para imprimir en el navegador

  }

  get dni() { return this.ordenDePagoForm.get('dni'); }

  buscarCreditoPorDni() {
    let dni = this.dni.value;

    if (this.dni.value !== '') {
      this.ordenDePago.postGetOrdenPagoPorDni(this.session, dni).subscribe((response: TableOrdenDePago[]) => {
        this.characters = response['ordenDb'];

        if (typeof this.characters === 'undefined' && this.yaPagoAUnCliente === false) {
          // tslint:disable-next-line:max-line-length
          Swal('Advertencia', 'El cliente no tiene ordenes de pago pendientes, pudo haberse pagado o que el credito no se haya aprobado' , 'info');
        }
        if (this.yaPagoAUnCliente){
          this.yaPagoAUnCliente = false;
        }
       /*  console.log('Busqueda: ', response);
        console.log('Busqueda: ', this.characters); */
      });
    }

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

  private pagarOrdenDePago(idOrden: string){
    let medioPago= this.formas[0].formaPago.toString();

   /*  console.log(idOrden);
    console.log(this.session.token);
    console.log(medioPago); */

    this.ordenDePago.postPagarOrdenDePago(idOrden, this.session.token, medioPago).subscribe(result =>{
      let respuesta = result;
      console.log(respuesta);
      Swal('Bien Hecho!', 'Ya pagaste el credito al cliente, el credito figurará como PAGADO' , 'success');
      this.yaPagoAUnCliente = true;
      this.buscarCreditoPorDni();
    }, error => {
      Swal('No se pudo registrar el pago', 'Intentanta nuevamente, revisa tu conexión' , 'info');
    });

    // this.postAprobarRechazar(idOrden,'PAGADO');
  }


  cargarCreditos(dni: string){
    this.creditoService.postGetCreditosVigentes(this.session, dni).subscribe((response: TableCreditos[]) => {
      this.charactersCreditos = response['creditos'];
      if(typeof response['creditos'] === 'undefined'){
        Swal('Advertencia', 'Orden de pago esta pagada o no existe!!', 'warning');
      }
      console.log('AQUI UN RESULTADO DE CREDITOS------>' + this.charactersCreditos);
    });

  }

  postAprobarRechazar(id: string, nuevoEstado: string) {
    let dni = this.dni.value;
    this.cargarCreditos(dni);
    this.creditoService.postGetCreditosVigentes(this.session, dni).subscribe((response: TableCreditos[]) => {
      this.charactersCreditos = response['creditos'];
      if(typeof response['creditos'] === 'undefined'){
        Swal('Advertencia', 'Orden de pago esta pagada o no existe!!', 'warning');
      }
      console.log('AQUI UN RESULTADO DE CREDITOS------>' + this.charactersCreditos);
    });

    let idNuevoEstado: string;
    this.estados.forEach(element => {
      if (nuevoEstado === element.nombre) {
        idNuevoEstado = element._id;
      }
    });

    this.charactersCreditos.forEach(element => {
      if (element._id === id) {
        if (element.estado.nombre === 'APROBADO') {
          let nuevoCredito = {
            idCredito: element._id,
            estado: idNuevoEstado,   // '5b72b281708d0830d07f3562'        // element.estado._id
            nombre_nuevo_estado: nuevoEstado,           // APROBADO RECHASADO OTRO,
            cliente: element.cliente._id,
            monto: element.montoPedido,
            nombre_estado_actual: element.estado.nombre,
            token: this.session.token
          };

          this.creditoService.postCambiarEstadoCredito(nuevoCredito).subscribe(result => {
            let respuesta = result;
            //alert('Se actualizó el estado de Credito');

          }, err => {
            alert('Ocurrio un problema');
          });
        } else {
          alert('No se puede cambiar el estado');
        }
      }
    });
    }



  onEnterDniCliente(){
    this.buscarCreditoPorDni();
  }
}
