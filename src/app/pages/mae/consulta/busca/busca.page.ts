import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BuscaMaeService } from '../../../../services/busca/busca-mae.service';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
})
export class BuscaPage implements OnInit {

  private pagina: number = 1
  public busca: String = ""
  public maes: any = []
  private infiniteScroll = null
  public carregando: boolean = false

  constructor(
    private router: Router, 
    private servico: BuscaMaeService,
    private toastController: ToastController
  ) { }

  private async mostrarMensagem(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  voltar() {
    this.router.navigateByUrl("/inicio")
  }

  abrirEdicaoMae(mae: { id: number }) {
    this.router.navigateByUrl('/mae/'+ mae.id +'/edicao')
  }

  abrirGestacoes(mae: { id: number }) {
    this.router.navigateByUrl('/mae/'+ mae.id +'/gestacao')
  }

  abrirEvolucoes(mae: Object) {
    this.router.navigateByUrl('/inicio')
  }


  async buscarMaes() {
    this.carregando = true

    try {
      this.maes = await this.servico.buscar(this.busca)
    } catch (error) {
      this.maes = []
    }

    this.carregando = false

    if(this.maes.length == 0) {
      this.mostrarMensagem("A busca não retornou resultado")
    }

    this.pagina = 1

    if(this.infiniteScroll) 
      this.infiniteScroll.disabled = false
  }

  async carregarPaginas(event) {
    this.infiniteScroll = event.target

    this.pagina++
    this.carregando = true
    
    let resultado = [];

    try {
      resultado = await this.servico.buscar(this.busca, this.pagina)
    } catch (error) {
      console.log(error)
      resultado = []
    }

    this.carregando = false
    
    if(resultado.length == 0) {
      this.infiniteScroll.disabled = true
      return
    }

    this.maes = this.maes.concat(resultado)
    
    this.infiniteScroll.complete()
  }

  ngOnInit() {
  }

  formatarData(data) {
    return moment(data).isValid() ? moment(data).format('DD/MM/YYYY') : ''
  }

  abrirCadastroMae() {
    this.router.navigateByUrl("/mae/cadastro")
  }
}
