import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {

    constructor(private _authService: AuthService) {
    }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // const roles: {authority: string}[] = JSON.parse(localStorage.getItem('authorities')) as {authority: string}[];
      if (this._authService.roles?.length > 0) {
          for(const roles of this._authService.roles) {
              return (roles.authority === 'ROLE_GOD' || roles.authority === 'ROLE_MIDDLE') ?  of(true): of(false);
          }
      }
  }

}
