import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DadosRecemNascido3Page } from './dados-recem-nascido3.page';

const routes: Routes = [
  {
    path: '',
    component: DadosRecemNascido3Page
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
  declarations: [DadosRecemNascido3Page]
})
export class DadosRecemNascido3PageModule {}
