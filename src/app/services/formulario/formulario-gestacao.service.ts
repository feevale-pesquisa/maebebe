import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Validators as V } from '@angular/forms';
import { Router } from '@angular/router';
import { BuscaMaeService } from '../busca/busca-mae.service';
import { LoginService } from '../login/login.service';
import { User } from '../login/user';
import * as moment from 'moment';
import { FormException } from '../../exceptions/form-exception';
import { AlertService } from '../helpers/alert.service';
import { CadastroMaeService } from './cadastro-mae.service';
import { TypeService } from '../helpers/type.service';

@Injectable({
  providedIn: 'root'
})
export class FormularioGestacao {

  public idUsuario:any;

  public salvando: boolean = false;

  private mae:any;

  private formDadosGestacao: FormGroup;
  private formDadosPlanejamento: FormGroup;
  private formDadosPreNatal: FormGroup;

  public listaTipoDesfecho = [
    {descricao: 'Ativo', id: '1'},
    {descricao: 'Inativo', id: '0'},
  ]

  public listaMotivoDesfecho = [

  ]

  public listaTipoParto = []

  public listaGestacaoPlanejada = [
    {descricao: 'Sim', id: '1'},
    {descricao: 'Não', id: '0'},
  ]
  
  public listaTipoPlanejamentoGestacao = []

  public listaTipoMAC = []

  public listaTempoMAC = []

  public listaTipoExamePreNatal = []

  constructor(
    private typeService: TypeService, 
    private maeServico: BuscaMaeService,
    private router: Router,
    private login: LoginService,
    private cadastro: CadastroMaeService,
    private alert: AlertService
  ) {
    this.buscarTipos()
    this.definirUsuario()
  }

  async definirUsuario() {
    let usuario:User = await this.login.getUser()
    this.idUsuario = usuario.id
  }

  async buscarTipos() {
    this.listaMotivoDesfecho = await this.typeService.getType('tipo_motivo_desfecho')
    this.listaTipoParto = await this.typeService.getType('tipo_parto')
    this.listaTipoPlanejamentoGestacao = await this.typeService.getType('tipo_planejamento_gestacao')
    this.listaTipoMAC = await this.typeService.getType('tipo_mac')
    this.listaTempoMAC = await this.typeService.getType('tempo_mac')
    this.listaTipoExamePreNatal = await this.typeService.getType('tipo_exame_prenatal')
  }

  private limparFormularios() {
    try {
      this.formDadosPreNatal.reset()
      this.formDadosPlanejamento.reset()
      this.formDadosGestacao.reset()
    } catch (error) { }
  }

  getFormAbaDadosGestacao(): FormGroup {
    let builder = new FormBuilder()

    this.formDadosGestacao = builder.group({
      id_tipo_desfecho: new FormControl('1'),
      id_motivo_desfecho: new FormControl(''),
      desfecho_obs: new FormControl(''),
      dt_registro_desfecho: new FormControl(''),
      id_usuario_registro_desfecho: new FormControl(''),
      numero_gestacao: new FormControl('1', [ V.maxLength(2) ]),
      id_tipo_parto_planejado: new FormControl(''),
      dt_dum: new FormControl(''),
      dt_dpp: new FormControl(''),
      dt_dpp_eco: new FormControl(''),
    });

    return this.formDadosGestacao
  }
  
  getFormAbaDadosPlanejamento(): FormGroup {
    let builder = new FormBuilder()

    this.formDadosPlanejamento = builder.group({
      planejada: new FormControl('1'),
      mac_antes_gestacao: new FormControl(''),
      ref_gestacao_planejamento_gestacao: builder.array([]),
      id_tempo_mac: new FormControl(''),
      mac_antes_gestacao_nome_orientador: new FormControl(''),
      mac_antes_gestacao_obs: new FormControl(''),
      ref_mac_gestacao: builder.array([]),
    });

    
    return this.formDadosPlanejamento
  }

