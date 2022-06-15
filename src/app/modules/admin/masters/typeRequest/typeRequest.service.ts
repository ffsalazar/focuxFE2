import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { TypeRequest } from 'app/modules/admin/masters/typeRequest/typeRequest.types';

@Injectable({
    providedIn: 'root'
})
export class TypeRequestService
{
    // Private
    private _typeRequest: BehaviorSubject<TypeRequest | null> = new BehaviorSubject(null);
    private _typeRequests: BehaviorSubject<TypeRequest[] | null> = new BehaviorSubject(null);


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
     * Getter for TypeRequest
     */
    get typeRequest$(): Observable<TypeRequest>
    {
        return this._typeRequest.asObservable();
    }

    /**
     * Getter for TypeRequests
     */
    get typeRequests$(): Observable<TypeRequest[]>
    {
        return this._typeRequests.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get TypeRequest
     */
    getTypeRequests(): Observable<TypeRequest[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<TypeRequest[]>('http://localhost:1616/api/v1/followup/typerequests/all', {headers}).pipe(
            tap((typeRequests) => {


                let typeRequestsFiltered : any[]=[];

                function compare(a: TypeRequest, b: TypeRequest) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                typeRequests.sort(compare);
                typeRequests.forEach((typeRequest) => {
                    if (typeRequest.isActive != 0){
                        typeRequestsFiltered.push(typeRequest);
                    }
                });
                this._typeRequests.next(typeRequestsFiltered);

            })
        );
    }

    /**
     * Search typeRequests with given query
     *
     * @param query
     */
    searchTypeRequest(query: string): Observable<TypeRequest[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<TypeRequest[]>('http://localhost:1616/api/v1/followup/typerequests/all', {
            params: {query}, headers
        }).pipe(
            tap((typeRequests) => {
                let typeRequestsFiltered: any[]=[];

                typeRequests.forEach((typeRequest) => {
                    if (typeRequest.isActive != 0){
                        typeRequestsFiltered.push(typeRequest);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the typeRequests

                    typeRequestsFiltered = typeRequestsFiltered.filter(typeRequest => typeRequest.name && typeRequest.name.toLowerCase().includes(query.toLowerCase()));

                    function compare(a: TypeRequest, b: TypeRequest) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    typeRequestsFiltered.sort(compare);
                    this._typeRequests.next(typeRequestsFiltered);
                }else{
                    function compare(a: TypeRequest, b: TypeRequest) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    typeRequestsFiltered.sort(compare);
                    this._typeRequests.next(typeRequestsFiltered);
                }

            })
        );
    }

    /**
     * Get typeRequest by id
     */
    getTypeRequestById(id: number): Observable<TypeRequest>
    {
        return this._typeRequests.pipe(
            take(1),
            map((typeRequests) => {

                // Find the typeRequest¿

                const typeRequest = typeRequests.find(item => item.id === id) || null;
                const typeRequest_test = typeRequests.find(item => item.id === id);

                console.log(typeRequest_test);
                // Update the typeRequest
                this._typeRequest.next(typeRequest_test);

                // Return the typeRequest

                return typeRequest;
            }),
            switchMap((typeRequest) => {

                if ( !typeRequest )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(typeRequest);
            })
        );
    }

    /**
     * Create typeRequest
     */
    createTypeRequest(): Observable<TypeRequest>
    {
        // Generate a new typeRequest
        const newTypeRequest =

        {
            "code": "COD",
            "name": "Nuevo tipo de request",
            "description": "Nueva descripcion",
            "isActive": 1
        }
        ;
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.typeRequests$.pipe(
            take(1),
            switchMap(typeRequests => this._httpClient.post<TypeRequest>('http://localhost:1616/api/v1/followup/typerequests/save', newTypeRequest, {headers}).pipe(
                map((newTypeRequest) => {
                    // Update the typeRequests with the new typeRequest
                    this._typeRequests.next([newTypeRequest, ...typeRequests]);

                    // Return the new typeRequest
                    return newTypeRequest;
                })
            ))
        );
    }

    /**
     * Update typeRequest
     *
     * @param id
     * @param typeRequest
     */
    updateTypeRequest(id: number, typeRequest: TypeRequest): Observable<TypeRequest>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.typeRequests$.pipe(
            take(1),
            switchMap(typeRequests => this._httpClient.put<TypeRequest>('http://localhost:1616/api/v1/followup/typerequests/typerequest/' + typeRequest.id,
                typeRequest, {headers}
            ).pipe(
                map((updatedTypeRequest) => {

                    // Find the index of the updated typeRequest
                    const index = typeRequests.findIndex(item => item.id === id);

                    // Update the typeRequest
                    typeRequests[index] = updatedTypeRequest;

                    function compare(a: TypeRequest, b: TypeRequest) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    typeRequests.sort(compare);


                    // Update the typeRequests
                    this._typeRequests.next(typeRequests);

                    // Return the updated typeRequest
                    return updatedTypeRequest;
                }),
                switchMap(updatedTypeRequest => this.typeRequest$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the typeRequest if it's selected
                        this._typeRequest.next(updatedTypeRequest);

                        // Return the updated typeRequest
                        return updatedTypeRequest;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the typeRequest
     *
     * @param id
     */
    deleteTypeRequest(typeRequest: TypeRequest): Observable<TypeRequest>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.typeRequests$.pipe(
            take(1),
            switchMap(typeRequests => this._httpClient.put('http://localhost:1616/api/v1/followup/typerequests/status/' + typeRequest.id, typeRequest, {headers}).pipe(
                map((updatedTypeRequest: TypeRequest) => {

                    // Find the index of the deleted typeRequest
                    const index = typeRequests.findIndex(item => item.id === typeRequest.id);

                    // Update the typeRequest
                    typeRequests[index] = updatedTypeRequest;

                    // Delete the typeRequests
                    typeRequests.splice(index, 1);

                    // Update the typeRequests
                    this._typeRequests.next(typeRequests);

                    // Return the updated typeRequest
                    return updatedTypeRequest;
                })
            ))
        );
    }





    /**
     * Update the avatar of the given typeRequest
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<TypeRequest>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.typeRequests$.pipe(
            take(1),
            switchMap(typeRequests => this._httpClient.post<TypeRequest>('api/dashboards/typerequests/avatar', {
                id

            }, {headers}).pipe(
                map((updatedTypeRequest) => {

                    // Find the index of the updated typeRequest
                    const index = typeRequests.findIndex(item => item.id === id);

                    // Update the typeRequest
                    typeRequests[index] = updatedTypeRequest;

                    // Delete the typeRequests
                    typeRequests.splice(index, 1);

                    function compare(a: TypeRequest, b: TypeRequest) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    typeRequests.sort(compare);

                    // Update the typeRequests
                    this._typeRequests.next(typeRequests);

                    // Return the updated typeRequest
                    return updatedTypeRequest;
                }),
                switchMap(updatedtypeRequest => this.typeRequest$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the typeRequest if it's selected
                        this._typeRequest.next(updatedtypeRequest);

                        // Return the updated typeRequest
                        return updatedtypeRequest;
                    })
                ))
            ))
        );
    }



}
