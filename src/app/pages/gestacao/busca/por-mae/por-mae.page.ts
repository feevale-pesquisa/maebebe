import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { BuscaMaeService } from '../../../../services/busca/busca-mae.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-por-mae',
  templateUrl: './por-mae.page.html',
  styleUrls: ['./por-mae.page.scss'],
})
export class PorMaePage implements OnInit {

  public gestacoes: Array<any> = []
  public mae: any = null
  public carregando: boolean = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private maeServico: BuscaMaeService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    
  }

  private async mostrarMensagem(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'middle'
    });
    toast.present();
  }

  ionViewWillEnter() {
    this.carregarDados()    
  }

  atualizar(event) {
    let id:string = this.route.snapshot.paramMap.get('id')
    this.carregarGestacoes(id).then(() => {
      event.target.complete()
    })
  }

  async carregarDados() {
    let id:string = this.route.snapshot.paramMap.get('id')

    await this.carregarMae(id)
    if(this.mae)
      await this.carregarGestacoes(id)
  }

  async carregarMae(id) {
    this.carregando = true
    try {
      
      this.mae = await this.maeServico.buscarPorId(id)
      this.carregando = false

    } catch(error) {

      this.carregando = false
      this.voltar()
      
    }
  }

  async carregarGestacoes(id) {
    this.carregando = true
    try {
      
      this.gestacoes = await this.maeServico.buscarGestacaoPorMae(id)
      
      this.carregando = false
      if(this.gestacoes.length == 0)
        this.mostrarMensagem("Nenhuma gestação cadastrada")

    } catch(error) {
      console.log(error)
      this.carregando = false
      await this.mostrarMensagem("Não foi possível buscar gestações cadastradas")
    }
  }

  voltar() {
    this.router.navigate(["mae", "consulta", "busca"])
  }

  abrirCadastroGestacao() {
    this.router.navigate(["mae", this.mae.id, "gestacao", "cadastro"])
  }
  
  abrirEdicaoGestacao(gestacao: { id: number }) {
    this.router.navigate(["gestacao", "cadastro"])
  }

  abrirAcompanhamento(gestacao) {
    this.router.navigate([
      "mae", this.mae.id, 
      "gestacao", gestacao.id, "acompanhamento"
    ])
  }


  abrirListagemBebes(gestacao: { id_gestacao: number }) {
    this.router.navigate(["mae", this.mae.id, "gestacao", gestacao.id_gestacao, 'bebe'])
  }

}
