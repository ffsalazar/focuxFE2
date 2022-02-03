import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Collaborator, Country, Department, EmployeePosition, Knowledge, Phone } from 'app/modules/admin/dashboards/collaborators/collaborators.types';

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsService
{
    // Private
    private _collaborator: BehaviorSubject<Collaborator | null> = new BehaviorSubject(null);
    private _collaborators: BehaviorSubject<Collaborator[] | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _knowledges: BehaviorSubject<Knowledge[] | null> = new BehaviorSubject(null);
    private _departments: BehaviorSubject<Department[] | null> = new BehaviorSubject(null);
    private _employeePositions: BehaviorSubject<EmployeePosition[] | null> = new BehaviorSubject(null);
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
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
                collaborators.forEach((collaborator) => {
                    if (collaborator.isActive != 0){
                        collaboratorFiltered.push(collaborator);
                    }
                });
                this._collaborators.next(collaboratorFiltered);

            })
        );
    }

    /**
     * Search collaborators with given query
     *
     * @param query
     */
    searchCollaborator(query: string): Observable<Collaborator[]>
    {
        return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/collaborators/all', {
            params: {query}
        }).pipe(
            tap((collaborators) => {
                let collaboratorFiltered : any[]=[];
                collaborators.forEach((collaborator) => {
                    if (collaborator.isActive != 0){
                        collaboratorFiltered.push(collaborator);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the collaborators

                    collaboratorFiltered = collaboratorFiltered.filter(collaborator => collaborator.name && collaborator.name.toLowerCase().includes(query.toLowerCase()));

                    this._collaborators.next(collaboratorFiltered);
                }else{
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

                // Find the collaborator¿

                const collaborator = collaborators.find(item => item.id === id) || null;
                const collaborator_test = collaborators.find(item => item.id === id);

                console.log(collaborator_test);
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
    createCollaborator(): Observable<Collaborator>
    {
        // Generate a new collaborator
        const newCollaborator = {

            idFile: 0,
            name: 'Nuevo',
            lastName: 'Colaborador',
            employeePosition: {
                id: 2,
                department: {
                    id: 1,
                    code: 'A01',
                    name: 'Aplicaciones',
                    description: 'Departamento encarcado del desarrollo y mantenimiento de las diversas aplicaciones que se manejan.',
                    isActive: 1
                },
                name: 'Analista de aplicaciones',
                description: 'Es capaz de mantener y desrrollar programas.',
                isActive: 1
            },
            companyEntryDate: '1970-01-01T00:00:00.000+00:00',
            organizationEntryDate: '1970-01-01T00:00:00.000+00:00',
            gender: 'M',
            bornDate: '1970-01-01T00:00:00.000+00:00',
            nationality: 'Venezolana',
            mail: '' ,
            isActive: 1,
            assignedLocation: 'Intelix Principal',
            technicalSkills: '',
            knowledges: [],
            phones: []

        };
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
       console.log(JSON.stringify(collaborator));
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
                this._knowledges.next(knowledges);
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

    getDepartments(): Observable<Department[]>
    {
        return this._httpClient.get<Department[]>('http://localhost:1616/api/v1/followup/departments/all').pipe(
            tap((departments) => {
                console.log(departments)
                this._departments.next(departments);
            })
        );
    }

    getEmployeePositions(): Observable<EmployeePosition[]>
    {
        return this._httpClient.get<EmployeePosition[]>('http://localhost:1616/api/v1/followup/employeeposition/all').pipe(
            tap((employeePositions) => {
                console.log(employeePositions)
                this._employeePositions.next(employeePositions);
            })
        );
    }

    updatePhoneStatus(id: number, phone: Phone): Observable<Phone>
    {
        console.log(phone);
        return this._httpClient.put<Phone>('http://localhost:1616/api/v1/followup/phones/status/'+ id, phone).pipe(
            tap(phone => {
                console.log(phone)
            })
        );
    }
}
