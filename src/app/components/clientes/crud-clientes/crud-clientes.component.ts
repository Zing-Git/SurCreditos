import { Component, OnInit, ViewChild} from '@angular/core';
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
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FormClienteComponent } from '../../clientes/form-cliente/form-cliente.component';
import { NgxSmartModalService } from 'ngx-smart-modal';
import swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

declare let jsPDF;


@Component({
  selector: 'app-crud-clientes',
  templateUrl: './crud-clientes.component.html',
  styleUrls: ['./crud-clientes.component.css'],
})
export class CrudClientesComponent implements OnInit {
  @ViewChild(FormClienteComponent) hijo: FormClienteComponent;


  message = '';

  characters: any[];
  charactersUnNivel: any[];
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
          title: 'Pdf/'
        },
        {
          name: 'cambioColor',
          title: ' Color'
        }
      ],
    },




columns: {
      fechaAlta: {
        title: 'Alta',
        width: '15%',
        filter: true,
        sort: true,
        valuePrepareFunction: (cell, row) => { return moment(row.fechaAlta).format('DD-MM-YYYY') }
      },
      dni: {
        title: 'Dni',
        width: '10%',
        filter: true,
        sort: true,
      },
      nombreCompleto: {
        title: 'Apellido y Nombre',
        width: '20%',
        filter: true,
        sort: true,
      },
      localidad: {
        title: 'Localidad',
        width: '20%',
        filter: true,
        sort: true,
      },
      barrio: {
        title: 'Barrio',
        width: '15%',
        filter: true,
        sort: true,
      },
      calle: {
        title: 'Calle',
        width: '15%',
        filter: true,
        sort: true,
      },
      numeroCasa: {
        title: 'Numero',
        width: '5%',
        filter: true,
        sort: true,
      },
      color: {
        title: 'Color',
        width: '5%',
        filter: true,
        sort: true,
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return this.getHtmlForCell(row.color);
        }
      }



    /* columns: {
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
        title: 'Alta',
        width: '15%',
        valuePrepareFunction: (cell, row) => { return moment(row.fechaAlta).format('DD-MM-YYYY') }
      },
      localidad: {
        title: 'Localidad',
        width: '25%',
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
      } */










    },
    pager: {
      display: true,
      perPage: 10
    },
  };

  constructor(
    private router: Router,
    private clientesService: ClientesService,
    private loginService: LoginService,
    private spinnerService: Ng4LoadingSpinnerService,
    public ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit() {
    // let tokenizer = new TokenPost();
    this.session.token = this.loginService.getTokenDeSession();

    this.spinnerService.show();
    this.clientesService.postGetClientes(this.session).subscribe((response: TableClientes[]) => {
      this.characters = response['clientes'];
      this.spinnerService.hide();
      this.cargarTabla(this.characters);
      // console.log(this.characters);
    } // , () => this.spinnerService.hide()
    );


  }


  getHtmlForCell(value: string) {

    // console.log(value);

    if (value === 'VERDE') {
        return `<p><font color="green">███</font></p>`;
    } else {
      if (value === 'AMARILLO') {
        return `<p><font color="yellow">███</font></p>`;
      } else {
        return `<p><font color="red">███</font></p>`;
      }
    }
  }



  cargarTabla(resClientes: any[]){
    this.charactersUnNivel = [];

    resClientes.forEach(element => {
          let fila = {
            id: element._id,
            dni: element.titular.dni,
            nombreCompleto: element.titular.apellidos + ', ' +   element.titular.nombres,
            fechaAlta: element.titular.fechaAlta,
            localidad: element.titular.domicilio.localidad,
            calle: element.titular.domicilio.calle,
            numeroCasa: element.titular.domicilio.numeroCasa,
            barrio: element.titular.domicilio.barrio,
            fechaNacimiento: element.titular.fechaNacimiento,
            estado: element.estado,
            tel1: element.contactos[0].codigoPais + element.contactos[0].codigoArea + element.contactos[0].numeroCelular,
            tel2: element.contactos[1].codigoPais + element.contactos[1].codigoArea + element.contactos[1].numeroCelular,
            mail: element.contactos[2].email,
            color: element.colorReferencia,
          };
          this.charactersUnNivel.push(fila);

    });

     // console.log(this.charactersUnNivel);
  }

  onCustom(event) {
    // alert(`Custom event '${event.action}' fired on row №: ${event.data.dni}`);
    let evento = (`${event.action}`);
    let dni = (`${event.data.dni}`);
    let id = (`${event.data.id}`);
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
      case 'cambioColor': {
        this.cambiarColor(id,event.data);
        break;
      }


      default: {
        console.log('Invalid choice');
        break;
      }
    }
  }

  async cambiarColor(idCliente: string, itemCliente: any) {

      const {value: color} = await swal({
        title: 'Select field validation',
        input: 'select',
        inputOptions: {
          'ROJO': 'ROJO',
          'AMARILLO': 'AMARILLO',
          'VERDE': 'VERDE'
        },
        inputPlaceholder: 'Selecciona un color',
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value === 'ROJO' || value === 'VERDE' || value === 'AMARILLO') {
              resolve();
            } else {
              resolve('Debes seleccionar un color');
            }
          });
        }
      });

      if (color) {
        this.clientesService.postCambiarColorCliente(this.session, idCliente, color).subscribe( result => {
          swal(
            'Color Cambiado',
            'Color de cliente cambiado correctamente a: ' + color,
            'success'
          );

/*
          let cli = this.charactersUnNivel.filter(cliente => cliente._id === idCliente)[0];
          cli.color = color;
 */



        }, err => {
          swal(
            'Color no se pudo cambiar',
            'No se pudo cambiar, intente mas tarde',
            'error'
          );
        });
      }
  }







  async nuevoCliente() {

    // Ingrese dni

    const {value: dniCliente} = await swal({
      title: 'Dni del Nuevo Cliente',
      input: 'text',
      inputValue: '',
      showCancelButton: true,
      inputValidator: (value) => {
        return !value && 'Debe ingresar un Dni valido!';
      }
    });

    if (dniCliente) {
      const clienteEncontrado = this.charactersUnNivel.filter(cliente => cliente.dni === dniCliente)[0];
      if (clienteEncontrado) {
        swal('Cliente con Dni ' + clienteEncontrado.dni + ' Ya Existe!');
      } else {
        // swal(`Cliente No Existe`);
        // Sino esta en la lista recien dar el alta
        let tipoDeAlta = 'NoExistePersona';
        let persona = {
          dni: dniCliente,
        };
        this.hijo.recibePametros(persona, tipoDeAlta);
        this.ngxSmartModalService.getModal('clienteModal').open();
      }
    }
  }

  showCliente(event): void {

    /* console.log('CLIENTE GUARDADO: ', event.cliente);
    console.log('CLIENTE RESULT: ', event.result);
     */
    this.ngOnInit();
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
    let pdfImprimir = doc.output("blob"); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
    window.open(URL.createObjectURL(pdfImprimir)); // Abre una nueva ventana para imprimir en el navegador
    // doc.save('credito.pdf'); // Obliga a guardar el documento

  }

  imprimirPDF(id: string, dni: string) {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    const imgData = new Image();

    doc.text('Sur Creditos', 20, 15, 'center');
    doc.setFontSize(7);
    doc.text('Creditos para comerciantes', 6, 18);

    doc.setFontSize(12);
    doc.setTextColor(255);
    doc.setFillColor(52, 152, 219)
    // doc.roundedRect(50, 23, 45, 10, 3, 3, 'FD')  //10 inicio, 23 es altura, 182 largo, 10 es
    // doc.setFillColor(1);

    // doc.text('DATOS  DE CLIENTE', 72, 30, 'center');

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

    doc.save('reporte.pdf');
    let pdfImprimir = doc.output("blob"); // debe ser blob para pasar el documento a un objeto de impresion en jspdf
    window.open(URL.createObjectURL(pdfImprimir)); // Abre una nueva ventana para imprimir en el navegador
    // doc.save('credito.pdf'); // Obliga a guardar el documento

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
