import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { API } from '../http/api';
import { CacheService, CacheType } from '../helpers/cache.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class CadastroMaeService {
    
    private possuiInternet:boolean = true;

    public constructor(
        private api: API,
        private cache: CacheService)
    {
        
    }

    public ehIdTemporario(id: any)
    {
        return moment(id, 'HH:mm:ss.SSS').isValid()
    }

    public async cadastrarMae(dados: any)
    {
        if(this.possuiInternet) {
            let resposta: {id_mae: any} =  await this.api.salvarFormularioMae(dados);

            return resposta.id_mae
        }

        let id = moment().format('HH:mm:ss.SSS')

        dados.id = id

        await this.cache.add(id, dados, CacheType.CADASTRO_MAE, 100000)

        return id
    }

    public async cadastrarGestacao(idMae, dados:any)
    {
        if(this.possuiInternet) {
            let resposta: {id: any} = await this.api.salvarFormulario('mae/:id/gestacao/new'.replace(":id", idMae), dados);

            return resposta.id
        }

        let id = moment().format('HH:mm:ss.SSS')

        dados.id_gestacao = id

        await this.cache.add(id, dados, CacheType.CADASTRO_GESTACAO, 100000)

        return id
    }

    public async cadastrarBebe(idMae, idGestacao, dados:any)
    {
        if(this.possuiInternet) {
            let resposta: {id: any} = await this.api.salvarFormularioBebe(idMae, idGestacao, dados);

            return resposta.id
        }


        let id = moment().format('HH:mm:ss.SSS')

        await this.cache.add(id, dados, CacheType.CADASTRO_BEBE, 100000)

        return id
    }

    public async sincronizar()
    {
        let maes = this.cache.getByType(CacheType.CADASTRO_MAE)

        // let resposta: {id_mae: any} =  await this.api.salvarFormularioMae(campos)
    }
  
}