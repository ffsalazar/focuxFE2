import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { TechnicalArea } from 'app/modules/admin/masters/technicalAreas/technicalAreas.types';

@Injectable({
    providedIn: 'root'
})
export class TechnicalAreasService
{
    // Private
    private _technicalArea: BehaviorSubject<TechnicalArea | null> = new BehaviorSubject(null);
    private _technicalAreas: BehaviorSubject<TechnicalArea[] | null> = new BehaviorSubject(null);


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
     * Getter for technicalArea
     */
    get technicalArea$(): Observable<TechnicalArea>
    {
        return this._technicalArea.asObservable();
    }

    /**
     * Getter for technicalAreas
     */
    get technicalAreas$(): Observable<TechnicalArea[]>
    {
        return this._technicalAreas.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get technicalAreas
     */
    getTechnicalAreas(): Observable<TechnicalArea[]>
    {
        return this._httpClient.get<TechnicalArea[]>('http://localhost:1616/api/v1/followup/technicalareas/all').pipe(
            tap((technicalAreas) => {


                let technicalAreaFiltered : any[]=[];

                function compare(a: TechnicalArea, b: TechnicalArea) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                technicalAreas.sort(compare);
                technicalAreas.forEach((technicalArea) => {
                    if (technicalArea.isActive != 0){
                        technicalAreaFiltered.push(technicalArea);
                    }
                });
                this._technicalAreas.next(technicalAreaFiltered);

            })
        );
    }

    /**
     * Search technicalAreas with given query
     *
     * @param query
     */
    searchTechnicalArea(query: string): Observable<TechnicalArea[]>
    {
        return this._httpClient.get<TechnicalArea[]>('http://localhost:1616/api/v1/followup/technicalareas/all', {
            params: {query}
        }).pipe(
            tap((technicalAreas) => {
                let technicalAreaFiltered : any[]=[];
                technicalAreas.forEach((technicalArea) => {
                    if (technicalArea.isActive != 0){
                        technicalAreaFiltered.push(technicalArea);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the technicalAreas

                    technicalAreaFiltered = technicalAreaFiltered.filter(technicalArea => technicalArea.name && technicalArea.name.toLowerCase().includes(query.toLowerCase()));

                    function compare(a: TechnicalArea, b: TechnicalArea) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    technicalAreaFiltered.sort(compare);
                    this._technicalAreas.next(technicalAreaFiltered);
                }else{
                    function compare(a: TechnicalArea, b: TechnicalArea) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    technicalAreaFiltered.sort(compare);
                    this._technicalAreas.next(technicalAreaFiltered);
                }

            })
        );
    }

    /**
     * Get technicalArea by id
     */
    getTechnicalAreaById(id: number): Observable<TechnicalArea>
    {
        return this._technicalAreas.pipe(
            take(1),
            map((technicalAreas) => {

                // Find the technicalArea¿

                const technicalArea = technicalAreas.find(item => item.id === id) || null;
                const technicalArea_test = technicalAreas.find(item => item.id === id);

                console.log(technicalArea_test);
                // Update the technicalArea
                this._technicalArea.next(technicalArea);

                // Return the technicalArea

                return technicalArea;
            }),
            switchMap((technicalArea) => {

                if ( !technicalArea )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(technicalArea);
            })
        );
    }

    /**
     * Create technicalArea
     */
    createTechnicalArea(): Observable<TechnicalArea>
    {
        // Generate a new technicalArea
        const newTechnicalArea =

        {
            "code": "COD",
            "name": "Nueva área técnica",
            "description": "Nueva descripción",
            "isActive": 1
        }
        ;
        return this.technicalAreas$.pipe(
            take(1),
            switchMap(technicalAreas => this._httpClient.post<TechnicalArea>('http://localhost:1616/api/v1/followup/technicalareas/save', newTechnicalArea).pipe(
                map((newTechnicalArea) => {
                    // Update the technicalAreas with the new technicalArea
                    this._technicalAreas.next([newTechnicalArea, ...technicalAreas]);

                    // Return the new technicalArea
                    return newTechnicalArea;
                })
            ))
        );
    }

    /**
     * Update technicalArea
     *
     * @param id
     * @param technicalArea
     */
    updateTechnicalArea(id: number, technicalArea: TechnicalArea): Observable<TechnicalArea>
    {
       console.log(JSON.stringify(technicalArea));
        return this.technicalAreas$.pipe(
            take(1),
            switchMap(technicalAreas => this._httpClient.put<TechnicalArea>('http://localhost:1616/api/v1/followup/technicalareas/technicalarea/' + technicalArea.id,
                technicalArea
            ).pipe(
                map((updatedTechnicalArea) => {

                    // Find the index of the updated technicalArea
                    const index = technicalAreas.findIndex(item => item.id === id);

                    // Update the technicalArea
                    technicalAreas[index] = updatedTechnicalArea;

                    function compare(a: TechnicalArea, b: TechnicalArea) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    technicalAreas.sort(compare);

                    // Update the technicalAreas
                    this._technicalAreas.next(technicalAreas);

                    // Return the updated technicalArea
                    return updatedTechnicalArea;
                }),
                switchMap(updatedTechnicalArea => this.technicalArea$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the technicalArea if it's selected
                        this._technicalArea.next(updatedTechnicalArea);

                        // Return the updated technicalArea
                        return updatedTechnicalArea;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the technicalArea
     *
     * @param id
     */
    deleteTechnicalArea(technicalArea: TechnicalArea): Observable<TechnicalArea>
    {
        return this.technicalAreas$.pipe(
            take(1),
            switchMap(technicalAreas => this._httpClient.put('http://localhost:1616/api/v1/followup/technicalareas/status/' + technicalArea.id, technicalArea).pipe(
                map((updatedTechnicalArea: TechnicalArea) => {

                    // Find the index of the deleted technicalArea
                    const index = technicalAreas.findIndex(item => item.id === technicalArea.id);

                    // Update the technicalArea
                    technicalAreas[index] = updatedTechnicalArea;

                    technicalAreas.splice(index,1);

                    function compare(a: TechnicalArea, b: TechnicalArea) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    technicalAreas.sort(compare);

                    // Update the technicalAreas
                    this._technicalAreas.next(technicalAreas);

                    // Return the updated technicalArea
                    return updatedTechnicalArea;
                })
            ))
        );
    }





    /**
     * Update the avatar of the given technicalArea
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<TechnicalArea>
    {
        return this.technicalAreas$.pipe(
            take(1),
            switchMap(technicalAreas => this._httpClient.post<TechnicalArea>('api/dashboards/technicalareas/avatar', {
                id

            }).pipe(
                map((updatedTechnicalArea) => {

                    // Find the index of the updated technicalArea
                    const index = technicalAreas.findIndex(item => item.id === id);

                    // Update the technicalArea
                    technicalAreas[index] = updatedTechnicalArea;

                    // Update the technicalAreas
                    this._technicalAreas.next(technicalAreas);

                    // Return the updated technicalArea
                    return updatedTechnicalArea;
                }),
                switchMap(updatedtechnicalArea => this.technicalArea$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the technicalArea if it's selected
                        this._technicalArea.next(updatedtechnicalArea);

                        // Return the updated technicalArea
                        return updatedtechnicalArea;
                    })
                ))
            ))
        );
    }



}
