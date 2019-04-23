import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CreditosService } from 'src/app/modules/servicios/creditos/creditos.service';
import { LoginService } from 'src/app/modules/servicios/login/login.service';
import { UtilidadesService } from 'src/app/modules/servicios/utiles/utilidades.service';
import { Session } from "src/app/modelo/util/session";
import * as moment from "moment/moment";
import { forEach } from '@angular/router/src/utils/collection';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-reporte-planes-atrasados',
  templateUrl: './reporte-planes-atrasados.component.html',
  styleUrls: ['./reporte-planes-atrasados.component.css']
})
export class ReportePlanesAtrasadosComponent implements OnInit {

  session = new Session();
  creditos: any;
  totalCredito: any;
  planViewModel: any;
  planes: any;
  planesXls: any;
  bandera: boolean = false;

  fechaActual = new Date(Date.now());
  cuotasPagadas = 0;
  cuotasImpagas = 0;
  //mesActual = Meses[this.fechaActual.getMonth() + 1];

  settings = {

    actions: {
      //columnTitle: 'Accion',
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,

    },
    columns: {
      titular: {
        title: 'Titular',
        width: '30%',
        filter: false
      },
      montoPedido: {
        title: 'Monto Pedido',
        width: '10%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'montoPedido' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      cuotasImpagas: {
        title: 'Cuotas Impagas',
        width: '10%',
        filter: false
      },
      montoPendientePago: {
        title: 'Total Impago',
        width: '20%',
        filter: false,
        valuePrepareFunction: (value) => {
          return value === 'montoPendientePago' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
        }
      },
      cobranzaADomicilio: {
        title: 'Tiene cobranza a domicilio',
        width: '30%',
        filter: false

      },
    },

    pager: {
      display: true,
      perPage: 10
    },
    noDataMessage: 'No hay Planes impagos...'
  };


  constructor(private datePipe: DatePipe,
    private creditoService: CreditosService,
    private loginService: LoginService,
    private spinnerService: Ng4LoadingSpinnerService,
    private auxiliar: UtilidadesService) {

    console.log(this.fechaActual);
    console.log(this.fechaActual.getMonth());
  }

  ngOnInit() {

    this.session.token = this.loginService.getTokenDeSession();

    /*this.creditoService.postGetAllCreditosTodosLosUsuarios(this.session).subscribe(result => {
      console.log(result["credito"]);
      this.planes = result["credito"];
      console.log('TOTAL CREDITOS');
      console.log(this.planes);
      this.getData();
    });*/

    setTimeout(() => this.getCuotasAtrasadas(), 2000);
  }

  generarXls(): void {
    this.auxiliar.exportAsExcelFile(this.planes, 'reportePlanes');
  }

  getData() {

    this.planViewModel = new Array();
    this.planes.forEach(x => {
      if (x.cliente.estado) {
        if (x.estado.estadoTerminal === false) {
          this.planViewModel.push(x);
        }
      }

    })
    this.configuracionPaln();

  }

  configuracionPaln() {
    let contadorCuotasImpagas = 0;
    let montoPendientePago = 0;

    this.planesXls = new Array();

    this.planViewModel.forEach(x => {
      contadorCuotasImpagas = 0;
      montoPendientePago = 0;
      let nombre = x.cliente.titular.nombres + ', ' + x.cliente.titular.apellidos;
      let id = x._id;
      let montoPedido = x.montoPedido;
      let cobranzaDomicilio: string = x.tieneCobranzaADomicilio == true ? 'SI' : 'NO';

      x.planPagos.cuotas.forEach(y => {
        if (y.cuotaPagada === false) {
          contadorCuotasImpagas += 1;
          montoPendientePago = montoPendientePago + y.montoPendienteDePago;
        }
      })

      this.planesXls.push({
        titular: nombre,
        id: id,
        montoPedido: montoPedido,
        cuotasImpagas: contadorCuotasImpagas,
        montoPendientePago: montoPendientePago,
        cobranzaADomicilio: cobranzaDomicilio
      })
    })

    console.log(this.planesXls);
  }

  getCuotasAtrasadas() {
    this.creditoService.postGetCuotasAtrasadas(this.session.token).subscribe(result => {
      this.creditos = result;
      this.totalCredito = Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(this.creditos.montoTotalCuotasRetrasadas)
    });
  }
}
