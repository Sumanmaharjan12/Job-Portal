import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { RouterModule } from '@angular/router';
import { FillerComponent } from './filler/filler.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LandingComponent,
    FillerComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
     HeaderComponent,
     LandingComponent,
     FillerComponent,
     RouterModule
  ]
})
export class SharedModule { }
