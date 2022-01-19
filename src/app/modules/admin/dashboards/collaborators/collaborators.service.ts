import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Collaborator, Country, Tag } from 'app/modules/admin/dashboards/collaborators/collaborators.types';

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsService
{
    // Private
    private _collaborator: BehaviorSubject<Collaborator | null> = new BehaviorSubject(null);
    private _collaborators: BehaviorSubject<Collaborator[] | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);

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
    get tags$(): Observable<Tag[]>
    {
        return this._tags.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get collaborators
     */
    getCollaborators(): Observable<Collaborator[]>
    {
        return this._httpClient.get<Collaborator[]>('api/dashboards/collaborators/all').pipe(
            tap((collaborators) => {
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
    getCollaboratorById(id: string): Observable<Collaborator>
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
    updateCollaborator(id: string, collaborator: Collaborator): Observable<Collaborator>
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
    deleteCollaborator(id: string): Observable<boolean>
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
    getTags(): Observable<Tag[]>
    {
        return this._httpClient.get<Tag[]>('api/dashboards/collaborators/tags').pipe(
            tap((tags) => {
                this._tags.next(tags);
            })
        );
    }

    /**
     * Create tag
     *
     * @param tag
     */
    createTag(tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.post<Tag>('api/dashboards/collaborators/tag', {tag}).pipe(
                map((newTag) => {

                    // Update the tags with the new tag
                    this._tags.next([...tags, newTag]);

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
    updateTag(id: string, tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.patch<Tag>('api/dashboards/collaborators/tag', {
                id,
                tag
            }).pipe(
                map((updatedTag) => {

                    // Find the index of the updated tag
                    const index = tags.findIndex(item => item.id === id);

                    // Update the tag
                    tags[index] = updatedTag;

                    // Update the tags
                    this._tags.next(tags);

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
    deleteTag(id: string): Observable<boolean>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.delete('api/dashboards/collaborators/tag', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted tag
                    const index = tags.findIndex(item => item.id === id);

                    // Delete the tag
                    tags.splice(index, 1);

                    // Update the tags
                    this._tags.next(tags);

                    // Return the deleted status
                    return isDeleted;
                }),
                filter(isDeleted => isDeleted),
                switchMap(isDeleted => this.collaborators$.pipe(
                    take(1),
                    map((collaborators) => {

                        // Iterate through the collaborators
                        collaborators.forEach((collaborator) => {

                            const tagIndex = collaborator.tags.findIndex(tag => tag === id);

                            // If the collaborator has the tag, remove it
                            if ( tagIndex > -1 )
                            {
                                collaborator.tags.splice(tagIndex, 1);
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
    uploadAvatar(id: string, avatar: File): Observable<Collaborator>
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
