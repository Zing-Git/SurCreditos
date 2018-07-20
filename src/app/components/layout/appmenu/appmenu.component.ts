import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../modules/servicios/login/login.service';

@Component({
  selector: 'app-appmenu',
  templateUrl: './appmenu.component.html',
  styleUrls: ['./appmenu.component.css']
})
export class AppmenuComponent implements OnInit, DoCheck {
  isLogged: boolean;

  ngDoCheck(): void {
    this.isLogged = this.loginService.verificaEstadoLogin();
  }

  constructor(private router: Router, private loginService: LoginService) {}

  ngOnInit() {
  }

  logout() {
    this.router.navigate(['login']);
    this.isLogged = this.loginService.logout();
  }
}
