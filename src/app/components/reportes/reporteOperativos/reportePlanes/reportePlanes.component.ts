import { OnInit, Component } from "@angular/core";
import { DatePipe } from "@angular/common";

import { LoginService } from "src/app/modules/servicios/login/login.service";
import { Session } from "src/app/modelo/util/session";
import { FormBuilder } from "@angular/forms";
import { CreditosService } from "src/app/modules/servicios/creditos/creditos.service";
import * as moment from "moment/moment";
import 'jspdf-autotable';
declare let jsPDF;
import Swal from 'sweetalert2';
import { UtilidadesService } from "src/app/modules/servicios/utiles/utilidades.service";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
enum Meses {
    "Enero" = 1,
    "Febrero" = 2,
    "Marzo" = 3,
    "Abril" = 4,
    "Mayo" = 5,
    "Junio" = 6,
    "Julio" = 7,
    "Agosto" = 8,
    "Septiembre" = 9,
    "Octubre" = 10,
    "Noviembre" = 11,
    "Diciembre" = 12
}

@Component({
    selector: 'app-reportePlanes',
    templateUrl: './reportePlanes.component.html',
})
export class ReportePlanes implements OnInit {

    session = new Session();
    creditos: any;
    planViewModel: any;
    planes: any;
    bandera: boolean = false;

    fechaActual = new Date(Date.now());
    cuotasPagadas = 0;
    cuotasImpagas = 0;
    mesActual = Meses[this.fechaActual.getMonth() + 1];
    settings = {

        actions: {
            //columnTitle: 'Accion',
            add: false,
            delete: false,
            edit: false,
            imprimirPDF: false,

        },
        columns: {
            /* orden: {
                title: 'Orden',
                width: '10%',
                filter: false,
                valuePrepareFunction: (cell, row) => {
                    if(row.planPagos.tipoPlan != null){
                        return  row.planPagos.tipoPlan.orden
                    }else{
                        return 'No Tiene'
                    }

                }
            }, */
            plan: {
                title: 'Plan',
                width: '10%',
                filter: false,
                valuePrepareFunction: (cell, row) => {
                    if(row.planPagos.tipoPlan != null){
                        return row.planPagos.tipoPlan.diasASumar
                    }else{
                        return 'No Tiene'
                    }
                }
            },
            tipoPlan: {
                title: 'Nombre',
                width: '10%',
                filter: false,
                valuePrepareFunction: (cell, row) => {
                    if(row.planPagos.tipoPlan != null){
                        return row.planPagos.tipoPlan.nombre
                    }else{
                        return 'No Tiene'
                    }
                }
            },
            legajo: {
                title: 'Legajo',
                width: '5%',
                filter: false,
                valuePrepareFunction: (cell, row) => row.legajo_prefijo + ' - ' + row.legajo
            },
            cliente: {
                title: 'Cliente',
                width: '20%',
                filter: false,
                valuePrepareFunction: (cell, row) => {
                    if (row.comercio) {
                        return row.comercio.razonSocial;
                    } else {
                        return row.cliente.titular.apellidos;
                    }

                }
            },
            direccion: {
                title: 'Direccion',
                width: '30%',
                filter: false,
                valuePrepareFunction: (cell, row) => {
                    if (row.comercio) {
                        return 'Bº: ' + row.comercio.domicilio.barrio + ' ,Calle: ' + row.comercio.domicilio.calle + ' Nº casa: ' + row.comercio.domicilio.numeroCasa;
                    } else {
                        return 'Bº: ' + row.cliente.titular.domicilio.barrio + ' ,Calle: ' + row.cliente.titular.domicilio.calle + ' Nº casa: ' + row.cliente.titular.domicilio.numeroCasa;
                    }
                }

            },
        /*     fechaUltimoPago: {
                title: 'Fecha Ultimo Pago',
                width: '20%',
                filter: false,
                valuePrepareFunction: (cell, row) => {
                    let raw: "0";
                    row.planPagos.cuotas.forEach(x => {
                        if (x.cuotaPagada === true) {
                            console.log(x.fechaPago[x.fechaPago.length - 1]);
                            raw = x.fechaPago[x.fechaPago.length - 1]
                        }
                    })
                    return raw === "0" ? "0" : this.datePipe.transform(raw, 'dd/MM/yyyy');

                }
            }, */
            fechaVencimiento: {
              title: 'Fecha Ultima Cuota',
              width: '20%',
              filter: false,
              // tslint:disable-next-line:max-line-length
              valuePrepareFunction: (cell, row) => { return moment(row.planPagos.cuotas[row.planPagos.cuotas.length - 1].fechaVencimiento).format('DD-MM-YYYY') }
           },
            montoCredito: {
                title: 'Monto Total de Credito',
                width: '10%',
                filter: false,
                valuePrepareFunction: (cell, row) => Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(row.valorCuota * row.cantidadCuotas)
            },
            cuotasPagadas: {
                title: 'Cuotas Pagadas',
                width: '10%',
                filter: false,
                valuePrepareFunction: (cell, row) => {
                    let raw = 0;
                    row.planPagos.cuotas.forEach(x => {
                        if (x.cuotaPagada === true) {
                            raw += 1;
                        }
                    })

                    return raw;
                }
            },
            cuotasRestantes: {
                title: 'Cuotas Restantes',
                width: '10%',
                filter: false,
                valuePrepareFunction: (cell, row) => {
                    let raw = 0;
                    row.planPagos.cuotas.forEach(x => {
                        if (x.cuotaPagada === false) {
                            raw += 1;
                        }
                    })

                    return raw;
                }
            }
        },
        pager: {
            display: true,
            perPage: 10
        },
        noDataMessage: 'No hay Planes que finalicen este mes...'
    };


