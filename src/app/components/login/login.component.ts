import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuariosService } from '../../modules/servicios/usuarios/usuarios.service';
import { LoginService } from '../../modules/servicios/login/login.service';
import { Session } from 'src/app/modelo/util/session';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  mensaje: String;

  constructor(private router: Router, private loginService: LoginService, private usuariosService: UsuariosService) {}

  ngOnInit() {}

  login(form: NgForm) {
    let session: Session;

    session = new Session();
    session.nombreUsuario = form.value.nombreUsuario;
    session.clave = form.value.password;

    this.usuariosService.postLogin(session).subscribe( response => {
      session.token = response['token'];
      this.loginService.registrarLogin(session.nombreUsuario, session.token);
      this.router.navigate(['/info']);
    }, err => {
      this.mensaje = err['error'].err.message;
  });

  }
}
