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
  public idBebe: string
  public bebe: Object = null
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
    this.idBebe = this.route.snapshot.paramMap.get('id_bebe')

    this.carregarDados()
  }

  atualizar(event) {
    this.carregarAcompanhamentos().then(() => {
      event.target.complete()
    })
  }

  async carregarDados() {
    await this.carregarBebe()
    if(this.bebe)
      await this.carregarAcompanhamentos()
  }

  async carregarBebe() {
    this.carregando = true
    try {
      this.bebe = await this.maeServico.buscarBebePorId(this.idBebe)
      this.carregando = false
    } catch(error) {
      this.carregando = false
      this.voltar()
    }
  }

  async carregarAcompanhamentos() {
    this.carregando = true
    try {
      this.acompanhamentos = await this.maeServico.buscarAcompanhamentoPorBebe(this.idBebe)
      this.carregando = false
    } catch(error) {
      this.carregando = false
      this.voltar()
    }
  }

  abrirCadastroAcompanhamento() {
    this.router.navigate([
      "mae", this.idMae, 
      "gestacao", this.idGestacao, 
      "bebe", this.idBebe, "acompanhamento", "cadastro"
    ])
  }

  abrirEdicaoAcompanhamento() {

  }

  voltar() {
    this.router.navigate(["mae", this.idMae, "gestacao", this.idGestacao, "bebe"])
  }

  formatarData(data) {
    if(data.length == 10)
      return data
      
    return moment(data).isValid() ? moment(data).format('DD/MM/YYYY') : ''
  }

}
