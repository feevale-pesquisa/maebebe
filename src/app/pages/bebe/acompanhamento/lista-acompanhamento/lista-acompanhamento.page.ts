import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lista-acompanhamento',
  templateUrl: './lista-acompanhamento.page.html',
  styleUrls: ['./lista-acompanhamento.page.scss'],
})
export class ListaAcompanhamentoPage implements OnInit {

  public idMae: string
  public idGestacao: string
  public idBebe: string

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')
    this.idBebe = this.route.snapshot.paramMap.get('id_bebe')
  }

  abrirCadastroAcompanhamento() {
    this.router.navigate([
      "mae", this.idMae, 
      "gestacao", this.idGestacao, 
      "bebe", this.idBebe, "acompanhamento", "cadastro"
    ])
  }

  voltar() {
    this.router.navigate(["mae", this.idMae, "gestacao", this.idGestacao, "bebe"])
  }

}
