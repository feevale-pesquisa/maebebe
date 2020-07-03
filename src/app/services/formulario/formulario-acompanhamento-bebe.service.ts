import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Validators as V } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AlertService } from '../helpers/alert.service';
import { User } from '../login/user';
import { LoginService } from '../login/login.service';
import { CadastroMaeService } from './cadastro-mae.service';
import { TypeService } from '../helpers/type.service';

@Injectable({
    providedIn: 'root'
})
export class FormularioAcompanhamentoBebe {
    public idUsuario:any;

    public salvando: boolean = false;
    
    public formDadosAmamentacao1: FormGroup
    public formDadosAmamentacao2: FormGroup
    public formDadosRecemNascido1: FormGroup
    public formDadosRecemNascido2: FormGroup
    public formDadosRecemNascido3: FormGroup
    public formDadosRecemNascido4: FormGroup
    
    public listaTipoMamilo = []
    public listaMamasIngurgitadas = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaTipoBebeAlimentacao = []
    public listaTipoDesmamePrecoce = []
    public listaEstaAmamentandoOutroFilho = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaTeveOrientacoesAmamentacao = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaTipoOrientacaoAmamentacao = []
    public listaTipoBebeMamada = []
    public listaBebeVomita = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaTipoComportamento = []
    public listaFezes = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaDiurese = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaPermeabilidadeNasal = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaEsforcoRespiratorio = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaPerfusaoAquecimento = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaTipoPele = []
    public listaTipoCavidadeOral = []
    public listaTipoTorax = []
    public listaEstadoAbdomen = []
    public listaEstadoCotoUmbilical = []
    public listaTipoHigieneBebe = []
    public listaEstadoPerineo = []
    public listaPercepcaoSentido = []
    public listaTipoRegulacaoNeurologica = []
    public listaTipoChoro = []
    public listaEmagrecido = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaMaeAdotaPraticasAdequadas = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaAvaliacao = []

    public ref_bebe_acomp_tipo_mamilo: Array<any>;
    public ref_bebe_acomp_tipo_desmame_precoce: Array<any>;
    
    constructor(
        private typeService: TypeService,
        private router: Router,
        private login: LoginService,
        private cadastro: CadastroMaeService,
        private alert: AlertService
    ) {
        this.buscarTipos();
    }

    private limparFormularios() {
        try {
            this.formDadosAmamentacao1.reset()
            this.formDadosAmamentacao2.reset()
            this.formDadosRecemNascido1.reset()
            this.formDadosRecemNascido2.reset()
        } catch (error) { }
    }

    getFormAbaDadosAmamentacao1(): FormGroup {
        if(this.formDadosAmamentacao1 instanceof FormGroup)
            return this.formDadosAmamentacao1

        let builder = new FormBuilder()

        this.formDadosAmamentacao1 = builder.group({
            dt_acompanhamento: new FormControl('', [ V.required ]),
            ref_bebe_acomp_tipo_mamilo : builder.array([]),
            mamilo_obs : new FormControl(),
            mamas_ingurgitadas : new FormControl(),
            id_tipo_alimentacao : new FormControl(),
            alimentacao_bebe_obs : new FormControl(),
            motivo_aleitamento_misto : new FormControl(),
            ref_bebe_acomp_tipo_desmame_precoce : builder.array([]),
            motivo_desmame_precoce : new FormControl()
        });

        return this.formDadosAmamentacao1
    }

    getFormAbaDadosAmamentacao2(): FormGroup {
        if(this.formDadosAmamentacao2 instanceof FormGroup)
            return this.formDadosAmamentacao2

        let builder = new FormBuilder()

        this.formDadosAmamentacao2 = builder.group({
            amamenta_outro_filho_junto: new FormControl(),
            amamenta_outro_filho_junto_idade: new FormControl(),
            recebeu_orientacoes_amamentacao: new FormControl(),
            ref_bebe_acomp_tipo_orientacao_amamentacao: builder.array([]),
            recebeu_orientacoes_amamentacao_obs: new FormControl(),
            ref_bebe_acomp_tipo_bebe_mamada: builder.array([]),
            bebe_mamada_obs: new FormControl(),
            bebe_vomita: new FormControl(),
            bebe_vomita_obs: new FormControl(),
        })
        
        return this.formDadosAmamentacao2
    }

