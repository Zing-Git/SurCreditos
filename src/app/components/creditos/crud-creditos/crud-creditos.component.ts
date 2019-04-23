import { Component, OnInit, ViewChild, Output } from '@angular/core';
import { Router } from '@angular/router';
// import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
declare let jsPDF;

import { LoginService } from '../../../modules/servicios/login/login.service';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { CreditosService } from '../../../modules/servicios/creditos/creditos.service';

import { Session } from '../../../modelo/util/session';
import { TableCreditos } from './TableCreditos';
import { ItemsReferencia } from '../../../modelo/negocio/itemsReferencia';
import * as moment from 'moment/moment';
import { EstadoCasa } from '../../../modelo/negocio/estado-casa';
import { Titular } from '../../../modelo/negocio/titular';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-crud-creditos',
  templateUrl: './crud-creditos.component.html',
  styleUrls: ['./crud-creditos.component.css']
})
export class CrudCreditosComponent implements OnInit {

  //@ViewChild('viewCredito') unCredito: ViewCreditoComponent;
  //@Output() enviarCredito: EventEmitter<TableCreditos> =new  EventEmitter<TableCreditos>();
  numFactura : string;
  message = '';
  charactersNuevo = [];
  characters: TableCreditos[];
  character: TableCreditos;
  estadosCasa: EstadoCasa[];
  session = new Session();
  lineaDeCarro = 40;      // para reporte general
  carroIndividual = 50;    //para reporte individual
  cantidadTotal = 0;
  estadoCasa : EstadoCasa[];
  // tiposPlanes : Plan[];
  numeroFactura : string;

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
          name: 'view',
          title: 'Ver/ ',
        },
        {
          name: 'imprimirPDF',
          title: 'PDF'
        }
      ],
    },
    columns: {
      legajo_prefijo:{
        title: 'Serie',
        width: '5%'
      },
      legajo: {
        title: 'Legajo',
        width: '5%'
      },
      dni: {
        title: 'Dni',
        width: '10%',
        // valuePrepareFunction: (cell, row) => row.cliente.titular.dni
      },
      nombreApellido: {
        title: 'Titular',
        width: '20%',
        // valuePrepareFunction: (cell, row) => row.cliente.titular.apellidos + ', ' + row.cliente.titular.nombres
      },
     /*  cuit: {
        title: "Cuit",
        width: "10%",
        filter: true,
        sort: true,
        // valuePrepareFunction: (cell, row) => row.comercio.cuit
      },
      razonSocial: {
        title: 'Comercio',
        width: '20%',
        // valuePrepareFunction: (cell, row) => row.comercio.razonSocial
      }, */
      /* rubro:{
        title: 'Rubro',
        width: '30%'
      }, */
      montoPedido: {
        title: 'Credito',
        width: '15%',
        valuePrepareFunction: (value) => {
          return value === 'montoPedido' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
     /*  cantidadCuotas: {
        title: 'Cuotas',
        width: '5%'
      },
      valorCuota: {
        title: '$/Cuota',
        width: '10%',
        valuePrepareFunction: (value) => {
          return value === 'valorCuota' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      montoInteres: {
        title: 'Interes',
        width: '7%',
        valuePrepareFunction: (value) => {
          return value === 'montoInteres' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      }, */
     /*  tieneCobranzaADomicilio: {
        title: 'Cobro a Dom.',
        width: '10%',
        valuePrepareFunction: (value) => value === true ? 'Si' : 'NO',
      }, */
     /*  porcentajeCobranzaADomicilio: {
        title: 'Cobro a Dom.%',
        width: '10%'
      }, */
      /* montoCobranzaADomicilio: {
        title: '$Domic.',
        width: '15%',
        valuePrepareFunction: (value) => {
          // tslint:disable-next-line:max-line-length
          return value === 'montoCobranzaADomicilio' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      }, */
      estado: {
        title: 'Estado',
        width: '15%',
        // valuePrepareFunction: (cell, row) => row.estado.nombre
      },
    },
    pager: {
      display: true,
      perPage: 10
    },
  };

  constructor(
    private router: Router,
    private creditosService: CreditosService,
    private loginService: LoginService,
    private clientesServices: ClientesService,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }

  ngOnInit() {
    this.session.token = this.loginService.getTokenDeSession();

    this.spinnerService.show();
    this.creditosService.postGetAllCreditos2(this.session).subscribe((response: TableCreditos[]) => {
        this.characters = response['credito'];
        this.spinnerService.hide();
        console.log(this.characters);
        if (this.characters !== undefined) {
          this.charactersNuevo = this.convertirDataSourceParaTabla(this.characters, '');
        } else {
          Swal(
            'No hay creditos cargados!',
            'Cuando genere nuevos creditos podra visualizarlos',
            'info'
          );
        }
    } // , () => this.spinnerService.hide()
    );
    this.cargarControlesCombos();
  }

  convertirDataSourceParaTabla(tabla: TableCreditos[], filtro: string): any[] {
    let arrayCreditos = [];
    // let arrayCreditosFiltrados = [];
    tabla.forEach(element => {

      let fila = {
        _id: element._id,
        legajo_prefijo: element.legajo_prefijo,
        legajo: element.legajo,
        dni: element.cliente.titular.dni,
        nombreApellido: element.cliente.titular.apellidos + ', ' + element.cliente.titular.nombres,
        // cuit: element.comercio.cuit,
        // razonSocial: element.comercio.razonSocial,
        montoPedido: element.montoPedido,
        estado: element.estado.nombre,
      };

      if (filtro === '') {
        arrayCreditos.push(fila);
      }
    });

    return arrayCreditos;

  }

  private cargarControlesCombos() {

    this.clientesServices.postGetCombos().subscribe(result => {
      //this.provincias = result['respuesta'].provincias;
      this.estadosCasa = result['respuesta'].estadosCasa;
      // this.tiposPlanes = result['respuesta'].tiposPlanes;
      //console.log(this.estadosCasa);
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
        this.characters.forEach(element =>{
          if(element._id === id){
            this.character = element;
          }
        });

        //this.enviarCredito.emitEvent.emit(this.character);   //aqui supuestamenbte le mando el credito al formulario que lo necesita
        //this.unCredito.emitEvent.subscribe(x =>{
         // console.log(x);
       //})
        this.creditosService.Storage = this.character;
        this.router.navigate(['viewcredito', evento, id]);
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
        // console.log('Invalid choice');
        break;
      }
    }
  }

  nuevoCredito() {

  }

  imprimirClientes() {
    const doc = new jsPDF('l');

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    // doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
    doc.text('Reporte General', 150, 10, 'center');
    doc.line(120, 13, 180, 13);   // 13 es x1, 13 es y1, 250 es longitud x2, 13 es y2

    doc.autoTable({
      head: this.getData('cabecera'),
      body: this.getData('cuerpo'),
      margin: {
        top: 35
      },
    });

    doc.text('Pagina 1', 150, 200, 'center');

    doc.save('ListaCreditos.pdf');

    let pdfImprimirCreditos = doc.output("blob"); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
    window.open(URL.createObjectURL(pdfImprimirCreditos)); // Abre una nueva ventana para imprimir en el navegador

  }

   crearNumeroFactura(legajo_prefijo: string, legajo: string): string{

    let s = +legajo + "";
    //console.log(s);
    while (s.length < 6) {

      s = "0" + s
      //console.log(s);
    };
    this.numeroFactura = legajo_prefijo + '-' + s;

    return this.numeroFactura;
  }

  imprimirPDF(id: string) {
    const doc = new jsPDF();
    const today = Date.now();
    ///////////////////////////////////////////////////////////////////////////////////
    /* doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    const imgData = new Image();

    doc.text('SUR Créditos', 20, 15);
    doc.setFontSize(7);
    doc.text('CREDITOS PARA COMERCIANTES', 20, 18);

    doc.setFontSize(12); */


    /* doc.text('NOTA DE PEDIDO', 72, 30, 'center');

    doc.setFontSize(10);
    doc.setTextColor(0)
    //doc.text('Vendedor: ' + this.session.nombreUsuario, 130, 20);
    const today = Date.now();
    doc.setTextColor(0)
    doc.text('Fecha: ' + moment(today).format('DD-MM-YYYY'), 130, 25);


    this.characters.forEach(x => {
      if (x._id === id) {
        this.crearNumeroFactura(x.legajo_prefijo, x.legajo);
        doc.text('Legajo Nº:  ' + this.numeroFactura, 130, 30);
        doc.text('Estado: ' + x.estado.nombre, 130, 35);
      }
    });


    doc.setFillColor(52, 152, 219)
    doc.setTextColor(255);
    doc.setFontSize(12);
    doc.roundedRect(10, 38, 182, 8, 3, 3, 'FD')
    doc.text('Datos del Titular', 100, 43, 'center');

    doc.setFontSize(10);
    this.characters.forEach(element => {
      if (element._id === id) {

        doc.setTextColor(0);
        doc.text('Apellido y Nombre: ' + element.cliente.titular.apellidos + ', ' + element.cliente.titular.nombres, 20, 53);
        doc.text('Fecha de Nacimiento: ' + moment(element.cliente.titular.fechaNacimiento).format('DD-MM-YYYY') + '              D.N.I.: ' + element.cliente.titular.dni, 20, 58);
      }
    });

    doc.setFontSize(12);
    doc.text('Domicilio Particular', 20, 70);

    doc.setFontSize(10);
    doc.setTextColor(0);
    this.characters.forEach(element => {
      if (element._id === id) {
        doc.text('Calle: ' + element.cliente.titular.domicilio.calle, 20, 75);
        doc.text('Barrio: ' + element.cliente.titular.domicilio.barrio, 130, 75);
        doc.text('Localidad: ' + element.cliente.titular.domicilio.localidad, 20, 80);
        doc.text('Provincia: ' + element.cliente.titular.domicilio.provincia, 130, 80);
        let miEstado: string;
        this.estadosCasa.forEach(estadoC => {
          if (element.cliente.titular.domicilio.estadoCasa == estadoC._id) {
            miEstado = estadoC.nombre;
          }

        });
        doc.text('Situacion de la vivienda: ' + miEstado, 20, 85);
      }
    });

    doc.setFontSize(12);
    doc.text('Domicilio Comercial', 20, 100);

    doc.setFontSize(10);
    doc.setTextColor(0);
    this.characters.forEach(element => {


      if (element._id === id && element.hasOwnProperty('comercio') !== null) {
        if (element.comercio != null) { // && element.comercio.domicilio !== null
          doc.text('Calle: ' + element.comercio.domicilio.calle, 20, 105);
          doc.text('Barrio:' + element.comercio.domicilio.barrio, 130, 105);
          doc.text('Localidad: ' + element.comercio.domicilio.localidad, 20, 110);
          doc.text('Provincia: ' + element.comercio.domicilio.provincia, 130, 110);

        } else {
          doc.text('Calle: ', 20, 105);
          doc.text('Barrio:', 130, 105);
          doc.text('Localidad: ', 20, 110);
          doc.text('Provincia: ', 130, 110);
        }
      }
    });

    doc.setFontSize(12);
    doc.setFillColor(52, 152, 219)
    doc.roundedRect(10, 120, 182, 8, 3, 3, 'FD')

    doc.setTextColor(255);
    doc.text('Datos del Garante', 100, 125, 'center');

    doc.setFontSize(10);
    doc.setTextColor(0);

    this.characters.forEach(element => {
      if (element._id === id && element.hasOwnProperty('garante') !== null) {
        if (element.garante != null) {
          doc.text('Apellido y Nombre: ' + element.garante.titular.apellidos + ', ' + element.garante.titular.nombres, 20, 135);
          doc.text('Fecha de Nacimiento: ' + moment(element.garante.titular.fechaNacimiento).format('DD-MM-YYYY'), 20, 140);
          doc.text('D.N.I.: ' + element.garante.titular.dni, 130, 140);
          if (element.garante.titular.domicilio != null) {
            doc.text('Calle: ' + element.garante.titular.domicilio.calle, 20, 145);
            doc.text('Localidad: ' + element.garante.titular.domicilio.localidad, 20, 150);
            doc.text('Provincia: ' + element.garante.titular.domicilio.provincia, 130, 150);

            doc.text('Celular: ', 20, 155);
            doc.text('T. Fijo:', 80, 155)
            doc.text('Mail:  ', 130, 155);
          } else {
            doc.text('Calle: ', 20, 145);
            doc.text('Localidad: ', 20, 150);
            doc.text('Provincia: ', 130, 150);

            doc.text('Celular: ', 20, 155);
            doc.text('T. Fijo:', 80, 155)
            doc.text('Mail:  ', 130, 155);
          }
        }
      }
    });

    doc.setFontSize(12);
    doc.setFillColor(52, 152, 219)
    doc.roundedRect(10, 160, 182, 8, 3, 3, 'FD')

    doc.setTextColor(255);
    doc.text('Plan de Pago', 100, 165, 'center');

    doc.setFontSize(10);
    doc.setTextColor(0);

    this.characters.forEach(element => {
      if (element._id === id) {


        let m = Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.montoPedido);
        doc.text('Monto Solicitado: ' + m, 20, 175);
        doc.text('Cantidad de Cuotas: ' + element.cantidadCuotas, 80, 175);

        if (element.hasOwnProperty('planPagos') !== null) {
          if (element.planPagos.tipoPlan.hasOwnProperty('nombre')) {
            doc.text('Plan: ' + element.planPagos.tipoPlan.nombre, 150, 175); // plan
          }
        }

      }
    });
    doc.text('.................................................... ', 115, 210);
    doc.text('Firmante (Lugar y fecha): ', 120, 220);




    this.getData('CuerpoPlanPago', id);

    doc.addPage();
    doc.setFontSize(10);
    // tslint:disable-next-line:max-line-length
    doc.text(' ---------------------------------------------------------------------------------------------------------------------------------------------', 10, 30);
    doc.setFontSize(14);
    doc.text('     PAGARÉ: ', 20, 35);
    doc.setFontSize(10);
    doc.text('Pagaré sin protesto [art. 50 D. Ley 5965 / 53] a Sur Créditos o a su orden la cantidad de pesos ', 20, 45);
    doc.setFontSize(10);



    doc.text(' -----------  ' + this.toText(this.cantidadTotal) + '  ----------- ', 60, 55);


    doc.setFontSize(10);
    doc.text('Por igual valor recibido en efectivo a mi entera satisfaccion pagadero segun detalle de cuotas.-', 20, 65);
    doc.text('.................................................... ', 115, 85);
    doc.text('Firmante (Lugar y fecha): ', 120, 95); */


        // ---------------------- FIN PAGARE













    // ----------------------------- NUEVO FORMATO DE CREDITO
    // -----------------------------
    // -----------------------------
    // doc.addPage();



  /*   this.characters.forEach(x => {
      if (x._id === id) {
        console.log('Imprimir: ' + x );
      }
    }); */



    this.getData('CuerpoPlanPago', id);
    doc.setFontSize(8);
    let filaBase=20;
    let columnaBase=10;
    let columnaCodeudor=70;
    let incrementoFila=5;
    let montoPedido, cantidadCuotas, tipoPlan;

    let titular, fechaNac, dni, calle, numero, barrio, localidad, provincia, estadoCasa;
    let garante, gFechaNac, gDni, gCalle, gNumero, gLocalidad, gProvincia, gEstadoCasa;
    let valorCuota, vecimientoPrimerCuota, diasASumarCuota, vecimientoUltimaCuota;

    let localidadDeCredito = 'San Pedro de Jujuy';

    this.characters.forEach(element => {
      if (element._id === id) {
        montoPedido = Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+element.montoPedido);
        cantidadCuotas = element.cantidadCuotas;

        titular = element.cliente.titular.apellidos + ', ' + element.cliente.titular.nombres;
        fechaNac =  moment(element.cliente.titular.fechaNacimiento).format('DD-MM-YYYY');
        dni = element.cliente.titular.dni;
        calle = element.cliente.titular.domicilio.calle;
        numero = element.cliente.titular.domicilio.numeroCasa;
        barrio = element.cliente.titular.domicilio.barrio;
        localidad = element.cliente.titular.domicilio.localidad;
        provincia = element.cliente.titular.domicilio.provincia;

        valorCuota = element.valorCuota;
        vecimientoPrimerCuota = moment(element.planPagos.cuotas[0].fechaVencimiento).format('DD-MM-YYYY');
        vecimientoUltimaCuota = moment(element.planPagos.cuotas[element.planPagos.cuotas.length - 1].fechaVencimiento).format('DD-MM-YYYY');

        if (element.hasOwnProperty('planPagos') !== null) {
          if (element.planPagos.tipoPlan.hasOwnProperty('nombre')) {
            tipoPlan = element.planPagos.tipoPlan.nombre;
            diasASumarCuota = element.planPagos.tipoPlan.diasASumar;
          }
        }

        this.estadosCasa.forEach(estadoC => {
          if (element.cliente.titular.domicilio.estadoCasa === estadoC._id) {
            estadoCasa = estadoC.nombre;
          }

          if (element.garante != null) {
            if (element.garante.titular.domicilio.estadoCasa === estadoC._id) {
              gEstadoCasa = estadoC.nombre;
            }
          }

        });

        if (element._id === id && element.hasOwnProperty('garante') !== null) {
          if (element.garante != null) {
            garante = element.garante.titular.apellidos + ', ' + element.garante.titular.nombres;
            gFechaNac = moment(element.garante.titular.fechaNacimiento).format('DD-MM-YYYY');
            gDni = element.garante.titular.dni;
            if (element.garante.titular.domicilio != null) {
              gCalle = element.garante.titular.domicilio.calle;
              gNumero = element.garante.titular.domicilio.numeroCasa;
              gLocalidad = element.garante.titular.domicilio.localidad;
              gProvincia = element.garante.titular.domicilio.provincia;
            }
          }
        }



      }
    });



    doc.text('SUR CREDITOS', 45, filaBase - 5);
    doc.text('SOLICITUD DE CREDITO DE CONSUMO ', 20, filaBase);
    // tslint:disable-next-line:max-line-length
    doc.text('Sr. Gerente de CREDISUR, por el presente solicitamos un prestamo de consumo por la suma de PESOS: ', columnaBase, filaBase + incrementoFila);
    doc.text(' -----------  ' + this.toText(this.cantidadTotal) + '  ----------- ', columnaBase, filaBase + 2 * incrementoFila);

    doc.text('Deudor: ' + titular, columnaBase, filaBase + 3 * incrementoFila);
    doc.text('Dni: ' + dni, columnaBase, filaBase + 4 * incrementoFila);
    doc.text('Fecha de Nac.: ' + fechaNac, columnaBase, filaBase + 5 * incrementoFila);
    doc.text('Dirección: ' + calle + ' ' + numero, columnaBase, filaBase + 6 * incrementoFila);
    doc.text('Localidad: ' + localidad, columnaBase, filaBase + 7 * incrementoFila);
    doc.text('Propiedad: ' + estadoCasa, columnaBase, filaBase + 8 * incrementoFila);

    doc.text('Codeudor: ' + garante, columnaCodeudor, filaBase + 3 * incrementoFila);
    doc.text('Dni: ' + gDni, columnaCodeudor, filaBase + 4 * incrementoFila);
    doc.text('Fecha de Nac.: ' + gFechaNac, columnaCodeudor, filaBase + 5 * incrementoFila);
    doc.text('Dirección: ' + gCalle + ' ' + gNumero, columnaCodeudor, filaBase + 6 * incrementoFila);
    doc.text('Localidad: ' + gLocalidad, columnaCodeudor, filaBase + 7 * incrementoFila);
    doc.text('Propiedad: ' + gEstadoCasa, columnaCodeudor, filaBase + 8 * incrementoFila);


    // tslint:disable-next-line:max-line-length
    doc.text('Por el presente reconocemos adeudar a CREDISUR o a su orden la suma de PESOS ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+this.cantidadTotal) + ' por igual valor recibido a nuestra entera satisfacción ', columnaBase, filaBase + 10 * incrementoFila);
    // tslint:disable-next-line:max-line-length
    doc.text('pagaremos la suma indicada en ' + cantidadCuotas + ' cuotas iguales con la modalidad de pago ' + tipoPlan + ' y cuotas consecutivas de PESOS ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+valorCuota) + ' cada una,', columnaBase, filaBase + 11 * incrementoFila);


    // tslint:disable-next-line:max-line-length
    doc.text('venciendo la primera el dia  '  + vecimientoPrimerCuota + ' con vencimiento cada ' + diasASumarCuota + ' dias.' , columnaBase, filaBase + 12 * incrementoFila);

    // tslint:disable-next-line:max-line-length
    doc.text('Los pagos los efectuaremos en el domicilio de Velez Zarfield Nro. 201 de la ciudad de San Pedro de Jujuy o donde en el futuro se nos indique. La' , columnaBase, filaBase + 13 * incrementoFila);
    doc.text('falta de  ago producirá la mora  automatica y de pleno derecho, sin necesidad de protesto ni  interpelación judicial o extrajudicial y dará lugar ' , columnaBase, filaBase + 14 * incrementoFila);
    doc.text('al pago de interés compensatorio igual a la tasa que aplica el Banco de la Nación Argentina, para las operaciones de adelanto en cuenta corriente ' , columnaBase, filaBase + 15 * incrementoFila);
    doc.text('sin acuerdo, mas un interés punitorio pactado, entre partes igual a 1,6 veces dicha tasa en el mismo periodo. Los intereses compensatorio y puni-' , columnaBase, filaBase + 16 * incrementoFila);
    doc.text('torios  pactados, sufrirán una  capitalización mensual, formando  la base del capital sobre la que se efectuará el calculo de los mismos, y asi su- ' , columnaBase, filaBase + 17 * incrementoFila);
    doc.text('cesivamente,  conforme lo autoriza  el art. 623 del codigo  civil, modificado  por el art. 11 de la ley 23928. Producirá  la caducidad de los plazos' , columnaBase, filaBase + 18 * incrementoFila);
    doc.text('otorgados y dará derecho a exigir por la via ejecutiva el saldo total de la deuda con mas un interes compensatorio del 1.25% mensual y un interes' , columnaBase, filaBase + 19 * incrementoFila);
    doc.text('punitorio del 0,9%. Los pagos parciales o a cuenta en ningun caso no implicarán en ningún caso novación, quita ni espera de las obligaciones con-' , columnaBase, filaBase + 20 * incrementoFila);
    doc.text('traidas y de  las  acciones judiciales emergentes, aunque tales  pagos fueran posteriores a la interposición  de la demanda, la que seguirá su curso,' , columnaBase, filaBase + 21 * incrementoFila);
    doc.text('siendo computables aquellos al momento de la liquidación. Las notificaciones serán validas en los domicilios denunciados mas arriba, sometiéndonos' , columnaBase, filaBase + 22 * incrementoFila);
    doc.text('a la jurisdicción de los tribunales ordinarios de Cordoba con exclusión de cualquier otro fuero o jurisdicción que pueda corresponder.' , columnaBase, filaBase + 23 * incrementoFila);
    doc.text('Una vez transcurridos 30 dias de cancelada la obligación del presente credito y el solicitante no retire el pagaré autorizamos expresamente a des-' , columnaBase, filaBase + 24 * incrementoFila);
    doc.text('truir el mismo. Así mismo tomamos conocimiento de tal procedimiento con la firma del presente.' , columnaBase, filaBase + 25 * incrementoFila);


    doc.text('Firma Solicitante                                                           Firma Garante' , columnaBase + 30, filaBase + 28 * incrementoFila);


    // tslint:disable-next-line:max-line-length
    doc.text('Recibí de CREDISUR la suma de PESOS ' + this.toText(this.cantidadTotal) + ' (' +  Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+this.cantidadTotal) + ') ' + 'en concepto del prestamo de consumo que', columnaBase, filaBase + 30 * incrementoFila);
    // tslint:disable-next-line:max-line-length
    doc.text('solicitara pagaderos en VELEZ SARFIELD 201 o donde se nos indique y en la cantidad de ' + cantidadCuotas + ' cuotas, con vencimiento cada ' + diasASumarCuota + ' días', columnaBase, filaBase + 31 * incrementoFila);
    // tslint:disable-next-line:max-line-length
    doc.text('comenzando la primera el dia ' + vecimientoPrimerCuota + 'y la ultima en ' + vecimientoUltimaCuota, columnaBase, filaBase + 32 * incrementoFila);



    doc.text('Firma Solicitante                                                           Firma Garante' , columnaBase + 30, filaBase + 35 * incrementoFila);

    // tslint:disable-next-line:max-line-length
    doc.text(localidadDeCredito + ' ' + new Date().getDay() + ' de ' + moment(new Date()).format('MMMM') + ' de ' + moment(new Date()).format('YYYY') + ' a la vista y  a su presentación  pagare/mos solidariamente sin protesto (Art. 50 del D. Let 5965/63) a', columnaBase, filaBase + 37 * incrementoFila);
    // tslint:disable-next-line:max-line-length
    doc.text('CREDISUR la suma de PESOS ' + Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(+this.cantidadTotal) + 'por igual valor recibido a nuestra entera satisfacción. La falta de pago producirá la mora automática y', columnaBase, filaBase + 38 * incrementoFila);
    doc.text('de pleno derecho, sin  necesidad de protesto ni interpelación judicial o  extrajudicial y dara lugar al pago  de interés  compensatorio igual a la tasa ' , columnaBase, filaBase + 39 * incrementoFila);
    doc.text('que aplica el Banco de la Nacion Argentina, para las operaciones de adelanto en cuenta corriente sin acuerdo, mas un interés punitorio pactado, en' , columnaBase, filaBase + 40 * incrementoFila);
    doc.text('cuenta corriente sin acuerdo, mas un interés punitorio pactado, entre partes igual a 1,6 veces dicha tasa en el mismo periodo. Los intereses  com-' , columnaBase, filaBase + 41* incrementoFila);
    doc.text('pensatorios y punitorios pactados, sufrirán  una  capitalización mensual, formando  la base del  capital sobre  la que se efectuará el calculo de los ' , columnaBase, filaBase + 42 * incrementoFila);
    doc.text('mismos, y asi sucesivamente, conforme lo autoriza el art. 623 del codigo civil, modificado por el art. 11 de la ley 23928. ', columnaBase, filaBase + 43 * incrementoFila);
    doc.text('En nuestro caracter de suscriptores-libradores ampliamos el plazo de  presentación para el pago de este pagaré hasta (1) mes  a contar de la fecha' , columnaBase, filaBase + 44 * incrementoFila);
    doc.text('de vencimiento. (art.36 de la Ley 5965/63). A los fines de la ejecución como obligados reconocemos el caracter de titulo ejecutivo al presente pagaré' , columnaBase, filaBase + 45 * incrementoFila);
    doc.text('y renuncio/renunciamos a oponer excepción que no sea la de pago comprobado con documento escrito emanado del acreedor, como la de apelar y de' , columnaBase, filaBase + 46 * incrementoFila);
    doc.text('recusar sin causa.Como asi también facultamos al acreedor a nombrar martillero publico para el hipotetico caso de venta en subasta pública de bienes' , columnaBase, filaBase + 47 * incrementoFila);
    doc.text('embargados pagadero en San Pedro de Jujuy.' , columnaBase, filaBase + 48 * incrementoFila);

    doc.text('Firma ..........................................................                                     Firma ..........................................................' , columnaBase + 30, filaBase + 51 * incrementoFila);



   // INICIO DETALLE DE CUOTAS ---------------------------
   this.carroIndividual = 50;
   this.cantidadTotal = 0;

   doc.addPage();
   doc.text('Fecha: ' + moment(today).format('DD-MM-YYYY'), 130, 25);
   this.characters.forEach(x => {
     if (x._id === id) {
       this.crearNumeroFactura(x.legajo_prefijo, x.legajo);
       doc.text('Legajo Nº:  ' + this.numeroFactura, 130, 30);
       doc.text('Estado: ' + x.estado.nombre, 130, 35);
     }
   });

   doc.text('SUR Créditos', 20, 15, 'center');
   doc.setFontSize(7);
   doc.text('CREDITOS PARA COMERCIANTES', 6, 18);





   doc.setFontSize(12);

   doc.setTextColor(0);
   doc.text('Detalle de cuotas', 20, 40);

   doc.autoTable({
     head: this.getData('CabeceraPlanPago'),
     body: this.getData('CuerpoPlanPago', id),

     margin: {
       top: 50
     }
   });



// FIN DETALLE DE CUOTAS


    // TODO: agregar esta apertura de pestaña a todos los cruds
    doc.save('credito.pdf');
    let pdfImprimir = doc.output("blob"); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
    window.open(URL.createObjectURL(pdfImprimir)); // Abre una nueva ventana para imprimir en el navegador
    // doc.save('credito.pdf'); // Obliga a guardar el documento

    this.carroIndividual = 50;
    this.cantidadTotal = 0;
  }




  getData(tipo: string, id: string = null, dni: string = null, items: ItemsReferencia = null): Array<any> {
    const dataArray = Array<any>();

    switch (tipo) {
      case 'cabecera':
        {
          dataArray.push({
            razonSocial: 'Cliente',
            montoPedido: 'Monto Pedido',
            cantidadCuotas: 'Cant. Cuotas',
            valorCuota: 'Valor de Cuota',
            montoInteres: 'Interes',
            tieneCobranzaADomicilio: 'Cobranza a Domicilio',
            montoCobranzaADomicilio: 'Monto Cobranza Domicilio',
            estado: 'Estado Credito'
          });
          this.lineaDeCarro = this.lineaDeCarro + 10;
          break;
        }
      case 'cuerpo': {
        this.characters.forEach(element => {
          this.lineaDeCarro = this.lineaDeCarro + 10;
          let cobroDom;
          if (element.tieneCobranzaADomicilio) {
            cobroDom = 'Si';
          } else {
            cobroDom = 'No';
          }



          dataArray.push({
            razonSocial: element.cliente.titular.apellidos + ', ' + element.cliente.titular.nombres,
            montoPedido: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
            .format(Number(element.montoPedido)).toString(),
            cantidadCuotas: element.cantidadCuotas,

            valorCuota: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
              .format(Number(element.valorCuota)).toString(),
            montoInteres: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
            .format(Number(element.montoInteres)).toString(),
            // tieneCobranzaADomicilio: element.tieneCobranzaADomicilio,
            tieneCobranzaADomicilio: cobroDom,
            montoCobranzaADomicilio: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
            .format(Number(element.montoCobranzaADomicilio)).toString(),
            estado: element.estado.nombre
          });
        });
        break;
      }
      case 'CabeceraPlanPago': {
        dataArray.push({
          orden: 'Cuota',

          montoCapital: 'Capital',
          fechaVencimiento: 'Vencimiento',
          montoInteres: 'Interes',
          montoCobranzaADomicilio: 'CAdic. cobro Domic.',
          montoTotalCuota: 'Total Cuota',

        });
        break;
      }
      case 'CuerpoPlanPago': {
        this.characters.forEach(element => {
          if (element._id === id) {

            element.planPagos.cuotas.forEach(p => {
              this.carroIndividual = this.carroIndividual + 10;

              dataArray.push({
                orden: p.orden,
                montoCapital: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                  .format(Number(p.montoCapital)).toString(),
                fechaVencimiento: moment(p.fechaVencimiento).format('DD-MM-YYYY'),
                montoInteres: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                  .format(Number(p.montoInteres)).toString(),
                montoCobranzaADomicilio: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                  .format(Number(p.montoCobranzaADomicilio)).toString(),
                montoTotalCuota: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                  .format(Number(p.MontoTotalCuota)).toString()
              });
              let numeroString = (+p.MontoTotalCuota).toFixed(2);
              // console.log(numeroString);
              this.cantidadTotal = this.cantidadTotal + +(numeroString);    //+ se usa para convertir
            });
            dataArray.push({
              orden: ' ',
              montoCapital: ' ',
              fechaVencimiento: ' ',
              montoInteres: ' ',
              montoCobranzaADomicilio: ' Total',
              montoTotalCuota: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
                .format(Number(this.cantidadTotal)).toString(),
            });
            this.carroIndividual = this.carroIndividual + 5;
            // console.log(this.carroIndividual);
          }
        });
        break;
      }
      case 'filtro': {
        this.characters.forEach(element => {
          if (element._id === id) {
            dataArray.push({
              id: element._id
            });
          }
        });
        break;
      }
      default:
        // console.log('Invalid choice');
        break;
    }

    return dataArray;
  }

  getString(valor: boolean): string {
    if (valor === true) {
      return 'SI';
    } else {
      return 'NO';
    }
  }

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
}
