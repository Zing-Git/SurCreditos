import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../modules/servicios/login/login.service';


@Component({
  selector: 'app-appmenu',
  templateUrl: './appmenu.component.html',
})
export class AppmenuComponent implements OnInit, DoCheck {
  isLogged: boolean;
  rol: string;
  usuario: string;
  caja: string;
  estadoCaja: string;
  estadoCajaSwitch: boolean;


  ngDoCheck(): void {
    this.isLogged = this.loginService.verificaEstadoLogin();
    this.rol = (this.loginService.getDatosDeSession()).rolNombre;
    this.usuario = (this.loginService.getDatosDeSession()).nombreUsuario;
    if (this.rol === 'CAJERO') {
      if (this.loginService.getIdCaja() === '0') {
        this.caja = this.loginService.getCaja();
        this.estadoCaja = 'CERRADA';
        this.estadoCajaSwitch = false;
      } else {
        this.caja = this.loginService.getCaja();
        this.estadoCaja = 'ABIERTA';
        this.estadoCajaSwitch = true;
      }
    } else {
      this.caja = '';
        this.estadoCaja = '';
        this.estadoCajaSwitch = false;
    }

  }

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit() {
  }

  logout() {
    this.router.navigate(['login']);
    this.isLogged = this.loginService.logout();
  }
}
