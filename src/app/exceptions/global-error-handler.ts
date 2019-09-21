import { ErrorHandler, Injectable } from '@angular/core';
import { RequestException } from './request-exception';
import { AlertService } from '../services/helpers/alert.service';
import { ToastService } from '../services/helpers/toast.service';
import { FormException } from './form-exception';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

  constructor(private alert: AlertService, private toast: ToastService) {
    super();
  }

  handleError(error: any): void {

    if(error.promise) { //Handle errors inside promises (async operations)

      error.promise.catch((error) => {
        if(error instanceof RequestException){
          this.alert.ok(error.getMessage(), 'Erro');
        } else if (error instanceof FormException) {
          this.alert.ok(error.getMessage(), 'Erro ao salvar');
        }
        else if(error.message == 'Timeout has occurred'){

          this.toast.present("Verifique sua conexão e tente novamente")

        }else{
          super.handleError(error);
        }
      })

    } else { //Handle common errors

      //Add your own exception here
      if(error instanceof RequestException) {
        this.alert.ok(error.getMessage(), 'Erro');
      } else if (error instanceof FormException) {
        this.alert.ok(error.getMessage(), 'Erro ao salvar');
      } else {
        super.handleError(error);
      }

    }


  }
}
