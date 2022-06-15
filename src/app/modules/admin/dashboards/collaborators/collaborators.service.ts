import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Client, Collaborator, CollaboratorKnowledge, Country, Department, EmployeePosition, Knowledge, Phone, Assigments,Status } from 'app/modules/admin/dashboards/collaborators/collaborators.types';
import {DialogData, DialogOptions} from "../../apps/portafolio/request/request.types";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FocusPopupRequestComponent} from "./details/focux-popup-request/focus-popup-request.component";
import {environment} from "../../../../../environments/environment";

import firebase  from "firebase/compat/app";
import 'firebase/compat/storage'

firebase.initializeApp(environment.firebaseConfig)


@Injectable({
    providedIn: 'root'
})
export class CollaboratorsService
{
    // Private
    private _collaborator: Subject<Collaborator | null> = new BehaviorSubject(null);
    private _collaborators: BehaviorSubject<Collaborator[] | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _knowledges: BehaviorSubject<Knowledge[] | null> = new BehaviorSubject(null);
    private _departments: BehaviorSubject<Department[] | null> = new BehaviorSubject(null);
    private _employeePositions: BehaviorSubject<EmployeePosition[] | null> = new BehaviorSubject(null);
    private _clients: BehaviorSubject<Client[] | null> = new BehaviorSubject(null);
    private _ocupations:BehaviorSubject<Assigments | null> = new BehaviorSubject(null);
    private _isOpenModal: BehaviorSubject<Boolean | null> = new BehaviorSubject(null);
    private  _request: BehaviorSubject<Request | null> = new BehaviorSubject(null)
    private _leaders: BehaviorSubject<Collaborator[] | null> = new BehaviorSubject(null);
    private _statuses: BehaviorSubject<Status[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,
                private _matDialog: MatDialog)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    storareRef = firebase.app().storage().ref();

    /**
     * Getter for collaborator
     */
    get collaborator$(): Observable<Collaborator>
    {
        return this._collaborator.asObservable();
    }

    /**
     * Getter for collaborators
     */
    get collaborators$(): Observable<Collaborator[]>
    {
        return this._collaborators.asObservable();
    }

    /**
     * Getter for collaborators
     */
    get leaders$(): Observable<Collaborator[]>
    {
        return this._leaders.asObservable();
    }

    /**
     * Getter for countries
     */
    get countries$(): Observable<Country[]>
    {
        return this._countries.asObservable();
    }

    /**
     * Getter for knowledges
     */
    get knowledges$(): Observable<Knowledge[]>
    {
        return this._knowledges.asObservable();
    }

    /**
     * Getter for departments
     */
     get departments$(): Observable<Department[]>
    {
        return this._departments.asObservable();
    }
    /**
     * Getter for employeePositions
     */
    get employeePositions$(): Observable<EmployeePosition[]>
    {
        return this._employeePositions.asObservable();
    }
    /**
     * Getter for employeePositions
     */
     get clients$(): Observable<Client[]>
     {
         return this._clients.asObservable();
     }

    /**
     * Getter for isOpenModal
     */
    get isOpenModal$(): Observable<Boolean>{
        return this._isOpenModal.asObservable()
    }


    /**
     * Getter for employeePositions
     */
    get ocupations$(): Observable<Assigments>
    {
        return this._ocupations.asObservable();
    }

    /**
     * Getter for employeePositions
     */
    get statuses$(): Observable<Status[]>
    {
        return this._statuses.asObservable();
    }

