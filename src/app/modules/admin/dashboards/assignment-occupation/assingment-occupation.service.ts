import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import data from './data/data.json';
import activitys from './data/activitys.json'
import { Activity, Collaborator, Client, Status, AssignationOccupation } from "./assignment-occupation.types";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { tap } from 'rxjs/operators';
import { PartnerSearchComponent } from './partner-search/partner-search.component';

@Injectable({
    providedIn: 'root'
})
export class AssingmentOccupationService {

    private _collaborators: BehaviorSubject<Collaborator[] | null> = new BehaviorSubject(null);
    private _clients: BehaviorSubject<Client[] | null> = new BehaviorSubject(null);
    private _activitys: Activity[] = activitys;
    private _collaboratorsAssign: Collaborator[] = data;
    private _tabIndex: Subject<number> = new Subject<number>();
    private _recommended:  BehaviorSubject<Collaborator[] | null> = new BehaviorSubject(null);
    private _status:  BehaviorSubject<Status[] | null> = new BehaviorSubject(null);
    private _collaboratorsSelected: Collaborator[] = [];
    private _requestSelected: any = null;

    selectedFiltered: any = {
        client: '',
        responsible: '',
        status: '',
        request: '',
    };

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
        return this._collaborators.asObservable();
    }

    /**
     * Getter for recomended$
     */
    get recommended$(): Observable<Collaborator[]> {
        return this._recommended.asObservable();
    }

    /**
     * Getter for requestSelected
     */
    get requestSelected() {
        return this._requestSelected;
    }

    /**
     * Setter for requestSelected
     */
    set requestSelected(requestSelected: any) {
        this._requestSelected = requestSelected;
    }

    /**
     * Getter for recomended$
     */
    get status$(): Observable<Status[]> {
        return this._status.asObservable();
    }

    /**
     * Getter for collaborators
     */
 
    get collaboratorsAssign() {
        return this._collaboratorsAssign;
    }

    set collaboratorsAssign(collaborators: Collaborator[]) {
        this._collaboratorsAssign = collaborators;
    }

    get clients$(): Observable<Client[]> {

        return this._clients.asObservable();
    }

    get activitys(): Activity[] {
        return this._activitys;
    }

    set activitys(value: Activity[]) {
        this._activitys = value;
    }

    set collaboratorsSelected(collaborators: Collaborator[]) {
        this._collaboratorsSelected = collaborators;
    }

    get collaboratorsSelected() {
        return this._collaboratorsSelected;
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
    
    getCollaboratorsByClient(clientId: number): Observable<Collaborator[]> {
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/filtercollaborator/allby/projectleads/', {
            params: {clientId}
        });
    }

    getRequestByResponsible(responsibleId: number, statusId: number): Observable<any[]> {
        return this._httpClient.get<any[]>('http://localhost:1616/api/v1/followup/requests/responsible/' + responsibleId, {
            params: {
                statusId
            }
        });
    }

    getRequestByClient(clientId: number, statusId: number): Observable<any[]> {
        return this._httpClient.get<any[]>('http://localhost:1616/api/v1/followup/requests/client/' + clientId, {
            params: {
                statusId
            }
        });
    }

    /**
     * 
     * @param requestId 
     */
    getRecommended(requestId: number): Observable<Collaborator[]>{
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/filtercollaborator/allby/request/allconditions/' + requestId)
        .pipe(
            tap((recommended)=>{
                this._recommended.next(recommended);
            })
        );
    }

    /**
     * 
     * @param requestId 
     */
    getCollaboratorsRecommendedByClient(requestId: number): Observable<Collaborator[]>{
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/filtercollaborator/allby/request/allclients/' + requestId)
        .pipe(
            tap((recommended)=>{
                this._recommended.next(recommended);
            })
        );
    }

    /**
     * 
     */
    getStatus(): Observable<Status[]>{
        return this._httpClient.get<Status[]>('http://localhost:1616/api/v1/followup/statuses/all/')
            .pipe(
                tap(status => {
                    this._status.next(status);
            }));
    }
    
    getCollaboratorsSelected(){
        return this._collaboratorsSelected;
    }

    /**
     * Save collaborator's assignation occupation
     * 
     * @param assignationOcupation 
     *
     */
    saveAssignationOccupation(assignationOcupation: AssignationOccupation): Observable<any> {
        return this._httpClient.post<any>('http://localhost:1616/api/v1/followup/occupationassignments/save', {
            assignationOcupation,
        });
    }

}
