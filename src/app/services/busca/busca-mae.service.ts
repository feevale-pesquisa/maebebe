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

  async buscar(busca: String, pagina = 1) {
    let filtroGet = (busca) ? '?search=' + busca : ''

    let resultado: any = await this.api.chamarGET('mae/list/' + pagina + filtroGet)

    let maes = []

    let maesNaoSalvas = await this.cache.getByType(CacheType.CADASTRO_MAE)
    maesNaoSalvas.filter(mae => { return mae.nome.includes(busca) || busca.trim() == "" })

    maes = maes.concat(maesNaoSalvas)

    if(resultado.result.length > 0) {
      pagina++

      maes = maes.concat(resultado.result)
    }
    
    return maes
  }

  async buscarPorId(id: string) {

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
    if(this.cadastroMae.ehIdTemporario(id)) {
      let gestacoes = await this.cache.getByType(CacheType.CADASTRO_GESTACAO)

      if(!gestacoes) return []

      return gestacoes.filter(gestacao => { return gestacao.id_mae == id })
    }

    let url = 'mae/' + id + '/gestacao'

    let resultado = await this.buscarDoCacheOuApi(
      CacheType.LISTA_GESTACAO, id, url
    )

    return resultado.result
  }

  async buscarGestacaoPorId(id: number) {
    if(this.cadastroMae.ehIdTemporario(id)) {
      return await this.cache.getById(id, CacheType.CADASTRO_GESTACAO)
    }

    let url = 'gestacao/' + id

    let resultado = await this.buscarDoCacheOuApi(
      CacheType.GESTACAO, id, url
    )

    return resultado
  }

  async buscarBebePorGestacao(id: number) {
    
    if(this.cadastroMae.ehIdTemporario(id)) {
      let bebes = await this.cache.getByType(CacheType.CADASTRO_BEBE)

      if(!bebes) return []

      return bebes.filter(bebe => { return bebe.id_gestacao == id })
    }

    let gestacao:any = await this.buscarGestacaoPorId(id)

    let url = 'mae/' + gestacao.id_mae + '/gestacao/' + gestacao.id_gestacao + '/bebe'

    let resultado:any = await this.buscarDoCacheOuApi(
      CacheType.LISTA_BEBE, gestacao.id_gestacao, url
    )

    return resultado.result
  }

  private async buscarDoCacheOuApi(cacheType: CacheType, id: any, apiUrl: string) {
    let possuiCache = await this.cache.has(id, cacheType)

    let resultado: any

    if(possuiCache) {
      
      resultado = await this.cache.getById(id, cacheType)

      this.api.chamarGET(apiUrl).then(retorno => {
        this.cache.add(id, retorno, cacheType)
      })

    } else {
      resultado = await this.api.chamarGET(apiUrl)

      await this.cache.add(id, resultado, cacheType)
    }

    return resultado;
  }
}
