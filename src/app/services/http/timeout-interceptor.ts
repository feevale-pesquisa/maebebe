import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { LoadingService } from '../helpers/loading.service';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor{

  constructor(private loading: LoadingService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      timeout(10000),
      catchError((error) => {
        if(error instanceof TimeoutError) {
          this.loading.stop();
        }
        return throwError(error);
      })
    );
  }
}
