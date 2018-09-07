import { Component, OnInit, ViewChild } from '@angular/core';
import { TableCuotas } from '../TableCuotas';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { Session } from '../../../modelo/util/session';
import * as moment from 'moment';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { SimuladorComponent } from '../modalCuotasSimuladas/simulador/simulador.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableCreditos } from '../tableCreditos';


@Component({
  selector: 'app-modal-cuotas',
  templateUrl: './modal-cuotas.component.html',
  styleUrls: ['./modal-cuotas.component.css']
})
export class ModalCuotasComponent implements OnInit {

  @ViewChild(SimuladorComponent) hijo: SimuladorComponent;
  cuotasModalForm: FormGroup;
  session = new Session();

  //ordenDePago: any;
  cuotas: any[];
  cuotasSimuladas: TableCuotas[];
  cuotasBackup: TableCuotas[];
  miOrdenDePago: any;
  creditos: TableCreditos[];
  idCredito: string;

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
        valuePrepareFunction: (value) => {
          return value === 'MontoTotalCuota' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      fechaVencimiento: {
        title: 'Vencimiento',
        width: '8%',
        valuePrepareFunction: (cell, row) => { return moment(row.fechaVencimiento).format('DD-MM-YYYY') }
      }
    },
    pager: {
      display: true,
      perPage: 6
    },
    noDataMessage: 'El Cliente no tiene Cuotas...'
  };

  constructor(private fb: FormBuilder, private loginService: LoginService, public ngxSmartModalService: NgxSmartModalService, private modalService: NgbModal) {
    this.session.token = this.loginService.getTokenDeSession();
    this.cuotasModalForm = this.fb.group({
      monto: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
  }

  get getMonto() { return this.cuotasModalForm.get('monto'); }
  //estoes enviado desde el padre
  recibePametros(ordenDePago: any) {
    this.miOrdenDePago = ordenDePago;

    this.cuotas = ordenDePago.cuotas;
    this.cuotasBackup = ordenDePago.cuotas;
  }

  onCustom(event) {

  }
  getDataFromCuotas(misCuotas: any[], misCreditos: TableCreditos[], idCredito: string) {
    this.cuotas = misCuotas;
    this.creditos = misCreditos;
    this.idCredito = idCredito;
    
  }

  simularPago() {
    let monto = this.getMonto.value;
    
    this.cuotasSimuladas = new Array();
    console.log('OBJETO CLONADO....' + this.cuotasSimuladas);
    if (monto > 0) {

      let contador = 0;

      let bandera = true;

      this.cuotas.forEach(i => {
        contador = monto;  //aqui  recuerdo el valor
        console.log('OBTENGO DEL PADRE ' + i.MontoTotalCuota);
        monto = monto - i.MontoTotalCuota;
        let nuevo: TableCuotas;
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
      
      console.log(this.cuotasSimuladas);
      this.hijo.simularPago(this.cuotasSimuladas, this.creditos, this.idCredito);
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


}
