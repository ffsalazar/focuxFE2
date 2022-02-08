import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BusinessType} from 'app/modules/admin/masters/businessType/businessTypes.types';
import {BusinessTypesService} from "./businessTypes.service";


@Injectable({
    providedIn: 'root'
})
export class BusinessTypesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _businessTypesService: BusinessTypesService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BusinessType[]>
    {
        return this._businessTypesService.getBusinessTypes();
    }
}

@Injectable({
    providedIn: 'root'
})
export class BusinessTypesBusinessTypeResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _businessTypesService: BusinessTypesService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BusinessType>
    {
        return this._businessTypesService.getBusinessTypeById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested businessType is not available
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







