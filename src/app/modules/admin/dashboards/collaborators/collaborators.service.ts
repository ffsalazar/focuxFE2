import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Client, Collaborator, CollaboratorKnowledge, Country, Department, EmployeePosition, Knowledge, Phone, Assigments,Status } from 'app/modules/admin/dashboards/collaborators/collaborators.types';
import {DialogData, DialogOptions} from "../../apps/portafolio/request/request.types";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FocuxPopupComponent} from "../../apps/portafolio/request/focux-popup/focux-popup.component";
import {FocusPopupRequestComponent} from "./details/focux-popup-request/focus-popup-request.component";

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
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/collaborators/all').pipe(
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
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/collaborators/all', {
            params: {controls}
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

                    console.log(controls)

                    // Filter the collaborators

                    collaboratorFiltered = collaboratorFiltered.filter(collaborator =>

                        (
                            (controls.clientControl.length > 0 ? controls.clientControl.includes( collaborator?.client.name) : true)  &&
                            (controls.statusControl.length > 0 ? controls.statusControl.includes( collaborator?.status.name) : true) &&
                            (controls.leaderControl.length && collaborator.leader !== null ? controls.leaderControl.includes( collaborator?.leader.id ) : true) &&

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
                const collaborator_test = collaborators.find(item => item.id === id);

                // Update the collaborator
                console.log("emit collaborator");
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
        console.log("createCollaborator");
        // Generate a new collaborator
        // const newCollaborator = {

        //     idFile: 0,
        //     name: 'Nuevo',
        //     lastName: 'Colaborador',
        //     employeePosition: {
        //         id: 2,
        //         department: {
        //             id: 1,
        //             code: 'A01',
        //             name: 'Aplicaciones',
        //             description: 'Departamento encarcado del desarrollo y mantenimiento de las diversas aplicaciones que se manejan.',
        //             isActive: 1
        //         },
        //         name: 'Analista de aplicaciones',
        //         description: 'Es capaz de mantener y desrrollar programas.',
        //         isActive: 1
        //     },
        //     client:{
        //         "id": 1,
        //         "businessType": {
        //             "id": 2,
        //             "code": "FIN01",
        //             "name": "Financiero",
        //             "description": "Servicios Financieros, inversiones, creditos personales",
        //             "isActive": 1
        //          },
        //     "name": "Credix",
        //     "description": "Empresa del ramo financiero en Costa Rica",
        //     "isActive": 1
        //     },
        //     companyEntryDate: '1970-01-01T00:00:00.000+00:00',
        //     organizationEntryDate: '1970-01-01T00:00:00.000+00:00',
        //     gender: 'M',
        //     bornDate: '1970-01-01T00:00:00.000+00:00',
        //     nationality: 've',
        //     mail: '' ,
        //     isActive: 1,
        //     assignedLocation: 'Intelix Principal',
        //     technicalSkills: '',
        //     knowledges: [],
        //     phones: [],
        //     status: {
        //         id: 9
        //     }
        // };

        return this.collaborators$.pipe(
            take(1),
            switchMap(collaborators => this._httpClient.post<Collaborator>('http://localhost:1616/api/v1/followup/collaborators/save', newCollaborator).pipe(
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
        return this.collaborators$.pipe(
            take(1),
            switchMap(collaborators => this._httpClient.put<Collaborator>('http://localhost:1616/api/v1/followup/collaborators/collaborator/' + collaborator.id,
                collaborator
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
        return this.collaborators$.pipe(
            take(1),
            switchMap(collaborators => this._httpClient.put('http://localhost:1616/api/v1/followup/collaborators/status/' + collaborator.id, collaborator).pipe(
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
        return this._httpClient.get<Country[]>('api/dashboards/collaborators/countries').pipe(
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
        return this._httpClient.get<Knowledge[]>('http://localhost:1616/api/v1/followup/knowledges/all').pipe(
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

    /**
     * Create knowledge
     *
     * @param knowledge
     */
   /* createKnowledge(knowledge: Knowledge): Observable<Knowledge>
    {
        return this.knowledges$.pipe(
            take(1),
            switchMap(knowledges => this._httpClient.post<Knowledge>('api/dashboards/collaborators/knowledge', {knowledge}).pipe(
                map((newKnowledge) => {

                    // Update the knowledges with the new knowledge
                    this._knowledges.next([...knowledges, newKnowledge]);

                    // Return new knowledge from observable
                    return newKnowledge;
                })
            ))
        );
    }

    /**
     * Update the knowledge
     *
     * @param id
     * @param knowledge
     */
   /* updateKnowledge(id: number, knowledge: Knowledge): Observable<Knowledge>
    {
        return this.knowledges$.pipe(
            take(1),
            switchMap(knowledges => this._httpClient.patch<Knowledge>('api/dashboards/collaborators/knowledge', {
                id,
                knowledge
            }).pipe(
                map((updatedKnowledge) => {

                    // Find the index of the updated knowledge
                    const index = knowledges.findIndex(item => item.id === id);

                    // Update the knowledge
                    knowledges[index] = updatedKnowledge;

                    // Update the knowledges
                    this._knowledges.next(knowledges);

                    // Return the updated knowledge
                    return updatedKnowledge;
                })
            ))
        );
    }

    /**
     * Delete the knowledge
     *
     * @param id
     */
    /*deleteKnowledge(id: number): Observable<boolean>
    {
        return this.knowledges$.pipe(
            take(1),
            switchMap(knowledges => this._httpClient.delete('api/dashboards/collaborators/knowledge', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted knowledge
                    const index = knowledges.findIndex(item => item.id === id);

                    // Delete the knowledge
                    knowledges.splice(index, 1);

                    // Update the knowledges
                    this._knowledges.next(knowledges);

                    // Return the deleted status
                    return isDeleted;
                }),
                filter(isDeleted => isDeleted),
                switchMap(isDeleted => this.collaborators$.pipe(
                    take(1),
                    map((collaborators) => {

                        // Iterate through the collaborators
                        collaborators.forEach((collaborator) => {

                            const knowledgeIndex = collaborator.knowledges.findIndex(knowledge => knowledge.id === id);

                            // If the collaborator has the knowledge, remove it
                            if ( knowledgeIndex > -1 )
                            {
                                collaborator.knowledges.splice(knowledgeIndex, 1);
                            }
                        });

                        // Return the deleted status
                        return isDeleted;
                    })
                ))
            ))
        );
    }

    /**
     * Update the avatar of the given collaborator
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<Collaborator>
    {
        return this.collaborators$.pipe(
            take(1),
            switchMap(collaborators => this._httpClient.post<Collaborator>('api/dashboards/collaborators/avatar', {
                id,
                avatar
            }, {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': avatar.type
                }
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
        return this._httpClient.get<any>('http://localhost:1616/api/v1/followup/requests/'+id).pipe(
            tap((request) => {

                this._request.next(request)


            })
        );
    }

    getDepartments(): Observable<Department[]>
{
    return this._httpClient.get<Department[]>('http://localhost:1616/api/v1/followup/departments/all').pipe(
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
        return this._httpClient.get<EmployeePosition[]>('http://localhost:1616/api/v1/followup/employeePosition/all').pipe(
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
        return this._httpClient.get<Client[]>('http://localhost:1616/api/v1/followup/clients/all').pipe(

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
        return this._httpClient.get<Status[]>('http://localhost:1616/api/v1/followup/statuses/all').pipe(

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
        return this._httpClient.get<Assigments>('http://localhost:1616/api/v1/followup/collaborators/assigments/' + id).pipe(

            tap((assigments) => {


                this._ocupations.next(assigments);
            })
        );
    }

    updatePhoneStatus(id: number, phone: Phone): Observable<Phone>
    {
        return this._httpClient.put<Phone>('http://localhost:1616/api/v1/followup/phones/status/'+ id, phone).pipe(
            tap(phone => {
                //console.log(phone)
            })
        );
    }

    updateCollaboratorKnowledgeStatus(id: number, collaboratorKnowledge: CollaboratorKnowledge): Observable<CollaboratorKnowledge>
    {
        return this._httpClient.put<CollaboratorKnowledge>('http://localhost:1616/api/v1/followup/collaboratorknowledge/status/'+ id, collaboratorKnowledge).pipe(
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
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/collaborators/leaders').pipe(
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
