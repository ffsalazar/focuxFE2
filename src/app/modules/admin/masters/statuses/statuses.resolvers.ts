import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Status, TypeStatus } from 'app/modules/admin/masters/statuses/statuses.types';
import {StatusesService} from "./statuses.service";


@Injectable({
    providedIn: 'root'
})
export class StatusesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _statusesService: StatusesService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Status[]>
    {
        return this._statusesService.getStatuses();
    }
}

@Injectable({
    providedIn: 'root'
})
export class StatusesStatusResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _statusesService: StatusesService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Status>
    {
        return this._statusesService.getStatusById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested status is not available
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




@Injectable({
    providedIn: 'root'
})
export class StatusesTypeStatussResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _statusesService: StatusesService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TypeStatus[]>
    {
        return this._statusesService.getTypeStatuses();
    }
}


