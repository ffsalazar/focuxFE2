import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    Client,
    Collaborator,
    Country,
    Department,
    EmployeePosition,
    Knowledge,
    Ocupation,
    Assigments,
    Status
} from 'app/modules/admin/dashboards/collaborators/collaborators.types';
import {CollaboratorsService} from "./collaborators.service";


@Injectable({
    providedIn: 'root'
})
export class CollaboratorsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _collaboratorsService: CollaboratorsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Collaborator[]>
    {
        return this._collaboratorsService.getCollaborators();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsCollaboratorResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _collaboratorsService: CollaboratorsService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Collaborator>
    {
        return this._collaboratorsService.getCollaboratorById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested collaborator is not available
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
export class CollaboratorsCollaboratorOcupationResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _collaboratorsService: CollaboratorsService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Assigments>
    {
        return this._collaboratorsService.getAssigmentByCollaboratorId(parseInt(route.paramMap.get('id')))

    }
}


@Injectable({
    providedIn: 'root'
})
export class CollaboratorsCountriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _collaboratorsService: CollaboratorsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Country[]>
    {
        return this._collaboratorsService.getCountries();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsKnowledgesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _collaboratorsService: CollaboratorsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Knowledge[]>
    {
        return this._collaboratorsService.getKnowledges();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsDepartmentsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _collaboratorsService: CollaboratorsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Department[]>
    {
        return this._collaboratorsService.getDepartments();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsLeadersResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _collaboratorsService: CollaboratorsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Collaborator[]>
    {
        return this._collaboratorsService.getLeaders(parseInt(route.paramMap.get('id')));
    }
}

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsEmployeePositionResolver implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _collaboratorsService: CollaboratorsService) {
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EmployeePosition[]> {
        return this._collaboratorsService.getEmployeePositions();
    }
}

    @Injectable({
        providedIn: 'root'
    })
    export class CollaboratorsClientsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _collaboratorsService: CollaboratorsService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EmployeePosition[]>
    {
        return this._collaboratorsService.getEmployeePositions();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsClientResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _collaboratorsService: CollaboratorsService)
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
        return this._collaboratorsService.getClients();
    }
}

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsStatusResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _collaboratorsService: CollaboratorsService)
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
        return this._collaboratorsService.getStatuses();
    }
}
