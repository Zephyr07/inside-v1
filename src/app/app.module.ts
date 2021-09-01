import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import * as _ from 'lodash';
import {RestangularModule} from 'ngx-restangular';
import {FormsModule} from '@angular/forms';
import {NgxPermissionsModule, NgxPermissionsService, NgxRolesService} from 'ngx-permissions';
import {API_ENDPOINT} from './services/contants';
import {ApiProvider} from './providers/api/api';
import {AuthProvider} from './providers/auth/auth';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import {LimitToPipe} from "./pipe/limit-to";
import {StatutPipe} from "./pipe/status";
import {FilterPipe} from "./pipe/filter.pipe";
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { SidemenuComponent } from './pages/sidemenu/sidemenu.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { AddUserComponent } from './pages/admin/user/add-user/add-user.component';
import { MenuComponent } from './pages/admin/menu/menu.component';
import { HomeComponent } from './pages/home/home.component';
import { ListUserComponent } from './pages/admin/user/list-user/list-user.component';
import { ListEntityComponent } from './pages/admin/entity/list-entity/list-entity.component';
import { AddEntityComponent } from './pages/admin/entity/add-entity/add-entity.component';
import { AddManagementComponent } from './pages/admin/management/add-management/add-management.component';
import { ListManagementComponent } from './pages/admin/management/list-management/list-management.component';

export function RestangularConfigFactory(RestangularProvider:any) {
  RestangularProvider
    .setBaseUrl(API_ENDPOINT)
    .addResponseInterceptor((data:any, operation:any, what:any, url:any, response:any, deferred:any) => {

      if (operation === 'getList') {

        let newResponse = what;
        if (Array.isArray(data)) {

          // newResponse = response.data[what]
          // newResponse.error = response.error
          return data;
        }
        if (data.per_page !== undefined) {
          newResponse = data.data;
          newResponse.metadata = _.omit(data, 'data');
          return newResponse;
        }
        return [{value: data}];


      }

      return response;
    })
    .addFullRequestInterceptor((element:any, operation:any, path:any, url:any, headers:any, params:any) => {
      /*console.log('element',element);
      console.log('operation',operation);
      console.log('what',what);
      console.log('url',url);
      console.log('headers',headers);
      console.log('params',params);*/

      const token = localStorage.getItem('jwt_token');
      if (token) {
        headers.Authorization = 'Bearer ' + token;
        headers['Access-Token'] = token;
      }
    })
  ;
}

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    StatutPipe,
    LimitToPipe,
    LoginComponent,
    DashboardComponent,
    SidemenuComponent,
    ProfileComponent,
    RegisterComponent,
    AddUserComponent,
    MenuComponent,
    HomeComponent,
    ListUserComponent,
    ListEntityComponent,
    AddEntityComponent,
    AddManagementComponent,
    ListManagementComponent
  ],
  imports: [
    BrowserModule,
    RestangularModule.forRoot(RestangularConfigFactory),
    NgxPermissionsModule.forRoot(),
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    ApiProvider,
    AuthProvider,],
  bootstrap: [AppComponent]
})
export class AppModule { }
