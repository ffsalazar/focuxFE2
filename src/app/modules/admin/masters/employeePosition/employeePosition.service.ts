import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { EmployeePosition, Department } from 'app/modules/admin/masters/employeePosition/employeePosition.types';

@Injectable({
    providedIn: 'root'
})
export class EmployeePositionsService
{
    // Private
    private _employeePosition: BehaviorSubject<EmployeePosition | null> = new BehaviorSubject(null);
    private _employeePositions: BehaviorSubject<EmployeePosition[] | null> = new BehaviorSubject(null);
    private _departments: BehaviorSubject<Department[] | null> = new BehaviorSubject(null);

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
     * Getter for employeePosition
     */
    get employeePosition$(): Observable<EmployeePosition>
    {
        return this._employeePosition.asObservable();
    }

    /**
     * Getter for employeePositions
     */
    get employeePositions$(): Observable<EmployeePosition[]>
    {
        return this._employeePositions.asObservable();
    }
    /**
     * Getter for departments
     */
     get departments$(): Observable<Department[]>
    {
        return this._departments.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get employeePositions
     */
    getEmployeePositions(): Observable<EmployeePosition[]>
    {
        return this._httpClient.get<EmployeePosition[]>('http://localhost:1616/api/v1/followup/employeePosition/all').pipe(
            tap((employeePositions) => {


                let employeePositionFiltered : any[]=[];

                function compare(a: EmployeePosition, b: EmployeePosition) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                employeePositions.sort(compare);
                employeePositions.forEach((employeePosition) => {
                    if (employeePosition.isActive != 0){
                        employeePositionFiltered.push(employeePosition);
                    }
                });
                this._employeePositions.next(employeePositionFiltered);

            })
        );
    }

    /**
     * Search employeePositions with given query
     *
     * @param query
     */
    searchEmployeePosition(query: string): Observable<EmployeePosition[]>
    {
        return this._httpClient.get<EmployeePosition[]>('http://localhost:1616/api/v1/followup/employeePosition/all', {
            params: {query}
        }).pipe(
            tap((employeePositions) => {
                let employeePositionFiltered : any[]=[];
                employeePositions.forEach((employeePosition) => {
                    if (employeePosition.isActive != 0){
                        employeePositionFiltered.push(employeePosition);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the employeePositions

                    employeePositionFiltered = employeePositionFiltered.filter(employeePosition => employeePosition.name && employeePosition.name.toLowerCase().includes(query.toLowerCase()));

                    function compare(a: EmployeePosition, b: EmployeePosition) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }

                    employeePositionFiltered.sort(compare);

                    this._employeePositions.next(employeePositionFiltered);
                }else{
                    function compare(a: EmployeePosition, b: EmployeePosition) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }

                    employeePositionFiltered.sort(compare);
                    this._employeePositions.next(employeePositionFiltered);
                }

            })
        );
    }

    /**
     * Get employeePosition by id
     */
    getEmployeePositionById(id: number): Observable<EmployeePosition>
    {
        return this._employeePositions.pipe(
            take(1),
            map((employeePositions) => {

                // Find the employeePosition¿

                const employeePosition = employeePositions.find(item => item.id === id) || null;
                const employeePosition_test = employeePositions.find(item => item.id === id);

                console.log(employeePosition_test);
                // Update the employeePosition
                this._employeePosition.next(employeePosition);

                // Return the employeePosition

                return employeePosition;
            }),
            switchMap((employeePosition) => {

                if ( !employeePosition )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(employeePosition);
            })
        );
    }

    /**
     * Create employeePosition
     */
    createEmployeePosition(): Observable<EmployeePosition>
    {
        // Generate a new employeePosition
        const newEmployeePosition = {

                "department": {
                    "code": "A01",
                    "description": "Departamento encarcado del desarrollo y mantenimiento de las diversas aplicaciones que se manejan.",
                    "id": 1,
                    "isActive": 1,
                    "name": "Aplicaciones"
                },
            "name": "Nuevo Cargo",
            "description": "Nueva descripcion cargo",
            "isActive": 1
        };
        return this.employeePositions$.pipe(
            take(1),
            switchMap(employeePositions => this._httpClient.post<EmployeePosition>('http://localhost:1616/api/v1/followup/employeePosition/save', newEmployeePosition).pipe(
                map((newEmployeePosition) => {
                    // Update the employeePositions with the new employeePosition
                    this._employeePositions.next([newEmployeePosition, ...employeePositions]);

                    // Return the new employeePosition
                    return newEmployeePosition;
                })
            ))
        );
    }

    /**
     * Update employeePosition
     *
     * @param id
     * @param employeePosition
     */
    updateEmployeePosition(id: number, employeePosition: EmployeePosition): Observable<EmployeePosition>
    {
       console.log(JSON.stringify(employeePosition));
        return this.employeePositions$.pipe(
            take(1),
            switchMap(employeePositions => this._httpClient.put<EmployeePosition>('http://localhost:1616/api/v1/followup/employeePosition/employeePosition/' + employeePosition.id,
                employeePosition
            ).pipe(
                map((updatedEmployeePosition) => {

                    // Find the index of the updated employeePosition
                    const index = employeePositions.findIndex(item => item.id === id);

                    // Update the employeePosition
                    employeePositions[index] = updatedEmployeePosition;




                    function compare(a: EmployeePosition, b: EmployeePosition) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    employeePositions.sort(compare);

                    // Update the employeePositions
                    this._employeePositions.next(employeePositions);

                    // Return the updated employeePosition
                    return updatedEmployeePosition;
                }),
                switchMap(updatedEmployeePosition => this.employeePosition$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the employeePosition if it's selected
                        this._employeePosition.next(updatedEmployeePosition);

                        // Return the updated employeePosition
                        return updatedEmployeePosition;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the employeePosition
     *
     * @param id
     */
    deleteEmployeePosition(employeePosition: EmployeePosition): Observable<EmployeePosition>
    {
        return this.employeePositions$.pipe(
            take(1),
            switchMap(employeePositions => this._httpClient.put('http://localhost:1616/api/v1/followup/employeePosition/status/' + employeePosition.id, employeePosition).pipe(
                map((updatedEmployeePosition: EmployeePosition) => {

                    // Find the index of the deleted employeePosition
                    const index = employeePositions.findIndex(item => item.id === employeePosition.id);

                    // Update the employeePosition
                    employeePositions[index] = updatedEmployeePosition;

                    employeePositions.splice(index,1);

                    function compare(a: EmployeePosition, b: EmployeePosition) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    employeePositions.sort(compare);


                    // Update the employeePositions
                    this._employeePositions.next(employeePositions);

                    // Return the updated employeePosition
                    return updatedEmployeePosition;
                })
            ))
        );
    }





    /**
     * Update the avatar of the given employeePosition
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<EmployeePosition>
    {
        return this.employeePositions$.pipe(
            take(1),
            switchMap(employeePositions => this._httpClient.post<EmployeePosition>('api/dashboards/employeePosition/avatar', {
                id

            }).pipe(
                map((updatedEmployeePosition) => {

                    // Find the index of the updated employeePosition
                    const index = employeePositions.findIndex(item => item.id === id);

                    // Update the employeePosition
                    employeePositions[index] = updatedEmployeePosition;

                    // Update the employeePositions
                    this._employeePositions.next(employeePositions);

                    // Return the updated employeePosition
                    return updatedEmployeePosition;
                }),
                switchMap(updatedemployeePosition => this.employeePosition$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the employeePosition if it's selected
                        this._employeePosition.next(updatedemployeePosition);

                        // Return the updated employeePosition
                        return updatedemployeePosition;
                    })
                ))
            ))
        );
    }

    getDepartments(): Observable<Department[]>
    {
        return this._httpClient.get<Department[]>('http://localhost:1616/api/v1/followup/departments/all').pipe(
            tap((departments) => {
                console.log(departments)
                this._departments.next(departments);
            })
        );
    }

}
