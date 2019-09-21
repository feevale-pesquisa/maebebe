import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioBebe } from '../../../../services/formulario/formulario-bebe.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dados-documentos',
  templateUrl: './dados-documentos.page.html',
  styleUrls: ['./dados-documentos.page.scss'],
})
export class DadosDocumentosPage implements OnInit {

  public idMae:Number
  public idGestacao:Number
  public bebeForm: FormGroup

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    public servico: FormularioBebe
  ) { 
    this.bebeForm = servico.getFormAbaDadosDocumentos()
  }

  ionViewDidEnter() {
    this.idMae = Number(this.route.snapshot.paramMap.get('id_mae'))
    this.idGestacao = Number(this.route.snapshot.paramMap.get('id_gestacao'))
  }

  voltar() {
    this.servico.abrirFormAbaDadosIntercorrencias(this.idMae, this.idGestacao)
  }

  salvar() {
    this.servico.salvar(this.idMae, this.idGestacao)
  }

  ngOnInit() {
  }

}
