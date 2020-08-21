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

  voltar() {
    this.servico.abrirFormDadosGestacao1(this.idMae, this.idGestacao)
  }

  salvar() {
    this.servico.abrirFormDadosGestacao3(this.idMae, this.idGestacao)
  }

  ngOnInit() {
  }

}