    getFormAbaDadosRecemNascido1(): FormGroup {

        if(this.formDadosRecemNascido1 instanceof FormGroup)
            return this.formDadosRecemNascido1

        let builder = new FormBuilder()

        this.formDadosRecemNascido1 = builder.group({
            id_tipo_comportamento: new FormControl(),
            comportamento_bebe_obs: new FormControl(),
            fezes: new FormControl(),
            fezes_caracteristicas: new FormControl(),
            diurese: new FormControl(),
            diurese_caracteristicas: new FormControl(),
            permeabilidade_nasal: new FormControl(),
            esforco_respiratorio: new FormControl(),
            perfusao_aquecimento_extremidades: new FormControl()
        })
        
        return this.formDadosRecemNascido1
    }

    getFormAbaDadosRecemNascido2(): FormGroup {
        if(this.formDadosRecemNascido2 instanceof FormGroup)
            return this.formDadosRecemNascido2

        let builder = new FormBuilder()
        
        this.formDadosRecemNascido2 = builder.group({
            ref_bebe_acomp_tipo_pele: builder.array([]),
            estado_pele_obs: new FormControl(),
            ref_bebe_acomp_tipo_cavidade_oral: builder.array([]),
            cavidade_oral_obs: new FormControl(),
            ref_bebe_acomp_tipo_torax: builder.array([]),
            torax_obs: new FormControl(),
            torax_presenca_retracoes_obs: new FormControl(),
            id_estado_abdomen: new FormControl(),
            id_estado_coto_umbilical: new FormControl()
        })
        
        return this.formDadosRecemNascido2
    }

    getFormAbaDadosRecemNascido3(): FormGroup {
        if(this.formDadosRecemNascido3 instanceof FormGroup)
            return this.formDadosRecemNascido3

        let builder = new FormBuilder()
        
        this.formDadosRecemNascido3 = builder.group({
            id_higiene_bebe: new FormControl(),
            higiene_bebe_obs: new FormControl(),
            id_estado_perineo: new FormControl(),
            estado_perineo_obs: new FormControl(),
            id_percepcao_sentido: new FormControl(),
            ref_bebe_acomp_tipo_regulacao_neurologica: builder.array([]),
            alteracao_neurologica: new FormControl(),
            id_tipo_choro: new FormControl(),
            emagracido: new FormControl(),
            ma_formacoes_obs: new FormControl()
        })

        return this.formDadosRecemNascido3
    }

    getFormAbaDadosRecemNascido4(): FormGroup {
        if(this.formDadosRecemNascido4 instanceof FormGroup)
            return this.formDadosRecemNascido4

        let builder = new FormBuilder()
        
        this.formDadosRecemNascido4 = builder.group({
            mae_adota_praticas_adequadas: new FormControl(),
            mae_adota_praticas_adequadas_obs: new FormControl(),
            id_avaliacao_conhecimento_bebe: new FormControl(),
            problemas_obs: new FormControl(),
            intervencoes_obs: new FormControl(),
            plano_proxima_visita: new FormControl(),
            evolucao_anterior: new FormControl(),
            evolucao: new FormControl(),
        })

        return this.formDadosRecemNascido4
    }

    abrirFormAbaDadosAmamentacao1(id_mae, id_gestacao, id_bebe) {
        this.router.navigate([
            'mae', id_mae, 
            'gestacao', id_gestacao, 
            'bebe', id_bebe, 
            'acompanhamento', 'cadastro', 'dados-amamentacao1'
        ])
    }

    abrirFormAbaDadosAmamentacao2(id_mae, id_gestacao, id_bebe) {
        this.router.navigate([
            'mae', id_mae, 
            'gestacao', id_gestacao, 
            'bebe', id_bebe, 
            'acompanhamento', 'cadastro', 'dados-amamentacao2'
        ])
    }

