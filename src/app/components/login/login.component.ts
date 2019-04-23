import { Component, OnInit, OnChanges, DoCheck, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuariosService } from '../../modules/servicios/usuarios/usuarios.service';
import { LoginService } from '../../modules/servicios/login/login.service';
import { Session } from '../../modelo/util/session';
import { environment } from '../../../environments/environment';
import swal from 'sweetalert2';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  mensaje: string;
  idRol: string;
  miSession: Session;
  constructor(private router: Router, private loginService: LoginService, private usuariosService: UsuariosService, private spinnerService: Ng4LoadingSpinnerService) {

    this.consultar();
  }

  ngOnInit() {

    /* this.usuariosService.getTest().subscribe(resp => {
      console.log ('Servicio TEST: ', resp );
    }); */

    this.consultar();


  }

  consultar(): void {
    if (this.loginService.getDatosDeSession().token == null) {
      // console.log(this.loginService.getDatosDeSession().token + 'TOKEN VACIO....');
      this.router.navigate(['/login']);

    } else {
      // console.log(this.loginService.getDatosDeSession().token + 'TOKEN lleno....');
      this.router.navigate(['/info']);
    }
  }


  login(form: NgForm) {
    let session: Session;

    session = new Session();
    session.nombreUsuario = form.value.nombreUsuario;
    session.clave = form.value.password;

    this.spinnerService.show();
    this.usuariosService.postLogin(session).subscribe(response => {
      session.token = response['token'];
      session.rol_id = response['usuario'].rol._id;
      session.rolPrecendencia = response['usuario'].rol.precedencia;
      session.usuario_id = response['usuario']._id;

      // console.log('DATOS DE SESSION: ', response);

      switch (session.rol_id) {
        case '5b91731eb02df40f286142bc': {
          session.rolNombre = 'VENDEDOR';
          break;
        }
        case '5b91731eb02df40f286142bd': {
          session.rolNombre = 'CAJERO';
          break;
        }
        case '5b91731eb02df40f286142be': {
          session.rolNombre = 'COBRADOR';
          break;
        }
        case '5b91731eb02df40f286142bb': { // esto es de produccion en amazon
          session.rolNombre = 'ADMINISTRADOR';
          break;
        }
        // TODO: falta comparar si el usuario es ROOT
        case '5b91731eb02df40f286142ba': {
          session.rolNombre = 'ROOT';
          break;
        }
        default: {
          // console.log('No se encontro este ID de rol en case de login component: ', session.rol_id);
          break;
        }
      }
      this.loginService.registrarLogin(session);
      this.spinnerService.hide();

      if (session.rolNombre === 'CAJERO'){
        console.log(this.loginService.getIdCaja());

          if (this.loginService.getIdCaja() === '0' || this.loginService.getIdCaja() === null) {
            swal(
              'Debe Abrir una Caja para comenzar a operar...',
              'Ingrese la caja sobre la que quiere trabajar y un monto inicial de caja',
              'info'
            );
            this.router.navigate(['/abrircaja']);
          } else { // mensaje de que tiene caja abierta
            swal(
              'Ya tiene una caja abierta asignada',
              'Puedes seguir trabajando o bien cerrar la caja para abrir una nueva',
              'info'
            );
            this.router.navigate(['/info']);
          }
      } else {
        this.router.navigate(['/info']);
      }

      this.miSession = session;

    }, error => {
      swal(
        'No se pudo iniciar sesión',
        'Intente nuevamente con usuario y clave válidos',
        'error'
      );
    }
    );
  }
}
