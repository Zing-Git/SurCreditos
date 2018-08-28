import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

import { Session } from '../../../modelo/util/session';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { Cliente } from '../../../modelo/negocio/cliente';
import { observable, Observable } from 'rxjs';
import { TableClientes } from './TableClientes';
// Moment
import * as moment from 'moment';
declare let jsPDF;


@Component({
  selector: 'app-crud-clientes',
  templateUrl: './crud-clientes.component.html',
})
export class CrudClientesComponent implements OnInit {

  message = '';

  characters: TableClientes[];
  session = new Session();

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
       /*  {
          name: 'edit',
          title: 'Blanquear Clave/ ',
        }, */
        {
          name: 'imprimirPDF',
          title: 'PDF'
        }
      ],
    },
    columns: {
      'titular.dni': {
        title: 'Dni',
        width: '10%',
        valuePrepareFunction: (cell, row) => { return row.titular.dni }
      },
      nombreCompleto: {
        title: 'Apellido y Nombre',
        width: '20%',
        valuePrepareFunction: (cell, row) => { return row.titular.apellidos + ', ' + row.titular.nombres }
      },
      fechaAlta: {
        title: 'Fecha de Alta',
        width: '15%',
        valuePrepareFunction: (cell, row) => { return moment(row.fechaAlta).format('DD-MM-YYYY') }
      },
      localidad: {
        title: 'Localidad',
        width: '10%',
        valuePrepareFunction: (cell, row) => { return row.titular.domicilio.localidad }
      },
      calle: {
        title: 'Calle',
        width: '10%',
        valuePrepareFunction: (cell, row) => { return row.titular.domicilio.calle }
      },
      numeroCasa: {
        title: 'Numero',
        width: '10%',
        valuePrepareFunction: (cell, row) => { return row.titular.domicilio.numeroCasa }
      }

    },
    pager: {
      display: true,
      perPage: 10
    },
  };

  constructor(
    private router: Router,
    private clientesService: ClientesService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    // let tokenizer = new TokenPost();
    this.session.token = this.loginService.getTokenDeSession();
    this.clientesService.postGetClientes(this.session).subscribe((response: TableClientes[]) => {
      this.characters = response['clientes'];
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

  nuevoCliente() {
    this.router.navigate(['formcliente']);
  }

  imprimirClientes() {
    const doc = new jsPDF();
    doc.page = 1;

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
    doc.text("Reporte General", 100, 20, 'center');

    doc.autoTable({
      head: this.getData('cabecera'),
      body: this.getData('cuerpo'),
      margin: {
        top: 35
      },
    });

    //pie de pagina

    doc.save('reporte.pdf');
  }

  imprimirPDF(id: string, dni: string) {
    const doc = new jsPDF('l');


    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
    doc.text("Reporte de Cliente", 100, 10, 'center');
    doc.line(70, 13, 130, 13);   //13 es x1, 13 es y1, 250 es longitud x2, 13 es y2

    this.characters.forEach(element => {
      if (element._id == id || element.titular.dni == dni) {
        doc.setFontSize(24);
        doc.text('Titular',30,40,'right');
        doc.line(13, 43, 250, 43);   //13 es x1, 13 es y1, 250 es longitud x2, 13 es y2
        doc.setFontSize(12);
        doc.text('Apellido y nombre:  ' + element.titular.apellidos + ', ' + element.titular.nombres, 30, 50);
        doc.text('Fecha de Alta:  ' + moment(element.fechaAlta).format('DD-MM-YYYY'), 200,50);
        doc.text('Localidad:  ' + element.titular.domicilio.localidad, 30, 60);
        doc.text('Calle: ' + element.titular.domicilio.calle, 30, 70);
        doc.text('Numero: ' + element.titular.domicilio.numeroCasa,30,80);
      }
    });

    //doc.autoTable({
    //  head: this.getData('cabecera'),
    //  body: this.getData('filtro', id, dni),
    //  margin: {
    //    top: 20
    //  }

    //});

    doc.save('reporteIndividual.pdf');

  }

  getData(tipo: string, id: string = null, dni: string = null): Array<any> {
    let dataArray = Array<any>();

    switch (tipo) {
      case 'cabecera':
        {
          dataArray.push({
            legajoLetra: 'Prefijo de Legajo',
            legajo: 'Legajo',
            id: 'Identificador',
            nombre: 'Nombre Cliente',
            dni: 'DNI'
          });
          break;
        }

      case 'cuerpo': {
        this.characters.forEach(element => {
          dataArray.push({
            legajoLetra: element.titular.legajo_prefijo,
            legajo: element.titular.legajo,
            id: element._id,
            nombre: element.titular.apellidos + ', ' + element.titular.nombres,
            dni: element.titular.dni
          });
        });
        break;
      }

      case 'filtro': {
        this.characters.forEach(element => {
          if (element._id == id || element.titular.dni == dni) {
            dataArray.push({
              id: element._id,
              nombre: element.titular.nombres + ' ' + element.titular.apellidos,
              dni: element.titular.dni
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


}
