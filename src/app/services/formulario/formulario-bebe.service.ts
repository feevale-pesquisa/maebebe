import { Injectable } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Validators as V } from '@angular/forms';
import { GerenciadorTiposService } from './gerenciador-tipos.service';
import { Router } from '@angular/router';
import { API } from '../http/api';
import * as moment from 'moment';
import { AlertService } from '../helpers/alert.service';
import { User } from '../login/user';
import { LoginService } from '../login/login.service';

@Injectable({
    providedIn: 'root'
})
export class FormularioBebe {
    public idUsuario:any;

    public salvando: boolean = false;
    
    public formDadosBebe: FormGroup
    public formDadosParto: FormGroup
    public formDadosTestes: FormGroup
    public formDadosIntercorrencias: FormGroup
    public formDadosDocumentos: FormGroup
    
    public listaTipoDesfecho = [
        {descricao: 'Nativivo', id: '0'},
        {descricao: 'Natimorto', id: '1'},
    ]
    public listaTipoParto = []
    public listaProblemaParto = [
        {descricao: 'Sim', id: '1'},
        {descricao: 'Não', id: '0'},
    ]
    public listaTipoEscala = []
    public listaTipoGenero = []
    public listaTriagemNeonatal = []
    public listaTesteDenver = []
    public listaIntercorrenciaNeonatal = []
    public listaIntercorrenciaPrimeiroAno = []
    public listaEstados = []
    public listaCidades = [
        { id: 4137, id_estado: 23, nome: "Novo Hamburgo" },
        { id: 4005, id_estado: 23, nome: "Estância Velha" },
    ]
    public listaBairros = []

    constructor(
        private gerenciadorTipos: GerenciadorTiposService, 
        private api: API,
        private router: Router,
        private login: LoginService,
        private alert: AlertService
    ) {
        this.buscarTipos();
    }

    private limparFormularios() {
        try {
            this.formDadosBebe.reset()
            this.formDadosParto.reset()
            this.formDadosTestes.reset()
            this.formDadosDocumentos.reset()
            this.formDadosIntercorrencias.reset()
        } catch (error) { }
    }

    getFormAbaDadosBebe(): FormGroup {
        if(this.formDadosBebe instanceof FormGroup)
            return this.formDadosBebe

        let builder = new FormBuilder()

        this.formDadosBebe = builder.group({
            id_tipo_desfecho_bebe: new FormControl(''),//, )V.required),
            id_genero: new FormControl(''),//, V.required),
            dt_nascimento: new FormControl(''),//, V.required),
            local_nascimento: new FormControl(''),
            nome: new FormControl(''),//, V.required),
            numero: new FormControl(''),
            pediatra: new FormControl(''),
            id_tipo_parto: new FormControl(''),//, V.required),
            problema_parto: new FormControl(''),
        });

        return this.formDadosBebe
    }

    getFormAbaDadosParto(): FormGroup {
        if(this.formDadosParto instanceof FormGroup)
            return this.formDadosParto

        let builder = new FormBuilder()

        this.formDadosParto = builder.group({
            peso_nascimento: new FormControl(''),//, V.required),
            comprimento_nascimento: new FormControl(''),
            idade_gestacional_semanas_parto: new FormControl(''),//, V.required),
            idade_gestacional_dias_parto: new FormControl(''),
            id_escala: new FormControl(''),
            apgar_1_min: new FormControl(''),
            apgar_5_min: new FormControl(''),//, V.required),
            perimetro_cefalico_nascimento: new FormControl(''),
            perimetro_abdominal_nascimento: new FormControl(''),
        })
        
        return this.formDadosParto
    }

    getFormAbaDadosTestes(): FormGroup {
        if(this.formDadosTestes instanceof FormGroup)
            return this.formDadosTestes

        let builder = new FormBuilder()

        this.formDadosTestes = builder.group({
            id_tipo_triagem_neonatal_reflexo_olho_vermelho: new FormControl(''),
            id_tipo_triagem_neonatal_orelhinha: new FormControl(''),
            id_tipo_triagem_neonatal_coracaozinho: new FormControl(''),
            id_tipo_triagem_neonatal_pezinho: new FormControl(''),
            id_tipo_triagem_neonatal_linguinha: new FormControl(''),
            anormalidade_triagem_neonatal_obs: new FormControl(''),
            id_denver_6_mes: new FormControl(''),
            id_denver_12_mes: new FormControl(''),
        })
        
        return this.formDadosTestes
    }

    getFormAbaDadosIntercorrencias(): FormGroup {
        if(this.formDadosIntercorrencias instanceof FormGroup)
            return this.formDadosIntercorrencias

        let builder = new FormBuilder()
        
        this.formDadosIntercorrencias = builder.group({
            numero_consultas_pre_natal: new FormControl(''),
            numero_consultas_pre_natal_obs: new FormControl(''),
            ref_bebe_intercorrencia_peri_neonatal: builder.array([]),
            intercorrencia_peri_neonatal_obs: new FormControl(''),
            ref_bebe_intercorrencia_primeiro_ano_vida: builder.array([]),
            intercorrencia_primeiro_ano_vida_obs: new FormControl(''),
        })
        
        return this.formDadosIntercorrencias
    }

