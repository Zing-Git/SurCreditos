import { Component, OnInit } from "@angular/core";
import { ClientesService } from "src/app/modules/servicios/clientes/clientes.service";
import { CreditosService } from "src/app/modules/servicios/creditos/creditos.service";
import swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-modificar-plan",
  templateUrl: "./modificar-plan.component.html"
})
export class ModificarPlanComponent implements OnInit {
  planesDePago: any;
  planes: any;
  planElegido: any;

  constructor(
    private clientesService: ClientesService,
    private creditosService: CreditosService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.session.token = this.loginService.getTokenDeSession();
    this.creditosService.postConsultarTiposDePlanDePago().subscribe(result => {
        this.planesDePago = result["tipoPlan"];
        // console.log(result);
        // console.log(this.planesDePago);
      },
      err => {
        swal(
          "No se pudo obtener la lista de planes de pago!",
          'Intente nuevamente mas tarde',
          'error'
        );
      }
    );
  }

  onChangeTipoPlanes() {
    // console.log(this.planElegido);
    this.planesDePago.forEach(element => {
      if (element.nombre === this.planElegido) {
        this.planes = element.plan;
        // console.log(element.plan);
      }
    });
  }

  async lanzarModificar(indice: any) {
    // console.log(indice);

// tslint:disable-next-line: deprecation
    const { value: nuevaTasa } = await swal({
      title: 'Ingrese el nuevo valor de la Tasa',
      input: 'number',
      inputPlaceholder: 'Nueva tasa. Ej: 0.35',
    });

    if (nuevaTasa) {
// tslint:disable-next-line: deprecation
      swal('Nueva Tasa: ' + nuevaTasa);
      // console.log(nuevaTasa);


      let items = {
        idItem: this.planes[indice]._id,
        tasa: nuevaTasa,
      };

      let itemsModificar: any[] = new Array();
      // console.log(items);

      itemsModificar.push(items);

      this.creditosService.postModificarTasaItem(itemsModificar).subscribe(result => {
        // console.log(result);
        if (result) {
          this.planes[indice].tasa = nuevaTasa;
        }
      },
      err => {
        swal(
          'No se pudo modificar esta tasa del plan de pago',
          'Intente nuevamente mas tarde',
          'error'
        );
      }
      );


    }




  }

  lanzarInhabilitar(indice2: any) {
    let item = {
      idItem: this.planes[indice2]._id
    };
    // console.log(item);
    let itemsInhabilitar: any[] = new Array();
    itemsInhabilitar.push(item);

    this.creditosService.postInhabilitarTasaItem(itemsInhabilitar).subscribe(result => {
      // console.log(result);
      if (result) {
        this.planes.splice(indice2, 1);
        // console.log(this.planes);
        swal(
          'Se inhabilitó correctamente la tasa',
          'Se pudo inhabilitar la tasa correctamente',
          'success'
        );
      }
    },
    err => {
      swal(
        'No se pudo inhabilitar esta tasa del plan de pago',
        'Intente nuevamente mas tarde',
        'error'
      );
    }
    );

  }

  lanzarInhabilitarTodoElPlan() {
    this.planesDePago.forEach(element => {
      if (element.nombre === this.planElegido) {
        let planAInhabilitar = {
          idPlan: element._id
        };

        let planInhabilitarArray: any[] = new Array();
        planInhabilitarArray.push(planAInhabilitar);



        // console.log(planInhabilitarArray);
        this.creditosService.postInhabilitarTodoElPlanDePago(planInhabilitarArray).subscribe(result => {
         // console.log(result);
          if (result) {
            swal(
              'El plan de pago seleccionado fue inhabilitado!',
              'No podra seleccionar ni recuperarlo, solo podra crear nuevos planes de pago',
              'success'
            );
            this.router.navigate(['modificarplandepago']);

          }
        },
        err => {
          swal(
            'No se pudo inhabilitar el plan de pago',
            'Intente nuevamente mas tarde',
            'error'
          );
        }
        );

      }
    });

  }
  generarNuevoPlan() {
    this.router.navigate(['planesdepago']);

  }
}
