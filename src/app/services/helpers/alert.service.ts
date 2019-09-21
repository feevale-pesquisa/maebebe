import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  async ok(message: string, header: string = 'Mensagem') {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();

    return alert;
  }

  async confirm(message: string, yes, no, header: string = 'Mensagem') {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          handler: no
        },
        {
          text: 'Sim',
          handler: yes
        }
      ]
    });

    await alert.present();

    return alert;
  }

}
