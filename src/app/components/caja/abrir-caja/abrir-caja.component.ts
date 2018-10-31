import { Component, OnInit } from '@angular/core';
import { CajaService } from 'src/app/modules/servicios/caja/caja.service';
import { LoginService } from 'src/app/modules/servicios/login/login.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-abrir-caja',
  templateUrl: './abrir-caja.component.html',
})
export class AbrirCajaComponent implements OnInit {
  token: any;
  dataCajas: any;

  selectedValue: any;

  constructor(private cajaService: CajaService, private loginService: LoginService, private datePipe: DatePipe, private router: Router) { }

  ngOnInit() {
    this.token = this.loginService.getDatosDeSession().token;
    this.cargarCombos();
  }

  cargarCombos() {
    this.cajaService.postGetComboIngresoEgreso(this.token).subscribe( resp => {
      this.dataCajas = resp['combos'].cajas;
      this.selectedValue = this.dataCajas[0];
      console.log(this.dataCajas);
    });


  }

  onChangeOperacion() {
    console.log(this.selectedValue);

  }

  abrirCaja(monto: number = 0) {
    const caja = {
      token: this.token,
      caja: this.selectedValue._id,
      montoInicial: monto
    };
    console.log(caja);


    this.cajaService.postAbrirCaja(caja).subscribe( resp =>  {
      let respuesta = resp;
      console.log(respuesta);
      if (resp['ok']) {
        this.loginService.registrarIdentificadorDeCaja(respuesta.idApertura, this.selectedValue.identificador);
        swal(
          'Se abrió correctamente la caja',
          'Todas tus operaciones se reflejarán en esta caja y podras verlos cuando cierres tu caja',
          'success'
        );
      } else {
        swal(
          'Ya tiene una caja abierta asignada',
          'Puedes seguir trabajando o bien cerrar la caja para abrir una nueva',
          'info'
        );

      }
    }, error => {
        swal({
          type: 'error',
          title: 'Oops...',
          text: 'Hubo un error al intentar abrir la caja! Intenta nuevamente mas tarde',
          footer: ''
        });
    });

  }



}
