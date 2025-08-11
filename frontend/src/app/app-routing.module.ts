import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/auth/login/login.component';
import { HireComponent } from 'src/homepage/hire/hire.component';
import { HomeComponent } from 'src/homepage/home/home.component';
import { JobdetailComponent } from 'src/homepage/jobdetail/jobdetail.component';
import { PostedjobComponent } from 'src/homepage/postedjob/postedjob.component';
import { ProfileComponent } from 'src/homepage/profile/profile.component';
import { PostajobComponent } from 'src/shared/postajob/postajob.component';


const routes: Routes = [
   { path: '',
     redirectTo: '/home', 
    pathMatch: 'full' },  
  { path: 'login',
     component: LoginComponent },
     
    { path: 'home', component: HomeComponent },
    { path: 'profile', component: ProfileComponent},
    {path: 'post-job', component: PostajobComponent},
    {path: 'job-posted', component: PostedjobComponent},
    {path:'hire', component:HireComponent},
    {path:'jobdetail', component:JobdetailComponent},
    {
    path: 'admin',
    loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)
     },
     { path: '', redirectTo: 'dashboard/admindashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
