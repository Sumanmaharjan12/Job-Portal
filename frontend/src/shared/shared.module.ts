import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { RouterModule } from '@angular/router';
import { FillerComponent } from './filler/filler.component';
import { CategoryComponent } from './category/category.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LandingComponent,
    FillerComponent,
    CategoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
     HeaderComponent,
     LandingComponent,
     FillerComponent,
     CategoryComponent,
     RouterModule
  ]
})
export class SharedModule { }
