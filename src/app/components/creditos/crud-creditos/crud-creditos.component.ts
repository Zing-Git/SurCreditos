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
        valuePrepareFunction: (cell, row) => row.cliente.titular.dni
      },
      titular: {
        title: 'Titular',
        width: '20%',
        valuePrepareFunction: (cell, row) => row.cliente.titular.apellidos + ', ' + row.cliente.titular.nombres
      },
      razonSocial: {
        title: 'Comercio',
        width: '20%',
        valuePrepareFunction: (cell, row) => row.comercio.razonSocial
      },
      /* rubro:{
        title: 'Rubro',
        width: '30%'
      }, */
      montoPedido: {
        title: 'Credito',
        width: '13%',
        valuePrepareFunction: (value) => {
          return value === 'montoPedido' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      cantidadCuotas: {
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
      },
     /*  tieneCobranzaADomicilio: {
        title: 'Cobro a Dom.',
        width: '10%',
        valuePrepareFunction: (value) => value === true ? 'Si' : 'NO',
      }, */
     /*  porcentajeCobranzaADomicilio: {
        title: 'Cobro a Dom.%',
        width: '10%'
      }, */
      montoCobranzaADomicilio: {
        title: '$Domic.',
        width: '15%',
        valuePrepareFunction: (value) => {
          // tslint:disable-next-line:max-line-length
          return value === 'montoCobranzaADomicilio' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      estado: {
        title: 'Estado',
        width: '15%',
        valuePrepareFunction: (cell, row) => row.estado.nombre
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
    private clientesServices: ClientesService
  ) { }

  ngOnInit() {
    this.session.token = this.loginService.getTokenDeSession();
    this.creditosService.postGetAllCreditos2(this.session).subscribe((response: TableCreditos[]) => {
     this.characters = response['credito'];
    });

    this.cargarControlesCombos();
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

    doc.save('reporte.pdf');
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

    //agregar formato A-000009 0-000009 este ultimo manual  => agregar x cantidad de ceros segun el numero de legajo
    ///////////////////////////////////////////////////////////////////////////////////
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    //let imagen = new Image;
    //imagen.onload = function(){
    //  doc.addImage(this,20,15);

    //imagen.crossOrigin = "";

    //imagen.src = "../crud-creditos/crediSur.jpg";
    // tslint:disable-next-line:max-line-length
    // imgData.src = 'https://npclhg.dm.files.1drv.com/y4m9GX1-ImqUAw21oHBc1AU0cXj8xJb_B4EW3Omo1lOtFGEwYTmTagcQHp6Zn7AjSsa84JUu_H2bNDa_rY8Ubsl2hkNV4xk5zmWlUaN2tz_0i1q39QOAfWe_FLpR-Jfg_J94rvvQpLHLNw5_aT2hWdWRsBclGuCgF9U1i5taliO9DWw7sc4EnxfgcWT_WamOy60jkpOdDzEQIINslKGINAR6A?width=558&height=299&cropmode=none' ;
    // doc.addImage(imgData, 50, 50);
    doc.text('Sur Creditos', 20, 15, 'center');
    doc.setFontSize(7);
    doc.text('CREDITOS PARA COMERCIANTES', 6, 18);

    doc.setFontSize(12);
    doc.setTextColor(255);
    doc.setFillColor(52, 152, 219)
    doc.roundedRect(50, 23, 45, 10, 3, 3, 'FD')  //10 inicio, 23 es altura, 182 largo, 10 es
    doc.setFillColor(1);

    doc.text('NOTA DE PEDIDO', 72, 30, 'center');

    doc.setFontSize(10);
    doc.setTextColor(0);
    let usuario = this.loginService.getDatosDeSession();
    doc.text('Vendedor: ' + usuario.nombreUsuario, 130, 20);
    const today = Date.now();
    doc.setTextColor(0);
    doc.text('Fecha: ' + moment(today).format('DD-MM-YYYY'), 130, 25);

    this.characters.forEach(element => {
      if(element._id === id){
        this.crearNumeroFactura(element.legajo_prefijo,element.legajo);
      }

    });
    doc.text('Legajo Nº:  ' + this.numeroFactura , 130, 30);
    doc.text('Estado: ', 130, 35);

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
        //doc.text('ACtividad: ' + element.comercio.codigoActividad + ' - ' + element.comercio.descripcionActividad, 80, 53);
        doc.text('Fecha de Nacimiento: ' + moment(element.cliente.titular.fechaNacimiento).format('DD-MM-YYYY') ,20, 58);
        doc.text('D.N.I.: ' + element.cliente.titular.dni, 130, 58 )
        //Domicilio
        doc.text('Calle: ' + element.cliente.titular.domicilio.calle, 20, 63);
        doc.text('Barrio: ' + element.cliente.titular.domicilio.barrio, 130, 63);
        doc.text('Localidad: ' + element.cliente.titular.domicilio.localidad, 20, 68);
        doc.text('Provincia: ' + element.cliente.titular.domicilio.provincia, 130, 68);
        let miEstado: string;
        this.estadosCasa.forEach(estadoC => {
          if (element.cliente.titular.domicilio.estadoCasa == estadoC._id) {
            miEstado = estadoC.nombre;
          }

        });
        doc.text('Situacion de la vivienda: ' + miEstado, 20, 73);

        //Datos de Comercio

        doc.setFontSize(12);
        doc.setFillColor(52, 152, 219)
        doc.roundedRect(10, 78, 182, 8, 3, 3, 'FD')

        doc.setTextColor(255);
        doc.text('Datos del Comercio', 100, 83, 'center');

        doc.setFontSize(10);
        doc.setTextColor(0);

        if (element.comercio.domicilio != null) {
          doc.text('Razon Social: ' + element.comercio.razonSocial, 20, 93)//93
          doc.text('Descripcion: ' + element.comercio.descripcionActividad, 20, 98)//98
          doc.text('Calle: ' + element.comercio.domicilio.calle, 20, 103);
          doc.text('Barrio:' + element.comercio.domicilio.barrio, 130, 103);
          doc.text('Localidad: ' + element.comercio.domicilio.localidad, 20, 108);
          doc.text('Provincia: ' + element.comercio.domicilio.provincia, 130, 108);

          doc.text('Celular: ', 20, 113);
          doc.text('T. Fijo:', 80, 113)
          doc.text('Mail:  ', 130, 113);
        } else {
          doc.text('Calle: ', 20, 103);
          doc.text('Barrio:', 130, 103);
          doc.text('Localidad: ', 20, 108);
          doc.text('Provincia: ', 130, 108);

          doc.text('Celular: ', 20, 113);
          doc.text('T. Fijo:', 80, 113)
          doc.text('Mail:  ', 130, 113);
        }

        //Datos de Garante
        doc.setFontSize(12);
        doc.setFillColor(52, 152, 219)
        doc.roundedRect(10, 118, 182, 8, 3, 3, 'FD')

        doc.setTextColor(255);
        doc.text('Datos del Garante', 100, 123, 'center');

        doc.setFontSize(10);
        doc.setTextColor(0);

        if (element.garante.titular != null) {
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
        doc.text('Monto Solicitado: ' + element.montoPedido, 20, 175);
        doc.text('Cantidad de Cuotas: ' + element.cantidadCuotas, 80, 175);
        //aqui iba tipo de plan que no existe en credito
      }
    });

    this.getData('CuerpoPlanPago', id);
    doc.setFontSize(10);
    doc.text('Pagare sin protesto [art. 50 D. Ley 5965 / 53] a Sur Creditos o a su Oredn la Cantidad de Pesos ', 10, 190);
    doc.setFontSize(12);
    doc.setLineWidth(0.5);
    doc.line(10, 194, 190, 194);
    doc.line(10, 202, 190, 202);   //x, , largo , y
    doc.text(this.toText(this.cantidadTotal), 60, 200);
    doc.setFontSize(10);
    doc.text('por igual valor recibido en efectivo a mi entera satisfaccion pagadero segun detalle de cuotas.', 10, 210);
    doc.text('Firmante (Lugar y fecha): ', 90, 230);

    this.carroIndividual = 50;
    this.cantidadTotal = 0;

    doc.addPage();

    doc.text('CrediSUR', 20, 15, 'center');
    doc.setFontSize(7);
    doc.text('CREDITOS PARA COMERCIANTES', 6, 18);

    doc.setFontSize(12);
    doc.setTextColor(255);
    doc.setFillColor(52, 152, 219)
    doc.roundedRect(50, 23, 45, 10, 3, 3, 'FD')  //10 inicio, 23 es altura, 182 largo, 10 es
    doc.setFillColor(1);

    doc.text('NOTA DE PEDIDO', 72, 30, 'center');

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

    // console.log();

    doc.save('reporteIndividual.pdf');
    this.carroIndividual = 50;
    this.cantidadTotal = 0;
  }


  getData(tipo: string, id: string = null, dni: string = null, items: ItemsReferencia = null): Array<any> {
    const dataArray = Array<any>();

    switch (tipo) {
      case 'cabecera':
        {
          dataArray.push({
            razonSocial: 'Razon Social',
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
          dataArray.push({
            razonSocial: element.comercio.razonSocial,
            montoPedido: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
            .format(Number(element.montoPedido)).toString(),
            cantidadCuotas: element.cantidadCuotas,

            valorCuota: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
              .format(Number(element.valorCuota)).toString(),
            montoInteres: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })
            .format(Number(element.montoInteres)).toString(),
            tieneCobranzaADomicilio: element.tieneCobranzaADomicilio,
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
