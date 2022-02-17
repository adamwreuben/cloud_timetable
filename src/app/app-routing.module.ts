import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NopageComponent } from './nopage/nopage.component';
import { AllComponent } from './all/all.component';


const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'colleges', component: AllComponent
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
