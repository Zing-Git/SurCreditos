import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

import { LoginService } from '../../../modules/servicios/login/login.service';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { CreditosService } from '../../../modules/servicios/creditos/creditos.service';
import { UsuariosService} from '../../../modules/servicios/usuarios/usuarios.service';

import { Session } from '../../../modelo/util/session';
import { TableCreditos } from './../../creditos/crud-creditos/TableCreditos';
import * as moment from 'moment/moment';
import { EstadoCasa } from '../../../modelo/negocio/estado-casa';
import { TableUsuarios } from '../../usuarios/crud-usuarios/TableUsuarios';

@Component({
  selector: 'app-crud-creditos-admin',
  templateUrl: './crud-creditos-admin.component.html',
  styleUrls: ['./crud-creditos-admin.component.css']
})
export class CrudCreditosAdminComponent implements OnInit {

  message = '';
  characters: TableCreditos[];
  estadosCasa: EstadoCasa[];
  usuarios: TableUsuarios[];
  session = new Session();
  
  lineaDeCarro = 40;      // para reporte general
  carroIndividual = 50;    //para reporte individual
  cantidadTotal = 0;

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
          name: 'aprobar',
          title: 'Aprobar /',
        },
        {
          name: 'rechazar',
          title: 'Rechazar /'
        },{
          name: 'derivar',
          title:'Derivar a Root'
        }
      ],
    },
    columns: {
      cuit: {
        title: 'CUIT',
        width: '15%',
        valuePrepareFunction: (cell, row) => row.comercio.cuit
      },
      nombreApellido:{
        title:'Titular',
        width:'15%',
        valuePrepareFunction :(cell, row) => (row.cliente.titular.apellidos + ', ' + row.cliente.titular.nombres)
      },
      //usuario:{
      //  title:'Vendedor',
      //  width:'10%',
      //  valuePrepareFunction: (value) => this.getUsuario(value)
      //},
      montoPedido: {
        title: 'Monto Credito',
        width: '15%'
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
    private clientesServices: ClientesService,
    private usuariosServices: UsuariosService
  ) { }

  ngOnInit() {
    this.session.token = this.loginService.getTokenDeSession();
    this.creditosService.postGetAllCreditos(this.session).subscribe((response: TableCreditos[]) => {
      this.characters = response['credito'];
    });
    this.cargarControlesCombos();
    this.getAllUsuarios();
    
  }

  private cargarControlesCombos() {

    this.clientesServices.postGetCombos().subscribe(result => {
      //this.provincias = result['respuesta'].provincias;
      this.estadosCasa = result['respuesta'].estadosCasa;
    });

  }

  private getAllUsuarios(){
    
    this.usuariosServices.postGetAllUsuarios(this.session).subscribe((response: TableUsuarios[]) => {
      this.usuarios = response['respuesta'];
    });
   
  }

  private getUsuario(id:string):string{
    
    
    let miUsuario:string;
    if(this.usuarios == null){ return this.session.nombreUsuario;}  // retorno si el listado esta vacio
    this.usuarios.forEach(element =>{
      if(element._id == id){
        return element.nombreUsuario;
      }
     });
     //console.log(miUsuario);
     return miUsuario;
  }
  onCustom(event) {
    //alert(`Custom event '${event.action}' fired on row №: ${event.data._id}`);
    const evento = (`${event.action}`);
    const dni = (`${event.data.dni}`);
    const id = (`${event.data._id}`);
    
    switch (evento) {
      case 'aprobar': {
       // this.router.navigate(['formclienteviewedit', evento, dni]);
        break;
      }
      case 'rechazar': {

        break;
      }
      case 'derivar': {
        
        break;
      }
      default: {
        console.log('Invalid choice');
        break;
      }
    }
  }


}
