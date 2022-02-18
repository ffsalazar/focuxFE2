import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { BusinessType } from 'app/modules/admin/masters/businessType/businessTypes.types';

@Injectable({
    providedIn: 'root'
})
export class BusinessTypesService
{
    // Private
    private _businessType: BehaviorSubject<BusinessType | null> = new BehaviorSubject(null);
    private _businessTypes: BehaviorSubject<BusinessType[] | null> = new BehaviorSubject(null);


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
     * Getter for businessType
     */
    get businessType$(): Observable<BusinessType>
    {
        return this._businessType.asObservable();
    }

    /**
     * Getter for businessTypes
     */
    get businessTypes$(): Observable<BusinessType[]>
    {
        return this._businessTypes.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get businessTypes
     */
    getBusinessTypes(): Observable<BusinessType[]>
    {
        return this._httpClient.get<BusinessType[]>('http://localhost:1616/api/v1/followup/businessType/all').pipe(
            tap((businessTypes) => {


                let businessTypeFiltered : any[]=[];

                function compare(a: BusinessType, b: BusinessType) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                businessTypes.sort(compare);
                businessTypes.forEach((businessType) => {
                    if (businessType.isActive != 0){
                        businessTypeFiltered.push(businessType);
                    }
                });
                this._businessTypes.next(businessTypeFiltered);

            })
        );
    }

    /**
     * Search businessTypes with given query
     *
     * @param query
     */
    searchBusinessType(query: string): Observable<BusinessType[]>
    {
        return this._httpClient.get<BusinessType[]>('http://localhost:1616/api/v1/followup/businessType/all', {
            params: {query}
        }).pipe(
            tap((businessTypes) => {
                let businessTypeFiltered : any[]=[];
                businessTypes.forEach((businessType) => {
                    if (businessType.isActive != 0){
                        businessTypeFiltered.push(businessType);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the businessTypes

                    businessTypeFiltered = businessTypeFiltered.filter(businessType => businessType.name && businessType.name.toLowerCase().includes(query.toLowerCase()));

                    function compare(a: BusinessType, b: BusinessType) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    businessTypeFiltered.sort(compare);
                    this._businessTypes.next(businessTypeFiltered);
                }else{
                    function compare(a: BusinessType, b: BusinessType) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    businessTypeFiltered.sort(compare);
                    this._businessTypes.next(businessTypeFiltered);
                }

            })
        );
    }

    /**
     * Get businessType by id
     */
    getBusinessTypeById(id: number): Observable<BusinessType>
    {
        return this._businessTypes.pipe(
            take(1),
            map((businessTypes) => {

                // Find the businessType¿

                const businessType = businessTypes.find(item => item.id === id) || null;
                const businessType_test = businessTypes.find(item => item.id === id);

                console.log(businessType_test);
                // Update the businessType
                this._businessType.next(businessType);

                // Return the businessType

                return businessType;
            }),
            switchMap((businessType) => {

                if ( !businessType )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(businessType);
            })
        );
    }

    /**
     * Create businessType
     */
    createBusinessType(): Observable<BusinessType>
    {
        // Generate a new businessType
        const newBusinessType = {


            "name": "Nuevo tipo de negocio",
            "code":"00AA",
            "description": "Descripcion de tipo de negocio",
            "isActive": 1
        };
        return this.businessTypes$.pipe(
            take(1),
            switchMap(businessTypes => this._httpClient.post<BusinessType>('http://localhost:1616/api/v1/followup/businessType/save', newBusinessType).pipe(
                map((newBusinessType) => {
                    // Update the businessTypes with the new businessType
                    this._businessTypes.next([newBusinessType, ...businessTypes]);

                    // Return the new businessType
                    return newBusinessType;
                })
            ))
        );
    }

    /**
     * Update businessType
     *
     * @param id
     * @param businessType
     */
    updateBusinessType(id: number, businessType: BusinessType): Observable<BusinessType>
    {
       console.log(JSON.stringify(businessType));
        return this.businessTypes$.pipe(
            take(1),
            switchMap(businessTypes => this._httpClient.put<BusinessType>('http://localhost:1616/api/v1/followup/businessType/businesstype/' + businessType.id,
                businessType
            ).pipe(
                map((updatedBusinessType) => {

                    // Find the index of the updated businessType
                    const index = businessTypes.findIndex(item => item.id === id);

                    // Update the businessType
                    businessTypes[index] = updatedBusinessType;

                    function compare(a: BusinessType, b: BusinessType) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    businessTypes.sort(compare);

                    // Update the businessTypes
                    this._businessTypes.next(businessTypes);

                    // Return the updated businessType
                    return updatedBusinessType;
                }),
                switchMap(updatedBusinessType => this.businessType$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the businessType if it's selected
                        this._businessType.next(updatedBusinessType);

                        // Return the updated businessType
                        return updatedBusinessType;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the businessType
     *
     * @param id
     */
    deleteBusinessType(businessType: BusinessType): Observable<BusinessType>
    {
        return this.businessTypes$.pipe(
            take(1),
            switchMap(businessTypes => this._httpClient.put('http://localhost:1616/api/v1/followup/businessType/status/' + businessType.id, businessType).pipe(
                map((updatedBusinessType: BusinessType) => {

                    // Find the index of the deleted businessType
                    const index = businessTypes.findIndex(item => item.id === businessType.id);

                    // Update the businessType
                    businessTypes[index] = updatedBusinessType;

                    businessTypes.splice(index,1);


                    function compare(a: BusinessType, b: BusinessType) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    businessTypes.sort(compare);

                    // Update the businessTypes
                    this._businessTypes.next(businessTypes);


                    // Return the updated businessType
                    return updatedBusinessType;
                })
            ))
        );
    }





    /**
     * Update the avatar of the given businessType
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<BusinessType>
    {
        return this.businessTypes$.pipe(
            take(1),
            switchMap(businessTypes => this._httpClient.post<BusinessType>('api/dashboards/businessType/avatar', {
                id

            }).pipe(
                map((updatedBusinessType) => {

                    // Find the index of the updated businessType
                    const index = businessTypes.findIndex(item => item.id === id);

                    // Update the businessType
                    businessTypes[index] = updatedBusinessType;

                    // Update the businessTypes
                    this._businessTypes.next(businessTypes);

                    // Return the updated businessType
                    return updatedBusinessType;
                }),
                switchMap(updatedbusinessType => this.businessType$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the businessType if it's selected
                        this._businessType.next(updatedbusinessType);

                        // Return the updated businessType
                        return updatedbusinessType;
                    })
                ))
            ))
        );
    }



}
