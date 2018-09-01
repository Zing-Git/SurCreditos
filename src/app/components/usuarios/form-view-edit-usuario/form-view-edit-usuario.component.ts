import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuariosService } from '../../../modules/servicios/usuarios/usuarios.service';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { TokenPost } from '../../../modelo/util/token';
import { TipoDni } from '../../../modelo/negocio/tipoDni';
import { UtilidadesService } from '../../../modules/servicios/utiles/utilidades.service';
import { Provincia } from '../../../modelo/negocio/provincia';
import { EstadoCasa } from '../../../modelo/negocio/estado-casa';
import { TipoContacto } from '../../../modelo/negocio/tipo-contacto';
import { Rol } from '../../../modelo/negocio/rol';



@Component({
  selector: 'app-form-view-edit-usuario',
  templateUrl: './form-view-edit-usuario.component.html',
})
export class FormViewEditUsuarioComponent implements OnInit {
  id: string;
  evento: string;
  habilitarControles: boolean;
  usuario: any;

  usuarioForm: FormGroup;
  tokenizer = new TokenPost();
  currentJustify = 'justified';

  public tiposDni: TipoDni[];
  public provincias: Provincia[];
  public estadosCasa: EstadoCasa[];
  public tiposContacto: TipoContacto[];
  public roles: Rol[];
  public localidades: string[];

  constructor(private router: ActivatedRoute,
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private loginService: LoginService,
    private utilidadesService: UtilidadesService) { }


  ngOnInit() {

      this.tokenizer.token = this.loginService.getTokenDeSession();
      this.router.params.subscribe( params => {
          this.id = params['dni'];
          this.evento = params['evento'];
          if (this.evento === 'view') { // si es view carga controles deshabilitados, si es edit, habilitados
            this.habilitarControles = false;
          } else {
            this.habilitarControles = true;
          }
      });
      this.cargarFormControls();
      this.obtenerUsuario();

  }
    get tipoDni() {    return this.usuarioForm.get('tipoDni');  }
    get dni() {    return this.usuarioForm.get('dni');   }
    get apellidos() {    return this.usuarioForm.get('apellidos');  }
    get nombres() {    return this.usuarioForm.get('nombres');  }
    get fechaNacimiento() {    return this.usuarioForm.get('fechaNacimiento');  }

    get pais() {    return this.usuarioForm.get('pais');  }
    get provincia() {    return this.usuarioForm.get('provincia');  }
    get localidad() {    return this.usuarioForm.get('localidad');  }
    get barrio() {    return this.usuarioForm.get('barrio');  }
    get calle() { return this.usuarioForm.get('calle');  }
    get numeroCasa() {return this.usuarioForm.get('numeroCasa');}
    get estadoCasa() {return this.usuarioForm.get('estadoCasa');}

    get persona() { return this.usuarioForm.get('persona'); }
    get nombreUsuario() { return this.usuarioForm.get('nombreUsuario'); }
    get clave() { return this.usuarioForm.get('clave'); }
    get claveReingreso() { return this.usuarioForm.get('claveReingreso'); }
    get rol() { return this.usuarioForm.get('rol'); }
    get contactos() { return this.usuarioForm.get('contactos'); }

    get codigoPais1() { return this.usuarioForm.get('codigoPais1'); }
    get codigoArea1() { return this.usuarioForm.get('codigoArea1'); }
    get numero1() { return this.usuarioForm.get('numero1'); }
    get codigoPais2() { return this.usuarioForm.get('codigoPais2'); }
    get codigoArea2() { return this.usuarioForm.get('codigoArea2'); }
    get numero2() { return this.usuarioForm.get('numero2'); }
    get email() { return this.usuarioForm.get('email'); }





