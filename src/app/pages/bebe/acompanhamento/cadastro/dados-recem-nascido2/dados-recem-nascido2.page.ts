import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioAcompanhamentoBebe } from 'src/app/services/formulario/formulario-acompanhamento-bebe.service';

@Component({
  selector: 'app-dados-recem-nascido2',
  templateUrl: './dados-recem-nascido2.page.html',
  styleUrls: ['./dados-recem-nascido2.page.scss'],
})
export class DadosRecemNascido2Page implements OnInit {

  public idMae:any
  public idGestacao:any
  public idBebe:any
  public acompanhamentoForm: FormGroup

  public tipoPele: Array<any> = []
  public tipoCavidadeOral: Array<any> = []
  public tipoTorax: Array<any> = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public servico: FormularioAcompanhamentoBebe
  ) { 
    this.acompanhamentoForm = servico.getFormAbaDadosRecemNascido2()
  }

  ionViewDidEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')
    this.idBebe = this.route.snapshot.paramMap.get('id_bebe')
  }

  escolherTipoPele() {
    let selecionados = []
    this.tipoPele.forEach(item => { selecionados.push(new FormControl(item)) })

    this.acompanhamentoForm.setControl("ref_bebe_acomp_tipo_pele", new FormArray(selecionados))
  }

  escolherTipoCavidadeOral() {
    let selecionados = []
    this.tipoCavidadeOral.forEach(item => { selecionados.push(new FormControl(item)) })

    this.acompanhamentoForm.setControl("ref_bebe_acomp_tipo_cavidade_oral", new FormArray(selecionados))
  }

  escolherTipoTorax() {
    let selecionados = []
    this.tipoTorax.forEach(item => { selecionados.push(new FormControl(item)) })

    this.acompanhamentoForm.setControl("ref_bebe_acomp_tipo_torax", new FormArray(selecionados))
}

  voltar() {
    this.servico.abrirFormAbaDadosRecemNascido1(this.idMae, this.idGestacao, this.idBebe)
  }

  salvar() {
    this.servico.abrirFormAbaDadosRecemNascido3(this.idMae, this.idGestacao, this.idBebe)
  }

  ngOnInit() {
  }

}
