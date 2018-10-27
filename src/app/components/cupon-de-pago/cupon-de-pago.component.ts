import { Component, OnInit} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators
} from "@angular/forms";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { ClientesService } from "../../modules/servicios/clientes/clientes.service";
import { OrdenPagoService } from "../../modules/servicios/ordenPago/orden-pago.service";
import "jspdf-autotable";
import { LoginService } from "../../modules/servicios/login/login.service";
import { DatePipe } from "@angular/common";
import { Session } from "../../modelo/util/session";
import { UsuariosService } from "../../modules/servicios/usuarios/usuarios.service";
import { TableUsuarios } from "../usuarios/crud-usuarios/TableUsuarios";
import { TokenPost } from "../../modelo/util/token";
import { LocalDataSource } from "ng2-smart-table";
import { ElegirCuotasComponent } from "./elegir-cuotas/elegir-cuotas.component";
declare let jsPDF;

@Component({
  selector: "app-cupon-de-pago",
  templateUrl: "./cupon-de-pago.component.html"
})
export class CuponDePagoComponent implements OnInit {


  cobradorForm: FormGroup;
  characters = [];
  session = new Session();
  tokenizer = new TokenPost();
  source: LocalDataSource;
  data = [];

  settings = {
    actions: {
      columnTitle: "Accion",
      add: false,
      delete: false,
      edit: false,
      position: "right",
      custom: [
        {
          name: "seleccionar",
          title: "Seleccionar"
        }
      ]
    },
    columns: {
      dni: {
        title: "Dni",
        width: "25%",
        filter: false
      },
      apellidos: {
        title: "Apellido",
        width: "25%",
        filter: false
      },
      nombres: {
        title: "Nombres",
        width: "25%",
        filter: false
      },
      nombreUsuario: {
        title: "Usuario",
        width: "25%",
        filter: false
      }
    },
    pager: {
      display: true,
      perPage: 5
    }
  };

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private usuariosService: UsuariosService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    this.session.token = this.loginService.getTokenDeSession();
    this.tokenizer.token = this.loginService.getTokenDeSession();

    this.cobradorForm = this.fb.group({
      cobrador: new FormControl("", [Validators.required])
    });

    this.cargarCobradores();


  }

  get cobrador() {
    return this.cobradorForm.get("cobrador");
  }

  cargarCobradores() {
    let valor = this.cobrador.value;

    this.usuariosService
      .postGetAllUsuarios(this.tokenizer)
      .subscribe((response: TableUsuarios[]) => {
        this.data = response['respuesta'];
        // console.log(this.data);
        this.source = new LocalDataSource(this.data);
      });
  }

  onSearch(query: string = '') {
    if (query === '') {
      // this.cargarCobradores();
      this.source = new LocalDataSource(this.data);

    } else {
      this.source.setFilter([
        // fields we want to include in the search
        {
          field: 'dni',
          search: query
        },
        {
          field: 'apellidos',
          search: query
        },
        {
          field: 'nombres',
          search: query
        },
        {
          field: 'nombreUsuario',
          search: query
        }
      ], false);
    }
  }

  onCustom(event) {
    // alert(`Custom event '${event.action}' fired on row №: ${event.data.dni}`);
    let evento = (`${event.action}`);
    let dni = (`${event.data.dni}`);
    let apellido = (`${event.data.apellidos}`);
    let idCobrador = (`${event.data._id}`);

    // console.log('INGRESO AL SELECCIONAR: ' + apellido + dni + 'ID: ' + idCobrador);

    switch (evento) {
      case 'seleccionar': {
        this.router.navigate(['seleccionclientecobro', evento, dni, apellido, idCobrador]);
        break;
      }


    }
  }






}
