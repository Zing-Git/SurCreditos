import { Injectable } from '@angular/core';
import { UsuariosService } from '../usuarios/usuarios.service';
import { environment } from '../../../../environments/environment';
import { Session } from '../../../modelo/util/session';
import { CajaService } from 'src/app/modules/servicios/caja/caja.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private cajaService: CajaService) { }

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
    sessionStorage.removeItem(environment.LSTORE_CAJA);
    try {
      sessionStorage.removeItem(environment.LSTORE_ID_CAJA);
      sessionStorage.removeItem(environment.LSTORE_CAJA);
    } catch (error) {
    }

    return false;
  }


  registrarLogin(session: Session): void {
    sessionStorage.setItem(environment.LSTORE_USUARIO, session.nombreUsuario);
    sessionStorage.setItem(environment.LSTORE_TOKEN, session.token);
    sessionStorage.setItem(environment.LSTORE_ROL, session.rolNombre);
    sessionStorage.setItem(environment.LSTORE_ROL_PRECEDENCIA, session.rolPrecendencia);
    sessionStorage.setItem(environment.LSTORE_ROL_ID, session.rol_id);
    sessionStorage.setItem(environment.LSTORE_USUARIO_ID, session.usuario_id);

    // Controla si es cajero con caja abierta, guarda id de caja en la session como variable
    if (session.rolNombre === 'CAJERO') {
      this.cajaService.postVerificarEstadoDeCaja(session.usuario_id).subscribe( resp => {
        console.log(resp);
        if (resp.ok) { // si hay el cajero tiene una caja abierta, se guarda en la session del navegadro el id de caja abierta
          this.registrarIdentificadorDeCaja(resp['idApertura'], resp['identificador']);
        } else {
          this.registrarIdentificadorDeCaja('0', 'CAJA SIN ASIGNAR'); // se guarda cero TEXTO cuando no tiene una caja abierta
        }
      });
    }
  }
 // OPERACIONES CON LA CAJA -----------------
  registrarIdentificadorDeCaja(idCaja: string = '', caja: string = ''): void {
    sessionStorage.setItem(environment.LSTORE_ID_CAJA, idCaja);
    sessionStorage.setItem(environment.LSTORE_CAJA, caja);
  }
  getIdCaja(): string {
    return sessionStorage.getItem(environment.LSTORE_ID_CAJA);
  }
  getCaja(): string {
    return sessionStorage.getItem(environment.LSTORE_CAJA);
  }
  setCierreDeCaja(){  // TODO: metodo solo de prueba
    sessionStorage.setItem(environment.LSTORE_ID_CAJA, '0');
    sessionStorage.setItem(environment.LSTORE_CAJA, 'CAJA SIN ASIGNAR');
  }
  // ---------------------------------------------

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
