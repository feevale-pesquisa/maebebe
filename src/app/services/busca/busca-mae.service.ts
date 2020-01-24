import { Injectable } from '@angular/core';
import { API } from '../http/api';
import { CacheService, CacheType } from '../helpers/cache.service';
import sha256 from 'crypto-js/sha256';

@Injectable({
  providedIn: 'root'
})
export class BuscaMaeService {
  
  constructor(private api: API, private cache: CacheService) {

  }

  async buscar(busca: String, pagina = 1) {
    let filtroGet = (busca) ? '?search=' + busca : ''

    let resultado: any = await this.api.chamarGET('mae/list/' + pagina + filtroGet)

    if(resultado.result.length > 0) {
      pagina++

      return resultado.result
    }
    
    return []
  }

  async buscarPorId(id: number) {
    let resultado = await this.buscarDoCacheOuApi(
      CacheType.MAE, id, 'mae/' + id
    )

    if(resultado.errors) {
      throw "Ocorreu um erro ao buscar a mãe"
    }

    return resultado
  }

  async buscarGestacaoPorMae(id: number) {
    let url = 'mae/' + id + '/gestacao'

    let resultado = await this.buscarDoCacheOuApi(
      CacheType.LISTA_GESTACAO, id, url
    )

    return resultado.result
  }

  async buscarGestacaoPorId(id: number) {
    let url = 'gestacao/' + id

    let resultado = await this.buscarDoCacheOuApi(
      CacheType.GESTACAO, id, url
    )

    return resultado
  }

  async buscarBebePorGestacao(id: number) {
    
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

    } else {
      resultado = await this.api.chamarGET(apiUrl)

      await this.cache.add(id, resultado, cacheType)
    }

    return resultado;
  }
}
