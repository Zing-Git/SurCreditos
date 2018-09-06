import { Component, OnInit } from '@angular/core';


import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../../../modules/servicios/login/login.service';
import { Session } from '../../../../modelo/util/session';
import * as moment from 'moment';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { TableCuotas } from '../../modal-cuotas/TableCuotas';

@Component({
  selector: 'app-simulador',
  templateUrl: './simulador.component.html',
  styleUrls: ['./simulador.component.css']
})
export class SimuladorComponent implements OnInit {

  cuotasModalForm: FormGroup;
  session = new Session();
  cuotasSimuladas: any;
  ordenDePago: any;
  cuotas: any;
  
  cuotasBackup: TableCuotas[];
  miOrdenDePago: any;

  settings = {

    actions: {
      columnTitle: 'Accion',
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,
      position: 'right',

    },
    columns: {
      orden: {
        title: 'Orden',
        width: '5%'
      },
      montoPagado: {
        title: 'Montos Pagados',
        width: '8%',
        valuePrepareFunction: (value) => {
          return value === 'montoPagado' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      montoPendienteDePago: {
        title: 'Pendiente de pago',
        width: '8%',
        valuePrepareFunction: (value) => {
          return value === 'montoPendienteDePago' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      MontoTotalCuota: {
        title: 'Total a pagar',
        width: '8%',
        valuePrepareFunction: (value) => {
          return value === 'MontoTotalCuota' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      
    },
    pager: {
      display: true,
      perPage: 6
    },
    noDataMessage: 'El Cliente no tiene Cuotas...'
  };
  constructor() { }

  ngOnInit() {
    this.cuotas = this.cuotasSimuladas;
  }

  simularPago(cuotas: any, monto : number) {
    this.cuotasSimuladas = new Array();
    this.cuotasSimuladas.lenght = 0;
    this.cuotasSimuladas = cuotas;
    this.ngOnInit();
   /* if(monto > 0){

    console.log(cuotas);
      this.cuotas = cuotas;
      let contador = 0;
      this.cuotasSimuladas = new Array();
      let bandera = true;

      this.cuotas.forEach(i => {
        contador = monto;  //aqui  recuerdo el valor
        monto = monto - i.MontoTotalCuota;
        if (bandera === true) {
          if (monto === 0) {
            i.montoPagado.push(i.MontoTotalCuota.toString());
            i.montoPendienteDePago = 0;    //montoPagado = total

            i.comentarios.push('pago toda la cuota');
            this.cuotasSimuladas.push(i);
            bandera = false;
            console.log('pasa por monto === 0');
          }

          if (monto < 0) {
            i.montoPagado.push(contador.toString());
            i.montoPendienteDePago = monto;
            i.comentarios.push('pago parcial');
            this.cuotasSimuladas.push(i);
            bandera = false;
            console.log('pasa por monto < 0');
          }

          if (monto > 0) {
            i.montoPagado.push(i.MontoTotalCuota.toString());
            i.montoPendienteDePago = 0;
            i.comentarios.push('pago toda la cuota');
            this.cuotasSimuladas.push(i);
            console.log('pasa por monto > 0');
          }
          console.log(monto);
          console.log(this.cuotasSimuladas);
        }
      })

      //this.cuotas = this.cuotasSimuladas;
      this.cuotasSimuladas = new Array();
      //this.ngxSmartModalService.getModal('cuotaModal').open();
    }else{

    }
    */
  }
  

}
