import { Component, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud-usuarios',
  templateUrl: './crud-usuarios.component.html',
  styleUrls: ['./crud-usuarios.component.css']
})
export class CrudUsuariosComponent implements OnInit {
  message = '';
  dtOptions: DataTables.Settings = {};



  constructor(private renderer: Renderer, private router: Router) {}

  someClickHandler(info: any): void {
    this.message = info.id + ' - ' + info.firstName;
  }


  ngOnInit(): void {
    this.dtOptions = {
      ajax: 'https://angular-datatables-demo-server.herokuapp.com/',
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
        }],
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
