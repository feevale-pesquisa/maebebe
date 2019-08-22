import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/login/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  
  { path: 'inicio', loadChildren: './pages/inicio/inicio.module#InicioPageModule', canActivate: [AuthGuard] },

  { path: 'mae/cadastro', loadChildren: './pages/mae/cadastro/inicio/inicio.module#InicioPageModule', canActivate: [AuthGuard] },
  { path: 'mae/cadastro/dados-pessoais', loadChildren: './pages/mae/cadastro/dados-pessoais/dados-pessoais.module#DadosPessoaisPageModule' },
  { path: 'mae/cadastro/dados-residencia', loadChildren: './pages/mae/cadastro/dados-residencia/dados-residencia.module#DadosResidenciaPageModule' },
  { path: 'mae/cadastro/outras-informacoes', loadChildren: './pages/mae/cadastro/outras-informacoes/outras-informacoes.module#OutrasInformacoesPageModule' },

  { path: 'mae/:id/edicao', loadChildren: './pages/mae/cadastro/inicio/inicio.module#InicioPageModule', canActivate: [AuthGuard] },
  { path: 'mae/:id/edicao/dados-pessoais', loadChildren: './pages/mae/cadastro/dados-pessoais/dados-pessoais.module#DadosPessoaisPageModule' },
  { path: 'mae/:id/edicao/dados-residencia', loadChildren: './pages/mae/cadastro/dados-residencia/dados-residencia.module#DadosResidenciaPageModule' },
  { path: 'mae/:id/edicao/outras-informacoes', loadChildren: './pages/mae/cadastro/outras-informacoes/outras-informacoes.module#OutrasInformacoesPageModule' },

  { path: 'mae/consulta/busca', loadChildren: './pages/mae/consulta/busca/busca.module#BuscaPageModule', canActivate: [AuthGuard] },
  { path: 'mae/consulta/dados', loadChildren: './pages/mae/consulta/dados/dados.module#DadosPageModule', canActivate: [AuthGuard] },
  { path: 'mae/:id/gestacao', loadChildren: './pages/gestacao/busca/por-mae/por-mae.module#PorMaePageModule', canActivate: [AuthGuard] },

  { path: 'bebe/cadastro', loadChildren: './pages/bebe/cadastro/inicio/inicio.module#InicioPageModule', canActivate: [AuthGuard] },
  { path: 'bebe/consulta/busca', loadChildren: './pages/bebe/consulta/busca/busca.module#BuscaPageModule', canActivate: [AuthGuard] },

  { path: 'gestacao/cadastro', redirectTo: 'gestacao/cadastro/dados-gestacao', canActivate: [AuthGuard] },
  { path: 'gestacao/cadastro/dados-gestacao', loadChildren: './pages/gestacao/cadastro/dados-gestacao/dados-gestacao.module#DadosGestacaoPageModule', canActivate: [AuthGuard] },
  { path: 'gestacao/cadastro/dados-planejamento', loadChildren: './pages/gestacao/cadastro/dados-planejamento/dados-planejamento.module#DadosPlanejamentoPageModule', canActivate: [AuthGuard] },
  { path: 'gestacao/cadastro/dados-prenatal', loadChildren: './pages/gestacao/cadastro/dados-prenatal/dados-prenatal.module#DadosPrenatalPageModule', canActivate: [AuthGuard] },
  { path: 'gestacao/:id/bebe', loadChildren: './pages/bebe/busca/por-gestacao/por-gestacao.module#PorGestacaoPageModule', canActivate: [AuthGuard] },

  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
