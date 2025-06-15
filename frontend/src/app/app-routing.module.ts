import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'src/auth/login/login.component';
import { HomeComponent } from 'src/homepage/home/home.component';


const routes: Routes = [
   { path: '',
     redirectTo: '/home', 
    pathMatch: 'full' },  
  { path: 'login',
     component: LoginComponent },
    { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
