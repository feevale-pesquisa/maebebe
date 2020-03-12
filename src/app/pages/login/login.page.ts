import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginService } from 'src/app/services/login/login.service';
import { TypeService } from '../../services/helpers/type.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  public username = "paulo.kussler@gmail.com";
  public password = "123";

  constructor(
    private router: Router,
    private loginService: LoginService,
    public toast: ToastController,
    private typeService: TypeService
  ) { }

  ionViewWillEnter() {
    if(this.loginService.isAuthenticated()) {
      this.router.navigateByUrl("/inicio")
    }
  }

  async login() {
    try {

      await this.loginService.login(this.username, this.password)
      await this.router.navigateByUrl('inicio')
      await this.typeService.firstSincronize()

    } catch (error) {
      this.toast.create({ message: 'Ocorreu um erro no login.', duration: 2000 })
                .then((toast) => toast.present());
    }
  }
}
