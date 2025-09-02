import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { AdminjobkeeperComponent } from './adminjobkeeper/adminjobkeeper.component';
import { AdminjobsComponent } from './adminjobs/adminjobs.component';
import { AdminjobseekerComponent } from './adminjobseeker/adminjobseeker.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobcategoriesComponent } from './jobcategories/jobcategories.component';
import { AdminApplicationComponent } from './admin-application/admin-application.component';

const routes: Routes = [
  {
    path:'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'admindashboard', component: AdmindashboardComponent },
       { path: 'adminjobseeker', component: AdminjobseekerComponent },
         { path: 'adminjobkeeper', component: AdminjobkeeperComponent },
           { path: 'adminjobs', component: AdminjobsComponent },
           { path: 'jobcategory', component: JobcategoriesComponent },
            { path: 'application', component: AdminApplicationComponent },
     
    ]
  },
  { path: '**', redirectTo: 'admindashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
