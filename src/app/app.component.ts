import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginService } from './services/login/login.service';
import { CacheService } from './services/helpers/cache.service';
import { TypeService } from './services/helpers/type.service';
import { CadastroMaeService } from './services/formulario/cadastro-mae.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private login: LoginService,
    private cacheService: CacheService,
    private typeService: TypeService,
    private cadastroMae: CadastroMaeService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      
      this.cacheService.schedule()
      this.typeService.schedule()
      this.cadastroMae.agendar()

      this.splashScreen.hide()
    });
  }
}
