import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NopageComponent } from './nopage/nopage.component';
import { AllComponent } from './all/all.component';
import { CollegeComponent } from './college/college.component';
import { ViewkanbanComponent } from './viewkanban/viewkanban.component';


const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'boards/:departmentId', component: ViewkanbanComponent
  },
  {
    path: 'colleges', component: AllComponent
  },

  {
    path: 'colleges/:collegeId', component: CollegeComponent
  },
  {
    path: 'home', component: SidebarComponent
  },
  {
    path: '**', component: NopageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
