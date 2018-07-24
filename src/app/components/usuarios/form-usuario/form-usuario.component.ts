import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

import { UsuariosService } from '../../../modules/servicios/usuarios/usuarios.service';
import { TipoDni } from '../../../modelo/negocio/tipoDni';
import { Rol } from '../../../modelo/negocio/rol';
import { Provincia } from '../../../modelo/negocio/provincia';
import { EstadoCasa } from '../../../modelo/negocio/estado-casa';
import { TipoContacto } from '../../../modelo/negocio/tipo-contacto';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { TokenPost } from '../../../modelo/util/token';
import { Domicilio } from '../../../modelo/negocio/domicilio';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.css']
})



export class FormUsuarioComponent implements OnInit {
  public tiposDni: TipoDni[];
  public provincias: Provincia[];
  public estadosCasa: EstadoCasa[];
  public tiposContacto: TipoContacto[];
  public roles: Rol[];
  public localidades: string[];


  currentJustify = 'justified';
  usuarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    // Inicializar controles con GET a Webservices para llenenar en formulario
    this.inicializarControlesUsandoGETServices();

    // Se inicializa el formulario en un FormBuilder que contiene FormsGroups
    // Se establecen controles del formulario con el nombre de los atributos del formulario
    // son nuevos controles de formulario, con sus validadores
    this.usuarioForm = this.fb.group({
      /*  usuario: new FormControl('', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]),
        clave: new FormControl('', [Validators.required, Validators.minLength(8)]),
        status: new FormControl(), */

      // Clase usuario
      tipoDni: new FormControl(), //codigo ID de una consulta GET previa de tipo de Dni
      dni: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      nombres: new FormControl('', [Validators.required]),
      domicilio: new FormControl(), // codigo ID obtenido despues de una POST domicilio
      fechaNacimiento: new FormControl('', [Validators.required]),
      // Clase Domicilio:
      pais: new FormControl(), // Por defecto dejar Argentina
      provincia: new FormControl(), //obtenido de una consulta de Get Provincias
      localidad: new FormControl(), //Idem
      barrio: new FormControl('', [Validators.required]),
      calle: new FormControl('', [Validators.required]),
      numeroCasa: new FormControl('', [Validators.required]),
      estadoCasa: new FormControl(), //obtenido de una consulta de Get Estado Casa
      // Clase Usuario:
      persona: new FormControl(), //codigo ID en respuesta a un alta previa de Persona
      nombreUsuario: new FormControl('', [Validators.required]),
      clave: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      claveReingreso: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      rol: new FormControl(), //obtenido de una consulta de Get Roles
      contactos: new FormControl(), //collection de strings  // cada string es un codigo ID en respuesta a una alta de contacto.

      tipoContacto1: new FormControl(),
      codigoPais1: new FormControl(),
      codigoArea1: new FormControl(),
      numero1: new FormControl(),

      tipoContacto2: new FormControl(),
      codigoPais2: new FormControl(),
      codigoArea2: new FormControl(),
      numero2: new FormControl(),

      tipoContacto3: new FormControl(),
      email: new FormControl('', [
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')
      ])
    });
  }
  // hago los getters para referenciarlos mas facil desde la plantilla de la forma: *ngIf="(clave.invalid)
  get tipoDni() {
    return this.usuarioForm.get('tipoDni');
  }
  get dni() {
    return this.usuarioForm.get('dni');
  }
  get apellidos() {
    return this.usuarioForm.get('apellidos');
  }
  get nombres() {
    return this.usuarioForm.get('nombres');
  }
  get domicilio() {
    return this.usuarioForm.get('domicilio');
  }
  get fechaNacimiento() {
    return this.usuarioForm.get('fechaNacimiento');
  }

  get pais() {
    return this.usuarioForm.get('pais');
  }
  get provincia() {
    return this.usuarioForm.get('provincia');
  }
  get localidad() {
    return this.usuarioForm.get('localidad');
  }
  get barrio() {
    return this.usuarioForm.get('barrio');
  }
  get calle() {
    return this.usuarioForm.get('calle');
  }
  get numeroCasa() {
    return this.usuarioForm.get('numeroCasa');
  }
  get estadoCasa() {
    return this.usuarioForm.get('estadoCasa');
  }
  get persona() { return this.usuarioForm.get('persona'); }
    get nombreUsuario() { return this.usuarioForm.get('nombreUsuario'); }
    get clave() { return this.usuarioForm.get('clave'); }
    get rol() { return this.usuarioForm.get('rol'); }
    get contactos() { return this.usuarioForm.get('contactos'); }


  inicializarControlesUsandoGETServices() {
    this.usuariosService.getAllTipoDni().subscribe(result => {
      this.tiposDni = result['tiposDni'];
    });
    this.usuariosService.getAllEstadoCasa().subscribe(result => {
      this.estadosCasa = result['estadosCasaDB'];
    });
    this.usuariosService.getAllTipoContacto().subscribe(result => {
      this.tiposContacto = result['tiposContactoDB'];
    });
    this.usuariosService.getAllProvincia().subscribe(result => {
      this.provincias = result;
    });


    let tokenizer = new TokenPost();
    tokenizer.token = this.loginService.getTokenDeSession();
    this.usuariosService.postGetRoles(tokenizer).subscribe(response => {
      this.roles = response['rol'];
      },
      err => {
        console.log('Ocurrio un Error al obtener los roles de usuarios: ', err);
    });



    let domicilio = new Domicilio({
      barrio : 'Moreno',
      calle : 'Mexico',
      estadoCasa : '5b18a965a04a411ac18bdef2',
      localidad : 'Palpala',
      numeroCasa : '222',
      pais : 'Argentina',
      provincia : 'Jujuy'
    });

  }

  onChange() {
    console.log('Eligio la Provincia: ',this.usuarioForm.get('provincia').value);
    let prov =  this.provincias.find(x => x.provincia === this.usuarioForm.get('provincia').value);
    this.localidades = prov.localidad;
  }

  resetForm() {
    this.usuarioForm.reset();
  }


}
