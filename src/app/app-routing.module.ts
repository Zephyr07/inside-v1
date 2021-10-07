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
import {ListNewsletterComponent} from "./pages/admin/newsletter/list-newsletter/list-newsletter.component";
import {AddNewsletterComponent} from "./pages/admin/newsletter/add-newsletter/add-newsletter.component";
import {ListEventComponent} from "./pages/admin/event/list-event/list-event.component";
import {AddEventComponent} from "./pages/admin/event/add-event/add-event.component";
import {SuggestionComponent} from "./pages/admin/suggestion/suggestion.component";
import {ListRoleComponent} from "./pages/admin/role/list-role/list-role.component";
import {AddRoleComponent} from "./pages/admin/role/add-role/add-role.component";
import {ListNoteComponent} from "./pages/list-note/list-note.component";
import {AnniversaireComponent} from "./pages/anniversaire/anniversaire.component";
import {EvenementComponent} from "./pages/evenement/evenement.component";
import {OrganigrammeComponent} from "./pages/bvs/organigramme/organigramme.component";
import {GroupeComponent} from "./pages/groupe/groupe.component";
import {PostComponent} from "./pages/post/post.component";
import {PartenaireComponent} from "./pages/bvs/partenaire/partenaire.component";
import {ListPartnerComponent} from "./pages/admin/partner/list-partner/list-partner.component";
import {AddPartnerComponent} from "./pages/admin/partner/add-partner/add-partner.component";
import {ProduitComponent} from "./pages/bvs/produit/produit.component";
import {DirectionComponent} from "./pages/bvs/direction/direction.component";
import {ListContentComponent} from "./pages/admin/content/list-content/list-content.component";
import {AddContentComponent} from "./pages/admin/content/add-content/add-content.component";
import {HistoireComponent} from "./pages/bvs/histoire/histoire.component";
import {CeoComponent} from "./pages/bvs/ceo/ceo.component";
import {AnnuaireComponent} from "./pages/bvs/annuaire/annuaire.component";
import {SearchComponent} from "./pages/search/search.component";
import {ResetComponent} from "./pages/reset/reset.component";

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
    path : 'reset',
    component : ResetComponent,
  },
  {
    path : 'inside',
    component : SidemenuComponent,
    children : [
      {
        path : 'bvs',
        children: [
          {
            path : 'organigramme',
            component : OrganigrammeComponent
          },
          {
            path : 'ceo',
            component : CeoComponent
          },
          {
            path : 'histoire',
            component : HistoireComponent
          },
          {
            path : 'direction',
            component : DirectionComponent
          },
          {
            path : 'partenaire',
            component : PartenaireComponent
          },
          {
            path : 'annuaire',
            component : AnnuaireComponent
          },
          {
            path : 'produit',
            component : ProduitComponent
          }
        ]
      },
      {
        path : 'search/:query',
        component : SearchComponent,
      },
      {
        path : 'home',
        component : HomeComponent,
      },
      {
        path : 'post/:id',
        component : PostComponent,
      },
      {
        path : 'note',
        component : ListNoteComponent,
      },
      {
        path : 'group',
        children : [
          {
            path : '',
            component : GroupeComponent,
          },
          {
            path : 'edit/:id',
            component : AddGroupComponent,
          },
          {
            path : 'edit',
            component : AddGroupComponent,
          },

        ]
      },
      {
        path : 'anniversaire',
        component : AnniversaireComponent,
      },
      {
        path : 'event',
        component : EvenementComponent,
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
        path : 'suggestion',
        component : SuggestionComponent,
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
        path : 'list-content',
        component : ListContentComponent,
      },
      {
        path : 'add-content/:id',
        component : AddContentComponent,
      },
      {
        path : 'add-content',
        component : AddContentComponent,
      },
      {
        path : 'list-partner',
        component : ListPartnerComponent,
      },
      {
        path : 'add-partner/:id',
        component : AddPartnerComponent,
      },
      {
        path : 'add-partner',
        component : AddPartnerComponent,
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
        path : 'list-newsletter',
        component : ListNewsletterComponent,
      },
      {
        path : 'add-newsletter/:id',
        component : AddNewsletterComponent,
      },
      {
        path : 'add-newsletter',
        component : AddNewsletterComponent,
      },
      {
        path : 'list-event',
        component : ListEventComponent,
      },
      {
        path : 'add-event/:id',
        component : AddEventComponent,
      },
      {
        path : 'add-event',
        component : AddEventComponent,
      },
      {
        path : 'list-role',
        component : ListRoleComponent,
      },
      {
        path : 'add-role/:id',
        component : AddRoleComponent,
      },
      {
        path : 'add-role',
        component : AddRoleComponent,
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
