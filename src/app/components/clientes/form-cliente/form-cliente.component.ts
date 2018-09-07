import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { UtilidadesService } from '../../../modules/servicios/utiles/utilidades.service';
import { Session } from '../../../modelo/util/session';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { UsuariosService } from '../../../modules/servicios/usuarios/usuarios.service';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
})
export class FormClienteComponent implements OnInit {
  // Usamos el decorador Output para pasar datos al componente PADRE FormCreditoComponent
  @Output() pasameDatosDelCliente = new EventEmitter();

  session: Session;
  clienteForm: FormGroup;
  currentJustify = 'justified';
  provincias: any[];
  localidades: any[];
  estadosCasa: any[];
  idPersona = '0';
  idDomicilio =  '0';


  // element: HTMLElement;

  constructor(private fb: FormBuilder,
    private clientesService: ClientesService,
    private loginService: LoginService,
    private utilidadesService: UtilidadesService,
    private usuariosService: UsuariosService,
    public ngxSmartModalService: NgxSmartModalService,
    /* private usuariosService */
    ) { }




  ngOnInit() {
    this.session = new Session();
    this.session.token = this.loginService.getTokenDeSession();

    // let element: HTMLElement = document.getElementsByClassName('btnTab1')[0] as HTMLElement;
    // element.click();


    this.clienteForm = this.fb.group({
      dni: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      nombres: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),

      /* cuit: new FormControl('', [Validators.required]),
      razonSocial: new FormControl('', [Validators.required]),
      rubro: new FormControl('', [Validators.required]),
      fechaActividad:  new FormControl('', [Validators.required]), */

      provincia: new FormControl('', [Validators.required]),
      localidad: new FormControl('', [Validators.required]),
      barrio: new FormControl('', [Validators.required]),
      calle: new FormControl('', [Validators.required]),
      numeroCasa: new FormControl('', [Validators.required]),
      estadoCasa: new FormControl('', [Validators.required]),

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
  get dni() { return this.clienteForm.get('dni'); }

  get tipoDni() { return this.clienteForm.get('tipoDni'); }
  get pais() { return this.clienteForm.get('pais'); }

  get apellidos() { return this.clienteForm.get('apellidos'); }
  get nombres() { return this.clienteForm.get('nombres'); }
  get fechaNacimiento() { return this.clienteForm.get('fechaNacimiento'); }

  /*   get cuit() {    return this.clienteForm.get('cuit');  }
    get razonSocial() {    return this.clienteForm.get('razonSocial');  }
    get rubro() {    return this.clienteForm.get('rubro');  }
    get fechaActividad() {    return this.clienteForm.get('fechaActividad');  } */

  get provincia() { return this.clienteForm.get('provincia'); }
  get localidad() { return this.clienteForm.get('localidad'); }
  get barrio() { return this.clienteForm.get('barrio'); }
  get calle() { return this.clienteForm.get('calle'); }
  get numeroCasa() { return this.clienteForm.get('numeroCasa'); }
  get estadoCasa() { return this.clienteForm.get('estadoCasa'); }

  get codigoPais1() { return this.clienteForm.get('codigoPais1'); }
  get codigoArea1() { return this.clienteForm.get('codigoArea1'); }
  get numero1() { return this.clienteForm.get('numero1'); }
  get codigoPais2() { return this.clienteForm.get('codigoPais2'); }
  get codigoArea2() { return this.clienteForm.get('codigoArea2'); }
  get numero2() { return this.clienteForm.get('numero2'); }
  get email() { return this.clienteForm.get('email'); }

/*   buscarClientePorDni() {
    let dni = this.dni.value;
    this.session = new Session();
    this.session.token = this.loginService.getTokenDeSession();
    this.clientesService.postGetClientePorDni(this.session, dni).subscribe(response => {
      let cliente = response['clientes'];
      console.log(cliente[0]);
      this.cargarClienteForm(cliente[0]);
    });
  } */
  cargarClienteForm(cliente: any) {
    this.apellidos.setValue(cliente.titular.apellidos);
    this.nombres.setValue(cliente.titular.nombres);
    this.fechaNacimiento.setValue(this.utilidadesService.formateaDateAAAAMMDD(cliente.titular.fechaNacimiento));

  }
  cargarControlesCombos() {

    this.clientesService.postGetCombos().subscribe(result => {
      this.provincias = result['respuesta'].provincias;
      this.estadosCasa = result['respuesta'].estadosCasa;
    });

  }


  capturarValoresDeFormulario(): any {

    /* this.codigoPais1.value,
    this.codigoArea1.value,
    String(this.numero1.value) },
    this.codigoPais2.value,
    this.codigoArea2.value,
    String(this.numero2.value) },
    this.email.value}], */


    let cliente = {
      persona: {
          _id: this.idPersona,
          tipoDni: 	'DNI',
          dni: String(this.dni.value),
          apellidos: this.apellidos.value,
          nombres: this.nombres.value,
          fechaNacimiento: this.utilidadesService.formateaDateAAAAMMDD(this.fechaNacimiento.value)
      },
      domicilio: {
          _id: this.idDomicilio,
          pais: 'Argentina',
          provincia: this.provincia.value,
          localidad: this.localidad.value,
          barrio: this.barrio.value,
          calle: this.calle.value,
          numeroCasa: this.numeroCasa.value,
          estadoCasa: {
            _id: this.estadoCasa.value
          }
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
      cliente: {
        tipoCliente: '5b2dd87359597a2d9d3065fb',
      },
      token: this.session.token,
     };
     return cliente;
  }


  onChange() {
    let prov = this.provincias.find(x => x.provincia === this.clienteForm.get('provincia').value);
    this.localidades = prov.localidad;
  }

  onFormSubmit() {
    /* console.log(this.clienteForm.value);
    console.log(this.capturarValoresDeFormulario()); */
    this.ngxSmartModalService.close('clienteModal');

  }
 // COMUNICACION CON EL COMPONENTE PADRE FormCreditoComponent
 // --------------------------------------------------------------
  recibePametros(personaC: any, tipoDeAlta: string) {


    // t.select('tab-selectbyid2')
    this.clienteForm.reset();

    // En caso de que la persona existe pero no el cliente
    if (tipoDeAlta === 'ExistePersona') {
      // console.log('LLego de formulario padre: ', personaC);
      this.idPersona = personaC._id;
      this.dni.setValue(personaC.dni);
      this.apellidos.setValue(personaC.apellidos);
      this.nombres.setValue(personaC.nombres);
      if (personaC.fechaNacimiento !== null) {
        this.fechaNacimiento.setValue(this.utilidadesService.formateaDateAAAAMMDD(personaC.fechaNacimiento));
      }
      this.provincia.setValue(personaC.domicilio.provincia, {onlySelf: true});
      let prov =  this.provincias.find(x => x.provincia === this.provincia.value);
      this.localidades = prov.localidad;
      this.localidad.setValue(personaC.domicilio.localidad, {onlySelf: true});
      this.barrio.setValue(personaC.domicilio.barrio);
      this.calle.setValue(personaC.domicilio.calle);
      this.numeroCasa.setValue(personaC.domicilio.numeroCasa);
      this.estadoCasa.setValue(personaC.domicilio.estadoCasa.nombre, {onlySelf: true});
    } else {
      if (tipoDeAlta === 'NoExistePersona') {
        this.idPersona = '0';
        this.idDomicilio = '0';
        this.dni.setValue(personaC.dni);
      }
    }
  }



  guardar() {
    let clienteC = this.capturarValoresDeFormulario();
    this.clientesService.postGuardarCliente(clienteC).subscribe( result => {
        let cliente = result['clienteDB'];
        alert('Se guardo correctamente...');
        // this.pasameDatosDelCliente.emit({cliente: cliente});
        this.pasameDatosDelCliente.emit({cliente: clienteC, result: cliente});
        this.ngxSmartModalService.close('clienteModal');
    }, err => {
         alert('Hubo un problema al guardar los datos!');
    });
  }

}
