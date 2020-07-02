import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DadosAmamentacao1Page } from './dados-amamentacao1.page';

const routes: Routes = [
  {
    path: '',
    component: DadosAmamentacao1Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  declarations: [DadosAmamentacao1Page]
})
export class DadosAmamentacao1PageModule {}