    /**
     * Getter for employeePositions
     */
    get request$(): Observable<Request>
    {
        return this._request.asObservable();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get collaborators
     */
    getCollaborators(): Observable<Collaborator[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/collaborators/all', {headers}).pipe(
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
            })
        );
    }

    /**
     * Update collaborator selected
     *
     */
    updateCollaboratorSelected() {
        return this._collaborator.next(null);
    }

    /**
     * Search collaborators with given query
     *
     * @param query
     */
    filtersCollaborator(controls: any): Observable<Collaborator[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/collaborators/all', {
            params: {controls}, headers
        }).pipe(
            tap((collaborators) => {
                let collaboratorFiltered : any[]=[];
                collaborators.forEach((collaborator) => {

                    //console.log(collaborator.leader.id)
                    collaboratorFiltered.push(collaborator);
                });
                // If the query exists...
                if ( controls )
                {
                    // Filter the collaborators

                    collaboratorFiltered = collaboratorFiltered.filter(collaborator =>

                        (
                            (controls.clientControl.length > 0 ? controls.clientControl.includes( collaborator?.client.name) : true)  &&
                            (controls.statusControl.length > 0 ? controls.statusControl.includes( collaborator?.status.name) : true) &&
                            (controls.leaderControl.length > 0 ? controls.leaderControl.includes( collaborator.leader?.id ) : true) &&
                            (controls.centralAmericanControl === null || ( controls.centralAmericanControl === '' || collaborator?.isCentralAmerican == controls.centralAmericanControl)) &&
                            (controls.searchInputControl === null || ( controls.searchInputControl.toLowerCase() === '' || collaborator?.name.toLowerCase().includes( controls.searchInputControl.toLowerCase())))

                        ));
                    function compare(a: Collaborator, b: Collaborator) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        // Their names are equal
                        if (a.lastName < b.lastName) return -1;
                        if (a.lastName > b.lastName) return 1;

                        return 0;
                    }
                    collaboratorFiltered.sort(compare);
                    this._collaborators.next(collaboratorFiltered);
                }else{
                    function compare(a: Collaborator, b: Collaborator) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        // Their names are equal
                        if (a.lastName < b.lastName) return -1;
                        if (a.lastName > b.lastName) return 1;

                        return 0;
                    }
                    collaboratorFiltered.sort(compare);
                    this._collaborators.next(collaboratorFiltered);
                }

            })
        );
    }

    /**
     * Get collaborator by id
     */
    getCollaboratorById(id: number): Observable<Collaborator>
    {
        return this._collaborators.pipe(
            take(1),
            map((collaborators) => {

                // Find the collaborator

                const collaborator = collaborators.find(item => item.id === id) || null;

                // Update the collaborator

                this._collaborator.next(collaborator);

                // Return the collaborator

                return collaborator;
            }),
            switchMap((collaborator) => {

                if ( !collaborator )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(collaborator);
            })
        );
    }

    /**
     * Create collaborator
     */
    createCollaborator(newCollaborator): Observable<Collaborator>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.collaborators$.pipe(
            take(1),
            switchMap(collaborators => this._httpClient.post<Collaborator>('http://localhost:1616/api/v1/followup/collaborators/save', newCollaborator, {headers}).pipe(
                map((newCollaborator) => {
                    // Update the collaborators with the new collaborator
                    this._collaborators.next([newCollaborator, ...collaborators]);

                    // Return the new collaborator
                    return newCollaborator;
                })
            ))
        );
    }

    /**
     * Update collaborator
     *
     * @param id
     * @param collaborator
     */
    updateCollaborator(id: number, collaborator: Collaborator): Observable<Collaborator>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.collaborators$.pipe(
            take(1),
            switchMap(collaborators => this._httpClient.put<Collaborator>('http://localhost:1616/api/v1/followup/collaborators/collaborator/' + collaborator.id,
                collaborator, {headers}
            ).pipe(
                map((updatedCollaborator) => {

                    // Find the index of the updated collaborator
                    const index = collaborators.findIndex(item => item.id === id);

                    // Update the collaborator
                    collaborators[index] = updatedCollaborator;

                    function compare(a: Collaborator, b: Collaborator) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        // Their names are equal
                        if (a.lastName < b.lastName) return -1;
                        if (a.lastName > b.lastName) return 1;

                        return 0;
                    }
                    collaborators.sort(compare);

                    // Update the collaborators
                    this._collaborators.next(collaborators);

                    // Return the updated collaborator
                    return updatedCollaborator;
                }),
                switchMap(updatedCollaborator => this.collaborator$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the collaborator if it's selected
                        this._collaborator.next(updatedCollaborator);

                        // Return the updated collaborator
                        return updatedCollaborator;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the collaborator
     *
     * @param id
     */
    deleteCollaborator(collaborator: Collaborator): Observable<Collaborator>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.collaborators$.pipe(
            take(1),
            switchMap(collaborators => this._httpClient.put('http://localhost:1616/api/v1/followup/collaborators/status/' + collaborator.id, collaborator, {headers}).pipe(
                map((updatedCollaborator: Collaborator) => {

                    // Find the index of the deleted collaborator
                    const index = collaborators.findIndex(item => item.id === collaborator.id);

                    // Update the collaborator
                    collaborators[index] = updatedCollaborator;

                    // Delete the collaborators
                    collaborators.splice(index, 1);


                    // Update the collaborators
                    this._collaborators.next(collaborators);

                    // Return the updated collaborator
                    return updatedCollaborator;
                })
            ))
        );
    }

    /**
     * Get countries
     */
    getCountries(): Observable<Country[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<Country[]>('api/dashboards/collaborators/countries', {headers}).pipe(
            tap((countries) => {
                this._countries.next(countries);
            })
        );
    }

    /**
     * Get knowledges
     */
    getKnowledges(): Observable<Knowledge[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<Knowledge[]>('http://localhost:1616/api/v1/followup/knowledges/all', {headers}).pipe(
            tap((knowledges) => {
                let knowledgesFiltered : Knowledge[] = []
                knowledges.forEach((knowledge) => {
                    if (knowledge.isActive != 0){
                        knowledgesFiltered.push(knowledge);
                    }
                });


                this._knowledges.next(knowledgesFiltered);
            })
        );
    }


    async uploadImage(nombre: number, Img: any){



        try {

                let respuesta = await this.storareRef.child("collaborators/" + nombre).putString(Img, "data_url");

                return await respuesta.ref.getDownloadURL()

        }catch (e) {

            console.log(e)

        }
    }

    /**
     * Update the avatar of the given collaborator
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<Collaborator>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.collaborators$.pipe(
            take(1),
            switchMap(collaborators => this._httpClient.post<Collaborator>('api/dashboards/collaborators/avatar', {
                id,
                avatar
            }, {
                headers
            }).pipe(
                map((updatedCollaborator) => {



                    // Find the index of the updated collaborator
                    const index = collaborators.findIndex(item => item.id === id);

                    // Update the collaborator
                    collaborators[index] = updatedCollaborator;

                    // Update the collaborators
                    this._collaborators.next(collaborators);

                    // Return the updated collaborator
                    return updatedCollaborator;
                }),
                switchMap(updatedcollaborator => this.collaborator$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {



                        // Update the collaborator if it's selected
                        this._collaborator.next(updatedcollaborator);

                        // Return the updated collaborator
                        return updatedcollaborator;
                    })
                ))
            ))
        );
    }

    getRequestById(id: number): Observable<any>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<any>('http://localhost:1616/api/v1/followup/requests/'+id, {headers}).pipe(
            tap((request) => {

                this._request.next(request)


            })
        );
    }

    getDepartments(): Observable<Department[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<Department[]>('http://localhost:1616/api/v1/followup/departments/all', {headers}).pipe(
            tap((departments) => {
                let departmentsFiltered : Department[] = []
                departments.forEach((department) => {
                    if (department.isActive != 0){
                        departmentsFiltered.push(department);
                    }
                });


                this._departments.next(departmentsFiltered);
            })
        );
    }

    getEmployeePositions(): Observable<EmployeePosition[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<EmployeePosition[]>('http://localhost:1616/api/v1/followup/employeePosition/all', {headers}).pipe(
            tap((employeePositions) => {
                let employeePositionsFiltered : EmployeePosition[] = []
                employeePositions.forEach((employeePosition) => {
                    if (employeePosition.isActive != 0){
                        employeePositionsFiltered.push(employeePosition);
                    }
                });


                this._employeePositions.next(employeePositionsFiltered);
            })
        );
    }

    getClients(): Observable<Client[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<Client[]>('http://localhost:1616/api/v1/followup/clients/all', {headers}).pipe(

            tap((clients) => {
                let clientsFiltered : Client[] = []
                clients.forEach((client) => {
                    if (client.isActive != 0){
                        clientsFiltered.push(client);
                    }
                });

                this._clients.next(clientsFiltered);
            })
        );
    }

    getStatuses(): Observable<Status[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<Status[]>('http://localhost:1616/api/v1/followup/statuses/all', {headers}).pipe(

            tap((statuses) => {
                let statusesFiltered : Status[] = []
                statuses.forEach((status) => {
                    if (status.isActive != 0 && status.typeStatus == 'Colaborador'){
                        statusesFiltered.push(status);
                    }
                });

                this._statuses.next(statusesFiltered);
            })
        );
    }

    getAssigmentByCollaboratorId(id: number): Observable<Assigments>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<Assigments>('http://localhost:1616/api/v1/followup/collaborators/assigments/' + id, {headers}).pipe(

            tap((assigments) => {


                this._ocupations.next(assigments);
            })
        );
    }

    updatePhoneStatus(id: number, phone: Phone): Observable<Phone>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.put<Phone>('http://localhost:1616/api/v1/followup/phones/status/'+ id, phone, {headers}).pipe(
            tap(phone => {
                //console.log(phone)
            })
        );
    }

    updateCollaboratorKnowledgeStatus(id: number, collaboratorKnowledge: CollaboratorKnowledge): Observable<CollaboratorKnowledge>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.put<CollaboratorKnowledge>('http://localhost:1616/api/v1/followup/collaboratorknowledge/status/'+ id, collaboratorKnowledge, {headers}).pipe(
            tap(collaboratorKnowledge => {
                console.log(collaboratorKnowledge);
            })
        );
    }

    open(data: DialogData, options: DialogOptions = {width: 300, minHeight: 0, height: 300, disableClose: true}, modalType: 1 | 2 = 1): Observable<boolean> {
        const dialogRef: MatDialogRef<FocusPopupRequestComponent> = this._matDialog.open<FocusPopupRequestComponent, DialogData>(
            FocusPopupRequestComponent,
            {
                data
            }
        );
        return dialogRef.afterClosed();
    }

    /**
     * Get collaborators
     */
    getLeaders(id: number): Observable<Collaborator[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/collaborators/leaders', {headers}).pipe(
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
                collaborators.forEach((collaborator) => {
                    if (collaborator.isActive != 0 && collaborator.id != id && collaborator.status.name == 'Activo'){
                        collaboratorFiltered.push(collaborator);
                    }
                });
                this._leaders.next(collaboratorFiltered);
            })
        );
    }
}
