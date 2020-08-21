import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioAcompanhamentoGestacao } from 'src/app/services/formulario/formulario-acompanhamento-gestacao.service';

@Component({
  selector: 'app-dados-gestacao2',
  templateUrl: './dados-gestacao2.page.html',
  styleUrls: ['./dados-gestacao2.page.scss'],
})

export class DadosGestacao2Page implements OnInit {

  public idMae:any
  public idGestacao:any
  public acompanhamentoForm: FormGroup

  public tipoGestacaoQueixaAtividade: Array<any> = []
  public tipoGestacaoExercicioFisico: Array<any> = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public servico: FormularioAcompanhamentoGestacao
  ) { 
    this.acompanhamentoForm = servico.getFormDadosGestacao2()
  }

  ionViewDidEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')
  }

  escolherTipoGestacaoQueixaAtividade() {
    let selecionados = []
    this.tipoGestacaoQueixaAtividade.forEach(item => { selecionados.push(new FormControl(item)) })

    this.acompanhamentoForm.setControl("ref_gestacao_queixa_atividade", new FormArray(selecionados))
  }

  escolherTipoGestacaoExercicioFisico() {
    let selecionados = []
    this.tipoGestacaoExercicioFisico.forEach(item => { selecionados.push(new FormControl(item)) })

    this.acompanhamentoForm.setControl("ref_gestacao_exercicio_fisico", new FormArray(selecionados))
  }

  voltar() {
    this.servico.abrirFormDadosGestacao1(this.idMae, this.idGestacao)
  }

  salvar() {
    this.servico.abrirFormDadosGestacao3(this.idMae, this.idGestacao)
  }

  ngOnInit() {
  }

}

