import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {switchMap} from 'rxjs/operators';

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
     return this._authService.roles
          .pipe( switchMap((roles) => {
              console.log(roles);
              if (roles?.length > 0) {
                  roles
                      .forEach( (rol) => {
                          console.log(rol);
                          return (rol.authority === 'ROLE_GOD' || rol.authority === 'ROLE_MIDDLE') ? of(true) : of(false);
                      });
              } else {
                  return of(false);
              }
          }));
  }

}
