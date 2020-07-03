import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioAcompanhamentoBebe } from 'src/app/services/formulario/formulario-acompanhamento-bebe.service';

@Component({
  selector: 'app-dados-amamentacao1',
  templateUrl: './dados-amamentacao1.page.html',
  styleUrls: ['./dados-amamentacao1.page.scss'],
})
export class DadosAmamentacao1Page implements OnInit {

  public idMae:any
  public idGestacao:any
  public idBebe:any
  public acompanhamentoForm: FormGroup

  public tipoMamilo: Array<any> = []
  public tipoDesmamePrecoce: Array<any> = []

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public servico: FormularioAcompanhamentoBebe
  ) { 
    this.acompanhamentoForm = servico.getFormAbaDadosAmamentacao1()
  }

  ionViewDidEnter() {
    this.idMae = this.route.snapshot.paramMap.get('id_mae')
    this.idGestacao = this.route.snapshot.paramMap.get('id_gestacao')
    this.idBebe = this.route.snapshot.paramMap.get('id_bebe')
  }

  voltar() {
    this.router.navigate(["mae", this.idMae ,"gestacao", this.idGestacao, "bebe", this.idBebe, "acompanhamento"])
  }

  salvar() {
    this.servico.abrirFormAbaDadosAmamentacao2(this.idMae, this.idGestacao, this.idBebe)
  }

  escolherTipoMamilo() {
    let selecionados = []
    this.tipoMamilo.forEach(item => { selecionados.push(new FormControl(item)) })

    this.acompanhamentoForm.setControl("ref_bebe_acomp_tipo_mamilo", new FormArray(selecionados))
  }

  escolherTipoDesmamePrecoce() {
    let selecionados = []
    this.tipoDesmamePrecoce.forEach(item => { selecionados.push(new FormControl(item)) })

    this.acompanhamentoForm.setControl("ref_bebe_acomp_tipo_desmame_precoce", new FormArray(selecionados))
  }

  ngOnInit() {
  }

}
