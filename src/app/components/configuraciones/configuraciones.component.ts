import { Component, OnInit } from '@angular/core';
import { CreditosService } from '../../modules/servicios/creditos/creditos.service';
import { LoginService } from 'src/app/modules/servicios/login/login.service';
import swal from 'sweetalert2';
import { Session } from 'src/app/modelo/util/session';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html'
})
export class ConfiguracionesComponent implements OnInit {
  session = new Session();
  configuraciones: any;

  constructor(private router: Router, private loginService: LoginService, private creditosService: CreditosService) { }

  ngOnInit() {
      this.session.token = this.loginService.getTokenDeSession();
      this.creditosService.postGetConfiguraciones(this.session).subscribe( result => {
          // this.configuraciones = result;
          // console.log(result);
          this.crearTablaConfiguraciones(result['configuraciones']);

          }, err => {
            swal(
              'No se pudo obtener la lista de configuraciones!',
              'Intente nuevamente mas tarde',
              'error'
            );
          });
  }

  crearTablaConfiguraciones(zconfiguraciones: any) {
    let listaConfiguraciones = new Array();

    zconfiguraciones.forEach(element => {
      // console.log(element);
      let itemTabla = {
            _id: element._id,
            item: element.item,
            valor: element.valor,
            valorNuevo: element.valor,
            __v: element.__v
      };
      listaConfiguraciones.push(itemTabla);
    });
    this.configuraciones = listaConfiguraciones;

  }

  lanzarPopupGuardar(){


    swal({
      title: 'Estas seguro de guardar?',
      text: 'Al guardar, los creditos tendran una nuevo valor de calculo en base a estos parametros configurados',
      type: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Si, Guardar',
      cancelButtonText: 'No, Cancelar'
    }).then((result) => {
      if (result.value) {
        this.guardarConfiguracion();
      }
    });
  }

  guardarConfiguracion(){
    // console.log(this.configuraciones);
    let nuevaConfiguracion = new Array();

    this.configuraciones.forEach(element => {
      let itemConfig = {
        _id: element._id,
        valor: element.valorNuevo
      };
      nuevaConfiguracion.push(itemConfig);
    });
    // console.log(nuevaConfiguracion);

    this.creditosService.postActualizarConfiguraciones(this.session, nuevaConfiguracion).subscribe( result => {
      swal(
        'Se Actualizó correctamente las configuraciones',
        'Tenga en cuenta que esto modifica los nuevos calculos que hacen uso de estas configuraciones',
        'success'
      );
      this.router.navigate(['configuraciones']);

    }, err => {
      swal(
        'No se pudo guardar las configuraciones!',
        'Revise las comas decimales o intente nuevamente mas tarde',
        'error'
      );
    });

  }



}
