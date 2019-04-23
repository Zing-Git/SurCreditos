import { Component, OnInit } from '@angular/core';
import { UtilidadesService } from 'src/app/modules/servicios/utiles/utilidades.service';
import { CajaService } from 'src/app/modules/servicios/caja/caja.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-model-caja',
  templateUrl: './model-caja.component.html',
  styleUrls: ['./model-caja.component.css']
})
export class ModelCajaComponent implements OnInit {

  //session = new Session();
    cajaViewModel : any;

    settings = {

        actions: {
            
            add: false,
            delete: false,
            edit: false,
            imprimirPDF: false,
            
           
        },
        columns: {
            caja: {
                title: 'Caja',
                width: '30%',
                filter: false
            },
            cantidadMovimientos: {
                title: 'Cant. Movimiento',
                width: '20%',
                filter: false
            },

            egresos: {
                title: 'Monto Egreso',
                width: '40%',
                filter: false,
                valuePrepareFunction: (value) => {
                    return value === 'montoEgreso' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
                }
            },
            ingresos: {
                title: 'Monto Ingreso',
                width: '40%',
                filter: false,
                valuePrepareFunction: (value) => {
                    return value === 'montoIngreso' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
                }
            }
        },
        pager: {
            display: true,
            perPage: 10
        },
        noDataMessage: 'No hay Ingresos - Egresos en esas fechas...'
    };

    constructor(public utilidades: UtilidadesService,public cajaService: CajaService,public ngx: NgxSmartModalService) { }

    ngOnInit(): void { }

    getDataFromReporteCaja(dia: string, mes: string, anio: string, token: any) {
        console.log(dia + '/' + mes + '/' + anio);
        let parameter = {
            token: token,
            dia: dia,
            mes: mes,
            anio: anio,
        }
        console.log(parameter);
        this.cajaService.postGetReportePorCajaSegunFecha(parameter).subscribe(result =>{
            this.cajaViewModel= result['cajas'];
            console.log(this.cajaViewModel); 
        })
    }

    onCustom(event) {}

    generarXls(): void {
        this.utilidades.exportAsExcelFile(this.cajaViewModel, 'reporteCaja');
    }

}
