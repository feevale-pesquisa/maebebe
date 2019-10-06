import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { GerenciadorTiposService } from './gerenciador-tipos.service';
import { Router } from '@angular/router';
import { API } from '../http/api';
import * as moment from 'moment';
import { AlertService } from '../helpers/alert.service';
import { User } from '../login/user';
import { LoginService } from '../login/login.service';
import { Validators as V } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormularioMae {

  public idUsuario:any;

  public salvando: boolean = false;

  private formDadosMaeInicial: FormGroup;
  private formDadosPessoais: FormGroup;
  private formDadosResidenciais: FormGroup;
  private formDadosOutrasInformacoes: FormGroup;



  public areas = [];
  public microAreas = [];
  public estados = [];
  public moradias = [];
  public escolaridades = [];
  public rendaFamiliar = [];



  constructor( private gerenciadorTipos: GerenciadorTiposService, 
    private api: API,
    private router: Router,
    private login: LoginService,
    private alert: AlertService
    ) {
    this.buscarTipos();
  }

  private limparFormularios() {
    try {
        this.formDadosMaeInicial.reset()
        this.formDadosPessoais.reset()
        this.formDadosResidenciais.reset()
        this.formDadosOutrasInformacoes.reset()
    } catch (error) { }
  }

  getFormAbaDadosMae(): FormGroup {
    let builder = new FormBuilder()

    this.formDadosMaeInicial = builder.group({
      id_area: new FormControl(''),
      id_micro_area: new FormControl(''),
   
    });

    return this.formDadosMaeInicial
  }

  getFormAbaDadosPessoais(): FormGroup {
    let builder = new FormBuilder()

    this.formDadosPessoais = builder.group({
      dt_inicio_projeto_maebebe: new FormControl(''),
      nome: new FormControl(''),
      email: new FormControl(''),
      cpf: new FormControl('', [ V.maxLength(11) ]),
      rg: new FormControl('', [ V.maxLength(11) ]),
      cartao_sus: new FormControl(''),
      idade: new FormControl(''),
      endereco: new FormControl(''),
      telefone: new FormControl(''),
      telefone_contato: new FormControl(''),
      dt_nascimento: new FormControl('')
    });

    return this.formDadosPessoais
  }
  
  getFormAbaDadosResidenciais(): FormGroup {
    let builder = new FormBuilder()

    this.formDadosResidenciais = builder.group({
      cep: new FormControl(''),
      id_estado: new FormControl(''),
      id_cidade: new FormControl(''),
      id_bairro: new FormControl(''),
      endereco: new FormControl(''),
      numero: new FormControl(''),
      complemento: new FormControl(''),
      ponto_referencia: new FormControl(''),
      id_moradia: new FormControl(''),

    });

    return this.formDadosResidenciais
  }

  getFormAbaDadosOutrasInformacoes(): FormGroup {
    let builder = new FormBuilder()

    this.formDadosOutrasInformacoes = builder.group({
      id_escolaridade: new FormControl(''),
      trabalha_fora: new FormControl(''),
      profissao: new FormControl(''),
      quando_retorna_trabalho: new FormControl(''),
      id_tipo_renda_mensal: new FormControl(''),
      renda_quantidade_moradores: new FormControl(''),
      id_estado_civil: new FormControl(''),
      imagem: new FormControl(''),
      obs: new FormControl(''),
    });

    return this.formDadosOutrasInformacoes
  }

  async buscarTipos() {
    this.areas = await this.gerenciadorTipos.buscarTipo('area');
    this.estados = await this.gerenciadorTipos.buscarTipo('estado');
    this.moradias = await this.gerenciadorTipos.buscarTipo('moradia');
    this.escolaridades = await this.gerenciadorTipos.buscarTipo('escolaridade');
    this.rendaFamiliar = await this.gerenciadorTipos.buscarTipo('tipo_renda_mensal');
  }

  async buscarMicroAreas(area: string){
    
    this.microAreas = await this.gerenciadorTipos.buscarMicroArea('micro_area', area);
  }

  async mapearCampos() {
    let usuario:User = await this.login.getUser()

    let camposUsuario = {
        dt_registro: moment().format('DD/MM/YYYY'),
        id_usuario_registro: usuario.id
    }

    let camposFormDadosMae:any = this.formDadosPessoais.getRawValue()


    let dt_nascimento:moment.Moment = moment(camposFormDadosMae.dt_nascimento)
    if(dt_nascimento.isValid()) camposFormDadosMae.dt_nascimento = dt_nascimento.format('DD/MM/YYYY')

    let dt_inicio_projeto_maebebe:moment.Moment = moment(camposFormDadosMae.dt_inicio_projeto_maebebe)
    if(dt_inicio_projeto_maebebe.isValid()) camposFormDadosMae.dt_inicio_projeto_maebebe = dt_inicio_projeto_maebebe.format('DD/MM/YYYY')

    let campos = { 
        ...camposUsuario,
        ...camposFormDadosMae,
        ...this.formDadosMaeInicial.getRawValue(),
        ...this.formDadosResidenciais.getRawValue(),
        ...this.formDadosOutrasInformacoes.getRawValue(),
    }
    return campos
  }

    async salvar() {
      try {
        this.salvando = true

        let campos:object = await this.mapearCampos()
        let resposta: {id: any} =  await this.api.salvarFormulario('mae/new', campos);
        this.acoesAposSalvar(resposta.id)

        this.salvando = false
        this.limparFormularios()
        
      } catch (error) {
        this.salvando = false
        throw error
      }
    }

    private acoesAposSalvar(idMae: any) {
      this.alert.confirm("Mãe cadastrada com sucesso, deseja cadastrar uma gestação?",
      () => { //Sim
        this.router.navigate(["mae", idMae, "gestacao", "cadastro"]);
      },
      () => { //Não
      this.router.navigate(["mae", idMae]);
      })
    }
}
