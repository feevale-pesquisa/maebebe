import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioAcompanhamentoBebe } from 'src/app/services/formulario/formulario-acompanhamento-bebe.service';

@Component({
  selector: 'app-dados-recem-nascido3',
  templateUrl: './dados-recem-nascido3.page.html',
  styleUrls: ['./dados-recem-nascido3.page.scss'],
})
export class DadosRecemNascido3Page implements OnInit {

  public idMae:any
  public idGestacao:any
  public idBebe:any
  public acompanhamentoForm: FormGroup

  public tipoRegulacaoNeurologica: Array<any> = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public servico: FormularioAcompanhamentoBebe
  ) { 
    this.acompanhamentoForm = servico.getFormAbaDadosRecemNascido3()
  }

  ionViewDidEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')
    this.idBebe = this.route.snapshot.paramMap.get('id_bebe')
  }

  escolherTipoRegulacaoNeurologica() {
    let selecionados = []
    this.tipoRegulacaoNeurologica.forEach(item => { selecionados.push(new FormControl(item)) })

    this.acompanhamentoForm.setControl("ref_bebe_acomp_tipo_regulacao_neurologica", new FormArray(selecionados))
  }

  voltar() {
    this.servico.abrirFormAbaDadosRecemNascido2(this.idMae, this.idGestacao, this.idBebe)
  }

  salvar() {
    this.servico.abrirFormAbaDadosRecemNascido4(this.idMae, this.idGestacao, this.idBebe)
  }

  ngOnInit() {
  }

}
