import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { TypeStatu } from 'app/modules/admin/masters/typeStatus/typeStatus.types';
import {Collaborator} from "../../dashboards/collaborators/collaborators.types";
import {BusinessType} from "../businessType/businessTypes.types";

@Injectable({
    providedIn: 'root'
})
export class TypeStatusService
{
    // Private
    private _typeStatu: BehaviorSubject<TypeStatu | null> = new BehaviorSubject(null);
    private _typeStatus: BehaviorSubject<TypeStatu[] | null> = new BehaviorSubject(null);


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
     * Getter for typeStatu
     */
    get typeStatu$(): Observable<TypeStatu>
    {
        return this._typeStatu.asObservable();
    }

    /**
     * Getter for typeStatus
     */
    get typeStatus$(): Observable<TypeStatu[]>
    {
        return this._typeStatus.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get typeStatus
     */
    getTypeStatus(): Observable<TypeStatu[]>
    {
        return this._httpClient.get<TypeStatu[]>('http://localhost:1616/api/v1/followup/typestatuses/all').pipe(
            tap((typeStatus) => {


                let typeStatuFiltered : any[]=[];

                function compare(a: TypeStatu, b: TypeStatu) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                typeStatus.sort(compare);
                typeStatus.forEach((typeStatu) => {
                    if (typeStatu.isActive != 0){
                        typeStatuFiltered.push(typeStatu);
                    }
                });
                this._typeStatus.next(typeStatuFiltered);

            })
        );
    }

    /**
     * Search typeStatus with given query
     *
     * @param query
     */
    searchTypeStatu(query: string): Observable<TypeStatu[]>
    {
        return this._httpClient.get<TypeStatu[]>('http://localhost:1616/api/v1/followup/typestatuses/all', {
            params: {query}
        }).pipe(
            tap((typeStatus) => {
                let typeStatuFiltered : any[]=[];
                typeStatus.forEach((typeStatu) => {
                    if (typeStatu.isActive != 0){
                        typeStatuFiltered.push(typeStatu);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the typeStatus

                    typeStatuFiltered = typeStatuFiltered.filter(typeStatu => typeStatu.name && typeStatu.name.toLowerCase().includes(query.toLowerCase()));

                    function compare(a: TypeStatu, b: TypeStatu) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    typeStatuFiltered.sort(compare);
                    this._typeStatus.next(typeStatuFiltered);
                }else{
                    function compare(a: TypeStatu, b: TypeStatu) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    typeStatuFiltered.sort(compare);
                    this._typeStatus.next(typeStatuFiltered);
                }

            })
        );
    }

    /**
     * Get typeStatu by id
     */
    getTypeStatuById(id: number): Observable<TypeStatu>
    {
        return this._typeStatus.pipe(
            take(1),
            map((typeStatus) => {

                // Find the typeStatu¿

                const typeStatu = typeStatus.find(item => item.id === id) || null;
                const typeStatu_test = typeStatus.find(item => item.id === id);

                console.log(typeStatu_test);
                // Update the typeStatu
                this._typeStatu.next(typeStatu);

                // Return the typeStatu

                return typeStatu;
            }),
            switchMap((typeStatu) => {

                if ( !typeStatu )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(typeStatu);
            })
        );
    }

    /**
     * Create typeStatu
     */
    createTypeStatu(): Observable<TypeStatu>
    {
        // Generate a new typeStatu
        const newTypeStatu =

        {
            "code": "COD",
            "name": "Nuevo tipo de estatus",
            "description": "Nueva descripcion",
            "isActive": 1
        }
        ;
        return this.typeStatus$.pipe(
            take(1),
            switchMap(typeStatus => this._httpClient.post<TypeStatu>('http://localhost:1616/api/v1/followup/typestatuses/save', newTypeStatu).pipe(
                map((newTypeStatu) => {
                    // Update the typeStatus with the new typeStatu
                    this._typeStatus.next([newTypeStatu, ...typeStatus]);

                    // Return the new typeStatu
                    return newTypeStatu;
                })
            ))
        );
    }

    /**
     * Update typeStatu
     *
     * @param id
     * @param typeStatu
     */
    updateTypeStatu(id: number, typeStatu: TypeStatu): Observable<TypeStatu>
    {
       console.log(JSON.stringify(typeStatu));
        return this.typeStatus$.pipe(
            take(1),
            switchMap(typeStatus => this._httpClient.put<TypeStatu>('http://localhost:1616/api/v1/followup/typestatuses/typestatus/' + typeStatu.id,
                typeStatu
            ).pipe(
                map((updatedTypeStatu) => {

                    // Find the index of the updated typeStatu
                    const index = typeStatus.findIndex(item => item.id === id);

                    // Update the typeStatu
                    typeStatus[index] = updatedTypeStatu;

                    function compare(a: TypeStatu, b: TypeStatu) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    typeStatus.sort(compare);


                    // Update the typeStatus
                    this._typeStatus.next(typeStatus);

                    // Return the updated typeStatu
                    return updatedTypeStatu;
                }),
                switchMap(updatedTypeStatu => this.typeStatu$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the typeStatu if it's selected
                        this._typeStatu.next(updatedTypeStatu);

                        // Return the updated typeStatu
                        return updatedTypeStatu;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the typeStatu
     *
     * @param id
     */
    deleteTypeStatu(typeStatu: TypeStatu): Observable<TypeStatu>
    {
        return this.typeStatus$.pipe(
            take(1),
            switchMap(typeStatus => this._httpClient.put('http://localhost:1616/api/v1/followup/typestatuses/status/' + typeStatu.id, typeStatu).pipe(
                map((updatedTypeStatu: TypeStatu) => {

                    // Find the index of the deleted typeStatu
                    const index = typeStatus.findIndex(item => item.id === typeStatu.id);

                    // Update the typeStatu
                    typeStatus[index] = updatedTypeStatu;

                    // Delete the typeStatus
                    typeStatus.splice(index, 1);

                    // Update the typeStatus
                    this._typeStatus.next(typeStatus);

                    // Return the updated typeStatu
                    return updatedTypeStatu;
                })
            ))
        );
    }





    /**
     * Update the avatar of the given typeStatu
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<TypeStatu>
    {
        return this.typeStatus$.pipe(
            take(1),
            switchMap(typeStatus => this._httpClient.post<TypeStatu>('api/dashboards/typestatuses/avatar', {
                id

            }).pipe(
                map((updatedTypeStatu) => {

                    // Find the index of the updated typeStatu
                    const index = typeStatus.findIndex(item => item.id === id);

                    // Update the typeStatu
                    typeStatus[index] = updatedTypeStatu;

                    // Delete the typeStatus
                    typeStatus.splice(index, 1);

                    function compare(a: TypeStatu, b: TypeStatu) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    typeStatus.sort(compare);

                    // Update the typeStatus
                    this._typeStatus.next(typeStatus);

                    // Return the updated typeStatu
                    return updatedTypeStatu;
                }),
                switchMap(updatedtypeStatu => this.typeStatu$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the typeStatu if it's selected
                        this._typeStatu.next(updatedtypeStatu);

                        // Return the updated typeStatu
                        return updatedtypeStatu;
                    })
                ))
            ))
        );
    }



}
