import { Component, OnInit } from '@angular/core';
import { CuotasService } from '../../modules/servicios/cuotas/cuotas.service';
import { LoginService } from 'src/app/modules/servicios/login/login.service';
import Swal from 'sweetalert2';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
declare let jsPDF;

@Component({
  selector: 'app-rendicion-de-nomina',
  templateUrl: './rendicion-de-nomina.component.html'
})
export class RendicionDeNominaComponent implements OnInit {
  nominas: any = '';
  buttonGuargarDisabled: boolean = false;
  buttonImprimirDisabled: boolean = true;
  texto = '';


  // tslint:disable-next-line:max-line-length
  constructor( private cuotasService: CuotasService, private loginService: LoginService, private datePipe: DatePipe, private router: Router) { }

  ngOnInit() {
  }

  onSearch(query: string = '') {

  /*   let xNomina = {
      ok: true,
      asignaciones: [
         {
            detalleASignacion: [
               {
                  cuotas: [
                     {
                        porcentajeInteresPorMora: 0,
                        cuotaPagada: false,
                        montoPagado: [
                           200,
                           1000,
                           50,
                           150,
                           500,
                           100
                        ],
                        montoPendienteDePago: 200,
                        diasRetraso: 0,
                        comentarios: [
                           'Se genero la cuota del credito',
                           'pago parcial',
                           'pago parcial',
                           'pago parcial',
                           'pago parcial',
                           'pago parcial',
                           'pago parcial'
                        ],
                        montoInteresPorMora: 0,
                        cuotaVencida: false,
                        fechaPago: [
                           '2018-09-12T20:58:31.061Z',
                           '2018-09-12T21:00:43.826Z',
                           '2018-09-12T21:02:02.555Z',
                           '2018-09-12T21:06:01.698Z',
                           '2018-09-12T21:17:42.965Z',
                           '2018-09-12T21:21:18.752Z'
                        ],
                        usuarioCobrador: [
                           '5b91dd1f81b8e3008ccf7cf6',
                           '5b91dd1f81b8e3008ccf7cf6',
                           '5b91dd1f81b8e3008ccf7cf6',
                           '5b91dd1f81b8e3008ccf7cf6',
                           '5b91dd1f81b8e3008ccf7cf6',
                           '5b91dd1f81b8e3008ccf7cf6'
                        ],
                        pagoInteres: false,
                        _id: '5b967ac37243670454fa8b73',
                        orden: 9,
                        montoCapital: 1250,
                        montoInteres: 937.5,
                        montoCobranzaADomicilio: 12.5,
                        MontoTotalCuota: 2200,
                        fechaVencimiento: '2019-01-23T14:08:03.247Z',
                        __v: 0
                     },
                     {
                        cuotaPagada: false,
                        montoPagado: [

                        ],
                        montoPendienteDePago: 2200,
                        diasRetraso: 0,
                        comentarios: [
                           'Se genero la cuota del credito'
                        ],
                        montoInteresPorMora: 0,
                        cuotaVencida: false,
                        fechaPago: [

                        ],
                        usuarioCobrador: [

                        ],
                        pagoInteres: false,
                        _id: '5b967ac37243670454fa8b74',
                        orden: 10,
                        montoCapital: 1250,
                        montoInteres: 937.5,
                        montoCobranzaADomicilio: 12.5,
                        MontoTotalCuota: 2200,
                        fechaVencimiento: '2019-02-07T14:08:03.247Z',
                        __v: 0
                     }
                  ],
                  credito: [
                     {
                        montoCobranzaADomicilio: 150,
                        documentos: [
                           '5b967ac37243670454fa8b78',
                           '5b967ac37243670454fa8b79',
                           '5b967ac37243670454fa8b7a',
                           '5b967ac37243670454fa8b7b'
                        ],
                        _id: '5b967ac37243670454fa8b7c',
                        cliente: '5b9679f77243670454fa8b46',
                        garante: '5b967a487243670454fa8b59',
                        comercio: '5b967a967243670454fa8b60',
                        montoPedido: 15000,
                        porcentajeInteres: 0.75,
                        montoInteres: 11250,
                        tieneCobranzaADomicilio: true,
                        porcentajeCobranzaADomicilio: 0.01,
                        cantidadCuotas: 12,
                        valorCuota: 2200,
                        planPagos: '5b967ac37243670454fa8b77',
                        usuario: '5b9196dee274a0113438f55a',
                        estado: '5b72b281708d0830d07f3564',
                        legajo_prefijo: 'A',
                        legajo: 10,
                        fechaAlta: '2018-09-10T14:08:03.265Z',
                        __v: 0
                     }
                  ],
                  estado: 'Asignacion pendiente de rendicion',
                  montoCobrado: 0,
                  _id: '5bd0c2ede11e850ee4747fad',
                  dni: '2000',
                  saldoACobrar: 2400,
                  valorDeCuota: 2200,
                  interes: 200,
                  fechaAlta: '2018-10-24T19:07:25.361Z',
                  __v: 0
               },
               {
                  cuotas: [
                     {
                        cuotaPagada: false,
                        montoPagado: [

                        ],
                        montoPendienteDePago: 1910,
                        diasRetraso: 0,
                        comentarios: [
                           'Se genero la cuota del credito'
                        ],
                        montoInteresPorMora: 0,
                        cuotaVencida: false,
                        fechaPago: [

                        ],
                        usuarioCobrador: [

                        ],
                        pagoInteres: false,
                        _id: '5b945daa7243670454fa89b0',
                        orden: 2,
                        montoCapital: 1000,
                        montoInteres: 900,
                        montoCobranzaADomicilio: 10,
                        MontoTotalCuota: 1910,
                        fechaVencimiento: '2018-11-07T23:39:22.712Z',
                        __v: 0
                     },
                     {
                        cuotaPagada: false,
                        montoPagado: [

                        ],
                        montoPendienteDePago: 1910,
                        diasRetraso: 0,
                        comentarios: [
                           'Se genero la cuota del credito'
                        ],
                        montoInteresPorMora: 0,
                        cuotaVencida: false,
                        fechaPago: [

                        ],
                        usuarioCobrador: [

                        ],
                        pagoInteres: false,
                        _id: '5b945daa7243670454fa89b1',
                        orden: 3,
                        montoCapital: 1000,
                        montoInteres: 900,
                        montoCobranzaADomicilio: 10,
                        MontoTotalCuota: 1910,
                        fechaVencimiento: '2018-12-07T23:39:22.712Z',
                        __v: 0
                     },
                     {
                        cuotaPagada: false,
                        montoPagado: [

                        ],
                        montoPendienteDePago: 1910,
                        diasRetraso: 0,
                        comentarios: [
                           'Se genero la cuota del credito'
                        ],
                        montoInteresPorMora: 0,
                        cuotaVencida: false,
                        fechaPago: [

                        ],
                        usuarioCobrador: [

                        ],
                        pagoInteres: false,
                        _id: '5b945daa7243670454fa89b2',
                        orden: 4,
                        montoCapital: 1000,
                        montoInteres: 900,
                        montoCobranzaADomicilio: 10,
                        MontoTotalCuota: 1910,
                        fechaVencimiento: '2019-01-06T23:39:22.712Z',
                        __v: 0
                     },
                     {
                        cuotaPagada: false,
                        montoPagado: [

                        ],
                        montoPendienteDePago: 1910,
                        diasRetraso: 0,
                        comentarios: [
                           'Se genero la cuota del credito'
                        ],
                        montoInteresPorMora: 0,
                        cuotaVencida: false,
                        fechaPago: [

                        ],
                        usuarioCobrador: [

                        ],
                        pagoInteres: false,
                        _id: '5b945daa7243670454fa89b3',
                        orden: 5,
                        montoCapital: 1000,
                        montoInteres: 900,
                        montoCobranzaADomicilio: 10,
                        MontoTotalCuota: 1910,
                        fechaVencimiento: '2019-02-05T23:39:22.712Z',
                        __v: 0
                     }
                  ],
                  credito: [
                     {
                        montoCobranzaADomicilio: 120,
                        documentos: [
                           '5b945daa7243670454fa89bc',
                           '5b945daa7243670454fa89bd',
                           '5b945daa7243670454fa89be',
                           '5b945daa7243670454fa89bf'
                        ],
                        _id: '5b945daa7243670454fa89c0',
                        cliente: '5b945c7c7243670454fa898a',
                        garante: '5b945ce97243670454fa899d',
                        comercio: '5b945d397243670454fa89a4',
                        montoPedido: 12000,
                        porcentajeInteres: 0.9,
                        montoInteres: 10800,
                        tieneCobranzaADomicilio: true,
                        porcentajeCobranzaADomicilio: 0.01,
                        cantidadCuotas: 12,
                        valorCuota: 1910,
                        planPagos: '5b945daa7243670454fa89bb',
                        usuario: '5b9196dee274a0113438f55a',
                        estado: '5b72b281708d0830d07f3564',
                        legajo_prefijo: 'A',
                        legajo: 7,
                        fechaAlta: '2018-09-08T23:39:22.777Z',
                        __v: 0
                     }
                  ],
                  estado: 'Asignacion pendiente de rendicion',
                  montoCobrado: 0,
                  _id: '5bd0c2ede11e850ee4747fae',
                  dni: '1120',
                  saldoACobrar: 7640,
                  valorDeCuota: 1910,
                  interes: 5730,
                  fechaAlta: '2018-10-24T19:07:25.362Z',
                  __v: 0
               }
            ],
            estado: 'Cobro Asignado',
            _id: '5bd0c2ede11e850ee4747fac',
            usuario: {
               estado: true,
               contactos: [
                  '5bb35a1fb506ca09e8c37ddd',
                  '5bb35a1fb506ca09e8c37de0',
                  '5bb35a1fb506ca09e8c37de3'
               ],
               _id: '5bb35a1fb506ca09e8c37de6',
               persona: '5bb35a1fb506ca09e8c37ddb',
               nombreUsuario: 'marcos',
               clave: '$2b$10$UA4XZEak5ot.Vcyn2jLTE.0ukZ4JwI0ZOFv/moq.q.NUdVH7FDNxW',
               rol: '5b91731eb02df40f286142be',
               fechaAlta: '2018-10-02T11:44:31.154Z',
               __v: 0
            },
            __v: 0
         }
      ]
   }; */


   let xNominas: any;

   this.cuotasService.postGetNominaDeCobranzas(query).subscribe( resp => {
       xNominas = resp;
       console.log(xNominas);

       let rendicionCobranza = {
        token: this.loginService.getTokenDeSession(),
        usuario: xNominas.asignaciones[0].usuario._id,    // cobrador
        nombreCobrador: xNominas.asignaciones[0].usuario.nombreUsuario, // nombre del cobrador
        idNominaCobranza: xNominas.asignaciones[0]._id,
        cabecera: query,
        totalCobrado: 0,
        asignaciones: []
     };

     xNominas.asignaciones[0].detalleASignacion.forEach(element => {
       let asignacion = {
         legajoCredito: element.credito[0].legajo_prefijo + ' - ' + element.credito[0].legajo,
         dniCliente: element.dni,
         valorDeCuota: element.valorDeCuota,
         fechaAlta: element.fechaAlta,
         saldoACobrar: element.saldoACobrar,
         _id: element._id,
         montoCobrado: element.montoCobrado,
       };
       rendicionCobranza.asignaciones.push(asignacion);
     });
     // Carga de Nominas a la tabla
     this.nominas = rendicionCobranza;
     console.log(this.nominas);
   });




  }

