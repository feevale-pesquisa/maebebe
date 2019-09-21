import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioBebe } from '../../../../services/formulario/formulario-bebe.service';
import { Location } from '@angular/common';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dados-intercorrencias',
  templateUrl: './dados-intercorrencias.page.html',
  styleUrls: ['./dados-intercorrencias.page.scss'],
})
export class DadosIntercorrenciasPage implements OnInit {

  public tiposIntercorrenciasNeonatal: Array<any>;
  public tiposIntercorrenciasPrimeiroAno: Array<any>;
  public idMae:Number
  public idGestacao:Number
  public bebeForm: FormGroup;
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private location: Location,
    public servico: FormularioBebe
  ) { 
    this.bebeForm = servico.getFormAbaDadosIntercorrencias()
  }

  ionViewDidEnter() {
    this.idMae = Number(this.route.snapshot.paramMap.get('id_mae'))
    this.idGestacao = Number(this.route.snapshot.paramMap.get('id_gestacao'))
  }

  voltar() {
    this.servico.abrirFormAbaDadosTestes(this.idMae, this.idGestacao)
  }

  salvar() {
    this.servico.abrirFormAbaDadosDocumentos(this.idMae, this.idGestacao) 
  }

  escolherTiposIntercorrenciasNeonatal() {
    let selecionados = []
    this.tiposIntercorrenciasNeonatal.forEach(item => { selecionados.push(new FormControl(item)) })

    this.bebeForm.setControl("ref_bebe_intercorrencia_peri_neonatal", new FormArray(selecionados))
  }

  escolherTiposIntercorrenciasPrimeiroAno() {
    let selecionados = []
    this.tiposIntercorrenciasPrimeiroAno.forEach(item => { selecionados.push(new FormControl(item)) })

    this.bebeForm.setControl("ref_bebe_intercorrencia_primeiro_ano_vida", new FormArray(selecionados))
  }

  ngOnInit() {
  }

}
