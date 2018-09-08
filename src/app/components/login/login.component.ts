import { Component, OnInit, OnChanges, DoCheck, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuariosService } from '../../modules/servicios/usuarios/usuarios.service';
import { LoginService } from '../../modules/servicios/login/login.service';
import { Session } from '../../modelo/util/session';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  mensaje: String;
  idRol: string;
  miSession: Session;
  constructor(private router: Router, private loginService: LoginService, private usuariosService: UsuariosService) { }

  ngOnInit() {

    /* this.usuariosService.getTest().subscribe(resp => {
      console.log ('Servicio TEST: ', resp );
    }); */
  
  }


  login(form: NgForm) {
    let session: Session;

    session = new Session();
    session.nombreUsuario = form.value.nombreUsuario;
    session.clave = form.value.password;

    this.usuariosService.postLogin(session).subscribe(response => {
      session.token = response['token'];
      session.rol_id = response['usuario'].rol._id;
      session.rolPrecendencia = response['usuario'].rol.precedencia;

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
        case '5b91731eb02df40f286142bb': {
          session.rolNombre = 'ADMINISTRADOR';
          break;
        }
        // TODO: falta comparar si el usuario es ROOT
        default: {
          session.rolNombre = 'INDEFINIDO';
          break;
        }
      }
      this.loginService.registrarLogin(session);
      this.router.navigate(['/info']);
      this.miSession = session;
      /*}, err => {
          alert('Usuario o clave incorrecta!');
          this.router.navigate(['/login']);*/
    });
  }
}
