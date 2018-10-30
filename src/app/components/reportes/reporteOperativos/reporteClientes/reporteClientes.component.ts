import { OnInit, Component } from "@angular/core";
import { DatePipe } from "@angular/common";

import { Session } from "src/app/modelo/util/session";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { CreditosService } from "src/app/modules/servicios/creditos/creditos.service";
import { LoginService } from "src/app/modules/servicios/login/login.service";
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

declare let jsPDF;

@Component({
    selector: 'app-reporteClientes',
    templateUrl: './reporteClientes.component.html',
})
export class ReporteClientes implements OnInit {

    session = new Session();
    creditos: any;


    fechaInicio: any = (this.datePipe.transform(new Date(Date.now()), 'dd/mm/yyyy'));
    clientesActivos: any;


    constructor(private datePipe: DatePipe,
        private creditoService: CreditosService,
        private loginService: LoginService, private spinnerService: Ng4LoadingSpinnerService
       ) {

    }

    ngOnInit(): void {
        this.spinnerService.show();
        this.session.token = this.loginService.getTokenDeSession();
        this.creditoService.postGetAllCreditosTodosLosUsuarios(this.session).subscribe(result => {
            this.creditos = result["credito"];
            console.log(this.creditos);
        })
        
        this.spinnerService.hide();
    }


    calcular(){
        this.clientesActivos = 0;
        this.creditos.forEach(x =>{
            this.clientesActivos +=1
        })
        
    }
}