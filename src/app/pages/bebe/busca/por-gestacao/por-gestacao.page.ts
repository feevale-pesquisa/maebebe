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
      position: 'top'
    });
    toast.present();
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')

    this.carregarGestacao(this.idGestacao)
    this.carregarBebes(this.idGestacao)
  }

  async carregarGestacao(id) {
    this.carregando = true
    this.mae = await this.maeServico.buscarPorId(this.idMae)
    this.gestacao = await this.maeServico.buscarGestacaoPorId(id)
    this.carregando = false
  }

  async carregarBebes(id) {
    this.carregando = true
    this.bebes = await this.maeServico.buscarBebePorGestacao(id)
    this.carregando = false
    if(this.bebes.length == 0)
      this.mostrarMensagem("Nenhum bebê cadastrado")
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

  formatarData(data) {
    return moment(data).isValid() ? moment(data).format('DD/MM/YYYY') : ''
  }

}
