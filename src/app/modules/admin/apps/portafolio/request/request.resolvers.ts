import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InventoryService } from 'app/modules/admin/apps/ecommerce/inventory/inventory.service';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import {RequestListComponent} from "./list/request.component";
import { RequestService } from './request.service';
import { CommercialArea, Request, Status, Client, Category, RequestPeriod, TypeRequest, TechnicalArea } from './request.types';

@Injectable({
    providedIn: 'root'
})
export class RequestBrandsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _requestService: RequestService)
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
    resolve(): Observable<Request[]>
    {
        return this._requestService.getRequests();
    }
}

@Injectable({
    providedIn: 'root'
})
export class RequestCategoriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _requestService: RequestService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Category[]>
    {
        return this._requestService.getCategory();
    }
}

@Injectable({
    providedIn: 'root'
})
export class RequestClientsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _requestService: RequestService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Client[]>
    {
        return this._requestService.getClients();           
    }
}
@Injectable({
    providedIn: 'root'
})
export class RequestComercAreaResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _requestService: RequestService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<CommercialArea[]>
    {
        return this._requestService.getComercArea();           
    }
}

@Injectable({
    providedIn: 'root'
})
export class RequestStatusResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _requestService: RequestService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Status[]>
    {
        return this._requestService.getStatus();           
    }
}


@Injectable({
    providedIn: 'root'
})
export class RequestPeriodResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _requestService: RequestService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RequestPeriod[]>
    {
        return this._requestService.getRequestPeriod();           
    }
}

@Injectable({
    providedIn: 'root'
})
export class RequestTypeResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _requestService: RequestService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TypeRequest[]>
    {
        return this._requestService.getTypeRequest();           
    }
}

@Injectable({
    providedIn: 'root'
})
export class BusinessTypeResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _requestService: RequestService,
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
    resolve(): Observable<TypeRequest[]>
    {
        return this._requestService.getBusinessType();           
    }
}

@Injectable({
    providedIn: 'root'
})
export class RequestTagsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _inventoryService: InventoryService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<InventoryTag[]>
    {
        return this._inventoryService.getTags();
    }
}

@Injectable({
    providedIn: 'root'
})
export class TechnicalAreaResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _requestService: RequestService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TechnicalArea[]>
    {
        return this._requestService.getAreaTech();           
    }
}

