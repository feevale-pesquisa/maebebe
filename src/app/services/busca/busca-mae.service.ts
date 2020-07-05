import { Injectable } from '@angular/core';
import { API } from '../http/api';
import { CacheService, CacheType } from '../helpers/cache.service';
import sha256 from 'crypto-js/sha256';
import { CadastroMaeService } from '../formulario/cadastro-mae.service';

@Injectable({
  providedIn: 'root'
})
export class BuscaMaeService {
  
  constructor(private api: API, private cadastroMae: CadastroMaeService, private cache: CacheService) {

  }

  async buscarMaesNaoSalvas(busca: String) {
    let maesNaoSalvas = await this.cache.getByType(CacheType.CADASTRO_MAE)
    maesNaoSalvas = maesNaoSalvas.filter(mae => { 
      return mae.nome.includes(busca) || busca.trim() == "" || mae.cpf.includes(busca)
    })

    return maesNaoSalvas
  }

  async buscarMaesSalvasOffline(busca: String) {
    let maesSalvasOffline = await this.cache.getByType(CacheType.MAE)

    maesSalvasOffline = maesSalvasOffline.filter(mae => { 
      return mae.nome.includes(busca) || busca.trim() == "" || mae.cpf.includes(busca)
    })

    return maesSalvasOffline
  }

  async buscar(busca: String, pagina = 1) {
    let maes = []
    
    let filtroGet = (busca) ? '?search=' + busca : ''
    let resultado: any = await this.api.chamarGET('mae/list/' + pagina + filtroGet)

    if(resultado.result.length > 0) {
      pagina++

      maes = maes.concat(resultado.result)
    }

    return maes
  }

  async buscarPorId(id: string) {
    id = this.cadastroMae.verificarId(id)

    if(this.cadastroMae.ehIdTemporario(id)) {
      return await this.cache.getById(id, CacheType.CADASTRO_MAE)
    }

    let resultado = await this.buscarDoCacheOuApi(
      CacheType.MAE, id, 'mae/' + id
    )

    if(resultado.errors) {
      throw "Ocorreu um erro ao buscar a mãe"
    }

    return resultado
  }

  async buscarGestacaoPorMae(id: number) {
    id = this.cadastroMae.verificarId(id)

    let gestacoes = []

    let gestacoesNaoSalvas = await this.cache.getByType(CacheType.CADASTRO_GESTACAO)

    if(gestacoesNaoSalvas.length > 0) {
      gestacoes = gestacoes.concat(
        gestacoesNaoSalvas.filter(gestacao => { return gestacao.id_mae == id })
      )
    }

    if(this.cadastroMae.ehIdTemporario(id))
      return gestacoes

    let url = 'mae/' + id + '/gestacao'

    let resultado = await this.buscarDoCacheOuApi(
      CacheType.LISTA_GESTACAO, id, url
    )

    if(resultado.result) {
      resultado.result.forEach(gestacao => {
        this.cache.has(gestacao.id_gestacao, CacheType.GESTACAO).then(possuiCache => {
          if(!possuiCache)
            this.cache.add(gestacao.id_gestacao, gestacao, CacheType.GESTACAO, 50000)
        })
      })
    }

    gestacoes = gestacoes.concat(resultado.result)

    return gestacoes
  }

  async buscarBebePorGestacao(id: any) {
    id = this.cadastroMae.verificarId(id)

    let bebes = []

    let bebesNaoSalvos = await this.cache.getByType(CacheType.CADASTRO_BEBE)

    if(bebesNaoSalvos.length > 0) {
      bebes = bebes.concat(
        bebesNaoSalvos.filter(bebe => { return bebe.id_gestacao == id })
      )
    }

    if(this.cadastroMae.ehIdTemporario(id)) {
      return bebes
    }

    let gestacao:any = await this.buscarGestacaoPorId(id)

    let url = 'mae/' + gestacao.id_mae + '/gestacao/' + gestacao.id_gestacao + '/bebe'

    let resultado:any = await this.buscarDoCacheOuApi(
      CacheType.LISTA_BEBE, gestacao.id_gestacao, url
    )

    bebes = bebes.concat(resultado.result)

    return bebes
  }

  async buscarGestacaoPorId(id: any) {
    id = this.cadastroMae.verificarId(id)

    if(this.cadastroMae.ehIdTemporario(id)) {
      return await this.cache.getById(id, CacheType.CADASTRO_GESTACAO)
    }

    let url = 'gestacao/' + id

    let resultado = await this.buscarDoCacheOuApi(
      CacheType.GESTACAO, id, url
    )

    return resultado
  }

  async buscarBebePorId(id: any) {
    id = this.cadastroMae.verificarId(id)
    
    if(this.cadastroMae.ehIdTemporario(id)) {
      return await this.cache.getById(id, CacheType.CADASTRO_BEBE)
    }

    let url = 'bebe/' + id

    let resultado = await this.buscarDoCacheOuApi(
      CacheType.BEBE, id, url
    )

    return resultado
  }

  async buscarAcompanhamentoPorBebe(id: any) {
    id = this.cadastroMae.verificarId(id)

    let acompanhamentos = []

    let acompanhamentosNaoSalvos = await this.cache.getByType(CacheType.CADASTRO_ACOMPANHAMENTO_BEBE)
    
    if(acompanhamentosNaoSalvos.length > 0) {
      acompanhamentos = acompanhamentos.concat(acompanhamentosNaoSalvos.filter(acompanhamento => { return acompanhamento.id_bebe == id }))
    }

    if(this.cadastroMae.ehIdTemporario(id))
      return acompanhamentos

    let bebe:any = await this.buscarBebePorId(id)
    let url = 'mae/' + bebe.id_mae + '/gestacao/' + bebe.id_gestacao + '/bebe/' + id + '/bebe_acompanhamento'

    let resultado = await this.buscarDoCacheOuApi(CacheType.LISTA_ACOMPANHAMENTO_BEBE, id, url)

    if(resultado.result) {
      resultado.result.forEach(acompanhamento => {
        this.cache.has(acompanhamento.id_bebe_acompanhamento, CacheType.CADASTRO_ACOMPANHAMENTO_BEBE).then(possuiCache => {
          if(!possuiCache)
            this.cache.add(acompanhamento.id_bebe_acompanhamento, acompanhamento, CacheType.ACOMPANHAMENTO_BEBE, 50000)
        })
      })
    }

    acompanhamentos = acompanhamentos.concat(resultado.result)

    return acompanhamentos
  }

  private async buscarDoCacheOuApi(cacheType: CacheType, id: any, apiUrl: string) {
    let possuiCache = await this.cache.has(id, cacheType)

    let resultado: any

    if(possuiCache) {
      
      resultado = await this.cache.getById(id, cacheType)

      this.api.chamarGET(apiUrl).then(retorno => {
        Object.assign(resultado, retorno)
        this.cache.add(id, retorno, cacheType, 50000)
      }).catch(erro => {
        console.debug('[busca-mae.service.ts] - Erro na requisição: ' + apiUrl)
      })

    } else {
      resultado = await this.api.chamarGET(apiUrl)

      if(resultado.errors && resultado.errors.length > 0) {
        throw new Error("Não encontrado")
      }

      await this.cache.add(id, resultado, cacheType, 50000)
    }

    return resultado;
  }
}