  guardarCobro() {
    this.cuotasService.postGuardarNominaDeCobranzas(this.nominas).subscribe( resp => {
      let respuesta = resp;
      console.log(respuesta);

      if (resp.ok) {
        Swal({
          title: 'Se guardó correctamente las cobranzas del cobrador',
          text: 'Quieres imprimirla?',
          type: 'success',
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: 'Si, Imprimir!',
          cancelButtonText: 'No, Cancelar'
        }).then((result) => {
          if (result.value) {
            this.imprimirComprobanteNominaPago();
          } else if (result.dismiss === Swal.DismissReason.cancel) {

          }
        });
      }
    });

    this.buttonImprimirDisabled = false;
    this.buttonGuargarDisabled = true;
  }

  verCobros() {
    console.log(this.nominas);
  }

  calcularTotalCobrado(){
    this.nominas.totalCobrado = 0;
    this.nominas.asignaciones.forEach(element => {
      this.nominas.totalCobrado = this.nominas.totalCobrado + element.montoCobrado;
    });
  }
  focusOutFunction(){
    this.calcularTotalCobrado();
  }


  lanzarPopupGuardar() {

    this.calcularTotalCobrado();

    if (this.nominas.asignaciones.length > 0) {
      Swal({
        title: 'Estas seguro de guardar?',
        text: 'Al guardar, ya no podras modificar las cobranzas del cobrador, revisa bien los datos cargados',
        type: 'warning',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Si, Guardar',
        cancelButtonText: 'No, Cancelar'
      }).then((result) => {
        if (result.value) {
          this.guardarCobro();
        }
      });
    } else {
      Swal(
        'Para guardar, debe agregar cobranzas a la lista de cobros',
        'No se puede Guardar todavía',
        'error'
      );

    }
  }



