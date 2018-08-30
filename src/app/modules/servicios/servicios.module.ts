import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from './usuarios/usuarios.service';
import { LoginService } from './login/login.service';
import { UtilidadesService } from './utiles/utilidades.service';
import { OrdenPagoService} from './ordenPago/orden-pago.service';
import { ClientesService } from './clientes/clientes.service';
import { CreditosService } from './creditos/creditos.service';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [UsuariosService, LoginService, UtilidadesService, OrdenPagoService, ClientesService, CreditosService]
})
export class ServiciosModule { }
