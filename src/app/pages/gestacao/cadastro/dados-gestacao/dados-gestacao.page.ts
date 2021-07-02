import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioGestacao } from '../../../../services/formulario/formulario-gestacao.service';

@Component({
  selector: 'app-dados-gestacao',
  templateUrl: './dados-gestacao.page.html',
  styleUrls: ['./dados-gestacao.page.scss'],
})
export class DadosGestacaoPage implements OnInit {

  public gestacaoForm: FormGroup;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    public servico: FormularioGestacao) { 
    
    this.gestacaoForm = servico.getFormAbaDadosGestacao()
  }

  voltar() {
    let id = this.route.snapshot.paramMap.get('id_mae')
    this.router.navigate(["mae", id, "gestacao"])
  }

  salvar() {
    let id:any = this.route.snapshot.paramMap.get('id_mae')
    this.servico.abrirFormAbaDadosPreNatal(id);
  }

  definirUsuarioDesfecho() {
    if(this.gestacaoForm.get("id_tipo_desfecho").value == 1) {
      this.gestacaoForm.setControl("id_usuario_registro_desfecho", this.servico.idUsuario)
    } else {
      this.gestacaoForm.setControl("id_usuario_registro_desfecho", null)
    }
  }

  ngOnInit() {
  }

}
