import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DadosAmamentacao2Page } from './dados-amamentacao2.page';

const routes: Routes = [
  {
    path: '',
    component: DadosAmamentacao2Page
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
  declarations: [DadosAmamentacao2Page]
})
export class DadosAmamentacao2PageModule {}
