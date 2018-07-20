import { Component, OnInit, DoCheck } from '@angular/core';
import { AppmenuComponent } from '../appmenu/appmenu.component';
import { LoginService } from '../../../modules/servicios/login/login.service';

@Component({
  selector: 'app-appheader',
  templateUrl: './appheader.component.html',
  styleUrls: ['./appheader.component.css']
})
export class AppheaderComponent implements OnInit, DoCheck{
  isLogged: boolean;

  constructor(private loginService: LoginService) { }

  ngDoCheck(): void {
    this.isLogged = this.loginService.verificaEstadoLogin();
  }
  ngOnInit() {
  }

}