    abrirFormAbaDadosRecemNascido1(id_mae, id_gestacao, id_bebe) {
        this.router.navigate([
            'mae', id_mae, 
            'gestacao', id_gestacao, 
            'bebe', id_bebe, 
            'acompanhamento', 'cadastro', 'dados-recem-nascido1'
        ])
    }

    abrirFormAbaDadosRecemNascido2(id_mae, id_gestacao, id_bebe) {
        this.router.navigate([
            'mae', id_mae, 
            'gestacao', id_gestacao, 
            'bebe', id_bebe, 
            'acompanhamento', 'cadastro', 'dados-recem-nascido2'
        ])
    }

    abrirFormAbaDadosRecemNascido3(id_mae, id_gestacao, id_bebe) {
        this.router.navigate([
            'mae', id_mae, 
            'gestacao', id_gestacao, 
            'bebe', id_bebe, 
            'acompanhamento', 'cadastro', 'dados-recem-nascido3'
        ])
    }

    abrirFormAbaDadosRecemNascido4(id_mae, id_gestacao, id_bebe) {
        this.router.navigate([
            'mae', id_mae, 
            'gestacao', id_gestacao, 
            'bebe', id_bebe, 
            'acompanhamento', 'cadastro', 'dados-recem-nascido4'
        ])
    }

    async buscarTipos() {
        this.listaTipoMamilo = await this.typeService.getType('tipo_mamilo')
        this.listaTipoBebeAlimentacao = await this.typeService.getType('tipo_bebe_alimentacao')
        this.listaTipoDesmamePrecoce = await this.typeService.getType('tipo_desmame_precoce')
        this.listaTipoOrientacaoAmamentacao = await this.typeService.getType('tipo_orientacao_amamentacao')
        this.listaTipoBebeMamada = await this.typeService.getType('tipo_bebe_mamada')
        this.listaTipoPele = await this.typeService.getType('tipo_pele')
        this.listaTipoCavidadeOral = await this.typeService.getType('tipo_cavidade_oral')
        this.listaTipoTorax = await this.typeService.getType('tipo_torax')
        this.listaEstadoAbdomen = await this.typeService.getType('estado_abdomen')
        this.listaEstadoCotoUmbilical = await this.typeService.getType('estado_coto_umbilical')
        this.listaTipoHigieneBebe = await this.typeService.getType('tipo_higiene_bebe')
        this.listaEstadoPerineo = await this.typeService.getType('estado_perineo')
        this.listaPercepcaoSentido = await this.typeService.getType('percepcao_sentido')
        this.listaTipoRegulacaoNeurologica = await this.typeService.getType('tipo_regulacao_neurologica')
        this.listaTipoChoro = await this.typeService.getType('tipo_choro')
        this.listaAvaliacao = await this.typeService.getType('avaliacao')
    }

    async mapearCampos(idMae: any, idGestacao: any) {
        let usuario:User = await this.login.getUser()

        let camposUsuario = {
            id_mae: idMae,
            id_gestacao: idGestacao,
            dt_registro: moment().format('DD/MM/YYYY'),
            id_usuario_registro: usuario.id
        }

        let campos = { 
            ...camposUsuario,
            ...this.formDadosAmamentacao1.getRawValue(),
            ...this.formDadosAmamentacao2.getRawValue(),
            ...this.formDadosRecemNascido1.getRawValue(),
            ...this.formDadosRecemNascido2.getRawValue(),
            ...this.formDadosRecemNascido3.getRawValue(),
            ...this.formDadosRecemNascido4.getRawValue()
        }
      
        return campos
    }

    async salvar(idMae, idGestacao, idBebe) {
        try {
            this.salvando = true

            let campos:object = await this.mapearCampos(idMae, idGestacao)
            alert('Aqui')
            console.log(campos)
            //TODO Cadastrar acompanhamento
            //let id = await this.cadastro.cadastrarBebe(idMae, idGestacao, campos)

            //this.acoesAposSalvar(idMae, idGestacao, id)

            this.salvando = false
            //this.limparFormularios()
          
        } catch (error) {
            this.salvando = false
            throw error
        }
    }

    private acoesAposSalvar(idMae: any, idGestacao: any, idBebe: any) {
        this.alert.ok("Acompanhamento do Bebê cadastrado com sucesso")
    }
}