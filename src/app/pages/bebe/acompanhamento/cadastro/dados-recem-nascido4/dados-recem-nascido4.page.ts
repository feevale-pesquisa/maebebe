import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioAcompanhamentoBebe } from 'src/app/services/formulario/formulario-acompanhamento-bebe.service';

@Component({
  selector: 'app-dados-recem-nascido4',
  templateUrl: './dados-recem-nascido4.page.html',
  styleUrls: ['./dados-recem-nascido4.page.scss'],
})
export class DadosRecemNascido4Page implements OnInit {

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
    this.acompanhamentoForm = servico.getFormAbaDadosRecemNascido4()
  }

  ionViewDidEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')
    this.idBebe = this.route.snapshot.paramMap.get('id_bebe')
  }

  //TODO:Rever esse campo

  // escolherTipoRegulacaoNeurologica() {
  //   let selecionados = []
  //   this.tipoRegulacaoNeurologica.forEach(item => { selecionados.push(new FormControl(item)) })

  //   this.acompanhamentoForm.setControl("ref_bebe_acomp_tipo_regulacao_neurologica", new FormArray(selecionados))
  // }

  voltar() {
    this.servico.abrirFormAbaDadosRecemNascido1(this.idMae, this.idGestacao, this.idBebe)
  }

  salvar() {
    this.servico.salvar(this.idMae, this.idGestacao, this.idBebe)
  }

  ngOnInit() {
  }

}
