import { Component, OnInit } from '@angular/core';
import { TableCuotas } from './TableCuotas';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { Session } from '../../../modelo/util/session';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-cuotas',
  templateUrl: './modal-cuotas.component.html',
  styleUrls: ['./modal-cuotas.component.css']
})
export class ModalCuotasComponent implements OnInit {

  cuotasModalForm: FormGroup;
  session = new Session();
  
  ordenDePago : any;
  cuotas: TableCuotas[];
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
          name: 'seleccionarCredito',
          title: 'Seleccionar'
        }
       
      ],
    },
    columns: {
      orden:{
        title: 'Orden',
        width: '5%'
      },
      cuotaPagada:{
        title: 'Estado',
        width: '10%',
        valuePrepareFunction: (value) =>{
          return value === true ? 'PAGADO': 'IMPAGA';
        }        
      },
      montoPagado: {
        title: 'Montos Pagados',
        width: '10%'
      },
      MontoTotalCuota: {
        title: 'Total a pagar',
        width: '15%',
        valuePrepareFunction: (value) => {
          return value === 'MontoTotalCuota' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      fechaVencimiento: {
        title: 'Vencimiento',
        width: '15%',
        valuePrepareFunction: (cell, row) => { return moment(row.fechaVencimiento).format('DD-MM-YYYY') }
      }   
    },
    pager: {
      display: true,
      perPage: 6
    },
    noDataMessage: 'El Cliente no tiene Cuotas...'
  };

  constructor(private fb: FormBuilder, private loginService: LoginService) { 
    this.session.token = this.loginService.getTokenDeSession();
    this.cuotasModalForm = this.fb.group({
      monto: new FormControl('')
    });
  }

  ngOnInit() {
  }

  get monto() { return this.cuotasModalForm.get('monto'); }
  //estoes enviado desde el padre
  recibePametros(ordenDePago: any) {
    console.log(ordenDePago);
    this.cuotas = ordenDePago.cuotas;
  }
  
  onCustom(event){

  }

  simularPago(){
    let miMonto = this.monto.value;
    console.log(this.monto + '  /   ' + miMonto);
  }
}
