import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import {
    Status,
    TypeStatus,
} from 'app/modules/admin/masters/statuses/statuses.types';

@Injectable({
    providedIn: 'root',
})
export class StatusesService {
    // Private
    private _status: BehaviorSubject<Status | null> = new BehaviorSubject(null);
    private _statuses: BehaviorSubject<Status[] | null> = new BehaviorSubject(
        null
    );
    private _typeStatuses: BehaviorSubject<TypeStatus[] | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for status
     */
    get status$(): Observable<Status> {
        return this._status.asObservable();
    }

    /**
     * Getter for statuses
     */
    get statuses$(): Observable<Status[]> {
        return this._statuses.asObservable();
    }
    /**
     * Getter for statusTypes
     */
    get typeStatuses$(): Observable<TypeStatus[]> {
        return this._typeStatuses.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get statuses
     */
    getStatuses(): Observable<Status[]> {
        return this._httpClient
            .get<Status[]>('http://localhost:1616/api/v1/followup/statuses/all')
            .pipe(
                tap((statuses) => {
                    let statusFiltered: any[] = [];

                    function compare(a: Status, b: Status) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;

                        return 0;
                    }
                    statuses.sort(compare);
                    statuses.forEach((status) => {
                        if (status.isActive != 0) {
                            statusFiltered.push(status);
                        }
                    });
                    this._statuses.next(statusFiltered);
                })
            );
    }

    /**
     * Search statuses with given query
     *
     * @param query
     */
    searchStatus(query: string): Observable<Status[]> {
        return this._httpClient
            .get<Status[]>(
                'http://localhost:1616/api/v1/followup/statuses/all',
                {
                    params: { query },
                }
            )
            .pipe(
                tap((statuses) => {
                    let statusFiltered: any[] = [];
                    statuses.forEach((status) => {
                        if (status.isActive != 0) {
                            statusFiltered.push(status);
                        }
                    });
                    // If the query exists...
                    if (query) {
                        // Filter the statuses

                        statusFiltered = statusFiltered.filter(
                            (status) =>
                                status.name &&
                                status.name
                                    .toLowerCase()
                                    .includes(query.toLowerCase())
                        );
                        function compare(a: Status, b: Status) {
                            if (a.name < b.name) return -1;
                            if (a.name > b.name) return 1;

                            return 0;
                        }
                        statusFiltered.sort(compare);
                        this._statuses.next(statusFiltered);
                    } else {
                        function compare(a: Status, b: Status) {
                            if (a.name < b.name) return -1;
                            if (a.name > b.name) return 1;

                            return 0;
                        }
                        statusFiltered.sort(compare);
                        this._statuses.next(statusFiltered);
                    }
                })
            );
    }

    /**
     * Get status by id
     */
    getStatusById(id: number): Observable<Status> {
        return this._statuses.pipe(
            take(1),
            map((statuses) => {
                // Find the status¿

                const status = statuses.find((item) => item.id === id) || null;
                const status_test = statuses.find((item) => item.id === id);

                console.log(status_test);
                // Update the status
                this._status.next(status);

                // Return the status

                return status;
            }),
            switchMap((status) => {
                if (!status) {
                    return throwError('El colaborador no existe !');
                }

                return of(status);
            })
        );
    }

    /**
     * Create status
     */
    createStatus(): Observable<Status> {
        // Generate a new status
        const newStatus = {
            typeStatus: 'nuevo Tipo',
            name: 'Nuevo Status',
            description: 'Nueva descripcion',
            isActive: 1,
        };
        return this.statuses$.pipe(
            take(1),
            switchMap((statuses) =>
                this._httpClient
                    .post<Status>(
                        'http://localhost:1616/api/v1/followup/statuses/save',
                        newStatus
                    )
                    .pipe(
                        map((newStatus) => {
                            // Update the statuses with the new status
                            this._statuses.next([newStatus, ...statuses]);

                            // Return the new status
                            return newStatus;
                        })
                    )
            )
        );
    }

    /**
     * Update status
     *
     * @param id
     * @param status
     */
    updateStatus(id: number, status: Status): Observable<Status> {
        console.log(JSON.stringify(status));
        return this.statuses$.pipe(
            take(1),
            switchMap((statuses) =>
                this._httpClient
                    .put<Status>(
                        'http://localhost:1616/api/v1/followup/statuses/statuses/' +
                            status.id,
                        status
                    )
                    .pipe(
                        map((updatedStatus) => {
                            // Find the index of the updated status
                            const index = statuses.findIndex(
                                (item) => item.id === id
                            );

                            // Update the status
                            statuses[index] = updatedStatus;

                            function compare(a: Status, b: Status) {
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;

                                return 0;
                            }
                            statuses.sort(compare);

                            // Update the statuses
                            this._statuses.next(statuses);

                            // Return the updated status
                            return updatedStatus;
                        }),
                        switchMap((updatedStatus) =>
                            this.status$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the status if it's selected
                                    this._status.next(updatedStatus);

                                    // Return the updated status
                                    return updatedStatus;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Delete the status
     *
     * @param id
     */
    deleteStatus(status: Status): Observable<Status> {
        return this.statuses$.pipe(
            take(1),
            switchMap((statuses) =>
                this._httpClient
                    .put(
                        'http://localhost:1616/api/v1/followup/statuses/status/' +
                            status.id,
                        status
                    )
                    .pipe(
                        map((updatedStatus: Status) => {
                            // Find the index of the deleted status
                            const index = statuses.findIndex(
                                (item) => item.id === status.id
                            );

                            // Update the status
                            statuses[index] = updatedStatus;

                            statuses.splice(index, 1);

                            function compare(a: Status, b: Status) {
                                if (a.name < b.name) return -1;
                                if (a.name > b.name) return 1;

                                return 0;
                            }
                            statuses.sort(compare);

                            // Update the statuses
                            this._statuses.next(statuses);

                            // Return the updated status
                            return updatedStatus;
                        })
                    )
            )
        );
    }

    /**
     * Update the avatar of the given status
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<Status> {
        return this.statuses$.pipe(
            take(1),
            switchMap((statuses) =>
                this._httpClient
                    .post<Status>('api/dashboards/statuses/avatar', {
                        id,
                    })
                    .pipe(
                        map((updatedStatus) => {
                            // Find the index of the updated status
                            const index = statuses.findIndex(
                                (item) => item.id === id
                            );

                            // Update the status
                            statuses[index] = updatedStatus;

                            // Update the statuses
                            this._statuses.next(statuses);

                            // Return the updated status
                            return updatedStatus;
                        }),
                        switchMap((updatedstatus) =>
                            this.status$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the status if it's selected
                                    this._status.next(updatedstatus);

                                    // Return the updated status
                                    return updatedstatus;
                                })
                            )
                        )
                    )
            )
        );
    }

    getTypeStatuses(): Observable<TypeStatus[]> {
        return this._httpClient
            .get<TypeStatus[]>(
                'http://localhost:1616/api/v1/followup/typestatuses/all'
            )
            .pipe(
                tap((typeStatus) => {
                    let typeStatusFiltered: any[] = [];

                    function compare(a: TypeStatus, b: TypeStatus) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;

                        return 0;
                    }
                    typeStatus.sort(compare);
                    typeStatus.forEach((status) => {
                        if (status.isActive != 0) {
                            typeStatusFiltered.push(status);
                        }
                    });
                    this._typeStatuses.next(typeStatusFiltered);
                })
            );
    }
}
