import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/modules/servicios/login/login.service';
import 'jspdf-autotable';
import { DatePipe } from "@angular/common";
import { CajaService } from 'src/app/modules/servicios/caja/caja.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilidadesService } from 'src/app/modules/servicios/utiles/utilidades.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ModelCajaComponent } from './model-caja/model-caja.component';

declare let jsPDF;

@Component({
    selector: 'app-reporteCaja',
    templateUrl: './reporteCaja.component.html'
})

export class ReporteCaja implements OnInit {
    @ViewChild(ModelCajaComponent) hijo: ModelCajaComponent;
    token: any;
    dataCombos: any;
    fechaActual: any = (this.datePipe.transform(new Date(Date.now()), 'dd/MMM/yyyy'));
    fechasForm: FormGroup;
    cajasViewModel: any;
    bandera: boolean = false;
    total: number = 0;
    fechaFin: any;
    cajaViewModel: any;
    arregloXls: any;

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
                    title: 'Detalle Excel',
                }
            ],
        },
        columns: {
            fecha: {
                title: 'Fecha',
                width: '15%',
                filter: false
            },
            cantidadMovimientos: {
                title: 'Cant. Movimiento',
                width: '20%',
                filter: false
            },

            montoEgreso: {
                title: 'Monto Egreso',
                width: '40%',
                filter: false,
                valuePrepareFunction: (value) => {
                    return value === 'montoEgreso' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
                }
            },
            montoIngreso: {
                title: 'Monto Ingreso',
                width: '40%',
                filter: false,
                valuePrepareFunction: (value) => {
                    return value === 'montoIngreso' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
                }
            },
            total: {
                title: 'Sub Total',
                width: '20%',
                filter: false,
                valuePrepareFunction: (cell, row) => {
                    return Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(row.montoIngreso - row.montoEgreso);
                }
            }
        },
        pager: {
            display: true,
            perPage: 10
        },
        noDataMessage: 'No hay Ingresos - Egresos en esas fechas...'
    };


    constructor(
        private fb: FormBuilder,
        public cajaService: CajaService,
        public loginService: LoginService,
        public datePipe: DatePipe,
        public utilidades: UtilidadesService,
        public ngxSmartModalService: NgxSmartModalService) { }

    ngOnInit() {
        this.token = this.loginService.getTokenDeSession();
        ///reportes/movimientos_de_caja_por_fecha/
        this.fechasForm = this.fb.group({
            fechaInicio: new FormControl('', [Validators.required]),
            fechaFin: new FormControl(new Date(), [Validators.required])
        });

    }

    getData() {

        this.total = 0;
        this.cajasViewModel = new Array();
        this.arregloXls = new Array();

        let fechaInicio = this.datePipe.transform(this.fechasForm.get('fechaInicio').value, 'dd-MM-yyyy');
        let fechaFin = this.datePipe.transform(this.fechasForm.get('fechaFin').value, 'dd-MM-yyyy');

        console.log(fechaInicio);
        console.log(fechaFin);

        let parameter = {
            token: this.token,
            diaInicio: fechaInicio.toString().substring(0, 2),
            diaFin: fechaFin.toString().substring(0, 2),
            mesInicio: fechaInicio.toString().substring(3, 5),
            mesFin: fechaFin.toString().substring(3, 5),
            anioInicio: fechaInicio.toString().substring(6),
            anioFin: fechaFin.toString().substring(6)
        }
        //this.fechaFin = parameter.diaFin + '/' + parameter.mesFin + '/' + parameter.anioFin;

        console.log(parameter);
        this.cajaService.postGetReporteCaja(parameter).subscribe(result => {
            console.log(result);
            if (result['ok'] === true) {

                this.cajasViewModel = result['cajas'];
                this.bandera = true;
            } else {
                console.log('nada');
            }
            this.cajasViewModel.forEach(element => {
                this.total = this.total + (element.montoIngreso - element.montoEgreso);
                console.log('TOTAL: ' + this.total.toString());
            });
        })

    }

    generarXls(): void {
        this.utilidades.exportAsExcelFile(this.cajasViewModel, 'reporteCaja');
    }

    onCustom(event) {
        //alert(`Custom event '${event.action}' fired on row №: ${event.data._id}`);
        const evento = (`${event.action}`);
        switch (evento) {
            case 'view': {
                this.getModal(event);

            }
        }
    }

    getModal(event: any) {

        //const datos= (`${event.data}`);
        console.log(event.data.fecha);
        let diaInicio = event.data.fecha.toString().substring(0, 2);
        let mesInicio = event.data.fecha.toString().substring(3, 5);
        let anioInicio = event.data.fecha.toString().substring(6);


        this.getDataFromReporteCaja(diaInicio, mesInicio, anioInicio, this.token);
        //this.ngxSmartModalService.getModal('cajaModal').open();
        //this.ngOnInit();
    }

    getDataFromReporteCaja(dia: string, mes: string, anio: string, token: any) {
        let fechaCreada = dia + '/' + mes + '/' + anio;
        let parameter = {
            token: token,
            dia: dia,
            mes: mes,
            anio: anio,
        }
        this.cajaViewModel = new Array();
        this.arregloXls = new Array();

        console.log(parameter);
        this.cajaService.postGetReportePorCajaSegunFecha(parameter).subscribe( result => {
            this.cajaViewModel = result['cajas'];
            console.log('caja view model');
            console.log(this.cajaViewModel);
           

        })
        
    setTimeout(()  =>  this.CargarArreglo(fechaCreada), 2000)
        
       
    }

    CargarArreglo(fechaCreada : string){
        console.log('en el metodo que genera');
        this.cajaViewModel.forEach(element => {
            if (element.aperturasCaja.length > 0) {
                element.aperturasCaja.forEach(x => {
                    if (x.operaciones.length > 0) {
                        x.operaciones.forEach(y => {
                            if (x.cajaAbierta === false) {
                                this.arregloXls.push({
                                    fecha: fechaCreada,
                                    caja: element.caja,
                                    cajaAbierta: x.cajaAbierta,
                                    fechaApertura: this.datePipe.transform(x.fechaApertura, 'dd-MM-yyyy'),
                                    fechaCierre: this.datePipe.transform(x.fechaCierre, 'dd-MM-yyyy'),
                                    montoIngreso: element.ingresos,
                                    montoEgreso: element.egresos,
                                    fechaOperacion: this.datePipe.transform(y.fechaAlta, 'dd-MM-yyyy'),
                                    tipoOperacion: y.tipoOperacion,
                                    operacion: y.operacion,
                                    montoOperacion : y.montoOperacion,
                                    comentario: y.comentario,
                                    usuario: x.usuario.nombreUsuario
                                });
                            }

                        });
                    } else {

                    }

                });
            } else { }

        });
        console.log(this.arregloXls);
        this.utilidades.exportAsExcelFile(this.arregloXls, 'reporteDetalleCaja');
    }
}