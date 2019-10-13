import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioGestacao } from '../../../../services/formulario/formulario-gestacao.service';

@Component({
  selector: 'app-dados-planejamento',
  templateUrl: './dados-planejamento.page.html',
  styleUrls: ['./dados-planejamento.page.scss'],
})
export class DadosPlanejamentoPage implements OnInit {

  public tiposPlanejamentoGestacao: Array<any>;
  public tiposMAC: Array<any>;
  public gestacaoForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public servico: FormularioGestacao) { 

    this.gestacaoForm = servico.getFormAbaDadosPlanejamento()
  }

  voltar() {
    let id:number = Number(this.route.snapshot.paramMap.get('id_mae'))
    this.servico.abrirFormAbaDadosGestacao(id);
  }

  salvar() {
    let id:number = Number(this.route.snapshot.paramMap.get('id_mae'))
    this.servico.abrirFormAbaDadosPreNatal(id);
  }

  escolherTipoPlanejamentoGestacao() {
    let selecionados = []
    this.tiposPlanejamentoGestacao.forEach(item => { selecionados.push(new FormControl(item)) })

    this.gestacaoForm.setControl("ref_gestacao_planejamento_gestacao", new FormArray(selecionados))
  }

  escolherTipoMAC() {
    let selecionados = []
    this.tiposMAC.forEach(item => { selecionados.push(new FormControl(item)) })

    this.gestacaoForm.setControl("ref_mac_gestacao", new FormArray(selecionados))
  }

  ngOnInit() {
  }

}
