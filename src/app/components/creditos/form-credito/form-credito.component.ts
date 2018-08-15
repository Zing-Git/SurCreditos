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
  tiposPlanes: any[];
  planes: any[];
  referenciaComercios = [];
  referenciaTitulares = [];



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
    this.session = new Session();
    this.session.token = this.loginService.getTokenDeSession();
    this.cargarControlesForm();


    // Create a new array with a form control for each order
    const controls = this.documentaciones.map(c => new FormControl(false));
    controls[0].setValue(true); // Set the first checkbox to true (checked)


    this.creditoForm = this.fb.group({
      dni: new FormControl('', [Validators.required]),
      apellidos: new FormControl('', [Validators.required]),
      nombres: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),

      montoSolicitado: new FormControl('', [Validators.required]),
      tipoDePlan: new FormControl('', [Validators.required]),
      plan: new FormControl('', [Validators.required]),
      cobroDomicilio: new FormControl(''),

      dniGarante: new FormControl('', [Validators.required]),
      apellidosGarante: new FormControl('', [Validators.required]),
      nombresGarante: new FormControl('', [Validators.required]),
      fechaNacimientoGarante: new FormControl('', [Validators.required]),
      cuit: new FormControl(''),
      razonSocial: new FormControl(''),

      // array de checkbox dinamico
      documentaciones: new FormArray(controls),
      numeroLegajo:  new FormControl('', [Validators.required]),
      tipoReferenciaTitular: new FormControl('', [Validators.required]),
      itemsReferenciasTitular: new FormArray(controls),
      notaComentarioTitular: new FormControl('', [Validators.required]),

      tipoReferenciaGarante: new FormControl('', [Validators.required]),
      itemsReferenciasGarante: new FormArray(controls),
      notaComentarioGarante: new FormControl(''),

    });
  }
  get dni() {    return this.creditoForm.get('dni');  }
  get apellidos() {    return this.creditoForm.get('apellidos');  }
  get nombres() {    return this.creditoForm.get('nombres');  }
  get fechaNacimiento() {    return this.creditoForm.get('fechaNacimiento');  }
  get montoSolicitado() {    return this.creditoForm.get('montoSolicitado');  }
  get tipoDePlan() {    return this.creditoForm.get('tipoDePlan');  }
  get plan() {    return this.creditoForm.get('plan');  }
  get cobroDomicilio() {    return this.creditoForm.get('cobroDomicilio');  }
  get dniGarante() {    return this.creditoForm.get('dniGarante');  }
  get apellidosGarante() {    return this.creditoForm.get('apellidosGarante');  }
  get nombresGarante() {    return this.creditoForm.get('nombresGarante');  }
  get fechaNacimientoGarante() {    return this.creditoForm.get('fechaNacimientoGarante');  }
  get cuit() {    return this.creditoForm.get('cuit');  }
  get razonSocial() {    return this.creditoForm.get('razonSocial');  }


  /* get documentacion() {    return this.creditoForm.get('documentacion');  } */
  get numeroLegajo() {    return this.creditoForm.get('numeroLegajo');  }
  get tipoReferenciaTitular() {    return this.creditoForm.get('tipoReferenciaTitular');  }
  get itemsReferenciasTitular() {    return this.creditoForm.get('itemsReferenciasTitular');  }
  get notaComentarioTitular() {    return this.creditoForm.get('notaComentarioTitular');  }
  get tipoReferenciaGarante() {    return this.creditoForm.get('tipoReferenciaGarante');  }
  get itemsReferenciasGarante() {    return this.creditoForm.get('itemsReferenciasGarante');  }
  get notaComentarioGarante() {    return this.creditoForm.get('notaComentarioGarante');  }







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


  cargarControlesForm() {
    this.clientesService.postGetCombos().subscribe( response => {
      let combos = response['respuesta'];
     /*  console.log(combos); */
      this.tiposPlanes = response['respuesta'].tiposPlanes;
      let referencias = response['respuesta'].itemsReferencia;
      for (let ref of referencias) {
        if (ref.referenciaCliente) {
          this.referenciaTitulares.push(ref);
        } else {
          this.referenciaComercios.push(ref);
        }
      }
      /* console.log('Titulares: ', this.referenciaTitulares);
      console.log('Comercios: ', this.referenciaComercios); */
      


    });




  }
  onChangePlanes() {
    let planes =  this.tiposPlanes.find(x => x.nombre === this.creditoForm.get('tipoDePlan').value);
    /* console.log('Tipo de planes: ', this.tiposPlanes);
    console.log('En el form: ', this.creditoForm.get('tipoDePlan').value);
    console.log('Planes: ', planes.plan); */
    this.planes = planes.plan;
  }

  buscarComercioPorCuit() {

  }

  buscarGarantePorDni() {

  }

}
