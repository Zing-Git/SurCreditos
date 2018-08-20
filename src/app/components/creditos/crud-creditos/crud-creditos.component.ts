import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

import { LoginService } from '../../../modules/servicios/login/login.service';
import { CreditosService } from '../../../modules/servicios/creditos/creditos.service';
import { Session } from '../../../modelo/util/session';
import { TableCreditos } from './TableCreditos';
import { ItemsReferencia } from '../../../modelo/negocio/itemsReferencia';
import * as moment from 'moment';
declare let jsPDF;

@Component({
  selector: 'app-crud-creditos',
  templateUrl: './crud-creditos.component.html',
})
export class CrudCreditosComponent implements OnInit {

  message = '';
  characters: TableCreditos[];
  session = new Session();
  lineaDeCarro = 40;

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
          title: ' /PDF'
        }
      ],
    },
    columns: {
      razonSocial: {
        title: 'Razon Social',
        width: '15%',
        valuePrepareFunction: (cell, row) => { return row.comercio.razonSocial }
      },
      montoPedido: {
        title: 'Monto Pedido',
        width: '15%'
      },
      cantidadCuotas: {
        title: 'Cant. Cuotas',
        width: '15%'
      },
      valorCuota: {
        title: 'Valor Cuota',
        width: '15%',
      },
      montoInteres: {
        title: 'Interes',
        width: '10%'
      },
      tieneCobranzaADomicilio: {
        title: 'Cobranza a Domicilio',
        width: '10%',
        valuePrepareFunction: (value) => { return value === true ? 'Si' : 'NO' },
      },
      porcentajeCobranzaADomicilio: {
        title: 'Cobranza a Domicilio %',
        width: '10%'
      },
      montoCobranzaADomicilio: {
        title: 'Monto Cobranza Domicilio',
        width: '10%'
      },
      estado: {
        title: 'Estado Credito',
        width: '15%',
        valuePrepareFunction: (cell, row) => { return row.estado.nombre }
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
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.session.token = this.loginService.getTokenDeSession();
    this.creditosService.postGetAllCreditos(this.session).subscribe((response: TableCreditos[]) => {
      this.characters = response['credito'];
    });
  }

  onCustom(event) {
    // alert(`Custom event '${event.action}' fired on row №: ${event.data.dni}`);
    let evento = (`${event.action}`);
    let dni = (`${event.data.dni}`);
    let id = (`${event.data._id}`);
    let apellidos = (`${event.data.apellidos}`);
    let nombres = (`${event.data.nombres}`);

    switch (evento) {
      case 'view': {
        this.router.navigate(['formclienteviewedit', evento, dni]);
        break;
      }
      case 'edit': {

        break;
      }

      case 'imprimirPDF': {
        this.imprimirPDF(id, dni);
        break;
      }
      default: {
        console.log('Invalid choice');
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
    //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
    doc.text("Reporte General", 150, 10, 'center');
    doc.line(120, 13, 180, 13);   //13 es x1, 13 es y1, 250 es longitud x2, 13 es y2

    doc.autoTable({
      head: this.getData('cabecera'),
      body: this.getData('cuerpo'),
      margin: {
        top: 35
      },
    });

    doc.text("Pagina 1", 150, 200, 'center');

    doc.save('reporte.pdf');
  }

  imprimirPDF(id: string, dni: string) {
    const doc = new jsPDF('l');

    ///////////////////////////////////////////////////////////////////////////////////
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
    doc.text("Reporte Credito", 150, 10, 'center');
    doc.line(120, 13, 180, 13);   //13 es x1, 13 es y1, 250 es longitud x2, 13 es y2

    this.characters.forEach(element => {
      if (element._id == id) {
        // doc.setFontSize(24);
        //doc.text('Documentos', this.lineaDeCarro, 40, 'right');
        //doc.line(13, this.lineaDeCarro - 17, 250, this.lineaDeCarro - 17);   //13 es x1, 13 es y1, 250 es longitud x2, 13 es y2
        doc.setFontSize(12);

        doc.autoTable({
          head: this.getData('CabeceraDocumento'),
          body: this.getData('CuerpoDocumento'),
          margin: {
            top: 30
          },
        });
      }
    });
    ///////////////////////////////////////////////////////////////////////////////////
    this.lineaDeCarro = this.lineaDeCarro + 20;
    doc.setFontSize(12);
    //doc.text('Cliente', 100, 30, 'right');
    doc.line(13, this.lineaDeCarro - 10, 250, this.lineaDeCarro - 10);   //13 es x1, 13 es y1, 250 es longitud x2, 13 es y2

    doc.autoTable({
      head: this.getData('CabeceraCliente'),
      body: this.getData('CuerpoCliente', id),
      margin: {
        top: 50
      }
    });


    ///////////////////////////////////////////////////////////////////////////////////
    this.lineaDeCarro = this.lineaDeCarro + 40;
    doc.line(13, this.lineaDeCarro - 10, 250, this.lineaDeCarro - 10);   //13 es x1, 13 es y1, 250 es longitud x2, 13 es y2

    doc.autoTable({
      head: this.getData('CabeceraPlanPago'),
      body: this.getData('CuerpoPlanPago')
    })

    doc.text('Pagina: 1' , this.lineaDeCarro, this.lineaDeCarro );
    doc.addPage();

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    doc.text("Reporte Credito", 150, 10, 'center');
    doc.line(120, 13, 180, 13);   //13 es x1, 13 es y1, 250 es longitud x2, 13 es y2

    this.characters.forEach(element => {
      doc.text('Apellido y Nombre de Titular: ' + element.cliente.titular.apellidos + ', ' + element.cliente.titular.nombres, 30, 40);

      element.cliente.referencias.forEach(x => {
        doc.text('Comentario:   ' + x.comentario, 40, 50);

      });

    });
    this.characters.forEach(element => {
      //console.log(element.garante.titular);
        doc.text('Apellido y Nombre del Garante:  ' + element.garante.titular.apellidos + ', ' +  element.garante.titular.nombres, 30, 60);
      });

    console.log(this.lineaDeCarro);
    /*
       contY = contY + 10;
      doc.text('Nombre:  ' + docu.nombre, contX + 10, contY);
      contY = contY + 10;
      doc.text('Requerido:  ' + this.getString(docu.requerido), contX + 10, contY);
      contY = contY + 10;
      doc.text('Presentado: ' + this.getString(docu.presentado), contX + 10, contY);

    doc.text('Nombre:  ' + element.documentos.nombre, 30, 50);
     doc.text('Requerido:  ' + element.documentos.requerido =true: 'Si'? 'No'), 200,50);
     doc.text('Localidad:  ' + element.titular.domicilio.localidad, 30, 60);
     doc.text('Calle: ' + element.titular.domicilio.calle, 30, 70);
     doc.text('Numero: ' + element.titular.domicilio.numeroCasa,30,80);*/



    //doc.autoTable({
    //  head: this.getData('cabecera'),
    //  body: this.getData('filtro', id, dni),
    //  margin: {
    //    top: 20
    //  }

    //});

    doc.save('reporteIndividual.pdf');

  }


  getData(tipo: string, id: string = null, dni: string = null, items: ItemsReferencia = null): Array<any> {
    let dataArray = Array<any>();

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
      case 'CabeceraDocumento': {
        dataArray.push({
          nombre: 'DOCUMENTO - Nombre',
          requerido: 'Requerido',
          presentado: 'Presentado'
        });
        this.lineaDeCarro = this.lineaDeCarro + 10;
        break;
      }
      case 'CabeceraCliente': {
        dataArray.push({
          titulo: 'CLIENTE - Titulo',
          referencia: 'Referencia'
        });
        this.lineaDeCarro = this.lineaDeCarro + 10;
        break;
      }
      case 'CuerpoCliente': {

        console.log(this.characters);
        this.characters.forEach(element => {
          if (element._id == id) {
            element.cliente.referencias.forEach(tipoR => {

              tipoR.itemsReferencia.forEach(x => {
                this.lineaDeCarro = this.lineaDeCarro + 10;

                dataArray.push({
                  titulo: x.item,
                  referencia: this.getString(x.referenciaCliente)
                });
              })
            });
          }
        });
        break;
      }
      case 'CuerpoDocumento': {
        this.characters.forEach(element => {
          this.lineaDeCarro = this.lineaDeCarro + 10;
          element.documentos.forEach(docu => {
            dataArray.push({
              nombre: docu.nombre,
              requerido: this.getString(docu.requerido),
              presentado: this.getString(docu.presentado)
            });
          });
        });
        break;
      }
      case 'cuerpo': {
        this.characters.forEach(element => {
          this.lineaDeCarro = this.lineaDeCarro + 10;
          dataArray.push({
            razonSocial: element.comercio.razonSocial,
            montoPedido: element.montoPedido,
            cantidadCuotas: element.cantidadCuotas,
            valorCuota: element.valorCuota,
            montoInteres: element.montoInteres,
            tieneCobranzaADomicilio: element.tieneCobranzaADomicilio,
            montoCobranzaADomicilio: element.montoCobranzaADomicilio,
            estado: element.estado.nombre
          });
        });
        break;
      }
      case 'CabeceraPlanPago': {
        dataArray.push({
          orden: 'PLAN PAGO - CUOTAS  Orden',
          cuotaPagada: 'Pagado',
          montoCapital: 'Capital',
          montoInteres: 'Interes',
          montoCobranzaADomicilio: 'Cobranza a Domicilio',
          montoTotalCuota: 'Monto Total',
          fechaVencimiento: 'Vencimiento'
        });
        break;
      }
      case 'CuerpoPlanPago': {
        this.characters.forEach(element => {

          element.planPagos.cuotas.forEach(p => {
            this.lineaDeCarro = this.lineaDeCarro + 10;
            dataArray.push({
              orden: p.orden,
              cuotaPagada: this.getString(p.cuotaPagada),
              montoCapital: p.montoCapital,
              montoInteres: p.montoInteres,
              montoCobranzaADomicilio: p.montoCobranzaADomicilio,
              montoTotalCuota: p.MontoTotalCuota,
              fechaVencimiento: moment(p.fechaVencimiento).format('DD-MM-YYYY')
            });
          });
        });
      }

      case 'filtro': {
        this.characters.forEach(element => {
          if (element._id == id) {
            dataArray.push({
              id: element._id
            });
          }
        });
        break;
      }

      case 'test': {

        for (let i = 0; i < 500; ++i) {
          dataArray.push({
            id: i.toString().trim(),
            nombre: i.toString(),
            dni: i.toString()
          });
        }

        break;
      }
      default:
        console.log('Invalid choice');
        break;
    }

    return dataArray;
  }

  getString(valor: boolean): string {
    if (valor === true) {
      return 'SI';
    } else {
      return 'NO'
    }
  }
}
