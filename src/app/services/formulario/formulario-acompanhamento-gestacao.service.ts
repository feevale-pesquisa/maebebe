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
export class FormularioAcompanhamentoGestacao {
    public idUsuario:any;

    public salvando: boolean = false;
    
    public formDadosGestacao1: FormGroup
    public formDadosGestacao2: FormGroup
    public formDadosGestacao3: FormGroup
    
    public listaIntercorrenciaGestacao = []
    public listaQueixaAtividade = []
    public listaExercicioFisico = []

    public listaDorDesconforto = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]

    public listaAcidoFolico = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]

    public listaSulfatoFerroso = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]


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
            this.formDadosGestacao1.reset()
            this.formDadosGestacao2.reset()
            this.formDadosGestacao3.reset()
        } catch (error) { }
    }

    getFormDadosGestacao1(): FormGroup {
        if(this.formDadosGestacao1 instanceof FormGroup)
            return this.formDadosGestacao1

        let builder = new FormBuilder()

        this.formDadosGestacao1 = builder.group({
            dt_acompanhamento: new FormControl(moment().format('YYYY-MM-DD'), [ V.required ]),
            nro_evacua_semana: new FormControl(''),
            nro_evacua_semana_obs: new FormControl(''),
            ref_gestacao_intercorrencia_gestacao:  builder.array([]),
            intercorrencias_gestacao: new FormControl(''),
        });

        return this.formDadosGestacao1
    }

    getFormDadosGestacao2(): FormGroup {
        if(this.formDadosGestacao2 instanceof FormGroup)
            return this.formDadosGestacao2

        let builder = new FormBuilder()

        this.formDadosGestacao2 = builder.group({
            apresenta_dor_desconforto: new FormControl(''),
            ref_gestacao_queixa_atividade:  builder.array([]),
            queixa_atividade_obs: new FormControl(''),
            ref_gestacao_exercicio_fisico:  builder.array([]),
            exercicio_fisico_freq_semanal: new FormControl(''),
            exercicio_fisico_obs: new FormControl(''),
        })
        
        return this.formDadosGestacao2
    }

    getFormDadosGestacao3(): FormGroup {
        if(this.formDadosGestacao3 instanceof FormGroup)
            return this.formDadosGestacao3

        let builder = new FormBuilder()

        this.formDadosGestacao3 = builder.group({
            expectativas_gravidez_parto: new FormControl(''),
            planejamento_bebe: new FormControl(''),
            aspectos_emocionais: new FormControl(''),
            apoio_parceiro_familia: new FormControl(''),
            uso_acido_folico: new FormControl(''),
            uso_sulfato_ferroso: new FormControl(''),
            plano_acompanhamento: new FormControl(''),
            obs: new FormControl(''),
            evolucao: new FormControl(''),
        })
        
        return this.formDadosGestacao3
    }

    abrirFormDadosGestacao1(id_mae, id_gestacao) {
        this.router.navigate([
            'mae', id_mae, 
            'gestacao', id_gestacao, 
            'acompanhamento', 'cadastro', 'dados-gestacao1'
        ])
    }
    abrirFormDadosGestacao2(id_mae, id_gestacao) {
        this.router.navigate([
            'mae', id_mae, 
            'gestacao', id_gestacao, 
            'acompanhamento', 'cadastro', 'dados-gestacao2'
        ])
    }
    abrirFormDadosGestacao3(id_mae, id_gestacao) {
        this.router.navigate([
            'mae', id_mae, 
            'gestacao', id_gestacao, 
            'acompanhamento', 'cadastro', 'dados-gestacao3'
        ])
    }

    async buscarTipos() {
        this.listaIntercorrenciaGestacao = await this.typeService.getType('tipo_intercorrencia_gestacao')
        this.listaQueixaAtividade = await this.typeService.getType('tipo_queixa_atividade')
        this.listaExercicioFisico = await this.typeService.getType('tipo_exercicio_fisico')
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
            ...this.formDadosGestacao1.getRawValue(),
            ...this.formDadosGestacao2.getRawValue(),
            ...this.formDadosGestacao3.getRawValue(),
        }

        campos.dt_acompanhamento = moment(campos.dt_acompanhamento).format('DD/MM/YYYY')
      
        return campos
    }

    async salvar(idMae, idGestacao) {
        try {
            this.salvando = true

            let campos:object = await this.mapearCampos(idMae, idGestacao)
            let id = await this.cadastro.cadastrarAcompanhamentoGestacao(idMae, idGestacao, campos)

            this.acoesAposSalvar(idMae, idGestacao)

            this.salvando = false
            this.limparFormularios()
          
        } catch (error) {
            this.salvando = false
            throw error
        }
    }

    private acoesAposSalvar(idMae: any, idGestacao: any) {
        this.alert.ok("Acompanhamento da Gestação cadastrado com sucesso")
        this.router.navigate(["mae", idMae, "gestacao", idGestacao, "acompanhamento"])
    }
}