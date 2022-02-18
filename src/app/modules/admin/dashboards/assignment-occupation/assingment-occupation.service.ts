import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import data from './data/data.json';
import activitys from './data/activitys.json'
import { Activity, Collaborator, Client } from "./assignment-occupation.types";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AssingmentOccupationService {

    private _collaborators: BehaviorSubject<Collaborator[] | null> = new BehaviorSubject(null);
    private _clients: BehaviorSubject<Client[] | null> = new BehaviorSubject(null);
    private _activitys: Activity[] = activitys;
    private _collaboratorsAssign: Collaborator[] = data;
    private _tabIndex: Subject<number> = new Subject<number>();

    constructor(private _httpClient: HttpClient) { }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get tabIndex$(): Observable<number> {
        return this._tabIndex.asObservable();
    }

    setTabIndex(id: number) {
        this._tabIndex.next(id);
    }

    /**
     * Getter for collaborators
     */
    get collaborators$(): Observable<Collaborator[]> {

        console.log("getCollaborators");
        return this._collaborators.asObservable();
    }

    /**
     * Getter for collaborators
     */
    get clients$(): Observable<Client[]> {

        return this._clients.asObservable();
    }

    get collaboratorsAssign() {
        return this._collaboratorsAssign;
    }

    set collaboratorsAssign(collaborators: Collaborator[]) {
        this._collaboratorsAssign = collaborators;
    }

    setCollaboratorByAssign(collaborator: Collaborator) {
        this._collaboratorsAssign.push(collaborator);
    }

    removeCollaboratorByAssign(collaborator: Collaborator) {
        const index = this._collaboratorsAssign.findIndex(find => find.id === collaborator.id);
        this._collaboratorsAssign.splice(index, 1);
        this._collaborators.next(this._collaboratorsAssign);
    }
    
    /***
     * Get Collaborators
     */
    getCollaborators(): Observable<Collaborator[]> {
        console.log("getCollaborators 123");
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/collaborators/all')
            .pipe(
                tap((collaborators) => {
                    this._collaborators.next(collaborators);
            }));
    }
    
    
    /**
     * Get Clients
     */
    getClients(): Observable<Client[]> {
        return this._httpClient.get<Client[]>('http://localhost:1616/api/v1/followup/clients/all')
            .pipe(
                tap((clients) => {
                    this._clients.next(clients);
                })
            );
    }

    get activitys(): Activity[] {
        return this._activitys;
    }

    set activitys(value: Activity[]) {
        this._activitys = value;
    }
}
