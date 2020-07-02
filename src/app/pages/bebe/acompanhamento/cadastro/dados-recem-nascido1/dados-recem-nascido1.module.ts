import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DadosRecemNascido1Page } from './dados-recem-nascido1.page';

const routes: Routes = [
  {
    path: '',
    component: DadosRecemNascido1Page
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
  declarations: [DadosRecemNascido1Page]
})
export class DadosRecemNascido1PageModule {}
