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
import { Cuota } from 'src/app/components/cuotas/modal-cuotas/cuota';



@Component({
  selector: 'app-modal-cuotas',
  templateUrl: './modal-cuotas.component.html',
  styleUrls: ['./modal-cuotas.component.css']
})
export class ModalCuotasComponent implements OnInit {

  @ViewChild(SimuladorComponent) hijo: SimuladorComponent;
  cuotasModalForm: FormGroup;
  session = new Session();

  nuevaCuota: Cuota;
  cuotas: any[];
  token: string;
  cuotasSimuladas: any[];
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
      ordenYPagado: {
        title: ' Estado ',
        width: '10%',
        filter: false,
        valuePrepareFunction: (cell, row) => { return row.orden + '_' + (row.cuotaPagada === true ? 'PAG' : 'IMP'); }
      },
      /*cuotaPagada: {
        title: 'Estado',
        width: '7%',
        valuePrepareFunction: (value) => {
          return value === true ? 'PAGADO' : 'IMPAGA';
        }
      ,}*/
      montoPagado: {
        title: 'Montos Pagados',
        width: '8%',
        filter: false,
        valuePrepareFunction: (value) => {
          let total: number= 0;
          for ( var i = 0 ; i < value.length; i++){
                     total += Number(value[i]);
               }
              return Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total);

        }
      },
      montoPendienteDePago: {
        title: 'Pendiente de pago',
        width: '8%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'montoPendienteDePago' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      MontoTotalCuota: {
        title: 'Total a pagar',
        width: '8%',
        filter: false,
         valuePrepareFunction: (value) => {
         return value === 'MontoTotalCuota' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);


        }
      },
      fechaVencimiento: {
        title: 'Vencimiento',
        width: '8%',
        filter: false,
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

    this.cuotasModalForm.setValue({ monto: 0});
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
  getDataFromCuotas(misCuotas: any[], misCreditos: TableCreditos[], idCredito: string, miToken: string) {
    this.cuotas = misCuotas;
    this.creditos = misCreditos;
    this.idCredito = idCredito;
    this.token = miToken;
  }

  simularPago() {
    let monto = this.getMonto.value;
    let valorConFormato : number;      //aqui debo usar para controlar los decimales
    this.cuotasSimuladas = new Array();
    //console.log('OBJETO CLONADO....' + this.cuotasSimuladas);
    if (monto > 0) {

      console.log(this.cuotas);

      this.cuotas.forEach(i => {

        this.nuevaCuota = new Cuota();  //inicialiso la cuota

        if (i.cuotaPagada === false) {

          valorConFormato = Math.round(i.montoPendienteDePago * 100) / 100;

          if (i.porcentajeInteresPorMora) {
            this.nuevaCuota.porcentajeInteresPorMora = +i.porcentajeInteresPorMora;
          } else {
            this.nuevaCuota.porcentajeInteresPorMora = 0;
          }

          let interes = 0;
          if (i.pagoInteres) {
            interes = i.montoInteresPorMora;
          }

          // CASO: PAGO DE CUOTA COMPLETA QUE TIENE UN SALDO PENDIENTE DE PAGO
          if ((i.montoPendienteDePago + interes) > 0 && monto >= (valorConFormato + interes)) {   //tiene saldo? valorconformato
            monto = monto - (valorConFormato + interes); // i.montoPendienteDePago;
            this.nuevaCuota._id = String(i._id);
            this.nuevaCuota.comentario = 'pago total';
            this.nuevaCuota.diasRetraso = i.diasRetraso;

            this.nuevaCuota.montoInteresPorMora = interes;

            this.nuevaCuota.montoPagado = i.montoPendienteDePago + interes;   //es el saldo
            this.nuevaCuota.montoPagadoHistorico = i.montoPagado;
            this.nuevaCuota.montoPendienteDePago = 0;
            this.nuevaCuota.MontoTotalCuota = i.MontoTotalCuota +  interes;
            this.nuevaCuota.orden = i.orden;

            this.cuotasSimuladas.push(this.nuevaCuota);

          } else { // CASO: PAGO DE CUOTA COMPLETAS QUE NO TIENE SALDO
            valorConFormato = Math.round(i.montoPendienteDePago * 100) / 100;

            if (monto >= (valorConFormato + interes)) {
              monto = monto - (Math.round((i.MontoTotalCuota + interes) * 100) / 100);   //valocconformato
              this.nuevaCuota._id = String(i._id);
              this.nuevaCuota.comentario = 'pago total';
              this.nuevaCuota.diasRetraso = i.diasRetraso;
              this.nuevaCuota.montoPagado = i.MontoTotalCuota + interes;   //es el total
              this.nuevaCuota.montoInteresPorMora = interes;
              this.nuevaCuota.montoPagadoHistorico = i.montoPagado;
              this.nuevaCuota.montoPendienteDePago = 0;
              this.nuevaCuota.MontoTotalCuota = i.MontoTotalCuota + interes;
              this.nuevaCuota.orden = i.orden;

              this.cuotasSimuladas.push(this.nuevaCuota);

            } else { // CASO: PAGO PARCIAL DE UNA CUOTA
              valorConFormato = Math.round(i.montoPendienteDePago * 100) / 100;
              if (monto > 0) {
                this.nuevaCuota._id = String(i._id);
                this.nuevaCuota.comentario = 'pago parcial';
                this.nuevaCuota.diasRetraso = i.diasRetraso;
                this.nuevaCuota.montoInteresPorMora = interes;
                this.nuevaCuota.montoPagado = monto;   //es el total
                this.nuevaCuota.montoPagadoHistorico = i.montoPagado;
                //aqui sumo el array de montos pagados
                if(i.montoPagado.lenght >0){
                  i.montoPagado.forEach(x =>{
                    i.montoPendienteDePago = i.montoPendienteDePago + x;
                  })
                }

                this.nuevaCuota.MontoTotalCuota = i.MontoTotalCuota + interes;
                this.nuevaCuota.montoPendienteDePago = +this.nuevaCuota.MontoTotalCuota - monto;
                this.nuevaCuota.orden = i.orden;

                this.cuotasSimuladas.push(this.nuevaCuota);
                monto = 0;
              }
            }
          }
        }
      });









      console.log('PARA LA SIMULACION::::', this.cuotasSimuladas);



      //llamo al Simulador
      this.hijo.simularPago(this.cuotasSimuladas, this.creditos, this.idCredito, this.token);
      this.ngxSmartModalService.getModal('simuladorModal').open();

    } else {
      alert('Monto debe ser mayor a cero');
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
  onEnterMonto(){
    this.simularPago();
  }


}
