import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FormularioMae } from '../../../../services/formulario/formulario-mae.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  public maeForm: FormGroup;
  public microareas = []

  constructor(private route: ActivatedRoute, private builder: FormBuilder, private location: Location, public servico: FormularioMae) { 
    let id:any = this.route.snapshot.paramMap.get('id')
    this.maeForm = servico.getFormAbaDadosMae(id)
  }

  changeMicroAreas() {
    this.microareas = []
    this.maeForm.controls['id_micro_area'].setValue("")
    let area = this.maeForm.get("id_area").value
    this.microareas = this.servico.microAreas.filter(microarea => { return microarea.id_area == area }) 
  }

  voltar() {
    this.servico.abrirListagemMae()
  }

  salvar() {
    this.servico.abrirFormAbaDadosPessoais()
  }

  ngOnInit() {
  }

}
