import { Injectable } from '@angular/core';
import { UsuariosService } from '../usuarios/usuarios.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor() { }

  verificaEstadoLogin(): boolean {
    if (sessionStorage.getItem(environment.LSTORE_USUARIO) !== null && sessionStorage.getItem(environment.LSTORE_TOKEN) !== null) {
      return true;
    } else {
      return false;
    }
  }

  logout(): boolean {
    sessionStorage.removeItem(environment.LSTORE_USUARIO);
    sessionStorage.removeItem(environment.LSTORE_TOKEN);
    return false;
  }

  registrarLogin(usuario: string, token: string): void {
    sessionStorage.setItem(environment.LSTORE_USUARIO, usuario);
    sessionStorage.setItem(environment.LSTORE_TOKEN, token);
    // TODO: Verificar si el valor que se  puede almacenar en el el environment es unico para todos
    // los usuarios conectados, si es asi, no sirve para este caso
    // si no es asi, se puede usar esa forma para ocultar el token y no ponerlo como sessionStorage
    // environment.TOKEN.VALOR = token;
    // console.log('registrando token en environment...');
  }

  getTokenDeSession(): string {
    return sessionStorage.getItem(environment.LSTORE_TOKEN);
  }


}
