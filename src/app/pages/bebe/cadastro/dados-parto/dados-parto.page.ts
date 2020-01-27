import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioBebe } from '../../../../services/formulario/formulario-bebe.service';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dados-parto',
  templateUrl: './dados-parto.page.html',
  styleUrls: ['./dados-parto.page.scss'],
})
export class DadosPartoPage implements OnInit {

  public idMae:any
  public idGestacao:any
  public bebeForm: FormGroup;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public servico: FormularioBebe
  ) { 
    this.bebeForm = servico.getFormAbaDadosParto()
  }

  ionViewDidEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')
  }

  voltar() {
    this.servico.abrirFormAbaDadosBebe(this.idMae, this.idGestacao)
  }

  salvar() {
    this.servico.abrirFormAbaDadosTestes(this.idMae, this.idGestacao)
  }

  ngOnInit() {
  }

}
