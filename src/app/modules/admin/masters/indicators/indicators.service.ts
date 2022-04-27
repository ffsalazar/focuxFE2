import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Indicator } from 'app/modules/admin/masters/indicators/indicators.types';

@Injectable({
    providedIn: 'root'
})
export class IndicatorsService
{
    // Private
    private _indicator: BehaviorSubject<Indicator | null> = new BehaviorSubject(null);
    private _indicators: BehaviorSubject<Indicator[] | null> = new BehaviorSubject(null);


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
     * Getter for indicator
     */
    get indicator$(): Observable<Indicator>
    {
        return this._indicator.asObservable();
    }

    /**
     * Getter for indicators
     */
    get indicators$(): Observable<Indicator[]>
    {
        return this._indicators.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get indicators
     */
    getIndicators(): Observable<Indicator[]>
    {
        return this._httpClient.get<Indicator[]>('http://localhost:1616/api/v1/followup/indicator/all').pipe(
            tap((indicators) => {


                let indicatorFiltered : any[]=[];

                function compare(a: Indicator, b: Indicator) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                indicators.sort(compare);
                indicators.forEach((indicator) => {
                    if (indicator.isActive != 0){
                        indicatorFiltered.push(indicator);
                    }
                });
                this._indicators.next(indicatorFiltered);

            })
        );
    }

    /**
     * Search indicators with given query
     *
     * @param query
     */
    searchIndicator(query: string): Observable<Indicator[]>
    {
        return this._httpClient.get<Indicator[]>('http://localhost:1616/api/v1/followup/indicator/all', {
            params: {query}
        }).pipe(
            tap((indicators) => {
                let indicatorFiltered : any[]=[];
                indicators.forEach((indicator) => {
                    if (indicator.isActive != 0){
                        indicatorFiltered.push(indicator);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the indicators

                    indicatorFiltered = indicatorFiltered.filter(indicator => indicator.name && indicator.name.toLowerCase().includes(query.toLowerCase()));

                    function compare(a: Indicator, b: Indicator) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    indicatorFiltered.sort(compare);
                    this._indicators.next(indicatorFiltered);
                }else{
                    function compare(a: Indicator, b: Indicator) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    indicatorFiltered.sort(compare);
                    this._indicators.next(indicatorFiltered);
                }

            })
        );
    }

    /**
     * Get indicator by id
     */
    getIndicatorById(id: number): Observable<Indicator>
    {
        return this._indicators.pipe(
            take(1),
            map((indicators) => {

                // Find the indicator¿

                const indicator = indicators.find(item => item.id === id) || null;
                const indicator_test = indicators.find(item => item.id === id);

                console.log(indicator_test);
                // Update the indicator
                this._indicator.next(indicator);

                // Return the indicator

                return indicator;
            }),
            switchMap((indicator) => {

                if ( !indicator )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(indicator);
            })
        );
    }

    /**
     * Create indicator
     */
    createIndicator(): Observable<Indicator>
    {
        // Generate a new indicator
        const newIndicator = {


            "name": "Nuevo Indicador",
            "type": "Tipo indicador",
            "description": "Nuevo descripcion Indicador",
            "isActive": 1
        };
        console.log("aqui",newIndicator);
        return this.indicators$.pipe(
            take(1),
            switchMap(indicators => this._httpClient.post<Indicator>('http://localhost:1616/api/v1/followup/indicator/save', newIndicator).pipe(
                map((newIndicator) => {
                    // Update the indicators with the new indicator
                    this._indicators.next([newIndicator, ...indicators]);

                    // Return the new indicator
                    return newIndicator;
                })
            ))
        );
    }

    /**
     * Update indicator
     *
     * @param id
     * @param indicator
     */
    updateIndicator(id: number, indicator: Indicator): Observable<Indicator>
    {
       console.log(JSON.stringify(indicator));
        return this.indicators$.pipe(
            take(1),
            switchMap(indicators => this._httpClient.put<Indicator>('http://localhost:1616/api/v1/followup/indicator/indicator/' + indicator.id,
                indicator
            ).pipe(
                map((updatedIndicator) => {

                    // Find the index of the updated indicator
                    const index = indicators.findIndex(item => item.id === id);

                    // Update the indicator
                    indicators[index] = updatedIndicator;

                    function compare(a: Indicator, b: Indicator) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    indicators.sort(compare);

                    // Update the indicators
                    this._indicators.next(indicators);

                    // Return the updated indicator
                    return updatedIndicator;
                }),
                switchMap(updatedIndicator => this.indicator$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the indicator if it's selected
                        this._indicator.next(updatedIndicator);

                        // Return the updated indicator
                        return updatedIndicator;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the indicator
     *
     * @param id
     */
    deleteIndicator(indicator: Indicator): Observable<Indicator>
    {
        return this.indicators$.pipe(
            take(1),
            switchMap(indicators => this._httpClient.put('http://localhost:1616/api/v1/followup/indicator/status/' + indicator.id, indicator).pipe(
                map((updatedIndicator: Indicator) => {

                    // Find the index of the deleted indicator
                    const index = indicators.findIndex(item => item.id === indicator.id);

                    // Update the indicator
                    indicators[index] = updatedIndicator;

                    indicators.splice(index,1);


                    function compare(a: Indicator, b: Indicator) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    indicators.sort(compare);

                    // Update the indicators
                    this._indicators.next(indicators);


                    // Return the updated indicator
                    return updatedIndicator;
                })
            ))
        );
    }
    /**
     * Update the avatar of the given indicator
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<Indicator>
    {
        return this.indicators$.pipe(
            take(1),
            switchMap(indicators => this._httpClient.post<Indicator>('api/dashboards/indicator/avatar', {
                id

            }).pipe(
                map((updatedIndicator) => {

                    // Find the index of the updated indicator
                    const index = indicators.findIndex(item => item.id === id);

                    // Update the indicator
                    indicators[index] = updatedIndicator;

                    // Update the indicators
                    this._indicators.next(indicators);

                    // Return the updated indicator
                    return updatedIndicator;
                }),
                switchMap(updatedindicator => this.indicator$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the indicator if it's selected
                        this._indicator.next(updatedindicator);

                        // Return the updated indicator
                        return updatedindicator;
                    })
                ))
            ))
        );
    }



}