  getFormAbaDadosPreNatal() {
    let builder = new FormBuilder()

    this.formDadosPreNatal = builder.group({
      ref_gestacao_exame_prenatal: builder.array([]),
      exame_prenatal_obs: new FormControl(''),
      ig_inicio_pre_natal: new FormControl('', [ V.maxLength(2) ]),
      peso_pre_gestacional: new FormControl('', [ V.maxLength(7) ]), //950.222
      altura_pre_gestacional: new FormControl('', [ V.maxLength(3) ]),
      imc_pre_gestacional: new FormControl('', [ V.maxLength(5) ]), //99.95
      ig_inicio_projeto: new FormControl('', [ V.maxLength(2) ]),
      peso_inicio_projeto: new FormControl('', [ V.maxLength(7) ]), //950.222
      imc_inicio_projeto: new FormControl('', [ V.maxLength(5) ]), //99.95
    });

    
    return this.formDadosPreNatal
  }

  private buscarIdMae(idMae)
  {
    if(this.cadastro.ehIdTemporario(idMae) && this.cadastro.foiSalvo(idMae)) {
      idMae = this.cadastro.buscarIdBancoDeDadosPeloIdTemporario(idMae)
    }

    return idMae
  }

  abrirFormAbaDadosGestacao(idMae) {
    this.router.navigate(['mae', this.buscarIdMae(idMae), 'gestacao', 'cadastro', 'dados-gestacao'])
  }

  abrirFormAbaDadosPlanejamento(idMae) {
    this.router.navigate(['mae', this.buscarIdMae(idMae), 'gestacao', 'cadastro', 'dados-planejamento'])
  }

  abrirFormAbaDadosPreNatal(idMae) {
    this.router.navigate(['mae', this.buscarIdMae(idMae), 'gestacao', 'cadastro', 'dados-prenatal'])
  }

  async mapearCampos(id_mae) {
    let usuario:User = await this.login.getUser()
    
    let camposPadrao = { id_mae: id_mae }
    let camposFormDadosGestacao = this.formDadosGestacao.getRawValue();

    let dt_dum:moment.Moment = moment(camposFormDadosGestacao.dt_dum)
    if(dt_dum.isValid()) camposFormDadosGestacao.dt_dum = dt_dum.format('DD/MM/YYYY')

    let dt_registro_desfecho:moment.Moment = moment(camposFormDadosGestacao.dt_registro_desfecho)
    if(dt_registro_desfecho.isValid()) camposFormDadosGestacao.dt_registro_desfecho = dt_registro_desfecho.format('DD/MM/YYYY')

    let dt_dpp:moment.Moment = moment(camposFormDadosGestacao.dt_dpp)
    if(dt_dpp.isValid()) camposFormDadosGestacao.dt_dpp = dt_dpp.format('DD/MM/YYYY')

    let dt_dpp_eco:moment.Moment = moment(camposFormDadosGestacao.dt_dpp_eco)
    if(dt_dpp_eco.isValid()) camposFormDadosGestacao.dt_dpp_eco = dt_dpp_eco.format('DD/MM/YYYY')

    let camposFormDadosPlanejamento = this.formDadosPlanejamento.getRawValue();
    let camposFormDadosPreNatal = this.formDadosPreNatal.getRawValue();

    let camposUsuario = {
      dt_registro: moment().format('DD/MM/YYYY'),
      id_usuario_registro: usuario.id
    }

    let campos = { 
      ...camposPadrao, 
      ...camposFormDadosGestacao, 
      ...camposFormDadosPlanejamento, 
      ...camposFormDadosPreNatal,
      ...camposUsuario
    }

    return campos
  }

  async salvar(idMae) {
    try {
      idMae = this.buscarIdMae(idMae)

      this.salvando = true

      let campos:object = await this.mapearCampos(idMae)

      let id = await this.cadastro.cadastrarGestacao(idMae, campos)

      this.acoesAposSalvar(idMae, id)

      this.salvando = false
      this.limparFormularios()
      
    } catch (error) {
      this.salvando = false
      throw error
    }
  }

  private acoesAposSalvar(idMae: any, idGestacao: any) {
    this.alert.confirm("Gestação cadastrada com sucesso, deseja cadastrar um bebê?",
    () => { //Sim
      this.router.navigate(["mae", idMae, "gestacao", idGestacao, "bebe", "cadastro"])
    },
    () => { //Não
      this.router.navigate(["mae", idMae, "gestacao"])
    })
  }
}
