import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RequestRole} from 'app/modules/admin/masters/requestRole/requestRole.types';
import {RequestRoleService} from './requestRole.service';


@Injectable({
    providedIn: 'root'
})
export class RequestRoleResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _requestRoleService: RequestRoleService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RequestRole[]>
    {
        return this._requestRoleService.getRequestRoles();
    }
}

@Injectable({
    providedIn: 'root'
})
export class RequestRolesRequestRoleResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _requestRoleService: RequestRoleService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RequestRole>
    {
        return this._requestRoleService.getRequestRoleById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested requestRole is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}







