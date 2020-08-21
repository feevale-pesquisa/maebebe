import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioAcompanhamentoGestacao } from 'src/app/services/formulario/formulario-acompanhamento-gestacao.service';

@Component({
  selector: 'app-dados-gestacao1',
  templateUrl: './dados-gestacao1.page.html',
  styleUrls: ['./dados-gestacao1.page.scss'],
})

export class DadosGestacao1Page implements OnInit {

  public idMae:any
  public idGestacao:any
  public acompanhamentoForm: FormGroup

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public servico: FormularioAcompanhamentoGestacao
  ) { 
    this.acompanhamentoForm = servico.getFormDadosGestacao1()
  }

  ionViewDidEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')
  }

  voltar() {
    this.router.navigate(["mae", this.idMae ,"gestacao", this.idGestacao, "acompanhamento"])
  }

  salvar() {
    this.servico.abrirFormDadosGestacao2(this.idMae, this.idGestacao)
  }


  ngOnInit() {
  }

}