    getFormAbaDadosDocumentos(): FormGroup {
        if(this.formDadosDocumentos instanceof FormGroup)
            return this.formDadosDocumentos

        let builder = new FormBuilder()
        
        this.formDadosDocumentos = builder.group({
            cpf: new FormControl(''),
            rg: new FormControl(''),
            cartao_sus: new FormControl(''),
            id_estado: new FormControl(23),
            id_cidade: new FormControl(4137),
            id_bairro: new FormControl(''),
            obs: new FormControl('')
        })
        
        return this.formDadosDocumentos
    }

    abrirFormAbaDadosBebe(id_mae, id_gestacao) {
        this.router.navigate(['mae', id_mae, 'gestacao', id_gestacao, 'bebe', 'cadastro', 'dados-bebe'])
    }

    abrirFormAbaDadosParto(id_mae, id_gestacao) {
        this.router.navigate(['mae', id_mae, 'gestacao', id_gestacao, 'bebe', 'cadastro', 'dados-parto'])
    }

    abrirFormAbaDadosTestes(id_mae, id_gestacao) {
        this.router.navigate(['mae', id_mae, 'gestacao', id_gestacao, 'bebe', 'cadastro', 'dados-testes'])
    }

    abrirFormAbaDadosIntercorrencias(id_mae, id_gestacao) {
        this.router.navigate(['mae', id_mae, 'gestacao', id_gestacao, 'bebe', 'cadastro', 'dados-intercorrencias'])
    }

    abrirFormAbaDadosDocumentos(id_mae, id_gestacao) {
        this.router.navigate(['mae', id_mae, 'gestacao', id_gestacao, 'bebe', 'cadastro', 'dados-documentos'])
    }

    async buscarTipos() {
        this.listaTipoGenero = await this.gerenciadorTipos.buscarTipo('genero')
        this.listaTipoParto = await this.gerenciadorTipos.buscarTipo('tipo_parto')
        this.listaTipoEscala = await this.gerenciadorTipos.buscarTipo('tipo_escala')
        this.listaTriagemNeonatal = await this.gerenciadorTipos.buscarTipo('tipo_triagem_neonatal')
        this.listaTesteDenver = await this.gerenciadorTipos.buscarTipo('tipo_denver')
        this.listaIntercorrenciaNeonatal = await this.gerenciadorTipos.buscarTipo('tipo_intercorrencia_peri_neonatal')
        this.listaIntercorrenciaPrimeiroAno = await this.gerenciadorTipos.buscarTipo('tipo_intercorrencia_primeiro_ano_vida')
        this.listaEstados = await this.gerenciadorTipos.buscarTipo('estado')
        this.listaBairros = await this.gerenciadorTipos.buscarTipo('bairro');
    }

    async mapearCampos(idMae: any, idGestacao: any) {
        let usuario:User = await this.login.getUser()

        let camposUsuario = {
            id_mae: idMae,
            id_gestacao: idGestacao,
            dt_registro: moment().format('DD/MM/YYYY'),
            id_usuario_registro: usuario.id
        }

        let camposFormDadosBebe:any = this.formDadosBebe.getRawValue()

        let dt_nascimento:moment.Moment = moment(camposFormDadosBebe.dt_nascimento)
        if(dt_nascimento.isValid()) camposFormDadosBebe.dt_nascimento = dt_nascimento.format('DD/MM/YYYY')

        let campos = { 
            ...camposUsuario,
            ...camposFormDadosBebe,
            ...this.formDadosParto.getRawValue(),
            ...this.formDadosTestes.getRawValue(),
            ...this.formDadosIntercorrencias.getRawValue(),
            ...this.formDadosDocumentos.getRawValue(),
        }
      
        return campos
    }

    async salvar(idMae, idGestacao) {
        console.log('teste');
        try {
            this.salvando = true

            let campos:object = await this.mapearCampos(idMae, idGestacao)

            let resposta: {id: any} = await this.api.salvarFormularioBebe(idMae, idGestacao, campos);

            this.acoesAposSalvar(idMae, idGestacao, resposta.id)

            this.salvando = false
            this.limparFormularios()
          
        } catch (error) {
            this.salvando = false
            throw error
        }
    }

    private acoesAposSalvar(idMae: any, idGestacao: any, idBebe: any) {
        this.alert.confirm("Bebê cadastrada com sucesso, deseja cadastrar outro bebê?",
        () => { //Sim
          this.router.navigate(["mae", idMae, "gestacao", idGestacao, "bebe", "cadastro"])
        },
        () => { //Não
          this.router.navigate(["mae", idMae, "gestacao", idGestacao, "bebe"])
        })
      }
}