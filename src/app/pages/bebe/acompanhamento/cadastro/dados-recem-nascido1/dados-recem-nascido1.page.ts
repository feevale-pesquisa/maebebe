import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioAcompanhamentoBebe } from 'src/app/services/formulario/formulario-acompanhamento-bebe.service';

@Component({
  selector: 'app-dados-recem-nascido1',
  templateUrl: './dados-recem-nascido1.page.html',
  styleUrls: ['./dados-recem-nascido1.page.scss'],
})
export class DadosRecemNascido1Page implements OnInit {

  public idMae:any
  public idGestacao:any
  public idBebe:any
  public acompanhamentoForm: FormGroup

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public servico: FormularioAcompanhamentoBebe
  ) { 
    this.acompanhamentoForm = servico.getFormAbaDadosRecemNascido1()
  }

  ionViewDidEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')
    this.idBebe = this.route.snapshot.paramMap.get('id_bebe')
  }

  voltar() {
    this.servico.abrirFormAbaDadosAmamentacao2(this.idMae, this.idGestacao, this.idBebe)
  }

  salvar() {
    //this.servico.abrirFormAbaDadosRecemNascido2(this.idMae, this.idGestacao, this.idBebe)
    this.servico.abrirFormAbaDadosRecemNascido4(this.idMae, this.idGestacao, this.idBebe)
  }

  ngOnInit() {
  }

}
