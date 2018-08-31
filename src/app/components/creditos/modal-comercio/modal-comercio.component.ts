import { Component, OnInit, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { UtilidadesService } from '../../../modules/servicios/utiles/utilidades.service';
import { Session } from '../../../modelo/util/session';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { UsuariosService } from '../../../modules/servicios/usuarios/usuarios.service';

@Component({
  selector: 'app-modal-comercio',
  templateUrl: './modal-comercio.component.html'
})
export class ModalComercioComponent implements OnInit {
// Usamos el decorador Output para pasar datos al componente PADRE FormCreditoComponent
@Output() pasameDatosDelComercio = new EventEmitter();

session: Session;
comercioForm: FormGroup;
currentJustify = 'justified';
provincias: any[];
localidades: any[];
estadosCasa: any[];
actividades: any[];
idCliente = '0';
idDomicilio =  '0';

constructor(private fb: FormBuilder,
  private clientesService: ClientesService,
  private loginService: LoginService,
  private utilidadesService: UtilidadesService,
  private usuariosService: UsuariosService,
  public ngxSmartModalService: NgxSmartModalService
  ) { }

  ngOnInit() {
    this.session = new Session();
    this.session.token = this.loginService.getTokenDeSession();

    this.comercioForm = this.fb.group({
      cuit: new FormControl('', [Validators.required]),
      razonSocial: new FormControl('', [Validators.required]),
      actividad: new FormControl(''),
      provincia: new FormControl(),
      localidad: new FormControl(),
      barrio: new FormControl('', [Validators.required]),
      calle: new FormControl('', [Validators.required]),
      numeroCasa: new FormControl('', [Validators.required]),
      estadoCasa: new FormControl(),
    });

    this.cargarControlesCombos();
  }

  get cuit() {    return this.comercioForm.get('cuit');  }
  get razonSocial() {    return this.comercioForm.get('razonSocial');  }
  get actividad() {    return this.comercioForm.get('actividad');  }
  get provincia() { return this.comercioForm.get('provincia'); }
  get localidad() { return this.comercioForm.get('localidad'); }
  get barrio() { return this.comercioForm.get('barrio'); }
  get calle() { return this.comercioForm.get('calle'); }
  get numeroCasa() { return this.comercioForm.get('numeroCasa'); }
  get estadoCasa() { return this.comercioForm.get('estadoCasa'); }



  cargarcomercioForm(cliente: any) {
    /* this.apellidos.setValue(cliente.titular.apellidos);
    this.nombres.setValue(cliente.titular.nombres);
    this.fechaNacimiento.setValue(this.utilidadesService.formateaDateAAAAMMDD(cliente.titular.fechaNacimiento)); */

  }
  cargarControlesCombos() {

    this.clientesService.postGetCombos().subscribe(result => {
      this.provincias = result['respuesta'].provincias;
      this.estadosCasa = result['respuesta'].estadosCasa;
      this.actividades = result['respuesta'].rubrosComerciales;
    });

  }


  capturarValoresDeFormulario(): any {
        let actividadElegida = this.actividades.filter(activ => activ.DESC_ACTIVIDAD_F883 === this.actividad.value);
        let comercio = {
            token: this.session.token,
            comercio: {
                _id: '0',
                cuit: this.cuit.value,
                razonSocial: this.razonSocial.value,
                codigoActividad: actividadElegida[0].COD_ACTIVIDAD_F883,
		            descripcionActividad: this.actividad.value,
                domicilio: {
                        _id: '0',
                        pais: 'Argentina',
                        provincia: this.provincia.value,
                        localidad: this.localidad.value,
                        barrio: this.barrio.value,
                        calle: this.calle.value,
                        numeroCasa: this.numeroCasa.value,
                        estadoCasa: {
                            id: this.estadoCasa.value
                        }
                }
            },
            idCliente: this.idCliente
      };
      return comercio;
  }


  onChange() {
    let prov = this.provincias.find(x => x.provincia === this.comercioForm.get('provincia').value);
    this.localidades = prov.localidad;
  }

  onFormSubmit() {
    this.ngxSmartModalService.close('comercioModal');
  }


 // COMUNICACION CON EL COMPONENTE PADRE FormCreditoComponent
 // --------------------------------------------------------------
  recibePametros(comercioC: any, tipoDeAlta: string) {
    this.comercioForm.reset();
    // En caso de que la persona existe pero no el cliente
    if (tipoDeAlta === 'NoExisteComercio') {
      // console.log('LLego de formulario padre: ', personaC);
      this.idCliente = comercioC._id;
      this.cuit.setValue(comercioC.cuit);
    }
  }



  guardar(event) {
    let comercioC = this.capturarValoresDeFormulario();
    // console.log('A guardar: ', JSON.stringify(comercioC));

    this.clientesService.postGuardarComercio(comercioC).subscribe( result => {
      if (result) {
        this.clientesService.postGetComercioPorCuit(this.session, this.cuit.value).subscribe ( res => {
          let comercioEncontrado = res['comercio'][0];
          // console.log('Comercio Guardado y Encontrado: ', comercioEncontrado);
          this.pasameDatosDelComercio.emit({comercio: comercioEncontrado});
          alert('El Comercio se guardo con éxito');
        });
      }
    }, err => {
      alert('Hubo un problema al Guardar el Comercio');
    });
  }
}
