<<<<<<< HEAD
import { Component, OnInit, ViewChild } from '@angular/core';
import { TableCuotas } from './TableCuotas';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { Session } from '../../../modelo/util/session';
import * as moment from 'moment';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SimuladorComponent } from '../modalCuotasSimuladas/simulador/simulador.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
=======
import { Component, OnInit } from '@angular/core';
import { TableCuotas } from './TableCuotas';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { Session } from '../../../modelo/util/session';
import * as moment from 'moment';
>>>>>>> f66bc5f4eea99c3100fb852a290d48813c20bef9

@Component({
  selector: 'app-modal-cuotas',
  templateUrl: './modal-cuotas.component.html',
  styleUrls: ['./modal-cuotas.component.css']
})
export class ModalCuotasComponent implements OnInit {

<<<<<<< HEAD
  @ViewChild(SimuladorComponent) hijo: SimuladorComponent;
  cuotasModalForm: FormGroup;
  session = new Session();

  ordenDePago: any;
  cuotas: TableCuotas[];
  cuotasSimuladas: TableCuotas[];
  cuotasBackup: TableCuotas[];
  miOrdenDePago: any;

=======
  cuotasModalForm: FormGroup;
  session = new Session();
  
  ordenDePago : any;
  cuotas: TableCuotas[];
>>>>>>> f66bc5f4eea99c3100fb852a290d48813c20bef9
  settings = {

    actions: {
      columnTitle: 'Accion',
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,
      position: 'right',
<<<<<<< HEAD

    },
    columns: {
      orden: {
        title: 'Orden',
        width: '5%'
      },
      cuotaPagada: {
        title: 'Estado',
        width: '7%',
        valuePrepareFunction: (value) => {
          return value === true ? 'PAGADO' : 'IMPAGA';
        }
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
=======
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
>>>>>>> f66bc5f4eea99c3100fb852a290d48813c20bef9
        valuePrepareFunction: (value) => {
          return value === 'MontoTotalCuota' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      fechaVencimiento: {
        title: 'Vencimiento',
<<<<<<< HEAD
        width: '8%',
        valuePrepareFunction: (cell, row) => { return moment(row.fechaVencimiento).format('DD-MM-YYYY') }
      }
=======
        width: '15%',
        valuePrepareFunction: (cell, row) => { return moment(row.fechaVencimiento).format('DD-MM-YYYY') }
      }   
>>>>>>> f66bc5f4eea99c3100fb852a290d48813c20bef9
    },
    pager: {
      display: true,
      perPage: 6
    },
    noDataMessage: 'El Cliente no tiene Cuotas...'
  };

<<<<<<< HEAD
  constructor(private fb: FormBuilder, private loginService: LoginService, public ngxSmartModalService: NgxSmartModalService, private modalService: NgbModal) {
    this.session.token = this.loginService.getTokenDeSession();
    this.cuotasModalForm = this.fb.group({
      monto: new FormControl('', [Validators.required])
=======
  constructor(private fb: FormBuilder, private loginService: LoginService) { 
    this.session.token = this.loginService.getTokenDeSession();
    this.cuotasModalForm = this.fb.group({
      monto: new FormControl('')
>>>>>>> f66bc5f4eea99c3100fb852a290d48813c20bef9
    });
  }

  ngOnInit() {
  }

<<<<<<< HEAD
  get getMonto() { return this.cuotasModalForm.get('monto'); }
  //estoes enviado desde el padre
  recibePametros(ordenDePago: any) {
    this.miOrdenDePago = ordenDePago;

    this.cuotas = ordenDePago.cuotas;
    this.cuotasBackup = ordenDePago.cuotas;
  }

  onCustom(event) {

  }
  getDataFromCuotas(misCuotas: TableCuotas[]){
    this.cuotas = misCuotas;
  }

  simularPago() {
    let monto = this.getMonto.value;
    if (monto > 0) {

      let contador = 0;
      this.cuotasSimuladas = new Array();
      let bandera = true;

      this.cuotas.forEach(i => {
        contador = monto;  //aqui  recuerdo el valor
        monto = monto - i.MontoTotalCuota;
        let nuevo : TableCuotas;
        if (bandera === true) {
          if (monto === 0) {
             
             nuevo = JSON.parse(JSON.stringify(i));
             nuevo.montoPendienteDePago = 0;           
            //i.montoPendienteDePago = 0;
            this.cuotasSimuladas.push(nuevo);
            bandera = false;
            console.log('pasa por monto === 0');
          }

          if (monto < 0) {
            nuevo = JSON.parse(JSON.stringify(i));
            nuevo.montoPagado.push(contador.toString());
            nuevo.montoPendienteDePago = monto;
            nuevo.comentarios.push('pago parcial');
            //i.montoPagado.push(contador.toString());
            //i.montoPendienteDePago = monto;
            //i.comentarios.push('pago parcial');
            this.cuotasSimuladas.push(nuevo);
            bandera = false;
            console.log('pasa por monto < 0');
          }

          if (monto > 0) {
            nuevo = JSON.parse(JSON.stringify(i));
            nuevo.montoPagado.push(i.MontoTotalCuota.toString());
            nuevo.montoPendienteDePago = 0;
            nuevo.comentarios.push('pago toda la cuota');

            //i.montoPagado.push(i.MontoTotalCuota.toString());
            //i.montoPendienteDePago = 0;
            //i.comentarios.push('pago toda la cuota');
            this.cuotasSimuladas.push(nuevo);
            console.log('pasa por monto > 0');
          }
          console.log(monto);
          //console.log(this.cuotasSimuladas);
        }
      })
     

      this.hijo.simularPago(this.cuotasSimuladas, monto);
      this.ngxSmartModalService.getModal('simuladorModal').open();
      //this.ngxSmartModalService.resetModalData('simuladorModal');
      //this.cuotasSimuladas.length = 0;   //limpiamos el array
      console.log('Aqui salgo del modal' + this.cuotasSimuladas);
      monto = 0;
    } else {

    }
  }
  
  onCerrarSimulacion() {
    //this.cuotas = this.cuotasBackup;
    //this.recibePametros(this.miOrdenDePago);
    this.ngxSmartModalService.getModal('cuotaModal').close();
    //this.ngxSmartModalService.getModal('cuotaModal').open();
  }
  confirmarPago() {

  }


=======
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
>>>>>>> f66bc5f4eea99c3100fb852a290d48813c20bef9
}
