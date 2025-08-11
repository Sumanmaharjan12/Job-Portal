import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminjobseekerComponent } from './adminjobseeker/adminjobseeker.component';
import { AdminjobkeeperComponent } from './adminjobkeeper/adminjobkeeper.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AdmindashboardComponent,
    AdminjobseekerComponent,
    AdminjobkeeperComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    FormsModule
    
  ]
})
export class AdminModule { }
