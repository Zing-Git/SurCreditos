import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../modules/servicios/usuarios/usuarios.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {
  servicios: string;
  constructor(private usuariosService: UsuariosService) { }

  ngOnInit() {

  }



}
