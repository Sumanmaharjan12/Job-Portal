import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { HomepageRoutingModule } from './homepage-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfiledetailComponent } from './profiledetail/profiledetail.component';
import { PostedjobComponent } from './postedjob/postedjob.component';


@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    ProfiledetailComponent,
    PostedjobComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    HomepageRoutingModule
  ]
})
export class HomepageModule { }
