import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { Session } from '../../../modelo/util/session';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { UtilidadesService } from '../../../modules/servicios/utiles/utilidades.service';


@Component({
  selector: 'app-form-credito',
  templateUrl: './form-credito.component.html'
})
export class FormCreditoComponent implements OnInit {
  session: Session;
  creditoForm: FormGroup;
  currentJustify = 'justified';


  documentaciones = [
    { id: 100, name: 'DNI Titular' },
    { id: 200, name: 'Impuesto 1' },
    { id: 300, name: 'Impuesto 2' },
    { id: 400, name: 'Otra' }
  ];


  constructor(
      private fb: FormBuilder,
      private clientesService: ClientesService,
      private loginService: LoginService,
      private utilidadesService: UtilidadesService) { }

  ngOnInit() {

    // Create a new array with a form control for each order
    const controls = this.documentaciones.map(c => new FormControl(false));
    controls[0].setValue(true); // Set the first checkbox to true (checked)


    this.creditoForm = this.fb.group({
      dni: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      nombres: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),

      // array de checkbox dinamico
      documentaciones: new FormArray(controls),

      //
      comentarioTitular: new FormControl('', [Validators.required]),

    });








  }
  get dni() {    return this.creditoForm.get('dni');  }
  get apellidos() {    return this.creditoForm.get('apellidos');  }
  get nombres() {    return this.creditoForm.get('nombres');  }
  get fechaNacimiento() {    return this.creditoForm.get('fechaNacimiento');  }

  onFormSubmit() {
    // toma los valores de los checkbox cargados dinamicamente:
    const selectedOrderIds = this.creditoForm.value.documentaciones
      .map((v, i) => v ? this.documentaciones[i].id : null)
      .filter(v => v !== null);

      console.log(selectedOrderIds);


  }

  verClientes() {
    this.session  = new Session();
    this.session.token =  this.loginService.getTokenDeSession();
    this.clientesService.postGetClientes(this.session).subscribe( response => {
        let clientes = response['clientes'];
        console.log(clientes);
    });
  }
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

  getCombos() {
    this.session  = new Session();
    this.session.token =  this.loginService.getTokenDeSession();

    this.clientesService.postGetCombos().subscribe( response => {
        let combos = response['respuesta'];
        console.log(combos);
    });
  }

  buscarComercioPorCuit() {

  }

  buscarGarantePorDni() {

  }

}
