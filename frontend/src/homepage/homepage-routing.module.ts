import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfiledetailComponent } from './profiledetail/profiledetail.component';
import { PostedjobComponent } from './postedjob/postedjob.component';
import { ApplyjobComponent } from './applyjob/applyjob.component';
import { HireComponent } from './hire/hire.component';

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
    },
     {
      path:'postedjob',
      component:PostedjobComponent
    },
    {
      path:'applyjob',
      component:ApplyjobComponent
    },
    {
      path:'hire',
      component:HireComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomepageRoutingModule { }
