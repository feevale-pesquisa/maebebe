import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DadosResidenciaPage } from './dados-residencia.page';
import { ReactiveFormsModule} from '@angular/forms';
import { BrMaskerModule } from 'br-mask';

const routes: Routes = [
  {
    path: '',
    component: DadosResidenciaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    BrMaskerModule
  ],
  declarations: [DadosResidenciaPage]
})
export class DadosResidenciaPageModule {}