  imprimirComprobanteNominaPago() {
    const doc = new jsPDF();
    doc.setFontSize(12);

    // tslint:disable-next-line:max-line-length
    doc.text('Rendicion de Nomina de Cobros:   ' + this.nominas.nombreCobrador + '  Id: ' +  this.nominas.idNominaCobranza, 80, 15, 'center');
    doc.text('Fecha:   ' + this.datePipe.transform(new Date(), 'dd/MM/yyyy') , 80, 20, 'center');
    let separadorCol1 = 10;
    let separadorCol2 = 190;
    doc.line(separadorCol1, 25, separadorCol2, 25);
    doc.setFontSize(7);
    doc.setTextColor(0);

    let col1 = 20;
    let fila1 = 30;
    let incrementoFila = 3;
    let  i = 0;


    this.nominas.asignaciones.forEach(element => {
       doc.text( 'Legajo: ' + element.legajoCredito, col1, fila1 + (i++ * incrementoFila));
       doc.text( 'Dni Cliente: ' + element.dniCliente, col1, fila1 + (i++ * incrementoFila));
       // tslint:disable-next-line:max-line-length
       doc.text('Valor de Cuota: '  + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.valorDeCuota), col1, fila1 + (i++ * incrementoFila));
       // tslint:disable-next-line:max-line-length
       doc.text( 'Fecha de Orden de Cobro: ' + this.datePipe.transform(element.fechaAlta, 'dd/MM/yyyy'), col1, fila1 + (i++ * incrementoFila));
       // tslint:disable-next-line:max-line-length
       doc.text('Saldo a Cobrar: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.saldoACobrar), col1, fila1 + (i++ * incrementoFila));
       // tslint:disable-next-line:max-line-length
       doc.text('Monto Cobrado: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(element.montoCobrado), col1, fila1 + (i++ * incrementoFila));

       let filaSeparadora = fila1 + (i++ * incrementoFila);
       // tslint:disable-next-line:max-line-length
       doc.text( '................................................................................................................................................................................................................................................................ ', separadorCol1, filaSeparadora);
    });


    i++;
    // tslint:disable-next-line:max-line-length
    doc.text('Fecha de Rendición: ' + this.datePipe.transform(new Date(), 'dd/MM/yyyy') + '                 ' + 'Monto Pagado Total: ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(this.nominas.totalCobrado), col1, fila1 + (i++ * incrementoFila));
    // tslint:disable-next-line:max-line-length
    i++;
    i++;
    i++;
    // tslint:disable-next-line:max-line-length
    doc.text('Firma Cobrador: ................................................................              Firma Cajero: ................................................................', col1, fila1  + (i++ * incrementoFila));

    doc.save('RENDICION-COBRADOR.pdf');
    let pdfImprimir = doc.output('blob'); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
    window.open(URL.createObjectURL(pdfImprimir)); // Abre una nueva ventana para imprimir en el navegador

  }

  nuevaRendicion(){
    this.nominas = '';
    this.texto = '';

  }
}
