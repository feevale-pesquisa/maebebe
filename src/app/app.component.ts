import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginService } from './services/login/login.service';
import { GerenciadorTiposService } from './services/formulario/gerenciador-tipos.service';
import { CacheService } from './services/helpers/cache.service';

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
    private gerenciadorTipos: GerenciadorTiposService,
    private cacheService: CacheService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      
      this.gerenciadorTipos.sincronizar()
      
      this.cacheService.schedule()

      this.splashScreen.hide()
    });
  }
}
