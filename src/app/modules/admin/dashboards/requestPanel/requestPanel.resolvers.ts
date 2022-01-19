import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RequestPanelService } from 'app/modules/admin/dashboards/RequestPanel/RequestPanel.service';

@Injectable({
    providedIn: 'root'
})
export class RequestPanelResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _requestPanelService: RequestPanelService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._requestPanelService.getData();
    }
}
