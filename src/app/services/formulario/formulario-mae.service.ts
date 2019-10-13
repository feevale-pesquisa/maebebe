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
  public imagem = new File([""], "")

  public areas = [];
  public microAreas = [];
  public listaEstados = []
  public listaCidades = [
      { id: 4137, id_estado: 23, nome: "Novo Hamburgo" },
      { id: 4005, id_estado: 23, nome: "Estância Velha" },
  ]
  public listaBairros = []
  public listaTrabalhaFora = [
    { descricao: 'Sim', id: '1' },
    { descricao: 'Não', id: '0' },
  ]
  public listaEstadoCivil = []
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
      id_area: new FormControl('', [ V.required ]),
      id_micro_area: new FormControl(''),
      dt_inicio_projeto_maebebe: new FormControl(moment().format('YYYY-MM-DD'), [ V.required ]),
      nome: new FormControl('', [ V.required ]),
      dt_nascimento: new FormControl('', [ V.required ]),
      id_escolaridade: new FormControl('', [ V.required ]),
      cpf: new FormControl('', [ V.maxLength(14), V.required ]),
      rg: new FormControl('', [ V.required ]),
    });

    return this.formDadosMaeInicial
  }

  getFormAbaDadosPessoais(): FormGroup {
    let builder = new FormBuilder()

    this.formDadosPessoais = builder.group({
      email: new FormControl(''),
      cartao_sus: new FormControl(''),
      idade: new FormControl(''),
      endereco: new FormControl(''),
      telefone: new FormControl(''),
      telefone_contato: new FormControl(''),
      id_moradia: new FormControl(''),
    });

    return this.formDadosPessoais
  }
  
  getFormAbaDadosResidenciais(): FormGroup {
    let builder = new FormBuilder()

    this.formDadosResidenciais = builder.group({
      cep: new FormControl(''),
      id_estado: new FormControl(23),
      id_cidade: new FormControl(4137),
      id_bairro: new FormControl(''),
      endereco: new FormControl(''),
      numero: new FormControl(''),
      complemento: new FormControl(''),
      ponto_referencia: new FormControl(''),
    });

    return this.formDadosResidenciais
  }

  getFormAbaDadosOutrasInformacoes(): FormGroup {
    let builder = new FormBuilder()

    this.formDadosOutrasInformacoes = builder.group({
      trabalha_fora: new FormControl(''),
      profissao: new FormControl(''),
      quando_retorna_trabalho: new FormControl(''),
      id_tipo_renda_mensal: new FormControl(''),
      renda_quantidade_moradores: new FormControl(''),
      id_estado_civil: new FormControl(''),
      obs: new FormControl('')
    });

    return this.formDadosOutrasInformacoes
  }

  async buscarTipos() {
    this.areas = await this.gerenciadorTipos.buscarTipo('area');
    this.microAreas = await this.gerenciadorTipos.buscarTipo('micro_area');
    this.listaEstados = await this.gerenciadorTipos.buscarTipo('estado');
    this.listaBairros = await this.gerenciadorTipos.buscarTipo('bairro');
    this.listaEstadoCivil = await this.gerenciadorTipos.buscarTipo('estado_civil');
    this.moradias = await this.gerenciadorTipos.buscarTipo('moradia');
    this.escolaridades = await this.gerenciadorTipos.buscarTipo('escolaridade');
    this.rendaFamiliar = await this.gerenciadorTipos.buscarTipo('tipo_renda_mensal');
  }

  async mapearCampos() {
    let usuario:User = await this.login.getUser()

    let camposUsuario = {
        dt_registro: moment().format('DD/MM/YYYY'),
        id_usuario_registro: usuario.id
    }

    let camposFormDadosMae:any = this.formDadosMaeInicial.getRawValue()


    let dt_nascimento:moment.Moment = moment(camposFormDadosMae.dt_nascimento)
    if(dt_nascimento.isValid()) camposFormDadosMae.dt_nascimento = dt_nascimento.format('DD/MM/YYYY')

    let dt_inicio_projeto_maebebe:moment.Moment = moment(camposFormDadosMae.dt_inicio_projeto_maebebe)
    if(dt_inicio_projeto_maebebe.isValid()) camposFormDadosMae.dt_inicio_projeto_maebebe = dt_inicio_projeto_maebebe.format('DD/MM/YYYY')

    let campos = { 
        ...camposUsuario,
        ...camposFormDadosMae,
        ...this.formDadosPessoais.getRawValue(),
        ...this.formDadosResidenciais.getRawValue(),
        ...this.formDadosOutrasInformacoes.getRawValue(),
    }

    campos.image = this.imagem

    return campos
  }

    async salvar() {
      try {
        this.salvando = true

        let campos:object = await this.mapearCampos()
        let resposta: {id_mae: any} =  await this.api.salvarFormularioMae(campos);
        this.acoesAposSalvar(resposta.id_mae)

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
          this.router.navigate(["mae", "consulta", "busca"]);
        }
      )
    }
}
