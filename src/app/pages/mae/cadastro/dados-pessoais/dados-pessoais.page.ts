import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormularioMae } from '../../../../services/formulario/formulario-mae.service';


@Component({
  selector: 'app-dados-pessoais',
  templateUrl: './dados-pessoais.page.html',
  styleUrls: ['./dados-pessoais.page.scss'],
})
export class DadosPessoaisPage implements OnInit {

  public maeForm: FormGroup; // Ver nomenclatura com Jefferson

  constructor(private route: ActivatedRoute, private builder: FormBuilder, public servico: FormularioMae) { 
    let id:any = this.route.snapshot.paramMap.get('id')
    this.maeForm = servico.getFormAbaDadosPessoais(id)
  }

  voltar() {
    this.servico.abrirFormAbaDadosMae()
  }

  salvar() {
    this.servico.abrirFormAbaDadosResidenciais()
  }

  ngOnInit() {
  }

}
