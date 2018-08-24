import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
declare let jsPDF;

import { TokenPost } from '../../../modelo/util/token';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { UsuariosService } from '../../../modules/servicios/usuarios/usuarios.service';
import { TableUsuarios } from './TableUsuarios';

@Component({
  selector: 'app-crud-usuarios',
  templateUrl: './crud-usuarios.component.html',
})
export class CrudUsuariosComponent implements OnInit {
  message = '';
  characters: TableUsuarios[];
  tokenizer = new TokenPost();

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
          name: 'edit',
          title: 'Blanquear Clave/ ',
        },
        {
          name: 'delete',
          title: 'Elim./ ',
        },
        {
          name:'imprimirPDF',
          title:'PDF '
        }
      ],
    },
    columns: {
      dni: {
        title: 'Dni',
        width: '15%',
      },
      apellidos: {
        title: 'Apellido',
        width: '15%',
      },
      nombres: {
        title: 'Nombres',
        width: '15%',
      },
      nombreUsuario: {
        title: 'Usuario',
        width: '15%',
      },
      rol: {
        title: 'Rol',
        width: '15%',
      },
      estado: {
        title: 'Estado',
        valuePrepareFunction: (value) => { return value === true ? 'Activo' : 'Inactivo' },
        width: '10%',
      }

    },
    pager: {
      display: true,
      perPage: 10
    },
  };



  // tslint:disable-next-line:max-line-length
  constructor(
    private router: Router,
    private usuariosService: UsuariosService,
    private loginService: LoginService
  ) { }



  ngOnInit() {
    // let tokenizer = new TokenPost();
    this.tokenizer.token = this.loginService.getTokenDeSession();
    this.usuariosService.postGetAllUsuarios(this.tokenizer).subscribe((response: TableUsuarios[]) => {
      this.characters = response['respuesta'];
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
        this.router.navigate(['formusuarioviewedit', evento, dni]);
        break;
      }
      case 'edit': {
        // this.router.navigate(['formusuarioviewedit', evento, dni]); // TODO: cuando se implemente el editar todo el usuario
        // this.router.navigate(['formusuariocambioclave', dni]);
        let resp = confirm('Seguro quiere blanquear la clave del usuario ' + apellidos + ', ' + nombres);
        if (resp) {

          let clave = prompt('Ingrese la nueva clave del usuario: ' + apellidos + ', ' + nombres);
          if (clave != null) {
            if (this.loginService.validaFormatoClaveUsuario(clave)) {
              this.usuariosService.postBlanquearClaveUsuario(this.tokenizer.token, id, clave).subscribe(result => {
                alert('Se blanqueo correctamente la clave del usuario: ' + apellidos + ', ' + nombres);
              });
            } else {
              alert('El formato de clave es incorrecto, debe tener 8 digitos como minimo con letras y números o solo números');
            }
          }
        }
        break;
      }
      case 'delete': {
        let resp = confirm('¿Seguro Desea Eliminar el Usuario de ' + apellidos + ', ' + nombres + '?');
        if (resp) {
          this.eliminarUsuario(id, dni);
        }
        break;
      }
      case 'imprimirPDF':{
        this.imprimirPDF(id, dni);
        break;
      }
      default: {
        console.log('Invalid choice');
        break;
      }
    }
  }

  eliminarUsuario(id: string, dni: string) {
    this.usuariosService.postDeleteUsuario(this.tokenizer.token, id).subscribe(result => {
      console.log(result);

      if (result['ok']) {
        alert('El usuario con dni ** ' + dni + '** se elimino correctamente');
      }
    });

  }
  nuevoUsuario() {
    this.router.navigate(['formusuario']);
  }

  imprimirUsuarios() {
    const doc = new jsPDF();
    doc.page=1;

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
    doc.text("Reporte General", 100, 20,'center');

    doc.autoTable({
      head: this.getData('cabecera'),
      body: this.getData('cuerpo') ,
      margin: {
        top: 35
      }                                                                                                                                                                 ,
    });

    doc.save('reporte.pdf');
  }

  imprimirPDF(id:string, dni:string){
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
    doc.text("Reporte de Usuario ", 100, 10,'center');

    doc.autoTable({
      head: this.getData('cabecera'),
      body: this.getData('filtro', id, dni),
      margin: {
        top: 20
      }

    });

    doc.save('reporteIndividual.pdf');

  }

  getData(tipo:string, id:string = null, dni:string=null): Array<any>{
    let dataArray= Array<any>();

    switch (tipo) {
      case 'cabecera':
      {
         dataArray.push({
         id:'Identificador',
         nombre:'Nombre Cliente',
         dni:'DNI'
      });
        break;
      }

      case 'cuerpo':{
         this.characters.forEach(element => {
            dataArray.push({
                id: element._id.toString().trim(),
                nombre: element.nombreUsuario.toString().trim(),
                dni: element.dni.toString().trim()
        });
      });
      break;
      }

      case 'filtro':{
        this.characters.forEach(element=>{
          if(element._id == id || element.dni == dni){
            dataArray.push({
              id: element._id.toString().trim(),
              nombre: element.nombreUsuario.toString().trim(),
              dni: element.dni.toString().trim()
            });
          }
        });
        break;
      }

      case 'test':{

        for(let i=0; i<500; ++i){
          dataArray.push({
            id:i.toString().trim(),
            nombre : i.toString(),
            dni:i.toString()
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
