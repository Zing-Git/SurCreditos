import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { UtilidadesService } from '../../../modules/servicios/utiles/utilidades.service';
import { Session } from '../../../modelo/util/session';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
})
export class FormClienteComponent implements OnInit {
  session: Session;
  clienteForm: FormGroup;
  currentJustify = 'justified';
  provincias: any[];
  localidades: any[];
  estadosCasa: any[];

  constructor(private fb: FormBuilder,
    private clientesService: ClientesService,
    private loginService: LoginService,
    private utilidadesService: UtilidadesService) { }

  ngOnInit() {
    this.clienteForm = this.fb.group({
      dni: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      nombres: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),

      /* cuit: new FormControl('', [Validators.required]),
      razonSocial: new FormControl('', [Validators.required]),
      rubro: new FormControl('', [Validators.required]),
      fechaActividad:  new FormControl('', [Validators.required]), */

      provincia: new FormControl(),
      localidad: new FormControl(),
      barrio: new FormControl('', [Validators.required]),
      calle: new FormControl('', [Validators.required]),
      numeroCasa: new FormControl('', [Validators.required]),
      estadoCasa: new FormControl(),
      piso: new FormControl(),
      departamento: new FormControl(),

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

    this.cargarControlesCombos();


  }
  get dni() {    return this.clienteForm.get('dni');  }
  get apellidos() {    return this.clienteForm.get('apellidos');  }
  get nombres() {    return this.clienteForm.get('nombres');  }
  get fechaNacimiento() {    return this.clienteForm.get('fechaNacimiento');  }

/*   get cuit() {    return this.clienteForm.get('cuit');  }
  get razonSocial() {    return this.clienteForm.get('razonSocial');  }
  get rubro() {    return this.clienteForm.get('rubro');  }
  get fechaActividad() {    return this.clienteForm.get('fechaActividad');  } */

  get provincia() {    return this.clienteForm.get('provincia');  }
  get localidad() {    return this.clienteForm.get('localidad');  }
  get barrio() {    return this.clienteForm.get('barrio');  }
  get calle() { return this.clienteForm.get('calle');  }
  get numeroCasa() {return this.clienteForm.get('numeroCasa'); }
  get estadoCasa() {return this.clienteForm.get('estadoCasa'); }
  get piso() {return this.clienteForm.get('piso'); }
  get departamento() {return this.clienteForm.get('departamento'); }

  get codigoPais1() { return this.clienteForm.get('codigoPais1'); }
  get codigoArea1() { return this.clienteForm.get('codigoArea1'); }
  get numero1() { return this.clienteForm.get('numero1'); }
  get codigoPais2() { return this.clienteForm.get('codigoPais2'); }
  get codigoArea2() { return this.clienteForm.get('codigoArea2'); }
  get numero2() { return this.clienteForm.get('numero2'); }
  get email() { return this.clienteForm.get('email'); }

  buscarClientePorDni() {
    let dni = this.dni.value;
    this.session  = new Session();
    this.session.token =  this.loginService.getTokenDeSession();
    this.clientesService.postGetClientePorDni(this.session, dni).subscribe( response => {
        let cliente = response['clientes'];
        console.log(cliente[0]);
        this.cargarClienteForm(cliente[0]);
    });
  }
  cargarClienteForm(cliente: any) {
    this.apellidos.setValue(cliente.titular.apellidos);
    this.nombres.setValue(cliente.titular.nombres);
    this.fechaNacimiento.setValue(this.utilidadesService.formateaDateAAAAMMDD(cliente.titular.fechaNacimiento));

  }
  cargarControlesCombos() {

    this.clientesService.postGetCombos().subscribe( result => {
      this.provincias = result['respuesta'].provincias;
      this.estadosCasa =  result['respuesta'].estadosCasa;
    });

  }
  capturarValoresDeFormulario(): any {

    let cliente = {
      persona: {
          _id: '0',
          tipoDni: this.tipoDni.value,
          dni: String(this.dni.value),
          apellidos: this.apellidos.value,
          nombres: this.nombres.value,
          fechaNacimiento: this.fechaNacimiento.value
      },
      domicilio: {
          pais: this.pais.value,
          provincia: this.provincia.value,
          localidad: this.localidad.value,
          barrio: this.barrio.value,
          calle: this.calle.value,
          numeroCasa: this.numeroCasa.value,
          estadoCasa: this.estadoCasa.value
      },
      contactos: [
            {tipoContacto: '5b10071f42fb563dffcf6b8c',
                codigoPais: this.codigoPais1.value,
                codigoArea: this.codigoArea1.value,
                numeroCelular: String(this.numero1.value) },
            {tipoContacto: '5b10071f42fb563dffcf6b8d',
                codigoPais: this.codigoPais2.value,
                codigoArea: this.codigoArea2.value,
                numeroCelular: String(this.numero2.value) },
            {tipoContacto: '5b10071f42fb563dffcf6b8e',
                email: this.email.value}],
      usuario: {
        nombreUsuario: this.nombreUsuario.value ,
        clave: this.clave.value,
        rol: this.rol.value
      },
      token: this.tokenizer.token
     };
     return usuario;
  }


  onChange() {
    let prov =  this.provincias.find(x => x.provincia === this.clienteForm.get('provincia').value);
    this.localidades = prov.localidad;
  }

  onFormSubmit() {
    console.log(this.clienteForm.value);

  }
}
