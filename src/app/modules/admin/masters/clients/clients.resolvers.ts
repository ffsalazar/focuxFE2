import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Client, BusinessType } from 'app/modules/admin/masters/clients/clients.types';
import {ClientsService} from "./clients.service";


@Injectable({
    providedIn: 'root'
})
export class ClientsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _clientsService: ClientsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Client[]>
    {
        return this._clientsService.getClients();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ClientsClientResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _clientsService: ClientsService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Client>
    {
        return this._clientsService.getClientById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested client is not available
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
export class ClientsBusinessTypesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _clientsService: ClientsService)
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
        return this._clientsService.getBusinessTypes();
    }
}


