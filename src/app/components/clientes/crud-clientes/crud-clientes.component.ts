import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

import { Session } from '../../../modelo/util/session';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { TableClientes } from './TableClientes';
// Moment
import * as moment from 'moment';
import { EstadoCasa } from '../../../modelo/negocio/estado-casa';
import { elementEnd } from '@angular/core/src/render3/instructions';
declare let jsPDF;


@Component({
  selector: 'app-crud-clientes',
  templateUrl: './crud-clientes.component.html',
})
export class CrudClientesComponent implements OnInit {

  message = '';

  characters: any[];
  session = new Session();
  estadosCasa: EstadoCasa[];
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
//    console.log(this.characters);
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


    doc.save('reporte.pdf');
  }

  imprimirPDF(id: string, dni: string) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    const imgData = new Image();

    doc.text('Sur Creditos', 20, 15, 'center');
    doc.setFontSize(7);
    doc.text('CREDITOS PARA COMERCIANTES', 6, 18);

    doc.setFontSize(12);
    doc.setTextColor(255);
    doc.setFillColor(52, 152, 219)
    doc.roundedRect(50, 23, 45, 10, 3, 3, 'FD')  //10 inicio, 23 es altura, 182 largo, 10 es
    doc.setFillColor(1);

    doc.text('DATOS  DE CLIENTE', 72, 30, 'center');

    doc.setFontSize(10);
    doc.setTextColor(0)
    //const today = Date.now();
    //doc.text('Fecha: ' + moment(today).format('DD-MM-YYYY'), 130, 25);

    doc.setFillColor(52, 152, 219)
    doc.setTextColor(255);
    doc.setFontSize(12);
    doc.roundedRect(10, 38, 182, 8, 3, 3, 'FD')
    doc.text('Datos del Titular', 100, 43, 'center');

    doc.setFontSize(10);
    this.characters.forEach(element => {
      if (element._id === id) {

        doc.setTextColor(0);
        doc.text('Fecha Alta: ' + moment(element.titular.fechaAlta).format('DD-MM-YYYY'), 130, 25);

        doc.setTextColor(0);
        doc.text('Apellido y Nombre: ' + element.titular.apellidos + ', ' + element.titular.nombres, 20, 53);
        //doc.text('ACtividad: ' + element.comercio.codigoActividad + ' - ' + element.comercio.descripcionActividad, 80, 53);
        doc.text('Fecha de Nacimiento: ' + moment(element.titular.fechaNacimiento).format('DD-MM-YYYY'), 20, 58);
        doc.text('D.N.I.: ' + element.titular.dni, 130, 58)
        //Domicilio
        doc.text('Calle: ' + element.titular.domicilio.calle, 20, 63);
        doc.text('Barrio: ' + element.titular.domicilio.barrio, 130, 63);
        doc.text('Localidad: ' + element.titular.domicilio.localidad, 20, 68);
        doc.text('Provincia: ' + element.titular.domicilio.provincia, 130, 68);

        doc.text('Situacion de la vivienda: ' + element.titular.domicilio.estadoCasa.nombre, 20, 73);

        //Datos de Comercio
        //console.log(element.comercios);
        if (element.comercios != null) {
          doc.setFontSize(12);
          doc.setFillColor(52, 152, 219)
         // doc.roundedRect(10, 78, 182, 8, 3, 3, 'FD')

          doc.setTextColor(255);
          //doc.text('Datos del Comercio', 100, 83, 'center');

          doc.setFontSize(10);
          doc.setTextColor(0);
          let cont: number = 88;
          element.comercios.forEach(x => {

            cont = cont + 5;
            doc.text('Razon Social: ' + x.razonSocial, 20, cont);//93
            cont = cont + 5;
            doc.text('Descripcion: ' + x.descripcionActividad, 20, cont);//98
            if (x.domicilio != null) {
              cont = cont + 5;
              doc.text('Calle: ' + x.domicilio.calle, 20, cont);
              doc.text('Barrio:' + x.domicilio.barrio, 130, cont);
              cont = cont + 5;
              doc.text('Localidad: ' + x.domicilio.localidad, 20, cont);
              doc.text('Provincia: ' + x.domicilio.provincia, 130, cont);

              cont = cont + 5;
              doc.text('Celular: ', 20, cont);
              doc.text('T. Fijo:', 80, cont)
              doc.text('Mail:  ', 130, cont);
            } else {
              cont = cont + 5;
              doc.text('Calle: ', 20, 103);
              doc.text('Barrio:', 130, 103);
              cont = cont + 5;
              doc.text('Localidad: ', 20, 108);
              doc.text('Provincia: ', 130, 108);
              cont = cont + 5;
              doc.text('Celular: ', 20, 113);
              doc.text('T. Fijo:', 80, 113)
              doc.text('Mail:  ', 130, 113);
            }
          });
          cont = 0;
        }
      }

    });

    doc.save('reporteIndividual.pdf');

  }

  getData(tipo: string, id: string = null, dni: string = null): Array<any> {
    let dataArray = Array<any>();

    switch (tipo) {
      case 'cabecera':
        {
          dataArray.push({
            dni: 'DNI',            
            nombre: 'Nombre Cliente',
            fechaAlta: 'Fecha de Alta'
           
          });
          break;
        }

      case 'cuerpo': {
        this.characters.forEach(element => {
          dataArray.push({
            dni: element.titular.dni,
            nombre: element.titular.apellidos + ', ' + element.titular.nombres,
            fechaAlta: moment(element.titular.fechaAlta).format('DD-MM-YYYY')
           
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
