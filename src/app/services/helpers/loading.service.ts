
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService { //This class is basically a wrapper of angular LoadingController

  private loader;
  private isLoading : boolean = false;

  private isCreatingLoader : boolean = false;
  private loadingPromisse;

  constructor(private loadingController: LoadingController) {

  }

  start(message: string = "Aguarde...") {
    if(this.isLoading) return; //Prevent two loaders at the same time

    this.isCreatingLoader = true;

    //The creation of a loading is async, so we use a Promise
    this.loadingPromisse = this.loadingController.create({ message: message });
    this.loadingPromisse.then((loader) => { //When loader was created
      this.loader = loader;
      this.loader.present();
      this.isLoading = true;

      this.isCreatingLoader = false; //The loader was created
    });
  }

  stop() {
    if(this.isCreatingLoader) {
      this.stopLoadingAfterCreated();

      return;
    }

    this.loader.dismiss();
    this.isLoading = false;
  }

  private stopLoadingAfterCreated() {
    this.loadingPromisse.then(() => {
      this.loader.dismiss();
      this.isLoading = false;
    });
  }
}
