import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FormularioMae } from '../../../../services/formulario/formulario-mae.service';


@Component({
  selector: 'app-outras-informacoes',
  templateUrl: './outras-informacoes.page.html',
  styleUrls: ['./outras-informacoes.page.scss'],
})
export class OutrasInformacoesPage implements OnInit {

  public maeForm: FormGroup;

  constructor(private router: Router, private builder: FormBuilder, public servico: FormularioMae) { 

    this.maeForm = servico.getFormAbaDadosOutrasInformacoes();

  }

  voltar() {
    this.router.navigateByUrl("/mae/cadastro/dados-residencia")
  }

  salvar() {
    console.log(this.maeForm)
    this.servico.salvar();
  }

  selecionarImagem(event) {
    if(event.target.files.length > 0) 
    {
      console.log(event.target.files[0]);
    }
  }

  ngOnInit() {
  }

}
