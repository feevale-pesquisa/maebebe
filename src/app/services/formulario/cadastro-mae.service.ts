import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { API } from '../http/api';
import { CacheService, CacheType } from '../helpers/cache.service';
import * as moment from 'moment';
import { FormException } from '../../exceptions/form-exception';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class CadastroMaeService {
    
    private possuiInternet:boolean = true
    private idsSalvos = []
    private bloquearAgendamento = false

    public constructor(
        private api: API,
        private cache: CacheService)
    {
        
    }

    public bloquear()
    {
        this.bloquearAgendamento = true
    }

    public desbloquear()
    {
        this.bloquearAgendamento = false
    }

    public ehIdTemporario(id: any)
    {
        return moment(id, 'HH:mm:ss.SSS').isValid()
    }

    public foiSalvo(id)
    {
        return this.buscarIdBancoDeDadosPeloIdTemporario(id) != null
    }

    public verificarId(id:any) {
        if(this.ehIdTemporario(id) && this.foiSalvo(id)) {
          id = this.buscarIdBancoDeDadosPeloIdTemporario(id)
        }
    
        return id
    }

    public buscarIdBancoDeDadosPeloIdTemporario(id: any)
    {
        let idBanco:any = this.idsSalvos[id]

        return idBanco ? idBanco : null
    }

    public async cadastrarMae(dados: any)
    {
        console.debug('[cadastro-mae.service.ts] - Cadastrando mãe ' + dados.nome)

        if(this.possuiInternet) {
            try {
                let resposta: {id_mae: any} = await this.api.salvarFormularioMae(dados);
                return resposta.id_mae
            } catch(error) {
                if(error instanceof HttpErrorResponse)
                    console.debug('[cadastro-mae.service.ts] - Erro ao salvar mãe ' + dados.nome + ', salvando em cache')
                else
                    throw error
            }
        }

        let id = moment().format('HH:mm:ss.SSS')

        dados.id = id

        await this.cache.add(id, dados, CacheType.CADASTRO_MAE, 100000)

        return id
    }

    public async cadastrarGestacao(idMae, dados:any)
    {
        idMae = this.verificarId(idMae)

        console.debug('[cadastro-mae.service.ts] - Cadastrando gestação')

        if(this.possuiInternet && !this.ehIdTemporario(idMae)) {
            try {
                let resposta: {id: any} = await this.api.salvarFormularioGestacao(idMae, dados)
                return resposta.id
            } catch (error) {
                if(error instanceof HttpErrorResponse)
                    console.debug('[cadastro-mae.service.ts] - Erro ao salvar mãe ' + dados.nome + ', salvando em cache')
                else
                    throw error
            }
        }

        let id = moment().format('HH:mm:ss.SSS')

        dados.id_gestacao = id

        await this.cache.add(id, dados, CacheType.CADASTRO_GESTACAO, 100000)

        return id
    }

    public async cadastrarBebe(idMae, idGestacao, dados:any)
    {
        idMae = this.verificarId(idMae)
        idGestacao = this.verificarId(idGestacao)

        console.debug('[cadastro-mae.service.ts] - Cadastrando bebe ' + dados.nome)

        if(this.possuiInternet && !this.ehIdTemporario(idMae) && !this.ehIdTemporario(idGestacao)) {
            try {
                let resposta: {id: any} = await this.api.salvarFormularioBebe(idMae, idGestacao, dados)
                return resposta.id
            } catch (error) {
                if(error instanceof HttpErrorResponse)
                    console.debug('[cadastro-mae.service.ts] - Erro ao salvar mãe ' + dados.nome + ', salvando em cache')
                else
                    throw error
            }
        }

        let id = moment().format('HH:mm:ss.SSS')

        dados.id_bebe = id

        await this.cache.add(id, dados, CacheType.CADASTRO_BEBE, 100000)

        return id
    }

    private async salvarMaes()
    {
        let maes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_MAE)
        let gestacoes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_GESTACAO)
        let bebes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_BEBE)

        for (let mae of maes) {
            try {
                if(mae.possuiErro || mae.id == undefined || this.bloquearAgendamento) {
                    continue
                }

                let resposta: {id_mae: any} = await this.api.salvarFormularioMae(mae);
                await this.cache.removeById(mae.id, CacheType.CADASTRO_MAE)

                let id = resposta.id_mae

                this.idsSalvos[mae.id] = id

                let gestacoesPorMae = gestacoes.filter(gestacao => { return gestacao.id_mae = mae.id })
                let bebesPorMae = bebes.filter(bebe => { return bebe.id_mae = mae.id })

                for (let gestacao of gestacoesPorMae) {
                    gestacao.id_mae = id

                    await this.cache.add(gestacao.id_gestacao, gestacao, CacheType.CADASTRO_GESTACAO, 100000)
                }

                for (let bebe of bebesPorMae) {
                    bebe.id_mae = id

                    await this.cache.add(bebe.id_bebe, bebe, CacheType.CADASTRO_BEBE, 100000)
                }
            } catch (error) {
                if(error instanceof FormException) {
                    
                    mae.possuiErro = true
                    mae.erros = error.getErrors()
                    await this.cache.add(mae.id, mae, CacheType.CADASTRO_MAE, 100000)

                } else {
                    throw error
                }
            }
        }
    }

    private async salvarGestacoes()
    {
        let gestacoes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_GESTACAO)
        let bebes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_BEBE)

        for (let gestacao of gestacoes) {
            try {
                if(gestacao.possuiErro || gestacao.id_gestacao == undefined || this.bloquearAgendamento) {
                    continue
                }
                
                if(this.ehIdTemporario(gestacao.id_mae))
                    continue
    
                let resposta: {id: any} = await this.api.salvarFormularioGestacao(gestacao.id_mae, gestacao)
                await this.cache.removeById(gestacao.id_gestacao, CacheType.CADASTRO_GESTACAO)
                let id = resposta.id
    
                this.idsSalvos[gestacao.id_gestacao] = id
    
                let bebesPorMae = bebes.filter(bebe => { return bebe.id_gestacao = gestacao.id_gestacao })
    
                for (let bebe of bebesPorMae) {
                    bebe.id_gestacao = id
    
                    await this.cache.add(bebe.id_bebe, bebe, CacheType.CADASTRO_BEBE, 100000)
                }

                await this.cache.removeById(gestacao.id_mae, CacheType.LISTA_GESTACAO)
                
            } catch (error) {
                
                if(error instanceof FormException) {
                    
                    gestacao.possuiErro = true
                    gestacao.erros = error.getErrors()
                    await this.cache.add(gestacao.id_gestacao, gestacao, CacheType.CADASTRO_GESTACAO, 100000)

                } else {
                    throw error
                }

            }
        }
    }

    private async salvarBebes()
    {
        let bebes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_BEBE)

        for (let bebe of bebes) {
            try {
                
                if(bebe.possuiErro || bebe.id_bebe == undefined || this.bloquearAgendamento) {
                    continue
                }

                if(this.ehIdTemporario(bebe.id_mae) || this.ehIdTemporario(bebe.id_gestacao))
                    continue

                let resposta: {id: any} = await this.api.salvarFormularioBebe(bebe.id_mae, bebe.id_gestacao, bebe)
                let id = resposta.id
                
                this.idsSalvos[bebe.id_bebe] = id

                await this.cache.removeById(bebe.id_bebe, CacheType.CADASTRO_BEBE)
                await this.cache.removeById(bebe.id_gestacao, CacheType.LISTA_BEBE)

            } catch (error) {
                
                if(error instanceof FormException) {
                    
                    bebe.possuiErro = true
                    bebe.erros = error.getErrors()
                    await this.cache.add(bebe.id_bebe, bebe, CacheType.CADASTRO_BEBE, 100000)

                } else {
                    throw error
                }

            }
        }
    }

    public async sincronizar()
    {
        await this.salvarMaes()
        await this.salvarGestacoes()
        await this.salvarBebes()
    }

    public async agendar(numero = 1, tempo = 10000)
    {
        if(tempo > 320000) //Máximo, aproximadamente 5 minutos
            tempo = 320000

        setTimeout(async () => {
            try {
                console.debug("Salvando cadastros [" + numero + "]")
                await this.sincronizar()
                this.agendar(numero + 1)
            } catch (error) {
                console.debug("Erro ao salvar cadastros, tentando em " + tempo * 2 / 1000 + " segundos")
                this.agendar(numero + 1, tempo * 2)
            }
        }, tempo)
    }
  
}