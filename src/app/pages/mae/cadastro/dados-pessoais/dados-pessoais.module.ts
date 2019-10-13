import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DadosPessoaisPage } from './dados-pessoais.page';
import { ReactiveFormsModule} from '@angular/forms';
import { BrMaskerModule } from 'br-mask';

const routes: Routes = [
  {
    path: '',
    component: DadosPessoaisPage
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
  declarations: [DadosPessoaisPage]
})
export class DadosPessoaisPageModule {}
