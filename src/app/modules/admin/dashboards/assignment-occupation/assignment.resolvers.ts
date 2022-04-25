import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Collaborator, Client, Knowledge, RolesRequest } from "./assignment-occupation.types";
import { AssingmentOccupationService } from './assingment-occupation.service';

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsResolver implements Resolve<any>
{
    
    /**
     * Constructor
     */
    constructor(
        private _assingmentService: AssingmentOccupationService,
        )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    resolve(): Observable<Collaborator[]>
    {
        return this._assingmentService.getCollaborators();
    }
}

@Injectable({
    providedIn: 'root'
})
export class RolesRequestResolver implements Resolve<any>
{
    
    /**
     * Constructor
     */
    constructor(
        private _assingmentService: AssingmentOccupationService,
        )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    resolve(): Observable<RolesRequest[]>
    {
        return this._assingmentService.getRolesRequest();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ClientsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _assingmentService: AssingmentOccupationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    resolve(): Observable<Client[]>
    {
        return this._assingmentService.getClients();           
    }
}

@Injectable({
    providedIn: 'root'
})
export class KnowledgesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _assingmentService: AssingmentOccupationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    resolve(): Observable<Knowledge[]>
    {
        return this._assingmentService.getKnowledges();           
    }
}

@Injectable({
    providedIn: 'root'
})
export class OccupationCollaboratorResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _assingmentService: AssingmentOccupationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    resolve(): Observable<Client[]>
    {
        return this._assingmentService.getAllColaboratorOccupation();           
    }
}

// @Injectable({
//     providedIn: 'root'
// })

// export class RecommendedResolver implements Resolve<any>
// {
//     /**
//      * Constructor
//      */
//     constructor(
//         private _assingmentService: AssingmentOccupationService,
//     )
//     {
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     resolve(): Observable<Collaborator[]>
//     {
//         return this._assingmentService.getRecommended();           
//     }
// }