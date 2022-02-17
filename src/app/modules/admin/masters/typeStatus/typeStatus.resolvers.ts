import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TypeStatu} from 'app/modules/admin/masters/typeStatus/typeStatus.types';
import {TypeStatusService} from "./typeStatus.service";


@Injectable({
    providedIn: 'root'
})
export class TypeStatusResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _typeStatusService: TypeStatusService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TypeStatu[]>
    {
        return this._typeStatusService.getTypeStatus();
    }
}

@Injectable({
    providedIn: 'root'
})
export class TypeStatusTypeStatuResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _typeStatusService: TypeStatusService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TypeStatu>
    {
        return this._typeStatusService.getTypeStatuById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested typeStatu is not available
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







