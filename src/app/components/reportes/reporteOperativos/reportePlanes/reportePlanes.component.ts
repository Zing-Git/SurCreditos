import { OnInit, Component } from "@angular/core";
import { DatePipe } from "@angular/common";

import { LoginService } from "src/app/modules/servicios/login/login.service";
import { Session } from "src/app/modelo/util/session";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { CreditosService } from "src/app/modules/servicios/creditos/creditos.service";

import 'jspdf-autotable';
declare let jsPDF;
import Swal from 'sweetalert2';

@Component({
    selector: 'app-reportePlanes',
    templateUrl: './reportePlanes.component.html',
})
export class ReportePlanes implements OnInit {

    session = new Session();
    creditos: any;
    creditosViewModel: any;
    fechaActual = new Date(this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd'));

    mesActual = this.fechaActual.getMonth() +1;
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
                title: 'Plan',
                width: '10%',
                filter: false
            },
            plan: {
                title: 'Plan',
                width: '10%',
                filter: false
            },
            tipoPlan: {
                title: 'Tipo de Plan',
                width: '10%',
                filter: false
            },
            legajo: {
                title: 'Legajo',
                width: '5%',
                filter: false
            },
            cliente: {
                title: 'Cliente',
                width: '20%',
                filter: false
            },
            direccion: {
                title: 'Direccion',
                width: '30%',
                filter: false
            },
            fechaUltimoPago: {
                title: 'Fecha Ultimo PAgo',
                width: '20%',
                filter: false,
                valuePrepareFunction: (date) => {
                    let raw = new Date(date);
                    let formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
                    return formatted;
                }
            },
            montoCredito: {
                title: 'Monto Total de Credito',
                width: '20%',
                filter: false,
                valuePrepareFunction: (value) => {
                    return value === 'montoCredito' ? value : Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
                }
            },
            cuotasPagadas: {
                title: 'Cuotas Pagadas',
                width: '10%',
                filter: false
            },
            cuotasRestantes: {
                title: 'Cuotas Restantes',
                width: '10%',
                filter: false
            }
        },
        pager: {
            display: true,
            perPage: 10
        },
        noDataMessage: 'No hay creditos entre las Fechas...'
    };


    constructor(private datePipe: DatePipe,
        private creditoService: CreditosService,
        private loginService: LoginService,
        private fb: FormBuilder) {

    }

    ngOnInit(): void {

        this.session.token = this.loginService.getTokenDeSession();
        this.creditoService.postGetAllCreditosTodosLosUsuarios(this.session).subscribe(result => {
            this.creditos = result["credito"];
        })
    }

    getData(): void {
        this.creditosViewModel = new Array();
        console.log(this.creditos);
        this.creditos.forEach(x => {
            let fecha = new Date(this.datePipe.transform(x.fechaAlta, 'yyyy-MM-dd'));
            console.log(fecha);
            if(fecha.getFullYear() <= this.fechaActual.getFullYear())
            {
                if(fecha.getFullYear() === this.fechaActual.getFullYear()){
                    if(fecha.getMonth() <= this.fechaActual.getMonth()){
                        this.creditosViewModel.push(x);
                    }
                }else{
                    if(fecha.getFullYear() < this.fechaActual.getFullYear()){
                        this.creditosViewModel.push(x);
                    }
                }
                
            }
        })
        console.log(this.creditosViewModel);
    }
}