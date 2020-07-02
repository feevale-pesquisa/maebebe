import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuscaMaeService } from '../../../../services/busca/busca-mae.service';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-por-gestacao',
  templateUrl: './por-gestacao.page.html',
  styleUrls: ['./por-gestacao.page.scss'],
})
export class PorGestacaoPage implements OnInit {

  public idMae: string
  public idGestacao: string
  public bebes: any = []
  public mae: Object = null
  public gestacao: Object = null
  public carregando: boolean = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maeServico: BuscaMaeService,
    private toastController: ToastController
  ) { }

  private async mostrarMensagem(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')

    this.carregarDados()
  }

  atualizar(event) {
    this.carregarBebes().then(() => {
      event.target.complete()
    })
  }

  async carregarDados() {
    await this.carregarGestacao()
    if(this.gestacao)
      await this.carregarBebes()
  }

  async carregarGestacao() {
    this.carregando = true
    try {

      this.mae = await this.maeServico.buscarPorId(this.idMae)
      this.gestacao = await this.maeServico.buscarGestacaoPorId(this.idGestacao)

      this.carregando = false
      
    } catch(error) {
      this.carregando = false
      this.voltar()
      
    }
  }

  async carregarBebes() {
    this.carregando = true
    try {
      
      this.bebes = await this.maeServico.buscarBebePorGestacao(this.idGestacao)
      this.carregando = false
      if(this.bebes.length == 0)
        this.mostrarMensagem("Nenhum bebê cadastrado")

    } catch(error) {
      this.carregando = false
      this.mostrarMensagem("Não foi possível buscar os bebês cadastrados")
    }
  }

  voltar() {
    this.router.navigate(["mae", this.idMae, "gestacao"])
  }

  abrirCadastroBebe() {
    this.router.navigate(["mae", this.idMae, "gestacao", this.idGestacao, "bebe", "cadastro"])
  }

  abrirEdicaoBebe() {
    this.router.navigate(["bebe", "cadastro"])
  }

  abrirAcompanhamento(bebe) {
    this.router.navigate([
      "mae", this.idMae, 
      "gestacao", this.idGestacao, 
      "bebe", bebe.id_bebe, "acompanhamento"
    ])
  }

  formatarData(data) {
    return moment(data).isValid() ? moment(data).format('DD/MM/YYYY') : ''
  }

}
