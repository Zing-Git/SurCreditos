import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from './usuarios/usuarios.service';
import { LoginService } from './login/login.service';
import { UtilidadesService } from './utiles/utilidades.service';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [UsuariosService, LoginService, UtilidadesService]
})
export class ServiciosModule { }
