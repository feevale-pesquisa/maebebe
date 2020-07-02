import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioAcompanhamentoBebe } from 'src/app/services/formulario/formulario-acompanhamento-bebe.service';

@Component({
  selector: 'app-dados-amamentacao2',
  templateUrl: './dados-amamentacao2.page.html',
  styleUrls: ['./dados-amamentacao2.page.scss'],
})
export class DadosAmamentacao2Page implements OnInit {

  public idMae:any
  public idGestacao:any
  public idBebe:any
  public acompanhamentoForm: FormGroup

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public servico: FormularioAcompanhamentoBebe
  ) { 
    this.acompanhamentoForm = servico.getFormAbaDadosAmamentacao2()
  }

  ionViewDidEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')
    this.idBebe = this.route.snapshot.paramMap.get('id_bebe')
  }

  voltar() {
    this.router.navigate(["mae", this.idMae ,"gestacao", this.idGestacao, "bebe", this.idBebe, "acompanhamento"])
  }

  salvar() {
    this.servico.abrirFormAbaDadosRecemNascido1(this.idMae, this.idGestacao, this.idBebe)
  }

  ngOnInit() {
  }

}
