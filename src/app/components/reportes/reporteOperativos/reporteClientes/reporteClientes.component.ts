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


    fechaInicio: any = (this.datePipe.transform(new Date(Date.now()), 'dd/MM/yyyy'));
    clientesActivos: any;
    clientesInactivos: any;

    constructor(private datePipe: DatePipe,
        private creditoService: CreditosService,
        private loginService: LoginService, private spinnerService: Ng4LoadingSpinnerService
       ) {

    }

    ngOnInit(): void {
        this.spinnerService.show();
        setTimeout(()=>this.spinnerService.hide(),3000)

        this.session.token = this.loginService.getTokenDeSession();
        this.creditoService.postGetAllCreditosTodosLosUsuarios(this.session).subscribe(result => {
            this.creditos = result["credito"];
            /* console.log(this.creditos);
            console.log(this.fechaInicio); */
        })

        //this.spinnerService.hide();
    }


    calcular(){
        this.clientesActivos = 0;
        this.clientesInactivos = 0;
        this.creditos.forEach(x =>{
            if(x.cliente.estado){
                this.clientesActivos +=1
            }else{
                this.clientesInactivos +=1;
            }

        })

    }
}
