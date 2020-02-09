import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormularioMae } from '../../../../services/formulario/formulario-mae.service';

@Component({
  selector: 'app-dados-residencia',
  templateUrl: './dados-residencia.page.html',
  styleUrls: ['./dados-residencia.page.scss'],
})
export class DadosResidenciaPage implements OnInit {

  public maeForm: FormGroup;

  constructor(private route: ActivatedRoute, private builder: FormBuilder, public servico: FormularioMae) { 
    let id:any = this.route.snapshot.paramMap.get('id')
    this.maeForm = servico.getFormAbaDadosResidenciais(id);
  }

  voltar() {
    this.servico.abrirFormAbaDadosPessoais()
  }

  salvar() {
    this.servico.abrirFormAbaOutrasInformacoes()
  }

  listarBairrosPorCidade() {
    return this.servico.listaBairros.filter(bairro => {
      return bairro.id_cidade == this.maeForm.get('id_cidade').value
    })
  }

  ngOnInit() {
  }

}
