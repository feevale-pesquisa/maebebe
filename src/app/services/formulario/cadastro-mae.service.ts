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

    public async cadastrarAcompanhamentoBebe(idMae, idGestacao, idBebe, dados:any)
    {
        idMae = this.verificarId(idMae)
        idGestacao = this.verificarId(idGestacao)
        idBebe = this.verificarId(idBebe)

        if(this.possuiInternet && !this.ehIdTemporario(idMae) && !this.ehIdTemporario(idGestacao) && !this.ehIdTemporario(idBebe)) {
            try {
                let resposta: {id: any} = await this.api.salvarFormularioAcompanhamentoBebe(idMae, idGestacao, idBebe, dados)
                return resposta.id
            } catch (error) {
                if(error instanceof HttpErrorResponse)
                    console.debug('[cadastro-mae.service.ts] - Erro ao salvar mãe ' + dados.nome + ', salvando em cache')
                else
                    throw error
            }
        }

        let id = moment().format('HH:mm:ss.SSS')

        dados.id_bebe_acompanhamento = id

        await this.cache.add(id, dados, CacheType.CADASTRO_ACOMPANHAMENTO_BEBE, 100000)

        return id
    }

    private async salvarMaes()
    {
        if(this.bloquearAgendamento) return
        let maes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_MAE)

        for (let mae of maes) {
            try {
                if(mae.possuiErro || mae.id == undefined || this.bloquearAgendamento) {
                    continue
                }

                let resposta: {id_mae: any} = await this.api.salvarFormularioMae(mae);
                await this.cache.removeById(mae.id, CacheType.CADASTRO_MAE)

                let id = resposta.id_mae

                this.idsSalvos[mae.id] = id

                this.atualizarIdNoCache(mae.id, id, CacheType.CADASTRO_GESTACAO, 'id_mae', 'id_gestacao')
                this.atualizarIdNoCache(mae.id, id, CacheType.CADASTRO_BEBE, 'id_mae', 'id_bebe')
                this.atualizarIdNoCache(mae.id, id, CacheType.CADASTRO_ACOMPANHAMENTO_BEBE, 'id_mae', 'id_bebe_acompanhamento')
                
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
        if(this.bloquearAgendamento) return
        let gestacoes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_GESTACAO)

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
    
                this.atualizarIdNoCache(gestacao.id_gestacao, id, CacheType.CADASTRO_BEBE, 'id_gestacao', 'id_bebe')
                this.atualizarIdNoCache(gestacao.id_gestacao, id, CacheType.CADASTRO_ACOMPANHAMENTO_BEBE, 'id_gestacao', 'id_bebe_acompanhamento')

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
        if(this.bloquearAgendamento) return
        let bebes:Array<any> = await this.cache.getByType(CacheType.CADASTRO_BEBE)

        for (let bebe of bebes) {
            try {
                
                if(bebe.possuiErro || bebe.id_bebe == undefined || this.bloquearAgendamento) {
                    continue
                }

                if(this.ehIdTemporario(bebe.id_mae) || this.ehIdTemporario(bebe.id_gestacao))
                    continue

                let resposta: {id_bebe: any} = await this.api.salvarFormularioBebe(bebe.id_mae, bebe.id_gestacao, bebe)
                let id = resposta.id_bebe
                
                this.idsSalvos[bebe.id_bebe] = id

                this.atualizarIdNoCache(bebe.id_bebe, id, CacheType.CADASTRO_ACOMPANHAMENTO_BEBE, 'id_bebe', 'id_bebe_acompanhamento')

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

    private async salvarAcompanhamentosBebes()
    {
        if(this.bloquearAgendamento) return
        let acompanhamentos:Array<any> = await this.cache.getByType(CacheType.CADASTRO_ACOMPANHAMENTO_BEBE)

        for (let acompanhamento of acompanhamentos) {
            try {
                
                if(acompanhamento.possuiErro || acompanhamento.id_bebe_acompanhamento == undefined || this.bloquearAgendamento) {
                    continue
                }

                if(this.ehIdTemporario(acompanhamento.id_bebe))
                    continue

                let resposta: {id: any} = await this.api.salvarFormularioAcompanhamentoBebe(
                    acompanhamento.id_mae, acompanhamento.id_gestacao, acompanhamento.id_bebe, acompanhamento
                )
                let id = resposta.id
                
                this.idsSalvos[acompanhamento.id_bebe_acompanhamento] = id

                await this.cache.removeById(acompanhamento.id_bebe_acompanhamento, CacheType.CADASTRO_ACOMPANHAMENTO_BEBE)
                await this.cache.removeById(acompanhamento.id_bebe, CacheType.LISTA_ACOMPANHAMENTO_BEBE)

            } catch (error) {
                
                if(error instanceof FormException) {
                    
                    acompanhamento.possuiErro = true
                    acompanhamento.erros = error.getErrors()
                    await this.cache.add(acompanhamento.id_bebe_acompanhamento, acompanhamento, CacheType.CADASTRO_ACOMPANHAMENTO_BEBE, 100000)

                } else {
                    throw error
                }

            }
        }
    }

    private async atualizarIdNoCache(idAntigo, idNovo, tipo, campo, campoKey) {
        let listaCache:Array<any> = await this.cache.getByType(tipo)
        listaCache = listaCache.filter(itemCache => { return itemCache[campo] == idAntigo })

        for (let item of listaCache) {
            console.log(item[campo], idNovo, item[campoKey])
            item[campo] = idNovo
            await this.cache.add(item[campoKey], item, tipo, 100000)
        }
    }

    public async sincronizar()
    {
        await this.salvarMaes()
        await this.salvarGestacoes()
        await this.salvarBebes()
        await this.salvarAcompanhamentosBebes()
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