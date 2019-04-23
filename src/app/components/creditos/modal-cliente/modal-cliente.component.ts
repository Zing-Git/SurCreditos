import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';
import { ClientesService } from '../../../modules/servicios/clientes/clientes.service';
import { UsuariosService } from "src/app/modules/servicios/usuarios/usuarios.service";
import { Session } from "src/app/modelo/util/session";
import { LoginService } from '../../../modules/servicios/login/login.service';
import { TableClientes } from "../../clientes/crud-clientes/TableClientes";
import * as moment from 'moment';
import { LocalDataSource } from "ng2-smart-table";

@Component({
  selector: "app-modal-cliente",
  templateUrl: "./modal-cliente.component.html",
  styleUrls: ["./modal-cliente.component.css"]
})
export class ModalClienteComponent implements OnInit {
  @Output() pasameCliente = new EventEmitter();

  clienteElegido: any;
  clientes: any;
  session: any;
  charactersUnNivel: any[];
  source: LocalDataSource;

  settings = {

    actions: {
      columnTitle: 'Accion',
      add: false,
      delete: false,
      edit: false,
      imprimirPDF: false,
      position: 'right',
      custom: [
        {
          name: 'elegir',
          title: 'Elegir'
        }
      ],
    },


columns: {
     /*  fechaAlta: {
        title: 'Alta',
        width: '15%',
        filter: true,
        sort: true,
        valuePrepareFunction: (cell, row) => { return moment(row.fechaAlta).format('DD-MM-YYYY') }
      }, */
      dni: {
        title: 'Dni',
        width: '10%',
        filter: false,
        sort: true,
      },
      nombreCompleto: {
        title: 'Cliente',
        width: '30%',
        filter: false,
        sort: true,
      },
      localidad: {
        title: 'Localidad',
        width: '30%',
        filter: false,
        sort: true,
      },
   /*    barrio: {
        title: 'Barrio',
        width: '15%',
        filter: true,
        sort: true,
      }, */
 /*      calle: {
        title: 'Calle',
        width: '15%',
        filter: true,
        sort: true,
      },
      numeroCasa: {
        title: 'Numero',
        width: '5%',
        filter: true,
        sort: true,
      } */
    },
    pager: {
      display: true,
      perPage: 5
    },
  };
  // tslint:disable-next-line:max-line-length
  constructor(public ngxSmartModalService: NgxSmartModalService, public clientesService: ClientesService, private loginService: LoginService) {}

  ngOnInit() {


    this.verClientes();
  }

  // COMUNICACION CON EL COMPONENTE PADRE FormCreditoComponent
  // --------------------------------------------------------------
  recibePametros() {
    this.clienteElegido = '2000';
    console.log('El modal hizo: ', this.clienteElegido);

  }

  seleccionar() {
    console.log('Click Elegir Cliente...');

    this.verClientes();



  }

  verClientes() {
    this.session = new Session();
    this.session.token = this.loginService.getTokenDeSession();

    this.clientesService.postGetClientes(this.session).subscribe((response: TableClientes[]) => {
      this.clientes = response['clientes'];
      this.cargarTabla(this.clientes);
    });
  }

  onSearch(query: string = '') {

    if (query === '') {
      this.source = new LocalDataSource(this.charactersUnNivel);
    } else {
        this.source.setFilter([
          // fields we want to include in the search
          {
            field: 'dni',
            search: query
          },
          {
            field: 'nombreCompleto',
            search: query
          },
          {
            field: 'localidad',
            search: query
          },

        ], false);
    }
  }


  cargarTabla(resClientes: any[]){
    this.charactersUnNivel = [];
    resClientes.forEach(element => {
          let fila = {
            id: element._id,
            dni: element.titular.dni,
            nombreCompleto: element.titular.apellidos + ', ' + element.titular.nombres,
            fechaAlta: element.titular.fechaAlta,
            localidad: element.titular.domicilio.localidad,
            calle: element.titular.domicilio.calle,
            numeroCasa: element.titular.domicilio.numeroCasa,
            barrio: element.titular.domicilio.barrio,
            fechaNacimiento: element.titular.fechaNacimiento,
            estado: element.estado,
            tel1: element.contactos[0].codigoPais + element.contactos[0].codigoArea + element.contactos[0].numeroCelular,
            tel2: element.contactos[1].codigoPais + element.contactos[1].codigoArea + element.contactos[1].numeroCelular,
            mail: element.contactos[2].email
          };
          this.charactersUnNivel.push(fila);

          this.onSearch('');
    });
  }


  onCustom(event){
    const dni = (`${event.data.dni}`);
    // let clienteElegido = this.charactersUnNivel.filter( cliente => cliente.dni === dni);
    // console.log(clienteElegido);
    // this.pasameCliente.emit({cliente: this.clienteElegido});
    this.pasameCliente.emit({cliente: dni});
    this.ngxSmartModalService.close('clienteModalPorFiltro');
  }
}
