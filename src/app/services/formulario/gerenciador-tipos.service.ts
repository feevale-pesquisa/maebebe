import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { API } from '../http/api';
import * as moment from 'moment'
import { looseIdentical } from '@angular/core/src/util';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class GerenciadorTiposService {

  public ultimaSincronizacao: moment.Moment = null

  private listaTipos = [
    { nome: 'tipo_parto', rota: 'tipo_parto/list/1' },
    { nome: 'tipo_motivo_desfecho', rota: 'tipo_motivo_desfecho/list/1' },
    { nome: 'tipo_planejamento_gestacao', rota: 'tipo_planejamento_gestacao/list/1' },
    { nome: 'tipo_mac', rota: 'tipo_mac/list/1' },
    { nome: 'tempo_mac', rota: 'tempo_mac/list/1' },
    { nome: 'tipo_exame_prenatal', rota: 'tipo_exame_prenatal/list/1' },
    { nome: 'tipo_choro', rota: 'tipo_choro/list/1' },
    { nome: 'tipo_renda_mensal', rota: 'tipo_renda_mensal/list/1' },
    { nome: 'tipo_comportamento', rota: 'tipo_comportamento/list/1' },
    { nome: 'tipo_exame_prenatal', rota: 'tipo_exame_prenatal/list/1' },
    { nome: 'tipo_higiene_bebe', rota: 'tipo_higiene_bebe/list/1' },
    { nome: 'area', rota: 'area/list/1' },
    { nome: 'micro_area', rota: '/micro_area/list/1' },
    { nome: 'estado', rota: 'estado/list/1' },
    { nome: 'bairro', rota: 'bairro/list/1' },
    { nome: 'moradia', rota: 'moradia/list/1' },
    { nome: 'escolaridade', rota: 'escolaridade/list/1' },
    { nome: 'genero', rota: 'genero/list/1' },
    { nome: 'estado_civil', rota: 'estado_civil/list/1' },
    { nome: 'tipo_escala', rota: 'tipo_escala/list/1' },
    { nome: 'tipo_triagem_neonatal', rota: 'tipo_triagem_neonatal/list/1' },
    { nome: 'tipo_denver', rota: 'tipo_denver/list/1' },
    { nome: 'tipo_intercorrencia_peri_neonatal', rota: 'tipo_intercorrencia_peri_neonatal/list/1' },
    { nome: 'tipo_intercorrencia_primeiro_ano_vida', rota: 'tipo_intercorrencia_primeiro_ano_vida/list/1' },
  ]

  constructor(
    private api: API, 
    private storage: Storage,
    private login: LoginService
  ) { }

  private async atualizarListaTipos()
  {
      await this.storage.set('tipos', this.listaTipos.map(tipo => { return tipo.nome }))
  }

  private async atualizarTipo(tipo: { nome: string, rota: string }) {
    try {
      
      let retorno: any = await this.api.chamarGET(tipo.rota)

      let dadosTipo = {
        dados: retorno.result,
        atualizacao: new Date()
      }
      this.storage.set('tipos.' + tipo.nome, dadosTipo)

    } catch(error) {
      console.log('Erro ao buscar tipo: ' + tipo.nome)
    }
  }

  private async getDataUltimaSincronizacao() {
    let data:any = await this.storage.get('ultima_sincronizacao')
    if(data == null)
      return

    this.ultimaSincronizacao = moment(data)

    return moment(data)
  }

  private setDataSincronizacao() {
    let novaData = moment()
    this.storage.set('ultima_sincronizacao', novaData.valueOf())

    this.ultimaSincronizacao = novaData
  }

  async sincronizar() {
    setInterval(async () => {
      if(!(await this.login.isAuthenticated())){
        return
      }

      let dataSincronizacao = await this.getDataUltimaSincronizacao()

      //Faz menos de 12 horas da última sincronização
      if(!(await this.possuiNovosTipos()) && dataSincronizacao && dataSincronizacao.add(12, 'hours').isAfter(moment()) ) {
        return
      }

      this.listaTipos.forEach(async tipo => {
        await this.atualizarTipo(tipo)
      });

      await this.atualizarListaTipos()

      this.setDataSincronizacao()
    }, 5000); //Executa a cada 5 segundos
  }

  async buscarTipo(nome: string) {
    let dadosTipo:any = await this.storage.get('tipos.' + nome)
    if(dadosTipo)
      return dadosTipo.dados
  }

  async possuiNovosTipos() {
    let listaTipos = await this.storage.get('tipos')
    return JSON.stringify(listaTipos) !== JSON.stringify(this.listaTipos.map(tipo => { return tipo.nome }))
  }
}
