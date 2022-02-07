import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
    EmployeePosition,

    Department
} from 'app/modules/admin/masters/employeePosition/employeePosition.types';
import {EmployeePositionsService} from "./employeePosition.service";


@Injectable({
    providedIn: 'root'
})
export class EmployeePositionsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _employeePositionsService: EmployeePositionsService)
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
        return this._employeePositionsService.getEmployeePositions();
    }
}

@Injectable({
    providedIn: 'root'
})
export class EmployeePositionsEmployeePositionResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _employeePositionsService: EmployeePositionsService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EmployeePosition>
    {
        return this._employeePositionsService.getEmployeePositionById(parseInt(route.paramMap.get('id')))
                   .pipe(
                       // Error here means the requested employeePosition is not available
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
export class EmployeePositionDepartmentsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _employeePositionsService: EmployeePositionsService)
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
        return this._employeePositionsService.getDepartments();
    }
}


