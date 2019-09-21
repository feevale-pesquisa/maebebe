import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioBebe } from '../../../../services/formulario/formulario-bebe.service';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dados-testes',
  templateUrl: './dados-testes.page.html',
  styleUrls: ['./dados-testes.page.scss'],
})
export class DadosTestesPage implements OnInit {

  public idMae:Number
  public idGestacao:Number
  public bebeForm: FormGroup;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public servico: FormularioBebe
  ) { 
    this.bebeForm = servico.getFormAbaDadosTestes()
  }

  ionViewDidEnter() {
    this.idMae = Number(this.route.snapshot.paramMap.get('id_mae'))
    this.idGestacao = Number(this.route.snapshot.paramMap.get('id_gestacao'))
  }

  voltar() {
    this.servico.abrirFormAbaDadosParto(this.idMae, this.idGestacao)
  }

  salvar() {
    this.servico.abrirFormAbaDadosIntercorrencias(this.idMae, this.idGestacao)
  }

  ngOnInit() {
  }

}
