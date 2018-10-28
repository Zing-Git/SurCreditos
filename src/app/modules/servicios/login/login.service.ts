import { Injectable } from '@angular/core';
import { UsuariosService } from '../usuarios/usuarios.service';
import { environment } from '../../../../environments/environment';
import { Session } from '../../../modelo/util/session';

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
    sessionStorage.removeItem(environment.LSTORE_ROL);
    sessionStorage.removeItem(environment.LSTORE_ROL_ID);
    sessionStorage.removeItem(environment.LSTORE_ROL_PRECEDENCIA);
    sessionStorage.removeItem(environment.LSTORE_USUARIO_ID);
    return false;
  }


  registrarLogin(session: Session): void {
    sessionStorage.setItem(environment.LSTORE_USUARIO, session.nombreUsuario);
    sessionStorage.setItem(environment.LSTORE_TOKEN, session.token);
    sessionStorage.setItem(environment.LSTORE_ROL, session.rolNombre);
    sessionStorage.setItem(environment.LSTORE_ROL_PRECEDENCIA, session.rolPrecendencia);
    sessionStorage.setItem(environment.LSTORE_ROL_ID, session.rol_id);
    sessionStorage.setItem(environment.LSTORE_USUARIO_ID, session.usuario_id);
  }

  getTokenDeSession(): string {
    return sessionStorage.getItem(environment.LSTORE_TOKEN);
  }

  getDatosDeSession(): Session {
    let session = new Session();
    session.nombreUsuario = sessionStorage.getItem(environment.LSTORE_USUARIO);
    session.token = sessionStorage.getItem(environment.LSTORE_TOKEN);
    session.rol_id = sessionStorage.getItem(environment.LSTORE_ROL_ID);
    session.rolNombre = sessionStorage.getItem(environment.LSTORE_ROL);
    session.rolPrecendencia = sessionStorage.getItem(environment.LSTORE_ROL_PRECEDENCIA);
    session.usuario_id = sessionStorage.getItem(environment.LSTORE_USUARIO_ID);
    return session;
  }

  // Metodo que devuelve true si la clave tiene numeros y letras y tiene al menos 8 caracteres
  validaFormatoClaveUsuario(clave: string): boolean {
      if (clave.length > 7) {
        let numeros = '0123456789';
        let letras = 'abcdefghyjklmnñopqrstuvwxyz';
        clave = clave.toLowerCase();
        for (let i = 0; i < clave.length; i++) {
          if ((numeros.indexOf(clave.charAt(i)) !== -1)) {
            return true;
          }
       }
      } else {
        return false;
      }
  }
}
