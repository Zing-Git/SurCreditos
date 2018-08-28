import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Session } from '../../../modelo/util/session';
import { TableCreditos } from '../../creditos/crud-creditos/TableCreditos';

import { CreditosService } from '../../../modules/servicios/creditos/creditos.service';

import { LoginService } from '../../../modules/servicios/login/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanPago } from '../../../modelo/negocio/planPago';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { FormClienteComponent } from '../../clientes/form-cliente/form-cliente.component';
import { DatePipe } from '@angular/common';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { UsuariosService } from '../../../modules/servicios/usuarios/usuarios.service';
import { UtilidadesService } from '../../../modules/servicios/utiles/utilidades.service';
import { NewSession } from '../../../modelo/util/newSession';
import { Cliente } from '../../../modelo/negocio/cliente';
import * as moment from 'moment';


@Component({
  selector: 'app-form-orden-de-pago',
  templateUrl: './form-orden-de-pago.component.html',
  styleUrls: ['./form-orden-de-pago.component.css']
})
export class FormOrdenDePagoComponent implements OnInit {

  ordenDePagoForm: FormGroup;
  session = new Session();
  characters: TableCreditos[];
  creditos: TableCreditos[];
  cliente: Cliente;

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
        title: 'Letra de Legajo',
        width: '5%'
      },
      legajo: {
        title: 'Legajo',
        width: '5%'
      },      
      dni: {
        title: 'D.N.I.',
        width: '30%',
        valuePrepareFunction: (cell, row) => row.comercio.cliente.titular.dni
      },
      nombre: {
        title: 'Nombre',
        width: '15%',
        valuePrepareFunction: (cell, row) => row.comercio.cliente.titular.nombres
      },
      apellido: {
        title: 'Apellido',
        width: '15%',
        valuePrepareFunction: (cell, row) => row.comercio.cliente.titular.apellidos
      },
      fechaAlta: {
        title: 'Fecha de Alta',
        width: '15%',
        valuePrepareFunction: (cell, row) => { return moment(row.fechaAlta).format('DD-MM-YYYY') }
      },
    },
    pager: {
      display: true,
      perPage: 10
    },
    noDataMessage: 'El Cliente no tiene creditos...'
  };


  constructor(private fb: FormBuilder, 
              private clientesService: ClientesService, 
              private loginService: LoginService,
              private creditosService : CreditosService,
              private router: Router) { }

  ngOnInit() {
    this.session.token = this.loginService.getTokenDeSession();
    this.ordenDePagoForm = this.fb.group({
      dni: new FormControl('', [Validators.required])
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
        this,this.router.navigate(['viewcredito', evento, id]);
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
        console.log('Invalid choice');
        break;
      }
    }
  }

  imprimirPDF(id : string){

  }

  get dni() { return this.ordenDePagoForm.get('dni'); }

  buscarCreditoPorDni() {
    let dni = this.dni.value;

    if (this.dni.value !== '') {
       this.clientesService.postGetClientePorDni(this.session, dni).subscribe(response => {
      this.cliente = response['clientes'][0];
      //console.log(this.cliente);
      this.obtenerCreditosDelCliente();
      //this.cargarClienteForm(this.cliente);  aqui debo cargar los creditos
    });
    }   
  }

  obtenerCreditosDelCliente(){
    this.creditosService.postGetAllCreditos2(this.session).subscribe((response: TableCreditos[]) => {
      this.characters = response['credito'];
    });
    console.log(this.characters)
    console.log(this.session);
    if(this.characters != null){
      this.characters.forEach(element=> {
        if(element.estado.nombre === 'APROBADO'){
          this.creditos.push(element);            //este array tiene los creditos aprobados
          console.log(element.estado.nombre)
        }
      });
    }else{
      alert('No existen Creditos APROBADOS para este cliente');
    }
  }

  
}
