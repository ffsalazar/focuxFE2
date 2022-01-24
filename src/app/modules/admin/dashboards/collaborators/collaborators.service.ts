import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Collaborator, Country, Knowledge } from 'app/modules/admin/dashboards/collaborators/collaborators.types';

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
     * Getter for tags
     */
    get knowledges$(): Observable<Knowledge[]>
    {
        return this._knowledges.asObservable();
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
                console.log(collaborators);
                this._collaborators.next(collaborators);
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
        return this._httpClient.get<Collaborator[]>('api/dashboards/collaborators/search', {
            params: {query}
        }).pipe(
            tap((collaborators) => {
                this._collaborators.next(collaborators);
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
                console.log(collaborators)
                console.log(collaborators[0].id === id) ;
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
        return this.collaborators$.pipe(
            take(1),
            switchMap(collaborators => this._httpClient.post<Collaborator>('api/dashboards/collaborators/collaborator', {}).pipe(
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
            switchMap(collaborators => this._httpClient.patch<Collaborator>('api/dashboards/collaborators/collaborator', {
                id,
                collaborator
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
    deleteCollaborator(id: number): Observable<boolean>
    {
        return this.collaborators$.pipe(
            take(1),
            switchMap(collaborators => this._httpClient.delete('api/dashboards/collaborators/collaborator', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted collaborator
                    const index = collaborators.findIndex(item => item.id === id);

                    // Delete the collaborator
                    collaborators.splice(index, 1);

                    // Update the collaborators
                    this._collaborators.next(collaborators);

                    // Return the deleted status
                    return isDeleted;
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
     * Get tags
     */
    getTags(): Observable<Knowledge[]>
    {
        return this._httpClient.get<Knowledge[]>('api/dashboards/collaborators/tags').pipe(
            tap((knowledges) => {
                this._knowledges.next(knowledges);
            })
        );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createTag(knowledge: Knowledge): Observable<Knowledge>
    {
        return this.knowledges$.pipe(
            take(1),
            switchMap(knowledges => this._httpClient.post<Knowledge>('api/dashboards/collaborators/tag', {knowledge}).pipe(
                map((newTag) => {

                    // Update the tags with the new tag
                    this._knowledges.next([...knowledges, newTag]);

                    // Return new tag from observable
                    return newTag;
                })
            ))
        );
    }

    /**
     * Update the tag
     *
     * @param id
     * @param tag
     */
    updateTag(id: number, knowledge: Knowledge): Observable<Knowledge>
    {
        return this.knowledges$.pipe(
            take(1),
            switchMap(knowledges => this._httpClient.patch<Knowledge>('api/dashboards/collaborators/tag', {
                id,
                knowledge
            }).pipe(
                map((updatedTag) => {

                    // Find the index of the updated tag
                    const index = knowledges.findIndex(item => item.id === id);

                    // Update the tag
                    knowledges[index] = updatedTag;

                    // Update the tags
                    this._knowledges.next(knowledges);

                    // Return the updated tag
                    return updatedTag;
                })
            ))
        );
    }

    /**
     * Delete the tag
     *
     * @param id
     */
    deleteTag(id: number): Observable<boolean>
    {
        return this.knowledges$.pipe(
            take(1),
            switchMap(tags => this._httpClient.delete('api/dashboards/collaborators/tag', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted tag
                    const index = tags.findIndex(item => item.id === id);

                    // Delete the tag
                    tags.splice(index, 1);

                    // Update the tags
                    this._knowledges.next(tags);

                    // Return the deleted status
                    return isDeleted;
                }),
                filter(isDeleted => isDeleted),
                switchMap(isDeleted => this.collaborators$.pipe(
                    take(1),
                    map((collaborators) => {

                        // Iterate through the collaborators
                        collaborators.forEach((collaborator) => {

                            const tagIndex = collaborator.knowledges.findIndex(knowledge => knowledge.id === id);

                            // If the collaborator has the tag, remove it
                            if ( tagIndex > -1 )
                            {
                                collaborator.knowledges.splice(tagIndex, 1);
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
}
