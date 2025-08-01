import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from 'src/admin/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from 'src/auth/login/login.component';
import { HireComponent } from 'src/homepage/hire/hire.component';
import { HomeComponent } from 'src/homepage/home/home.component';
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
    {path:'admin/dashboard', component: AdminDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
