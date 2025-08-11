import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { FillerComponent } from './filler/filler.component';
import { HeaderComponent } from './header/header.component';
import { LandingComponent } from './landing/landing.component';
import { PostajobComponent } from './postajob/postajob.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LandingComponent,
    FillerComponent,
    CategoryComponent,
    PostajobComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  exports: [
     HeaderComponent,
     LandingComponent,
     FillerComponent,
     CategoryComponent,
     PostajobComponent,
    //  RouterModule
  ]
})
export class SharedModule { }
