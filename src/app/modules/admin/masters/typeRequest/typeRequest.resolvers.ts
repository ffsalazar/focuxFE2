import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TypeRequest} from 'app/modules/admin/masters/typeRequest/typeRequest.types';
import {TypeRequestService} from './typeRequest.service';


@Injectable({
    providedIn: 'root'
})
export class TypeRequestResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _typeRequestService: TypeRequestService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TypeRequest[]>
    {
        return this._typeRequestService.getTypeRequests();
    }
}

@Injectable({
    providedIn: 'root'
})
export class TypeRequestsTypeRequestResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _typeRequestService: TypeRequestService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TypeRequest>
    {
        return this._typeRequestService.getTypeRequestById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested typeRequest is not available
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







