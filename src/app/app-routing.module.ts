import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {DashboardComponent} from "./pages/admin/dashboard/dashboard.component";
import {SidemenuComponent} from "./pages/sidemenu/sidemenu.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {RegisterComponent} from "./pages/register/register.component";
import {MenuComponent} from "./pages/admin/menu/menu.component";
import {AddUserComponent} from "./pages/admin/user/add-user/add-user.component";
import {HomeComponent} from "./pages/home/home.component";
import {ListUserComponent} from "./pages/admin/user/list-user/list-user.component";
import {ListEntityComponent} from "./pages/admin/entity/list-entity/list-entity.component";
import {AddEntityComponent} from "./pages/admin/entity/add-entity/add-entity.component";
import {ListManagementComponent} from "./pages/admin/management/list-management/list-management.component";
import {AddManagementComponent} from "./pages/admin/management/add-management/add-management.component";
import {ListGroupComponent} from "./pages/admin/group/list-group/list-group.component";
import {AddGroupComponent} from "./pages/admin/group/add-group/add-group.component";

const routes: Routes = [
  {
    path : 'login',
    component : LoginComponent,
  },
  {
    path : 'register',
    component : RegisterComponent,
  },
  {
    path : 'inside',
    component : SidemenuComponent,
    children : [
      {
        path : 'home',
        component : HomeComponent,
      },
      {
        path : 'profile',
        component : ProfileComponent,
      },
      { path: '',
        redirectTo: '/inside/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path : 'admin',
    component : MenuComponent,
    children : [
      {
        path : 'dashboard',
        component : DashboardComponent,
      },
      {
        path : 'list-user',
        component : ListUserComponent,
      },
      {
        path : 'add-user/:id',
        component : AddUserComponent,
      },
      {
        path : 'add-user',
        component : AddUserComponent,
      },
      {
        path : 'list-entity',
        component : ListEntityComponent,
      },
      {
        path : 'add-entity/:id',
        component : AddEntityComponent,
      },
      {
        path : 'add-entity',
        component : AddEntityComponent,
      },
      {
        path : 'list-group',
        component : ListGroupComponent,
      },
      {
        path : 'add-group/:id',
        component : AddGroupComponent,
      },
      {
        path : 'add-group',
        component : AddGroupComponent,
      },
      {
        path : 'list-management',
        component : ListManagementComponent,
      },
      {
        path : 'add-management/:id',
        component : AddManagementComponent,
      },
      {
        path : 'add-management',
        component : AddManagementComponent,
      },
      { path: '',
        redirectTo: '/admin/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: '**', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
