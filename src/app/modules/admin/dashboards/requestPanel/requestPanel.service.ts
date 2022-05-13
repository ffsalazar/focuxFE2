import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PieCharts,ColumnCharts } from './requestPanel.types';

@Injectable({
    providedIn: 'root'
})
export class RequestPanelService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _requestsByDepartment: BehaviorSubject<PieCharts | null> = new BehaviorSubject(null);
    private _requestsByArea: BehaviorSubject<PieCharts | null> = new BehaviorSubject(null);
    private _requestsByBusiness: BehaviorSubject<ColumnCharts | null> = new BehaviorSubject(null);

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
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    /**
     * Getter for TypeRequest
     */
    get requestsByDepartment$(): Observable<PieCharts>
    {
        return this._requestsByDepartment.asObservable();
    }

    get requestsByArea$(): Observable<PieCharts>
    {
        return this._requestsByArea.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        return this._httpClient.get('api/dashboards/project').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    /**
     * Get Requests By Department
     */
     getRequestsByDepartment(): Observable<PieCharts>
     {
         return this._httpClient.get<PieCharts>('http://localhost:1616/api/v1/followup/dashboard/requestsbydepartment').pipe(
             tap((data) => {
 
                 this._requestsByDepartment.next(data);
 
             })
         );
    }

     /**
     * Get Requests By Areas
     */
    getRequestsByArea(): Observable<PieCharts>
    {
          return this._httpClient.get<PieCharts>('http://localhost:1616/api/v1/followup/dashboard/requestsbyarea').pipe(
              tap((data) => {
  
                  this._requestsByArea.next(data);
  
              })
          );
    }

    /**
     * Get Requests By Areas
     */
    getRequestsByBusiness(): Observable<ColumnCharts>
    {
           return this._httpClient.get<ColumnCharts>('http://localhost:1616/api/v1/followup/dashboard/requestsbybusiness').pipe(
               tap((data) => {
   
                   this._requestsByBusiness.next(data);
   
               })
           );
    }
}
