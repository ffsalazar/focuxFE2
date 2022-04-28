import {Injectable} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from "moment";
import data from './data/data.json';
import activitys from './data/activitys.json'
import { Activity, Collaborator, Client, Status, AssignationOccupation, Knowledge, RolesRequest } from "./assignment-occupation.types";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { tap, switchMap, filter, toArray, take } from 'rxjs/operators';
import { PartnerSearchComponent } from './partner-search/partner-search.component';
import { LoadingSpinnerService } from 'app/core/services/loading-spinner/loading-spinner.service';

@Injectable({
    providedIn: 'root'
})
export class AssingmentOccupationService {

    private _collaborators: BehaviorSubject<Collaborator[] | null> = new BehaviorSubject(null);
    private _collaboratorSelected: BehaviorSubject<Collaborator[] | null> = new BehaviorSubject(null);
    private _clients: BehaviorSubject<Client[] | null> = new BehaviorSubject(null);
    private _activitys: Activity[] = activitys;
    private _collaboratorsAssign: Collaborator[] = data;
    private _tabIndex: Subject<number> = new Subject<number>();
    private _recommended:  BehaviorSubject<Collaborator[] | null> = new BehaviorSubject(null);
    private _status:  BehaviorSubject<Status[] | null> = new BehaviorSubject(null);
    private _collaboratorsSelected: Collaborator[] = [];
    private _requestSelected: any = null;
    private _collaboratorSelectedRemove: BehaviorSubject<number | null> = new BehaviorSubject(null);
    private _isSuccess: Subject<boolean | null> = new Subject();
    private _knowledges: BehaviorSubject<Knowledge[] | null> = new BehaviorSubject(null);
    private _rolesRequest: BehaviorSubject<RolesRequest[] | null> = new BehaviorSubject(null);

    collaborators: any;

    selectedFiltered: any = {
        client: '',
        responsible: '',
        status: '',
        request: '',
    };

    constructor(
        private _httpClient: HttpClient,
        private _loadingSpinnerService: LoadingSpinnerService,
        private spinner: NgxSpinnerService,
    ) { }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    
    /**
     * Tab index
     * 
     */
    get tabIndex$(): Observable<number> {
        return this._tabIndex.asObservable();
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
     * Getter for isSuccess$
     */
    get isSuccess$(): Observable<boolean> {
        return this._isSuccess.asObservable();
    }

    /**
     * Getter for knowledges
     */
     get knowledges$(): Observable<Knowledge[]>
     {
         return this._knowledges.asObservable();
     }

    /**
     * Getter for requestSelected
     */
    get requestSelected() {
        return this._requestSelected;
    }

    /**
     * Getter for rolesRequest
     * 
     */
    get rolesRequest$(): Observable<any> {
        return this._rolesRequest.asObservable();
    }

    /**
     * Setter for requestSelected
     */
    set requestSelected(requestSelected: any) {
        this._requestSelected = requestSelected;
    }

    /**
     * Getter for ollaboratorSelected
     */
    get collaboratorSelected$(): Observable<Collaborator[]> {
        return this._collaboratorSelected.asObservable();
    }

    /**
     * Getter for ollaboratorSelected
     */
    get collaboratorSelectedRemove$() {
        return this._collaboratorSelectedRemove.asObservable();
    }

    // /**
    //  * Setter for requestSelected
    //  */
    // set requestSelected(requestSelected: any) {
    //     this._requestSelected = requestSelected;
    // }

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

    /**
     * Setter for request
     * 
     */
    setCollaborators(collaborators: any[])
    {
        this._collaborators.next(collaborators);
    }

    /**
     * Set tab index
     * 
     * @param id 
     */
    setTabIndex(id: number) {
        this._tabIndex.next(id);
    }

    /**
     * Set collaborator by assign
     * 
     * @param collaborator 
     */
    setCollaboratorByAssign(collaborator: Collaborator) {
        this._collaboratorsAssign.push(collaborator);
    }
    
    /**
     * Remove collaborator by assign
     * 
     * @param collaborator 
     */
    removeCollaboratorByAssign(collaborator: Collaborator) {
        const index = this._collaboratorsAssign.findIndex(find => find.id === collaborator.id);
        this._collaboratorsAssign.splice(index, 1);
        this._collaborators.next(this._collaboratorsAssign);
    }
    
    /***
     * Get Collaborators
     * 
     */
    getCollaborators(): Observable<Collaborator[]> {
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/collaborators/all')
            .pipe(
                tap((collaborators) => {
                    let collaboratorFiltered : any[]=[];

                    function compare(a: Collaborator, b: Collaborator) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;
                    // Their names are equal
                    if (a.lastName < b.lastName) return -1;
                    if (a.lastName > b.lastName) return 1;
                    return 0;
                }
                collaborators.sort(compare);

                collaboratorFiltered = collaborators.filter((item)=> item.isActive ===1);

                this._collaborators.next(collaboratorFiltered);
            }));
    }
    
    
    /**
     * Get Clients
     * 
     */
    getClients(): Observable<Client[]> {
        return this._httpClient.get<Client[]>('http://localhost:1616/api/v1/followup/clients/all')
            .pipe(
                tap((clients) => {
                    clients = clients.filter(item => item.isActive === 1);
                    this._clients.next(clients);
                })
            );
    }

