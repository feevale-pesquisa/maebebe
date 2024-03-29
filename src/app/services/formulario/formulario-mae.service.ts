import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AlertService } from '../helpers/alert.service';
import { User } from '../login/user';
import { LoginService } from '../login/login.service';
import { Validators as V } from '@angular/forms';
import { CadastroMaeService } from './cadastro-mae.service';
import { TypeService } from '../helpers/type.service';

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

  constructor( private typeService: TypeService,
    private router: Router,
    private login: LoginService,
    private cadastro: CadastroMaeService,
    private alert: AlertService
    ) {
    this.buscarTipos();
  }

  private iniciarFormularios() {
    this.getFormAbaDadosMae()
    this.getFormAbaDadosPessoais()
    this.getFormAbaDadosResidenciais()
    this.getFormAbaDadosOutrasInformacoes()
  }

  private limparFormularios() {
    try {
        this.formDadosMaeInicial.reset()
        this.formDadosPessoais.reset()
        this.formDadosResidenciais.reset()
        this.formDadosOutrasInformacoes.reset()
    } catch (error) { }
  }

  getFormAbaDadosMae(id = null): FormGroup {
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

  getFormAbaDadosPessoais(id = null): FormGroup {
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

  getFormAbaDadosResidenciais(id = null): FormGroup {
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

  getFormAbaDadosOutrasInformacoes(id = null): FormGroup {
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

  abrirListagemMae() {
    this.limparFormularios()
    this.router.navigateByUrl("/inicio")
  }

  abrirFormAbaDadosMae() {
    this.router.navigateByUrl("/mae/cadastro")
  }

  abrirFormAbaDadosPessoais() {
    this.router.navigateByUrl("/mae/cadastro/dados-pessoais")
  }
  
  abrirFormAbaDadosResidenciais() {
    this.router.navigateByUrl("/mae/cadastro/dados-residencia")
  }

  abrirFormAbaOutrasInformacoes() {
    this.router.navigateByUrl("/mae/cadastro/outras-informacoes")
  }

  async buscarTipos() {
    this.areas = await this.typeService.getType('area');
    this.microAreas = await this.typeService.getType('micro_area');
    this.listaEstados = await this.typeService.getType('estado');
    this.listaBairros = await this.typeService.getType('bairro');
    this.listaEstadoCivil = await this.typeService.getType('estado_civil');
    this.moradias = await this.typeService.getType('moradia');
    this.escolaridades = await this.typeService.getType('escolaridade');
    this.rendaFamiliar = await this.typeService.getType('tipo_renda_mensal');
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

        let id = await this.cadastro.cadastrarMae(campos)

        this.acoesAposSalvar(id)

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
