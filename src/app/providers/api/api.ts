import {Injectable} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {Router} from '@angular/router';
/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class ApiProvider {

  public Employees: any = this.restangular.service('employees');
  public Managements: any = this.restangular.service('directions');
  public Entities: any = this.restangular.service('entities');
  public Groups: any = this.restangular.service('groups');
  public Members: any = this.restangular.service('members');
  public Newsletters: any = this.restangular.service('newsletters');
  public NewsletterEntities: any = this.restangular.service('newsletter_entities');
  public NewsletterGroups: any = this.restangular.service('newsletter_groups');
  public NewsletterDirections: any = this.restangular.service('newsletter_directions');
  public Suggestions: any = this.restangular.service('suggestions');
  public Roles: any = this.restangular.service('roles');
  public Users: any = this.restangular.service('users');
  public Permissions: any = this.restangular.service('permissions');
  public Posts: any = this.restangular.service('posts');
  public Ratings: any = this.restangular.service('ratings');
  public PermissionRoles: any = this.restangular.service('permission_roles');
  public RoleUsers: any = this.restangular.service('role_users');
  public me: any = this.restangular.one('auth/me');

  public date_format = 'Y-M-D';

  public autoplay_val = 5000;
  public slide_speed = 700;

  constructor(public restangular: Restangular, private router: Router) {
    restangular.withConfig((RestangularConfigurer:any) => {});
  }

  formarPrice(price:any) {
    if (price === undefined) {
      return '';
    } else {
      price += '';
      const tab = price.split('');
      let p = '';
      for (let i = tab.length; i > 0; i--) {
        if (i % 3 === 0) {
          p += ' ';
        }
        p += tab[tab.length - i];
      }
      return p;
    }
  }

  checkUser() {
    // @ts-ignore
    if (JSON.parse(localStorage.getItem('user')) == null) {
      //Metro.notify.create('Vous n\'êtes pas connecté', 'Erreur de connexion', {cls: 'alert'});
      this.router.navigate(['/login']);
    } else {
      // rien
      // verification si le mot de passe a été reset
      // @ts-ignore
      if (!JSON.parse(localStorage.getItem('user')).has_reset_password) {
        // @ts-ignore
        this.router.navigate(['/reset', JSON.parse(localStorage.getItem('user')).id]);
      }
    }
  }
}
