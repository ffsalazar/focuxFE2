import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Collaborator } from "./assignment-occupation.types";
import { AssingmentOccupationService } from './assingment-occupation.service';
import { Client } from './assignment-occupation.types';

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
        console.log("Hola mundo");

        return this._assingmentService.getCollaborators();
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