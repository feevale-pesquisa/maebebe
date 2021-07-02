import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {

  }

  private setHeaders(headers?: HttpHeaders) {
    if (!headers) {
      headers = new HttpHeaders();
    }

    return headers
  }

  get(url, headers?: HttpHeaders) {
    let parameters = { headers: this.setHeaders(headers) };
    return this.http.get(url, parameters).toPromise();
  }

  post(url, data: any, headers?: HttpHeaders) {
    let parameters = { headers: this.setHeaders(headers) };
    return this.http.post(url, data, parameters).toPromise();
  }

  postLogin(username: string, password: string) {
    let form = new FormData()
    form.append("username", username)
    form.append("password", password)

    return this.post("https://ceted.feevale.br/maebebe/API/index.php/sign/in", form)
  }
}
