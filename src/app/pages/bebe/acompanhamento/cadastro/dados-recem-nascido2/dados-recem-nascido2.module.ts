import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DadosRecemNascido2Page } from './dados-recem-nascido2.page';

const routes: Routes = [
  {
    path: '',
    component: DadosRecemNascido2Page
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
  declarations: [DadosRecemNascido2Page]
})
export class DadosRecemNascido2PageModule {}
