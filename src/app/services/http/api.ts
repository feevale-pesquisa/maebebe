import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend, HttpParams } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { FormException } from '../../exceptions/form-exception';

@Injectable({
    providedIn: 'root'
})
export class API {

    private http: HttpClient;
    private urlApi = "http://ceted.feevale.br/maebebe/API/index.php/"

    constructor(
        handler : HttpBackend,
        private login: LoginService
    ) { 
        this.http = new HttpClient(handler)
    }

    async chamarGET(url: string) {
        let usuario = await this.login.getUser()
        
        return this.http.get(this.urlApi + url, {
            headers: new HttpHeaders({'Authorization': usuario.token})
        }).toPromise();
    }

    async chamarPOST(url: string, data: any) {
        let body = new HttpParams()
        for (var key in data) {
            Array.isArray(data[key]) 
                ? data[key].forEach(value => { body = body.append(key + '[]', value) })
                : body = body.append(key, data[key])
        }

        let usuario = await this.login.getUser()
        let headers = new HttpHeaders({'Authorization' : usuario.token})
        return this.http.post(this.urlApi + url, body, {
            headers: headers
        }).toPromise();
    }

    async salvarFormulario(url: string, data: any) {
        let resposta:any = await this.chamarPOST(url, data)
        if(resposta.errors && resposta.errors.length > 0) {
            throw new FormException(resposta.errors)
        }

        return resposta
    }

    async salvarFormularioGestacao(idMae: any, data:any) {
        let url:string = 'mae/:id/gestacao/new'.replace(":id", idMae)

        let resposta:any = await this.chamarPOST(url, data)
        if(resposta.errors && resposta.errors.length > 0) {
            throw new FormException(resposta.errors)
        }

        return resposta
    }

    async salvarFormularioBebe(idMae: any, idGestacao: any, data: any) {
        let url: string = 'mae/:id_mae/gestacao/:id_gestacao/bebe/new'
                        .replace(":id_mae", idMae)
                        .replace(":id_gestacao", idGestacao)

        data.image = new File([""], "")

        let body = new FormData()
        
        for (var key in data) {
            Array.isArray(data[key]) 
                ? data[key].forEach(value => { body.set(key + '[]', value) })
                : body.set(key, data[key])
        }

        let usuario = await this.login.getUser()
        let headers = new HttpHeaders({'Authorization' : usuario.token})

        let resposta:any = await this.http.post(this.urlApi + url, body, {
            headers: headers
        }).toPromise()
        
        if(resposta.errors && resposta.errors.length > 0) {
            throw new FormException(resposta.errors)
        }

        return resposta
    }

    async salvarFormularioMae(data: any) {
        let url: string = 'mae/new'

        data.image = new File([""], "")

        let body = new FormData()
        
        for (var key in data) {
            Array.isArray(data[key]) 
                ? data[key].forEach(value => { body.set(key + '[]', value) })
                : body.set(key, data[key])
        }

        let usuario = await this.login.getUser()
        let headers = new HttpHeaders({'Authorization' : usuario.token})

        let resposta:any = await this.http.post(this.urlApi + url, body, {
            headers: headers
        }).toPromise()
        
        if(resposta.errors && resposta.errors.length > 0) {
            throw new FormException(resposta.errors)
        }

        return resposta
    }
}
