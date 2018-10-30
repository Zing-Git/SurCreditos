// import { forEach } from "@angular/router/src/utils/collection";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import * as moment from 'moment';
import { NgxSmartModalService } from "ngx-smart-modal";
// import { TableCreditos } from "../../creditos/crud-creditos/TableCreditos";
import { FilaCuota } from './filaCuota';


@Component({
  selector: "app-modal-cuotas-cobranza",
  templateUrl: "./modal-cuotas-cobranza.component.html"
})
export class ModalCuotasCobranzaComponent implements OnInit {
  @Output() pasameCuotasACobrar = new EventEmitter();


  cuotas: any[];
  token: string;
  idCredito: string;
  cuotasSeleccionadasAPagar: any[];
  cuotasPendientesAPagar: FilaCuota[];
  cuotasPendientes: FilaCuota[];
  creditos: any[];
  msjCobros: string;


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
        valuePrepareFunction: (cell, row) => { return row.orden; }
        // valuePrepareFunction: (cell, row) => { return row.orden + '_' + (row.cuotaPagada === true ? 'PAG' : 'IMP'); }
      },
      montoPagado: {
        title: 'Montos Pagados',
        width: '8%',
        filter: false,
        valuePrepareFunction: (value) => {
          let total: number= 0;
          for(var i=0;i<value.length;i++)
              {
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










  constructor(private ngxSmartModalService: NgxSmartModalService) {}
  // constructor() {}

  ngOnInit( ) {
  }


  getDataFromCuotas(misCuotas: any[], misCreditos: any[], idCredito: string, miToken: string) {

    this.creditos = misCreditos;
    this.idCredito = idCredito;
    this.token = miToken;

    /* console.log('LLEGARON ESTAS CUOTAS DEL PADRE: ' + misCuotas);
    console.log(this.creditos[0]);
    console.log(this.creditos[0].cuotas); */

    this.cuotas = this.creditos[0].cuotas;

    let cuotasLocal: any[] = [];

    this.cuotas.forEach(element => {
      if (!element.cuotaPagada){
            cuotasLocal.push(element);
      }
    });
    this.cuotasPendientesAPagar = cuotasLocal;
    // console.log(this.cuotasPendientesAPagar);
  }

  cargarCuotasAPagar(value: string) {
    this.msjCobros = 'Se cargaran estas cuotas a cobrar para el cobrador';
    // console.log(value);
    this.cuotasSeleccionadasAPagar = new Array();

    let i = 0;

    this.cuotasPendientesAPagar.forEach(element => {
      if (element.orden <= +value) {
        // this.cuotasSeleccionadasAPagar.push(Object.values(element));

        this.cuotasSeleccionadasAPagar.push(element);
        // console.log(element);

        i++;
      }
    });
    // console.log(this.cuotasSeleccionadasAPagar);
  }


  /* cargarCuotasPendientes(){

    this.cuotasPendientes = JSON.parse(JSON.stringify(this.cuotasPendientesAPagar));


  } */

  aceptarCuotasAPagar(event){

    const total = 10000;
    // this.operate.emit(total); // este valor se va a pasar al componenete padre

    // alert('Se guardaran estas cobranzas pendientes para el cobrador');
    // this.ngxSmartModalService.getModal('popupTwo').close();
    // this.ngxSmartModalService.getModal('popupOne').close();

    // Cuando se lance el evento click en la plantilla llamaremos a este método
    // Usamos el método emit
    // this.pasameCuotasACobrar.emit({nombre: 'VIENDE DEL HIJO:' + this.msjCobros});

    let parametros : any[] = [];
    parametros.push(this.cuotas);
    parametros.push(this.creditos);
    parametros.push(this.idCredito);
    parametros.push(this.token);
    parametros.push(this.cuotasSeleccionadasAPagar);


    this.pasameCuotasACobrar.emit(parametros);



  }

  onCustom(event){

  }

}