    /**
     * Get knowledges
     *
     */
    getKnowledges(): Observable<Knowledge[]>
    {
        return this._httpClient.get<Knowledge[]>('http://localhost:1616/api/v1/followup/knowledges/all').pipe(
            
        switchMap(knowledges => knowledges),
            filter(knowledges => knowledges.isActive !== 0),
            toArray(),
            tap(knowledges => {
                this._knowledges.next(knowledges);
            })
        );
    }

    /**
     * Sort Array
     *
     */
    private _sortArray(x, y): number {
        if (x.name < y.name) {return -1; }
        if (x.name > y.name) {return 1; }
        return 0;
    }

    /**
     * Get Roles Request
     *
     */
     getRolesRequest(): Observable<RolesRequest[]>
     {
        return this._httpClient.get<RolesRequest[]>('http://localhost:1616/api/v1/followup/requestrole/all').pipe(
            switchMap(rolesRequest => rolesRequest.sort(this._sortArray)),
            filter(roleRequest => roleRequest.isActive !== 0),
            toArray(),
            tap(rolesRequest => {
                this._rolesRequest.next(rolesRequest);
            })
        );
    }

    /**
     * Get collaborators by client
     *
     * @param clientId
     * @returns
     */
    getCollaboratorsByClient(clientId: number): Observable<Collaborator[]> {
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/filtercollaborator/allby/projectleads/', {
            params: {clientId}
        });
    }

    /**
     * Set collaborator selected
     * 
     */
    setCollaboratorSelected(): void {
        // Update collaborators selected
        this._collaboratorSelected.next(this.collaboratorsSelected);
    }

    /**
     * Remove collaborator selected
     *
     * @param collaboratorId
     */
    removeCollaboratorSelected(collaboratorId: number): void {
        // Remove collaborators selected
        this._collaboratorSelectedRemove.next(collaboratorId);
    }

    /**
     * Get request by responsible
     * 
     * @param responsibleId 
     * @param statusId 
     * @returns 
     */
    getRequestByResponsible(responsibleId: number, statusId: number): Observable<any[]> {
        return this._httpClient.get<any[]>('http://localhost:1616/api/v1/followup/requests/responsible/' + responsibleId, {
            params: {
                statusId
            }
        });
    }
    
    /**
     * Get request by client
     * 
     * @param clientId 
     * @param statusId 
     * @returns 
     */
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
        /** spinner starts on init */
        this._loadingSpinnerService.startLoading();

        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/filtercollaborator/allby/request/allconditions/' + requestId)
            .pipe(
                tap((recommended)=>{
                    /** spinner ends after 5 seconds */
                    this._loadingSpinnerService.stopLoading();

                    this._recommended.next(recommended);
                })
            );
    }
     	
    /**
     * 
     * @param requestId 
     */
    getCollaboratorsRecommendedByClient(requestId: number): Observable<Collaborator[]>{
        /** spinner starts on init */
        this._loadingSpinnerService.startLoading();

        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/filtercollaborator/allby/request/allclients/' + requestId)
            .pipe(
                tap((recommended) => {
                    /** spinner ends after 5 seconds */
                    this._loadingSpinnerService.stopLoading();

                    this._recommended.next(recommended);
                })
            );
    }

    /**
     * 
     * @param requestId 
     */
    getCollaboratorRecommendedByKnowledge(requestId: number): Observable<Collaborator[]>{
        /** spinner starts on init */
        this._loadingSpinnerService.startLoading();

        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/filtercollaborator/allby/request/knowledgeclient/' + requestId)
            .pipe(
                tap((recommended) => {
                    /** spinner ends after 5 seconds */
                    this._loadingSpinnerService.stopLoading();

                    this._recommended.next(recommended);
                    
                })
            );
    }
    
    /**
     * Get collaborator recommended by free
     * 
     * @param requestId 
     */
    getCollaboratorRecommendedByFree(requestId: number): Observable<Collaborator[]>{
        /** spinner starts on init */
        this._loadingSpinnerService.startLoading();

        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/filtercollaborator/allby/request/free/' + requestId)
            .pipe(
                tap((recommended) => {
                    /** spinner ends after 5 seconds */
                    this._loadingSpinnerService.stopLoading();

                    this._recommended.next(recommended);
                })
            );
    }

    /**
     * Get status
     * 
     */
    getStatus(): Observable<Status[]>{
        return this._httpClient.get<Status[]>('http://localhost:1616/api/v1/followup/statuses/all/')
            .pipe(
                tap(status => {
                    this._status.next(status);
            }));
    }
    
    /**
     * Get collaborators selected
     * 
     * @returns 
     */
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
        return this._httpClient.post<any>('http://localhost:1616/api/v1/followup/occupationassignments/save',
            assignationOcupation,
        ).pipe(
            tap((occupation) => {
                this._isSuccess.next(true);
            })
        );
    }

    /**
     * Update is success
     * 
     */
    updateIsSuccess() {
        this._isSuccess.next(true);
    }

    /**
     * Get all collaborator occupation
     * 
     * @returns
     */
    getAllColaboratorOccupation(): Observable<any> {
        /** spinner starts on init */
        this._loadingSpinnerService.startLoading();
        
        return this._httpClient.get<any>('http://localhost:1616/api/v1/followup/collaborators/all/occupationpercentage')
            .pipe(
                tap(collaborators => {
                    /** spinner ends after 5 seconds */
                    this._loadingSpinnerService.stopLoading();
                    
                    let collaboratorFiltered : any[]=[];

                    function compareOcupation(a: any, b: any) {
                        if (a.occupationPercentage < b.occupationPercentage) return -1;
                        if (a.occupationPercentage > b.occupationPercentage) return 1;
                        return 0;
                    }
                    function compare(a: Collaborator, b: Collaborator) {
                            if (a.name < b.name) return -1;
                            if (a.name > b.name) return 1;
                            // Their names are equal
                            if (a.lastName < b.lastName) return -1;
                            if (a.lastName > b.lastName) return 1;

                            return 0;
                        }
                    
                    let collaboratorsTmp = collaborators.sort(compare);
                    collaboratorsTmp.sort(compareOcupation);
                    collaboratorFiltered = collaboratorsTmp.filter((item)=> item.isActive ===1);
                    
                    this.collaborators = [...collaboratorFiltered];
                    this._collaborators.next(collaboratorFiltered);
                })
            )
    }

    /**
     * Get occupations by collaborator
     * 
     * @returns 
     */
    getOccupationsByCollaborator(collaboratorId: number): Observable<any> {
        return this._httpClient.get<any>('http://localhost:1616/api/v1/followup/collaborators/assigments/' + collaboratorId);
    }
    
    /**
     * Update occupation by collaborator
     * 
     * @param occupationId 
     * @param occupation 
     * @returns 
     */
    updateOccupationsByCollaborator(collaboratorId: number, occupations): Observable<any> {
        return this._httpClient.put<any>('http://localhost:1616/api/v1/followup/occupationassignments/updateall/' + collaboratorId,
            occupations
        ).pipe(
            tap((occupation) => {
                this._isSuccess.next(true);
            })
        );
    }

    /**
     * Delete occupation
     * 
     * @param occupationId 
     * @param occupation 
     * @returns 
     */
    deleteOccupation(occupationId: number, occupation) {
        return this._httpClient.put<any>('http://localhost:1616/api/v1/followup/occupationassignments/status/' + occupationId,
            occupation
        );
    }
    
    /**
     * Compare occupation
     * 
     * @param a 
     * @param b 
     * @returns 
     */
    private _compareOcupation(a: any, b: any) {
        if (a.occupationPercentage < b.occupationPercentage) return -1;
        if (a.occupationPercentage > b.occupationPercentage) return 1;
        return 0;
    }
    
    /**
     * Compare
     * 
     * @param a 
     * @param b 
     * @returns 
     */
    private _compare(a: Collaborator, b: Collaborator) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        // Their names are equal
        if (a.lastName < b.lastName) return -1;
        if (a.lastName > b.lastName) return 1;

        return 0;
    }

    /**
     * Delete occupation
     * 
     * @param occupationId 
     * @param occupation 
     * @returns 
     */
    getFilterCollaborator(clientsId: number[], knowledgesId: number[], occupation: number, dateInit: Date, dateEnd: Date): Observable<any> {
        /** spinner starts on init */
        this._loadingSpinnerService.startLoading();

        this.spinner.show();

        let params = new HttpParams();

        if ( clientsId.length > 0 ) {
            params = params.append('clientsId', clientsId.join(','));
        }
        
        if ( knowledgesId.length > 0 ) {
            params = params.append('knowledgesId', knowledgesId.join(','));
        }

        if ( occupation ) {
            params = params.append('occupation', occupation);
        }

        const startDate = moment(dateInit).format('L').split('/').join('-');
        const endDate = moment(dateEnd).format('L').split('/').join('-')

        if ( ( dateInit.toString() !== '' || !startDate.includes('Invalid') ) && ( dateEnd.toString() !== '' || !endDate.includes('Invalid') ) ) {
            params = params.append('dateInit', startDate);
            params = params.append('dateEnd', endDate);
        }
        
        return this._httpClient.get<any>('http://localhost:1616/api/v1/followup/filtercollaborator/allby', {
            params
        }).pipe(
            switchMap(collaborators => collaborators.sort(this._compare)),
            toArray(),
            switchMap(collaborators => collaborators.sort(this._compareOcupation)),
            toArray(),
            tap(collaborators => {
                /** spinner ends after 5 seconds */
                this._loadingSpinnerService.stopLoading();
                this.spinner.hide();

                this._collaborators.next(collaborators);

            }
        ));
    }

}
