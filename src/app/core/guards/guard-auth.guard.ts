import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from "../auth/auth.service";

@Injectable({
    providedIn: "root"
})
export class GuardAuthGuard implements CanActivate{

    constructor(private _authService: AuthService,
                private _router: Router) {
    }



    /**
     * Can activate
     *
     * @param route
     * @param state
     */
        canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
        {
            const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
            return this._isAuthenticated(redirectUrl);
        }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
        return this._isAuthenticated(redirectUrl);
    }

    private _isAuthenticated(redirectURL: string): Observable<boolean> {
       if (!this._authService.authenticated && this._authService.roles.length === 0) {
           this._router.navigate(['sign-in'], {queryParams: {redirectURL}}).then();
           return of(false);
       } else {
           return of(true);
       }
    }
}
