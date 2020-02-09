import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormularioMae } from '../../../../services/formulario/formulario-mae.service';


@Component({
  selector: 'app-outras-informacoes',
  templateUrl: './outras-informacoes.page.html',
  styleUrls: ['./outras-informacoes.page.scss'],
})
export class OutrasInformacoesPage implements OnInit {

  public maeForm: FormGroup;

  constructor(private route: ActivatedRoute, private builder: FormBuilder, public servico: FormularioMae) {
    let id:any = this.route.snapshot.paramMap.get('id')
    this.maeForm = servico.getFormAbaDadosOutrasInformacoes(id)
  }

  voltar() {
    this.servico.abrirFormAbaDadosResidenciais()
  }

  salvar() {
    this.servico.salvar();
  }

  selecionarImagem(event) {
    if(event.target.files.length > 0) 
    {
      this.servico.imagem = event.target.files[0]
    }
  }

  ngOnInit() {
  }

}
