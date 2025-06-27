import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LandingComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
     HeaderComponent,
     LandingComponent
  ]
})
export class SharedModule { }
