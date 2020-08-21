import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuscaMaeService } from 'src/app/services/busca/busca-mae.service';
import * as moment from 'moment';

@Component({
  selector: 'app-lista-acompanhamento',
  templateUrl: './lista-acompanhamento.page.html',
  styleUrls: ['./lista-acompanhamento.page.scss'],
})
export class ListaAcompanhamentoPage implements OnInit {

  public idMae: string
  public idGestacao: string
  public gestacao: Object = null
  public acompanhamentos: any = []
  public carregando: boolean = false


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maeServico: BuscaMaeService
  ) { }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')

    this.carregarDados()
  }

  atualizar(event) {
    this.carregarAcompanhamentos().then(() => {
      event.target.complete()
    })
  }

  async carregarDados() {
    await this.carregarGestacao()
    if(this.gestacao)
      await this.carregarAcompanhamentos()
  }

  async carregarGestacao() {
    this.carregando = true
    try {
      this.gestacao = await this.maeServico.buscarGestacaoPorId(this.idGestacao)
      this.carregando = false
    } catch(error) {
      this.carregando = false
      this.voltar()
    }
  }

  async carregarAcompanhamentos() {
    this.carregando = true
    try {
      this.acompanhamentos = await this.maeServico.buscarAcompanhamentoPorGestacao(this.idGestacao)
      this.carregando = false
    } catch(error) {
      this.carregando = false
      this.voltar()
    }
  }

  abrirCadastroAcompanhamento() {
    this.router.navigate([
      "mae", this.idMae, 
      "gestacao", this.idGestacao,  "acompanhamento", "cadastro"
    ])
  }

  abrirEdicaoAcompanhamento() {

  }

  voltar() {
    this.router.navigate(["mae", this.idMae, "gestacao"])
  }

  formatarData(data) {
    if(data.length == 10)
      return data
      
    return moment(data).isValid() ? moment(data).format('DD/MM/YYYY') : ''
  }

}
