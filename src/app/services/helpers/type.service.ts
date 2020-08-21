import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage'
import { LoginService } from '../login/login.service'
import * as moment from 'moment'
import { HttpService } from '../http/http.service'
import { API } from '../http/api'
import { LoadingController } from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  private isRunning = false

  private typesList = [
    { name: 'tipo_parto', route: 'tipo_parto/list/1' },
    { name: 'tipo_motivo_desfecho', route: 'tipo_motivo_desfecho/list/1' },
    { name: 'tipo_planejamento_gestacao', route: 'tipo_planejamento_gestacao/list/1' },
    { name: 'tipo_mac', route: 'tipo_mac/list/1' },
    { name: 'tempo_mac', route: 'tempo_mac/list/1' },
    { name: 'tipo_exame_prenatal', route: 'tipo_exame_prenatal/list/1' },
    { name: 'tipo_choro', route: 'tipo_choro/list/1' },
    { name: 'tipo_renda_mensal', route: 'tipo_renda_mensal/list/1' },
    { name: 'tipo_comportamento', route: 'tipo_comportamento/list/1' },
    { name: 'tipo_exame_prenatal', route: 'tipo_exame_prenatal/list/1' },
    { name: 'tipo_higiene_bebe', route: 'tipo_higiene_bebe/list/1' },
    { name: 'area', route: 'area/list/1' },
    { name: 'micro_area', route: '/micro_area/list/1' },
    { name: 'estado', route: 'estado/list/1' },
    { name: 'bairro', route: 'bairro/list/1' },
    { name: 'moradia', route: 'moradia/list/1' },
    { name: 'escolaridade', route: 'escolaridade/list/1' },
    { name: 'genero', route: 'genero/list/1' },
    { name: 'estado_civil', route: 'estado_civil/list/1' },
    { name: 'tipo_escala', route: 'tipo_escala/list/1' },
    { name: 'tipo_triagem_neonatal', route: 'tipo_triagem_neonatal/list/1' },
    { name: 'tipo_denver', route: 'tipo_denver/list/1' },
    { name: 'tipo_intercorrencia_peri_neonatal', route: 'tipo_intercorrencia_peri_neonatal/list/1' },
    { name: 'tipo_intercorrencia_primeiro_ano_vida', route: 'tipo_intercorrencia_primeiro_ano_vida/list/1' },
    { name: 'tipo_intercorrencia_gestacao', route: 'tipo_intercorrencia_gestacao/list/1' },
    { name: 'tipo_mamilo', route: 'tipo_mamilo/list/1' },
    { name: 'tipo_bebe_alimentacao', route: 'tipo_bebe_alimentacao/list/1' },
    { name: 'tipo_desmame_precoce', route: 'tipo_desmame_precoce/list/1' },
    { name: 'tipo_orientacao_amamentacao', route: 'tipo_orientacao_amamentacao/list/1' },
    { name: 'tipo_bebe_mamada', route: 'tipo_bebe_mamada/list/1' },
    { name: 'tipo_pele', route: 'tipo_pele/list/1' },
    { name: 'tipo_cavidade_oral', route: 'tipo_cavidade_oral/list/1' },
    { name: 'tipo_torax', route: 'tipo_torax/list/1' },
    { name: 'estado_abdomen', route: 'estado_abdomen/list/1' },
    { name: 'estado_coto_umbilical', route: 'estado_coto_umbilical/list/1' },
    { name: 'tipo_higiene_bebe', route: 'tipo_higiene_bebe/list/1' },
    { name: 'estado_perineo', route: 'estado_perineo/list/1' },
    { name: 'percepcao_sentido', route: 'percepcao_sentido/list/1' },
    { name: 'tipo_regulacao_neurologica', route: 'tipo_regulacao_neurologica/list/1' },
    { name: 'tipo_choro', route: 'tipo_choro/list/1' },
    { name: 'avaliacao', route: 'avaliacao/list/1' },
    { name: 'tipo_queixa_atividade', route: 'tipo_queixa_atividade/list/1'},
    {name: 'tipo_exercicio_fisico', route: 'tipo_exercicio_fisico/list/1'}
    //Novos tipos devem ser adicionados aqui (sendo 'name' o nome e 'route' a rota referente a url dentro da api)
  ]

  constructor(
      private storage: Storage,
      private api: API, 
      private login: LoginService, 
      private http: HttpService,
      private loading: LoadingController) { 

    }

  public schedule() {
    this.sincronize()

    setInterval(async () => {
      this.sincronize()
    }, 10000) //Executa a cada 15 segundos
  }

  public async firstSincronize() {
    let loader = await this.loading.create({ message: "Sincronizando dados..." })
    await loader.present()
    await this.sincronize()
    await loader.dismiss()
  }

  public async sincronize() {
    if(this.isRunning == true)
      return

    this.isRunning = true

    if(!(await this.login.isAuthenticated())){
      this.isRunning = false
      return
    }

    let lastSyncDate = await this.getLastSyncDate()
    let hasNewTypes:boolean = await this.hasNewTypes()
    let hasTypesWithError:boolean = await this.hasTypesWithError()

    //Não possui tipos com erro (problema na requisição) e
    //Não possui novos tipos (para compatibilidade de código em mudanças na 'typesList') e
    //Já sincronizou alguma vez e faz menos de 12 horas da última sincronização
    if(!hasTypesWithError && !hasNewTypes && lastSyncDate && lastSyncDate.add(12, 'hours').isAfter(moment()) ) {
      this.isRunning = false
      return
    }

    let typesWithError:any = []

    for (let i in this.typesList) {
      let type = this.typesList[i]

      try {
        let lastUpdate = await this.getTypeLastUpdate(type.name)

        //Faz mais de 12 horas dá última sincronização
        if(!lastUpdate || lastUpdate.add(12, 'hours').isBefore(moment()))
          await this.updateType(type)

      } catch (error) {
        typesWithError.push(type.name)
      }
    }

    await this.updateTypesList()
    await this.markTypesWithError(typesWithError)

    if(typesWithError.length == 0)
      await this.setLastSyncDate()

    this.isRunning = false
  }

  public async getType(name: string) {
    let typeData:any = await this.storage.get('types.' + name)
    if(typeData)
      return typeData.data

    return false
  }

  private async getLastSyncDate() {
    let date:any = await this.storage.get('types_last_sync')
    if(date == null)
      return

    return moment(date)
  }

  private async setLastSyncDate() {
    let newDate = moment()
    this.storage.set('types_last_sync', newDate.valueOf())
  }

  private async updateType(type: { name: string, route: string }) {
    let user = this.login.getUser()
    let data:any = await this.api.chamarGET(type.route)

    let typeInformation = {
      data: data.result,
      last_update: moment().valueOf()
    }

    this.storage.set('types.' + type.name, typeInformation)
  }

  private async getTypeLastUpdate(name: string) {
    let typeData:any = await this.storage.get('types.' + name)
    if(typeData)
      return moment(typeData.last_update)

    return false
  }

  private async hasNewTypes() {
    let typesList = await this.storage.get('types')
    return JSON.stringify(typesList) !== JSON.stringify(this.typesList.map(type => { return type.name }))
  }

  private async updateTypesList() {
    await this.storage.set('types', this.typesList.map(type => { return type.name }))
  }

  private async markTypesWithError(types) {
    await this.storage.set('types_error', types)
  }

  private async hasTypesWithError() {
    let typesList = await this.storage.get('types_error')

    return typesList && typesList.length > 0
  }

}
