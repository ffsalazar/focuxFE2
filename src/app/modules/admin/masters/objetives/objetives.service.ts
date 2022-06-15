import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Objetive } from './objetives.types';

@Injectable({
    providedIn: 'root',
})
export class ObjetivesService {
    // Private-
    private _objetive: BehaviorSubject<Objetive | null> = new BehaviorSubject(
        null
    );
    private _objetives: BehaviorSubject<Objetive[] | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // ----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for objetive
     */
    get objetive$(): Observable<Objetive> {
        return this._objetive.asObservable();
    }

    /**
     * Getter for objetives
     */
    get objetives$(): Observable<Objetive[]> {
        return this._objetives.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get objetives
     */
    getObjetives(): Observable<Objetive[]> {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient
            .get<Objetive[]>('http://localhost:1616/api/v1/followup/target/all', {headers})
            .pipe(
                tap((objetives) => {
                    const objetiveFiltered: any[] = [];

                    function compare(a: Objetive, b: Objetive) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;

                        return 0;
                    }
                    objetives.sort(compare);
                    objetives.forEach((objetive) => {
                        if (objetive.isActive != 0) {
                            objetiveFiltered.push(objetive);
                        }
                    });
                    this._objetives.next(objetiveFiltered);
                })
            );
    }

    /**
     * Search objetives with given query
     *
     * @param query
     */
    searchObjetive(query: string): Observable<Objetive[]> {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient
            .get<Objetive[]>(
                'http://localhost:1616/api/v1/followup/target/all',
                {
                    params: { query },
                    headers
                }
            )
            .pipe(
                tap((objetives) => {
                    let objetiveFiltered: any[] = [];
                    objetives.forEach((objetive) => {
                        if (objetive.isActive != 0) {
                            objetiveFiltered.push(objetive);
                        }
                    });
                    // If the query exists...
                    if (query) {
                        // Filter the objetives

                        objetiveFiltered = objetiveFiltered.filter(
                            (objetive) =>
                                objetive.name &&
                                objetive.name
                                    .toLowerCase()
                                    .includes(query.toLowerCase())
                        );
                        function compare(a: Objetive, b: Objetive) {
                            if (a.name < b.name) return -1;
                            if (a.name > b.name) return 1;

                            return 0;
                        }
                        objetiveFiltered.sort(compare);
                        this._objetives.next(objetiveFiltered);
                    } else {
                        function compare(a: Objetive, b: Objetive) {
                            if (a.name < b.name) return -1;
                            if (a.name > b.name) return 1;

                            return 0;
                        }
                        objetiveFiltered.sort(compare);
                        this._objetives.next(objetiveFiltered);
                    }
                })
            );
    }

    /**
     * Get objetive by id
     */
    getObjetiveById(id: number): Observable<Objetive> {
        return this._objetives.pipe(
            take(1),
            map((objetives) => {
                // Find the objetive

                const objetive =
                    objetives.find((item) => item.id === id) || null;
                // Update the objetive
                this._objetive.next(objetive);

                // Return the objetive

                return objetive;
            }),
            switchMap((objetive) => {
                if (!objetive) {
                    return throwError('El objetivo no existe !');
                }

                return of(objetive);
            })
        );
    }

    /**
     * Create objetive
     */
    createObjetive(): Observable<Objetive> {
        // Generate a new objetive
        const newObjetive = {
            name: 'Nuevo objetivo',
            description: 'Nueva Descripcion de Objetivo',
            type: 'Nuevo tipo de objetivo',
            isActive: 1,
        };
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.objetives$.pipe(
            take(1),
            switchMap((objetives) =>
                this._httpClient
                    .post<Objetive>(
                        'http://localhost:1616/api/v1/followup/target/save',
                        newObjetive, {headers}
                    )
                    .pipe(
                        map((newObjetive) => {
                            // Update the objetives with the new objetive
                            this._objetives.next([newObjetive, ...objetives]);

                            // Return the new objetive
                            return newObjetive;
                        })
                    )
            )
        );
    }

    /**
     * Update objetive
     *
     * @param id
     * @param objetive
     */
    updateObjetive(id: number, objetive: Objetive): Observable<Objetive> {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.objetives$.pipe(
            take(1),
            switchMap((objetives) =>
                this._httpClient
                    .put<Objetive>(
                        'http://localhost:1616/api/v1/followup/target/target/' +
                            objetive.id,
                        objetive, {headers}
                    )
                    .pipe(
                        map((updatedObjetive) => {
                            // Find the index of the updated objetive
                            const index = objetives.findIndex(
                                (item) => item.id === id
                            );

                            // Update the objetive
                            objetives[index] = updatedObjetive;

                            function compare(a: Objetive, b: Objetive) {
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;
                                return 0;
                            }
                            objetives.sort(compare);

                            // Update the objetives
                            this._objetives.next(objetives);

                            // Return the updated objetive
                            return updatedObjetive;
                        }),
                        switchMap((updatedObjetive) =>
                            this.objetive$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the objetive if it's selected
                                    this._objetive.next(updatedObjetive);

                                    // Return the updated objetive
                                    return updatedObjetive;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Delete the objetive
     *
     * @param id
     */
    deleteObjetive(objetive: Objetive): Observable<Objetive> {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.objetives$.pipe(
            take(1),
            switchMap((objetives) =>
                this._httpClient
                    .put(
                        'http://localhost:1616/api/v1/followup/target/status/' +
                            objetive.id,
                        objetive, {headers}
                    )
                    .pipe(
                        map((updatedObjetive: Objetive) => {
                            // Find the index of the deleted objetive
                            const index = objetives.findIndex(
                                (item) => item.id === objetive.id
                            );

                            // Update the objetive
                            objetives[index] = updatedObjetive;

                            objetives.splice(index, 1);

                            function compare(a: Objetive, b: Objetive) {
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;
                                return 0;
                            }
                            objetives.sort(compare);

                            // Update the objetives
                            this._objetives.next(objetives);

                            // Return the updated objetive
                            return updatedObjetive;
                        })
                    )
            )
        );
    }
}
