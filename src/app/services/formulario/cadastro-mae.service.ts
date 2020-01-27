import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { API } from '../http/api';
import { CacheService, CacheType } from '../helpers/cache.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class CadastroMaeService {
    
    private possuiInternet:boolean = true
    private idsSalvos = []

    public constructor(
        private api: API,
        private cache: CacheService)
    {
        
    }

    public ehIdTemporario(id: any)
    {
        return moment(id, 'HH:mm:ss.SSS').isValid()
    }

    public foiSalvo(id)
    {
        return this.buscarIdBancoDeDadosPeloIdTemporario(id) != null
    }

    public buscarIdBancoDeDadosPeloIdTemporario(id: any)
    {
        let idBanco:any = this.idsSalvos[id]

        return idBanco ? idBanco : null
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

    private async salvarMaes()
    {
        let maes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_MAE)
        let gestacoes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_GESTACAO)
        let bebes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_BEBE)

        for (const mae of maes) {
            let id = 481

            this.idsSalvos[mae.id] = id

            let gestacoesPorMae = gestacoes.filter(gestacao => { return gestacao.id_mae = mae.id })
            let bebesPorMae = bebes.filter(bebe => { return bebe.id_mae = mae.id })

            for (const gestacao of gestacoesPorMae) {
                gestacao.id_mae = id
            }

            for (const bebe of bebesPorMae) {
                bebe.id_mae = id
            }

            mae.id = id

            console.log(mae)
        }
    }

    private async salvarGestacoes()
    {
        let gestacoes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_GESTACAO)
        let bebes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_BEBE)

        for (const gestacao of gestacoes) {
            if(this.ehIdTemporario(gestacao.id_mae))
                continue

            let id = 150

            this.idsSalvos[gestacao.id_gestacao] = id

            let bebesPorMae = bebes.filter(bebe => { return bebe.id_gestacao = gestacao.id_gestacao })

            for (const bebe of bebesPorMae) {
                bebe.id_gestacao = id
            }

            gestacao.id = id

            console.log(gestacao)
        }
    }

    private async salvarBebes()
    {
        let bebes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_BEBE)

        for (const bebe of bebes) {
            if(this.ehIdTemporario(bebe.id_mae) || this.ehIdTemporario(bebe.id_gestacao))
                continue

            let id = 150
            
            this.idsSalvos[bebe.id_bebe] = 155
            bebe.id = 155

            console.log(bebe)
        }
    }

    public async sincronizar()
    {
        await this.salvarMaes()
        await this.salvarGestacoes()
        await this.salvarBebes()
    }

    public async agendar()
    {
        // await this.sincronizar()

        // setInterval(async () => {
        //     await this.sincronizar()
        // }, 20000)
    }
  
}