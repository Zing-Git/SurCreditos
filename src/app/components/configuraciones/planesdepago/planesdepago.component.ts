import { Component, OnInit } from "@angular/core";
import swal from "sweetalert2";
import { LoginService } from "src/app/modules/servicios/login/login.service";
import { ClientesService } from "src/app/modules/servicios/clientes/clientes.service";
import { Session } from "src/app/modelo/util/session";
import { FormsModule } from '@angular/forms';
import { CreditosService } from "src/app/modules/servicios/creditos/creditos.service";
import { Router } from "@angular/router";



@Component({
  selector: "app-planesdepago",
  templateUrl: "./planesdepago.component.html"
})
export class PlanesdepagoComponent implements OnInit {
  session = new Session();
  planesDePago: any;
  plan: any;
  dias: any;
  // tslint:disable-next-line:max-line-length
  cuota1: any = 0; cuota2: any = 0; cuota3: any = 0; cuota4: any = 0; cuota5: any = 0; cuota6: any = 0; cuota7: any = 0; cuota8: any = 0; cuota9: any = 0;
  // tslint:disable-next-line:max-line-length
  tasa1: any = 0; tasa2: any = 0; tasa3: any = 0; tasa4: any = 0; tasa5: any = 0; tasa6: any = 0; tasa7: any = 0; tasa8: any = 0; tasa9: any = 0;

  constructor(
    private loginService: LoginService,
    private clientesService: ClientesService,
    private creditosService: CreditosService,
    private router: Router
  ) {}

  ngOnInit() {

  }

  lanzarGuardar() {
    swal({
      title: "Estas seguro de guardar?",
      text: 'Al guardar, tendras un nuevo plan de pago para generar creditos',
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Si, Guardar',
      cancelButtonText: 'No, Cancelar'
    }).then(result => {
      if (result.value) {
        this.guardar();
      }
    });
  }

  guardar() {

      let itemsCargados: any[] = new Array();

      if ((this.cuota1 > 0) && (this.tasa1 > 0)) {
        let item = {
          cantidadCuotas: this.cuota1,
          tasa: this.tasa1
        };
        itemsCargados.push(item);
      }
      if ((this.cuota2 > 0) && (this.tasa2 > 0)) {
        let item = {
          cantidadCuotas: this.cuota2,
          tasa: this.tasa2
        };
        itemsCargados.push(item);
      }
      if ((this.cuota3 > 0) && (this.tasa3 > 0)) {
        let item = {
          cantidadCuotas: this.cuota3,
          tasa: this.tasa3
        };
        itemsCargados.push(item);
      }
      if ((this.cuota4 > 0) && (this.tasa4 > 0)) {
        let item = {
          cantidadCuotas: this.cuota4,
          tasa: this.tasa4
        };
        itemsCargados.push(item);
      }
      if ((this.cuota5 > 0) && (this.tasa5 > 0)) {
        let item = {
          cantidadCuotas: this.cuota5,
          tasa: this.tasa5
        };
        itemsCargados.push(item);
      }
      if ((this.cuota6 > 0) && (this.tasa6 > 0)) {
        let item = {
          cantidadCuotas: this.cuota6,
          tasa: this.tasa6
        };
        itemsCargados.push(item);
      }
      if ((this.cuota7 > 0) && (this.tasa7 > 0)) {
        let item = {
          cantidadCuotas: this.cuota7,
          tasa: this.tasa7
        };
        itemsCargados.push(item);
      }
      if ((this.cuota8 > 0) && (this.tasa8 > 0)) {
        let item = {
          cantidadCuotas: this.cuota8,
          tasa: this.tasa8
        };
        itemsCargados.push(item);
      }
      if ((this.cuota9 > 0) && (this.tasa9 > 0)) {
        let item = {
          cantidadCuotas: this.cuota9,
          tasa: this.tasa9
        };
        itemsCargados.push(item);
      }


      let planes = [
        {
          nombre: this.plan,
          diasASumar: this.dias,
          montoMinimo: 0,
          montoMaximo: 0,
          items: itemsCargados
        },
      ];

      this.creditosService.postPlanDePagoNuevo(planes).subscribe( result => {
         //  console.log(result);
          swal(
            "Se guardo el nuevo plan de pago",
            "Ya puede usar el nuevo plan",
            "success"
          );

        },
        err => {
          swal(
            "No se pudo guardar el plan de pago",
            "Intente nuevamente mas tarde",
            "error"
          );
        }
      );



  }

  volver() {

    this.router.navigate(['modificarplandepago']);
  }
}
