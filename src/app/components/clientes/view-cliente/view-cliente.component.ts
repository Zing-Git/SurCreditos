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
  selector: 'app-view-cliente',
  templateUrl: './view-cliente.component.html'
})
export class ViewClienteComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private clientesService: ClientesService,
    private loginService: LoginService,
    private utilidadesService: UtilidadesService,
    private usuariosService: UsuariosService,
    public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {

  }

}
