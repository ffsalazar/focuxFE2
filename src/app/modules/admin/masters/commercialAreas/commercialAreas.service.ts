import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { CommercialArea } from 'app/modules/admin/masters/commercialAreas/commercialAreas.types';

@Injectable({
    providedIn: 'root'
})
export class CommercialAreasService
{
    // Private
    private _commercialArea: BehaviorSubject<CommercialArea | null> = new BehaviorSubject(null);
    private _commercialAreas: BehaviorSubject<CommercialArea[] | null> = new BehaviorSubject(null);


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
     * Getter for commercialArea
     */
    get commercialArea$(): Observable<CommercialArea>
    {
        return this._commercialArea.asObservable();
    }

    /**
     * Getter for commercialAreas
     */
    get commercialAreas$(): Observable<CommercialArea[]>
    {
        return this._commercialAreas.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get commercialAreas
     */
    getCommercialAreas(): Observable<CommercialArea[]>
    {
        return this._httpClient.get<CommercialArea[]>('http://localhost:1616/api/v1/followup/commercialareas/all').pipe(
            tap((commercialAreas) => {


                let commercialAreaFiltered : any[]=[];

                function compare(a: CommercialArea, b: CommercialArea) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                commercialAreas.sort(compare);
                commercialAreas.forEach((commercialArea) => {
                    if (commercialArea.isActive != 0){
                        commercialAreaFiltered.push(commercialArea);
                    }
                });
                this._commercialAreas.next(commercialAreaFiltered);

            })
        );
    }

    /**
     * Search commercialAreas with given query
     *
     * @param query
     */
    searchCommercialArea(query: string): Observable<CommercialArea[]>
    {
        return this._httpClient.get<CommercialArea[]>('http://localhost:1616/api/v1/followup/commercialareas/all', {
            params: {query}
        }).pipe(
            tap((commercialAreas) => {
                let commercialAreaFiltered : any[]=[];
                commercialAreas.forEach((commercialArea) => {
                    if (commercialArea.isActive != 0){
                        commercialAreaFiltered.push(commercialArea);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the commercialAreas

                    commercialAreaFiltered = commercialAreaFiltered.filter(commercialArea => commercialArea.name && commercialArea.name.toLowerCase().includes(query.toLowerCase()));

                    function compare(a: CommercialArea, b: CommercialArea) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    commercialAreaFiltered.sort(compare);
                    this._commercialAreas.next(commercialAreaFiltered);
                }else{
                    function compare(a: CommercialArea, b: CommercialArea) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    commercialAreaFiltered.sort(compare);
                    this._commercialAreas.next(commercialAreaFiltered);
                }

            })
        );
    }

    /**
     * Get commercialArea by id
     */
    getCommercialAreaById(id: number): Observable<CommercialArea>
    {
        return this._commercialAreas.pipe(
            take(1),
            map((commercialAreas) => {

                // Find the commercialArea¿

                const commercialArea = commercialAreas.find(item => item.id === id) || null;
                const commercialArea_test = commercialAreas.find(item => item.id === id);

                console.log(commercialArea_test);
                // Update the commercialArea
                this._commercialArea.next(commercialArea);

                // Return the commercialArea

                return commercialArea;
            }),
            switchMap((commercialArea) => {

                if ( !commercialArea )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(commercialArea);
            })
        );
    }

    /**
     * Create commercialArea
     */
    createCommercialArea(): Observable<CommercialArea>
    {
        // Generate a new commercialArea
        const newCommercialArea =

        {
            "code": "COD",
            "name": "Nueva área comercial",
            "description": "Nueva descripcion",
            "isActive": 1
        }
        ;
        return this.commercialAreas$.pipe(
            take(1),
            switchMap(commercialAreas => this._httpClient.post<CommercialArea>('http://localhost:1616/api/v1/followup/commercialareas/save', newCommercialArea).pipe(
                map((newCommercialArea) => {
                    // Update the commercialAreas with the new commercialArea
                    this._commercialAreas.next([newCommercialArea, ...commercialAreas]);

                    // Return the new commercialArea
                    return newCommercialArea;
                })
            ))
        );
    }

    /**
     * Update commercialArea
     *
     * @param id
     * @param commercialArea
     */
    updateCommercialArea(id: number, commercialArea: CommercialArea): Observable<CommercialArea>
    {

        return this.commercialAreas$.pipe(
            take(1),
            switchMap(commercialAreas => this._httpClient.put<CommercialArea>('http://localhost:1616/api/v1/followup/commercialareas/commercialarea/' + commercialArea.id,
                commercialArea
            ).pipe(
                map((updatedCommercialArea) => {

                    // Find the index of the updated commercialArea
                    const index = commercialAreas.findIndex(item => item.id === id);

                    // Update the commercialArea
                    commercialAreas[index] = updatedCommercialArea;

                    function compare(a: CommercialArea, b: CommercialArea) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    commercialAreas.sort(compare);


                    // Update the commercialAreas
                    this._commercialAreas.next(commercialAreas);

                    // Return the updated commercialArea
                    return updatedCommercialArea;
                }),
                switchMap(updatedCommercialArea => this.commercialArea$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the commercialArea if it's selected
                        this._commercialArea.next(updatedCommercialArea);

                        // Return the updated commercialArea
                        return updatedCommercialArea;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the commercialArea
     *
     * @param id
     */
    deleteCommercialArea(commercialArea: CommercialArea): Observable<CommercialArea>
    {
        return this.commercialAreas$.pipe(
            take(1),
            switchMap(commercialAreas => this._httpClient.put('http://localhost:1616/api/v1/followup/commercialareas/status/' + commercialArea.id, commercialArea).pipe(
                map((updatedCommercialArea: CommercialArea) => {

                    // Find the index of the deleted commercialArea
                    const index = commercialAreas.findIndex(item => item.id === commercialArea.id);

                    // Update the commercialArea
                    commercialAreas[index] = updatedCommercialArea;

                    commercialAreas.splice(index,1);

                    // Update the commercialAreas
                    this._commercialAreas.next(commercialAreas);

                    // Return the updated commercialArea
                    return updatedCommercialArea;
                })
            ))
        );
    }





    /**
     * Update the avatar of the given commercialArea
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<CommercialArea>
    {
        return this.commercialAreas$.pipe(
            take(1),
            switchMap(commercialAreas => this._httpClient.post<CommercialArea>('api/dashboards/commercialareas/avatar', {
                id

            }).pipe(
                map((updatedCommercialArea) => {

                    // Find the index of the updated commercialArea
                    const index = commercialAreas.findIndex(item => item.id === id);

                    // Update the commercialArea
                    commercialAreas[index] = updatedCommercialArea;

                    // Update the commercialAreas
                    this._commercialAreas.next(commercialAreas);

                    // Return the updated commercialArea
                    return updatedCommercialArea;
                }),
                switchMap(updatedcommercialArea => this.commercialArea$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the commercialArea if it's selected
                        this._commercialArea.next(updatedcommercialArea);

                        // Return the updated commercialArea
                        return updatedcommercialArea;
                    })
                ))
            ))
        );
    }



}