  cargarFormControls() {
    this.usuarioForm = this.fb.group({
      // Clase usuario
      tipoDni: new FormControl(),
      dni: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      nombres: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),

      // Clase Domicilio:
      pais: new FormControl(),
      provincia: new FormControl(),
      localidad: new FormControl(),
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

    if (!this.habilitarControles) {
      this.tipoDni.disable();
      this.dni.disable();
      this.apellidos.disable();
      this.nombres.disable();
      this.fechaNacimiento.disable();

      this.pais.disable();
      this.provincia.disable();
      this.localidad.disable();
      this.barrio.disable();
      this.calle.disable();
      this.numeroCasa.disable();
      this.estadoCasa.disable();

      this.nombreUsuario.disable();
      this.clave.disable();
      this.claveReingreso.disable();
      this.rol.disable();

      this.codigoPais1.disable();
      this.codigoArea1.disable();
      this.numero1.disable();
      this.codigoPais2.disable();
      this.codigoArea2.disable();
      this.numero2.disable();
      this.email.disable();

    }
  }

  obtenerUsuario(){
    const parametros = ({
      token : this.tokenizer.token,
      dni : this.id
    });
    this.usuariosService.postSearchdUsuario(parametros).subscribe(response => {
      this.usuario = response['usuario'][0];
      this.cargarUsuarioAControles(this.usuario);
    });
  }


  cargarUsuarioAControles(usuario: any){
    // Persona
    this.tipoDni.setValue(usuario.persona.tipoDni.nombre, {onlySelf: true});
    this.dni.setValue(usuario.persona.dni);
    this.apellidos.setValue(usuario.persona.apellidos);
    this.nombres.setValue(usuario.persona.nombres);
    this.fechaNacimiento.setValue(this.utilidadesService.formateaDateAAAAMMDD(usuario.persona.fechaNacimiento));
    this.inicializarControlesUsandoGETServices(usuario);

    // Domicilio:
    this.pais.setValue(usuario.persona.domicilio.pais);
    // Provincias y Localidades se cargan en el metodo cargarUsuarioAControles, por ser anidada la consulta al WService

    this.barrio.setValue(usuario.persona.domicilio.barrio);
    this.calle.setValue(usuario.persona.domicilio.calle);
    this.numeroCasa.setValue(usuario.persona.domicilio.numeroCasa);
    this.estadoCasa.setValue(usuario.persona.domicilio.estadoCasa.nombre, {onlySelf: true});
    // this.usuarioForm.controls['estadoCasa'].setValue(usuario.persona.domicilio.estadoCasa.nombre, {onlySelf: true});
    // Usuario:
    this.nombreUsuario.setValue(usuario.nombreUsuario);
    this.clave.setValue('');
    this.rol.setValue(usuario.rol.nombre, {onlySelf: true});
    // Contactos:
    for (const contacto of usuario.contactos) {
        switch (contacto._id) {
          case '5b2bae57b44803001445c1d7': {
            this.codigoPais1.setValue(contacto.codigoPais);
            this.codigoArea1.setValue(contacto.codigoArea);
            this.numero1.setValue(contacto.numeroCelular);
            break;
          }
          case '5b2bae57b44803001445c1d9': {
            this.codigoPais2.setValue(contacto.codigoPais);
            this.codigoArea2.setValue(contacto.codigoArea);
            this.numero2.setValue(contacto.numeroCelular);
            break;
          }
          case '5b2bae57b44803001445c1db': {
            this.email.setValue(contacto.email);
            break;
          }
      }
    }
  }

  inicializarControlesUsandoGETServices(usuario: any) {
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
        this.provincia.setValue(usuario.persona.domicilio.provincia, {onlySelf: true});
        let prov =  this.provincias.find(x => x.provincia === this.usuarioForm.get('provincia').value);
        this.localidades = prov.localidad;
        this.localidad.setValue(usuario.persona.domicilio.localidad, {onlySelf: true});
      });

      this.usuariosService.postGetRoles(this.tokenizer).subscribe(response => {
        this.roles = response['rol'];
      });
  }
  onChange() {
    // console.log('Eligio la Provincia: ',this.usuarioForm.get('provincia').value);
    // console.log(this.provincias);
    let prov =  this.provincias.find(x => x.provincia === this.usuarioForm.get('provincia').value);
    // console.log(prov);
    this.localidades = prov.localidad;
    // console.log(this.localidades);
  }
  volver(): void {
    console.log('Volviendo...');
  }

  guardar(){

  }
  onFormSubmit() {

  }
  resetForm(){

  }
}
