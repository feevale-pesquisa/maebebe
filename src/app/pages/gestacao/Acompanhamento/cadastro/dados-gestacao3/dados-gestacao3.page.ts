import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioAcompanhamentoGestacao } from 'src/app/services/formulario/formulario-acompanhamento-gestacao.service';

@Component({
  selector: 'app-dados-gestacao3',
  templateUrl: './dados-gestacao3.page.html',
  styleUrls: ['./dados-gestacao3.page.scss'],
})

export class DadosGestacao3Page implements OnInit {

  public idMae:any
  public idGestacao:any
  public acompanhamentoForm: FormGroup

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public servico: FormularioAcompanhamentoGestacao
  ) { 
    this.acompanhamentoForm = servico.getFormDadosGestacao3()
  }

  ionViewDidEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')
  }

  voltar() {
    this.servico.abrirFormDadosGestacao2(this.idMae, this.idGestacao)
  }

  salvar() {
     this.servico.salvar(this.idMae, this.idGestacao)
  }

  ngOnInit() {
  }

}

