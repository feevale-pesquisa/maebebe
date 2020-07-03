import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
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

  public tipoOrientacaoAmamentacao: Array<any> = []
  public tipoBebeMamada: Array<any> = []

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

  escolherTipoOrientacaoAmamentacao() {
    let selecionados = []
    this.tipoOrientacaoAmamentacao.forEach(item => { selecionados.push(new FormControl(item)) })

    this.acompanhamentoForm.setControl("ref_bebe_acomp_tipo_orientacao_amamentacao", new FormArray(selecionados))
  }

  escolherTipoBebeMamada() {
    let selecionados = []
    this.tipoBebeMamada.forEach(item => { selecionados.push(new FormControl(item)) })

    this.acompanhamentoForm.setControl("ref_bebe_acomp_tipo_bebe_mamada", new FormArray(selecionados))
  }

  voltar() {
    this.servico.abrirFormAbaDadosAmamentacao1(this.idMae, this.idGestacao, this.idBebe)
  }

  salvar() {
    this.servico.abrirFormAbaDadosRecemNascido1(this.idMae, this.idGestacao, this.idBebe)
  }

  ngOnInit() {
  }

}
