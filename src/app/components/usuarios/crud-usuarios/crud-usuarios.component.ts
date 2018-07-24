import { Component, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from '../../../modules/servicios/usuarios/usuarios.service';
import { TokenPost } from '../../../modelo/util/token';
import { LoginService } from '../../../modules/servicios/login/login.service';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-crud-usuarios',
  templateUrl: './crud-usuarios.component.html',
  styleUrls: ['./crud-usuarios.component.css']
})
export class CrudUsuariosComponent implements OnInit {
  message = '';
  dtOptions: DataTables.Settings = {};

  // tslint:disable-next-line:max-line-length
  constructor(
    private renderer: Renderer,
    private router: Router,
    private usuariosService: UsuariosService,
    private loginService: LoginService
  ) {}

  someClickHandler(info: any): void {
    this.message = info.id + ' - ' + info.firstName;
  }

  ngOnInit() {
    let tokenizer = new TokenPost();
    tokenizer.token = this.loginService.getTokenDeSession();
    this.cargarDataTable();


     /* this.usuariosService.postGetAllUsuarios(tokenizer).subscribe(response => {
      this.cargarTabla(response);
    }); */

  }


  cargarDataTable() {
    this.dtOptions = {
      ajax: 'https://angular-datatables-demo-server.herokuapp.com/',
      // ajax: this.usuariosService.urlGetUsuarios,
      columns: [
        {
          title: 'ID',
          data: 'id'
        },
        {
          title: 'name',
          data: 'firstName'
        },
        {
          title: 'Last name',
          data: 'lastName'
        }
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          self.someClickHandler(data);
        });
        return row;
      }
    };

  }



}
