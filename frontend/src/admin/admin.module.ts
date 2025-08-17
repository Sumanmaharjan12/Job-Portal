import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { AdminjobkeeperComponent } from './adminjobkeeper/adminjobkeeper.component';
import { AdminjobseekerComponent } from './adminjobseeker/adminjobseeker.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminjobsComponent } from './adminjobs/adminjobs.component';
import { JobcategoriesComponent } from './jobcategories/jobcategories.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AdmindashboardComponent,
    AdminjobseekerComponent,
    AdminjobkeeperComponent,
    AdminjobsComponent,
    JobcategoriesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    HttpClientModule,
    FormsModule
    
  ]
})
export class AdminModule { }
