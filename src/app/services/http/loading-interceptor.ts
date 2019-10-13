import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { RequestException } from '../../exceptions/request-exception';
import { Observable } from 'rxjs';
import { LoadingService } from '../helpers/loading.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor{

  constructor(private loading: LoadingService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loading.start("Carregando...");

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => { //When request was completed without error
        if(event instanceof HttpResponse) 
          this.loading.stop();
      }, (error: HttpErrorResponse) => {
        this.loading.stop();
      })
    );
  }
}
