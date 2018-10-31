import { OnInit, Component } from "@angular/core";
import { DatePipe } from "@angular/common";

import { LoginService } from "src/app/modules/servicios/login/login.service";
import { Session } from "src/app/modelo/util/session";
import { FormBuilder } from "@angular/forms";
import { CreditosService } from "src/app/modules/servicios/creditos/creditos.service";

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

    fechaActual = new Date(this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd'));
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
            orden: {
                title: 'Orden',
                width: '10%',
                filter: false,
                valuePrepareFunction: (cell, row) => row.planPagos.tipoPlan.orden
            },
            plan: {
                title: 'Plan',
                width: '10%',
                filter: false,
                valuePrepareFunction: (cell, row) => row.planPagos.tipoPlan.diasASumar
            },
            tipoPlan: {
                title: 'Tipo de Plan',
                width: '10%',
                filter: false,
                valuePrepareFunction: (cell, row) => row.planPagos.tipoPlan.nombre
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
                valuePrepareFunction: (cell, row) => row.comercio.razonSocial
            },
            direccion: {
                title: 'Direccion',
                width: '30%',
                filter: false,
                valuePrepareFunction: (cell, row) => 'Bº: ' + row.comercio.domicilio.barrio + ' ,Calle: ' + row.comercio.domicilio.calle + ' Nº casa: ' + row.comercio.domicilio.numeroCasa

            },
            fechaUltimoPago: {
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
        noDataMessage: 'No hay Planes...'
    };


    constructor(private datePipe: DatePipe,
        private creditoService: CreditosService,
        private loginService: LoginService,
        private fb: FormBuilder,
        private auxiliar: UtilidadesService,
        private spinnerService: Ng4LoadingSpinnerService) {

    }

    ngOnInit(): void {
        this.spinnerService.show();
        setTimeout(() => this.spinnerService.hide(), 5000)
        this.session.token = this.loginService.getTokenDeSession();
        this.creditoService.postGetAllCreditosTodosLosUsuarios(this.session).subscribe(result => {
            this.creditos = result["credito"];
        })
    }

    getData(): void {
        this.bandera = true;
        this.planViewModel = new Array();
        console.log(this.creditos);
        this.creditos.forEach(x => {
            let fecha = new Date(this.datePipe.transform(x.fechaAlta, 'yyyy-MM-dd'));
            console.log(fecha);
            if (fecha.getFullYear() <= this.fechaActual.getFullYear()) {
                if (fecha.getFullYear() === this.fechaActual.getFullYear()) {
                    if (fecha.getMonth() <= this.fechaActual.getMonth()) {
                        this.planViewModel.push(x);
                    }
                } else {
                    if (fecha.getFullYear() < this.fechaActual.getFullYear()) {
                        this.planViewModel.push(x);
                    }
                }

            }
        })
        this.configurarPlan();
    }

    configurarPlan(): void {
        let ultimaFecha: string = ' ';
        this.planes = new Array();
        this.planViewModel.forEach(x => {
            x.planPagos.cuotas.forEach(y => {
                if (y.cuotaPagada === true) {
                    if (typeof y.fechaPago[y.fechaPago.length - 1] != "undefined") {
                        ultimaFecha = this.datePipe.transform(y.fechaPago[y.fechaPago.length - 1], 'dd/MM/yyyy')
                    }
                    this.cuotasPagadas = this.cuotasPagadas + 1;
                } else {
                    "0";
                    this.cuotasImpagas = this.cuotasImpagas + 1;
                }
            })

            this.planes.push({
                orden: x.planPagos.tipoPlan.orden,
                plan: x.planPagos.tipoPlan.diasASumar,
                tipoPlan: x.planPagos.tipoPlan.nombre,
                legajo: x.legajo_prefijo + ' - ' + x.legajo,
                cliente: x.comercio.razonSocial,
                direccion: 'Bº: ' + x.comercio.domicilio.barrio + ' ,Calle: ' + x.comercio.domicilio.calle + ' Nº casa: ' + x.comercio.domicilio.numeroCasa,
                fechaUltimoPago: ultimaFecha,
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