    constructor(private datePipe: DatePipe,
        private creditoService: CreditosService,
        private loginService: LoginService,
        private fb: FormBuilder,
        private auxiliar: UtilidadesService,
        private spinnerService: Ng4LoadingSpinnerService) {
        console.log(this.fechaActual);
        console.log(this.fechaActual.getMonth());
    }

    ngOnInit(): void {
        this.bandera = false;
        this.planViewModel = new Array();

       /*  this.spinnerService.show();
        setTimeout(() => this.spinnerService.hide(), 5000) */
        this.session.token = this.loginService.getTokenDeSession();
        this.creditoService.postGetAllCreditosTodosLosUsuarios(this.session).subscribe(result => {
            this.creditos = result["credito"];
            console.log(this.creditos);
            this.getData();
        });
    }

    getData(): void {
       /*  this.spinnerService.show();
        setTimeout(() => this.spinnerService.hide(), 3000); */
        this.bandera = true;
        this.planViewModel = new Array();
        console.log(this.creditos);
        this.creditos.forEach(x => {
            let fecha = new Date(this.datePipe.transform(x.fechaAlta, 'yyyy-MM-dd'));

            // tslint:disable-next-line:max-line-length
            let fechaUltimaCuota = new Date(this.datePipe.transform(x.planPagos.cuotas[x.planPagos.cuotas.length - 1].fechaVencimiento, 'yyyy-MM-dd'));

            console.log(fechaUltimaCuota);



              if (fechaUltimaCuota.getFullYear() === this.fechaActual.getFullYear()) {
                  if (fechaUltimaCuota.getMonth() === this.fechaActual.getMonth()) {
                      this.planViewModel.push(x);
                  }
              }


         /*    if (fecha.getFullYear() <= this.fechaActual.getFullYear()) {
                if (fecha.getFullYear() === this.fechaActual.getFullYear()) {
                    if (fecha.getMonth() <= this.fechaActual.getMonth()) {
                        this.planViewModel.push(x);
                    }
                } else {
                    if (fecha.getFullYear() < this.fechaActual.getFullYear()) {
                        this.planViewModel.push(x);
                    }
                }

            } */



        });

        this.configurarPlan();
    }

    configurarPlan(): void {
        let ultimaFecha: string = ' ';
        let cliente: string = ' ';
        let direccion: string = ' ';
        let tipoPlan : string = ' ';
        let orden : string = ' ';
        let plan : string = ' ';

        this.planes = new Array();
        console.log(this.planViewModel);
        this.planViewModel.forEach(x => {
            x.planPagos.cuotas.forEach(y => {
                ultimaFecha = this.datePipe.transform(y.fechaVencimiento, 'yyyy-MM-dd');
                if (y.cuotaPagada === true) {
                    /*const n = y.fechaPago.length;
                    if (n > 0) {
                        console.log('n es mayor que cero  ' + n);
                    } else {
                        console.log('n no es mayor y vale  ' + n);
                    }
                    if (typeof y.fechaPago[n - 1] != "undefined") {//TODO: fecha de vencimiento deberia ser,
                        /* ultimaFecha = this.datePipe.transform(y.fechaPago[n - 1], 'dd/MM/yyyy')
                        ultimaFecha = this.datePipe.transform(y.fechaPago[n - 1], 'dd/MM/yyyy')
                    }*/

                    this.cuotasPagadas = this.cuotasPagadas + 1;
                } else {
                    "0";
                    this.cuotasImpagas = this.cuotasImpagas + 1;
                }
            })
            if (x.comercio) {
                cliente = x.comercio.razonSocial;
                direccion = 'Bº: ' + x.comercio.domicilio.barrio + ' ,Calle: ' + x.comercio.domicilio.calle + ' Nº casa: ' + x.comercio.domicilio.numeroCasa;
            } else {
                cliente = x.cliente.titular.apellidos;
                direccion = 'Bº: ' + x.cliente.titular.domicilio.barrio + ' ,Calle: ' + x.cliente.titular.domicilio.calle + ' Nº casa: ' + x.cliente.titular.domicilio.numeroCasa;
            }
            if(x.planPagos.tipoPlan != null){
                tipoPlan = x.planPagos.tipoPlan.nombre;
                orden= x.planPagos.tipoPlan.orden;
                plan= x.planPagos.tipoPlan.diasASumar;
            }else{
                tipoPlan = 'No Tiene';
                orden = ' No Tiene';
                plan='No Tiene';
            }
            this.planes.push({
                orden: orden,
                plan: plan,
                tipoPlan: tipoPlan,
                legajo: x.legajo_prefijo + ' - ' + x.legajo,
                cliente: cliente,
                direccion: direccion,
                fechaVencimientoUltimoPago: ultimaFecha,
                montoCredito: Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(x.valorCuota * x.cantidadCuotas),
                cuotasPagadas: this.cuotasPagadas,
                cuotasImpagas: this.cuotasImpagas

            })
            this.cuotasPagadas = 0;
            this.cuotasImpagas = 0;
        })

        console.log(this.planes);
    }

    generarXls(): void {
        this.auxiliar.exportAsExcelFile(this.planes, 'reportePlanes');
    }


}
