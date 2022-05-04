import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class CustomAuthGuard implements CanActivate{

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
            const isAuthenticated: boolean = (localStorage.getItem('isAuthenticated') === 'true');
            const roles: {authority: string}[] = JSON.parse(localStorage.getItem('authorities')) as {authority: string}[];
       if (!isAuthenticated && roles?.length === 0) {
           this._router.navigate(['sign-in'], {queryParams: {redirectURL}}).then();
           return of(true);
       } else {
           return of(true);
       }
    }
}
