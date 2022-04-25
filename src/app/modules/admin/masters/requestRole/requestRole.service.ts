import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { RequestRole } from 'app/modules/admin/masters/requestRole/requestRole.types';
import {Collaborator} from '../../dashboards/collaborators/collaborators.types';
import {BusinessType} from '../businessType/businessTypes.types';

@Injectable({
    providedIn: 'root'
})
export class RequestRoleService
{
    // Private
    private _requestRole: BehaviorSubject<RequestRole | null> = new BehaviorSubject(null);
    private _requestRoles: BehaviorSubject<RequestRole[] | null> = new BehaviorSubject(null);


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
     * Getter for RequestRole
     */
    get requestRole$(): Observable<RequestRole>
    {
        return this._requestRole.asObservable();
    }

    /**
     * Getter for RequestRoles
     */
    get requestRoles$(): Observable<RequestRole[]>
    {
        return this._requestRoles.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get RequestRole
     */
    getRequestRoles(): Observable<RequestRole[]>
    {
        return this._httpClient.get<RequestRole[]>('http://localhost:1616/api/v1/followup/requestrole/all').pipe(
            tap((requestRoles) => {


                let requestRolesFiltered : any[]=[];

                function compare(a: RequestRole, b: RequestRole) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                requestRoles.sort(compare);
                requestRoles.forEach((requestRole) => {
                    if (requestRole.isActive != 0){
                        requestRolesFiltered.push(requestRole);
                    }
                });
                this._requestRoles.next(requestRolesFiltered);

            })
        );
    }

    /**
     * Search requestRoles with given query
     *
     * @param query
     */
    searchRequestRole(query: string): Observable<RequestRole[]>
    {
        return this._httpClient.get<RequestRole[]>('http://localhost:1616/api/v1/followup/requestrole/all', {
            params: {query}
        }).pipe(
            tap((requestRoles) => {
                let requestRolesFiltered: any[]=[];

                requestRoles.forEach((requestRole) => {
                    if (requestRole.isActive != 0){
                        requestRolesFiltered.push(requestRole);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the requestRoles

                    requestRolesFiltered = requestRolesFiltered.filter(requestRole => requestRole.name && requestRole.name.toLowerCase().includes(query.toLowerCase()));

                    function compare(a: RequestRole, b: RequestRole) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    requestRolesFiltered.sort(compare);
                    this._requestRoles.next(requestRolesFiltered);
                }else{
                    function compare(a: RequestRole, b: RequestRole) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    requestRolesFiltered.sort(compare);
                    this._requestRoles.next(requestRolesFiltered);
                }

            })
        );
    }

    /**
     * Get requestRole by id
     */
    getRequestRoleById(id: number): Observable<RequestRole>
    {
        return this._requestRoles.pipe(
            take(1),
            map((requestRoles) => {

                // Find the requestRole¿

                const requestRole = requestRoles.find(item => item.id === id) || null;
                const requestRole_test = requestRoles.find(item => item.id === id);

                console.log(requestRole_test);
                // Update the requestRole
                this._requestRole.next(requestRole_test);

                // Return the requestRole

                return requestRole;
            }),
            switchMap((requestRole) => {

                if ( !requestRole )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(requestRole);
            })
        );
    }

    /**
     * Create requestRole
     */
    createRequestRole(): Observable<RequestRole>
    {
        // Generate a new requestRole
        const newRequestRole =

        {
            "code": "COD",
            "name": "Nuevo tipo de request",
            "description": "Nueva descripcion",
            "isActive": 1
        }
        ;
        return this.requestRoles$.pipe(
            take(1),
            switchMap(requestRoles => this._httpClient.post<RequestRole>('http://localhost:1616/api/v1/followup/requestrole/save', newRequestRole).pipe(
                map((newRequestRole) => {
                    // Update the requestRoles with the new requestRole
                    this._requestRoles.next([newRequestRole, ...requestRoles]);

                    // Return the new requestRole
                    return newRequestRole;
                })
            ))
        );
    }

    /**
     * Update requestRole
     *
     * @param id
     * @param requestRole
     */
    updateRequestRole(id: number, requestRole: RequestRole): Observable<RequestRole>
    {
       console.log(JSON.stringify(requestRole));
        return this.requestRoles$.pipe(
            take(1),
            switchMap(requestRoles => this._httpClient.put<RequestRole>('http://localhost:1616/api/v1/followup/requestrole/requestrole/' + requestRole.id,
                requestRole
            ).pipe(
                map((updatedRequestRole) => {

                    // Find the index of the updated requestRole
                    const index = requestRoles.findIndex(item => item.id === id);

                    // Update the requestRole
                    requestRoles[index] = updatedRequestRole;

                    function compare(a: RequestRole, b: RequestRole) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    requestRoles.sort(compare);


                    // Update the requestRoles
                    this._requestRoles.next(requestRoles);

                    // Return the updated requestRole
                    return updatedRequestRole;
                }),
                switchMap(updatedRequestRole => this.requestRole$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the requestRole if it's selected
                        this._requestRole.next(updatedRequestRole);

                        // Return the updated requestRole
                        return updatedRequestRole;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the requestRole
     *
     * @param id
     */
    deleteRequestRole(requestRole: RequestRole): Observable<RequestRole>
    {
        return this.requestRoles$.pipe(
            take(1),
            switchMap(requestRoles => this._httpClient.put('http://localhost:1616/api/v1/followup/requestrole/status/' + requestRole.id, requestRole).pipe(
                map((updatedRequestRole: RequestRole) => {

                    // Find the index of the deleted requestRole
                    const index = requestRoles.findIndex(item => item.id === requestRole.id);

                    // Update the requestRole
                    requestRoles[index] = updatedRequestRole;

                    // Delete the requestRoles
                    requestRoles.splice(index, 1);

                    // Update the requestRoles
                    this._requestRoles.next(requestRoles);

                    // Return the updated requestRole
                    return updatedRequestRole;
                })
            ))
        );
    }





    /**
     * Update the avatar of the given requestRole
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<RequestRole>
    {
        return this.requestRoles$.pipe(
            take(1),
            switchMap(requestRoles => this._httpClient.post<RequestRole>('api/dashboards/requestrole/avatar', {
                id

            }).pipe(
                map((updatedRequestRole) => {

                    // Find the index of the updated requestRole
                    const index = requestRoles.findIndex(item => item.id === id);

                    // Update the requestRole
                    requestRoles[index] = updatedRequestRole;

                    // Delete the requestRoles
                    requestRoles.splice(index, 1);

                    function compare(a: RequestRole, b: RequestRole) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    requestRoles.sort(compare);

                    // Update the requestRoles
                    this._requestRoles.next(requestRoles);

                    // Return the updated requestRole
                    return updatedRequestRole;
                }),
                switchMap(updatedrequestRole => this.requestRole$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the requestRole if it's selected
                        this._requestRole.next(updatedrequestRole);

                        // Return the updated requestRole
                        return updatedrequestRole;
                    })
                ))
            ))
        );
    }



}
