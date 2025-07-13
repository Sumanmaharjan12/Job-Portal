import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfiledetailComponent } from './profiledetail/profiledetail.component';

const routes: Routes = [
   {
      path:' ' ,
      component:HomeComponent
    },
    {
      path:'profile' ,
      component:ProfileComponent
    },
    {
      path:'profiledetail',
      component:ProfiledetailComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule { }
