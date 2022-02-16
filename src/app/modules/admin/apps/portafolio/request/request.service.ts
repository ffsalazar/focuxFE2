import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { InventoryBrand, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import { CommercialArea, Request, Status, Category, RequestPeriod, TypeRequest, TechnicalArea, DialogOptions, DialogData } from './request.types';
import { BusinessType, Client } from 'app/modules/admin/dashboards/collaborators/collaborators.types';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FocuxPopupComponent }  from './focux-popup/focux-popup.component';

@Injectable({
    providedIn: 'root'
})
export class RequestService
{
    // Private
    private _brands: BehaviorSubject<InventoryBrand[] | null> = new BehaviorSubject(null);
  
    private _pagination: BehaviorSubject<InventoryPagination | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<InventoryProduct | null> = new BehaviorSubject(null);
    private _products: BehaviorSubject<InventoryProduct[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<InventoryTag[] | null> = new BehaviorSubject(null);

    private _clients: BehaviorSubject<Client[] | null> = new BehaviorSubject(null);
    private _commerc: BehaviorSubject<CommercialArea[] | null> = new BehaviorSubject(null);
    private _request: BehaviorSubject<Request | null> = new BehaviorSubject(null); 
    private _requests: BehaviorSubject<Request[] | null> = new BehaviorSubject(null);
    private _status: BehaviorSubject<Status[] | null> = new BehaviorSubject(null);
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _requestp: BehaviorSubject<RequestPeriod[] | null> = new BehaviorSubject(null);
    private _typereq: BehaviorSubject<TypeRequest[] | null> = new BehaviorSubject(null);
    private _areatech: BehaviorSubject<TechnicalArea[] | null> = new BehaviorSubject(null);

    private _isOpenModal: Subject<boolean | null> = new Subject(); 

    request: Request;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient,
        private dialog: MatDialog)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for categories
     */
    get categories$(): Observable<Category[]>
    {
        return this._categories.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<InventoryPagination>
    {
        return this._pagination.asObservable();
    }

    /**
     * Getter for product
     */
    get product$(): Observable<InventoryProduct>
    {
        return this._product.asObservable();
    }

    /**
     * Getter for products
     */
    get products$(): Observable<InventoryProduct[]>
    {
        return this._products.asObservable();
    }

    /**
     * Getter for products
     */
    get requests$(): Observable<Request[]>
    {
        return this._requests.asObservable();
    }

    get request$(): Observable<Request>
    {
        return this._request.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<InventoryTag[]>
    {
        return this._tags.asObservable();
    }

     /**
     * Getter for commerca
     */
    get commerca$(): Observable<CommercialArea[]>
    {
        return this._commerc.asObservable();
    }
     
     /**
     * Getter for status
     */
    get status$(): Observable<Status[]>
    {
        return this._status.asObservable();
    }

    /**
     * Getter for client
     */
    get clients$(): Observable<Client[]>
    {
        return this._clients.asObservable();
    }

    /**
     * Getter for request
     */
    get requestp$(): Observable<RequestPeriod []>
    {
        return this._requestp.asObservable();
    }

    get areatech$(): Observable<TechnicalArea []>{
        return this._areatech.asObservable()
     }

    /**
     * Getter for type request
     */
    get typereq$(): Observable<TypeRequest []>{
       return this._typereq.asObservable()
    }

    /**
     * Getter for type request
     */
    get isOpenModal$(): Observable<Boolean>{
       return this._isOpenModal.asObservable()
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get categories
     */
    getCategory(): Observable<Category[]>
    {
        return this._httpClient.get<Category[]>('http://localhost:1616/api/v1/followup/categories/all').pipe(
            tap((categories) => {
                this._categories.next(categories);
            })
        );
    }

    

    // /**
    //  * Get products
    //  *
    //  *
    //  * @param page
    //  * @param size
    //  * @param sort
    //  * @param order
    //  * @param search
    //  */
    // getRequest(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
    //     Observable<{ pagination: InventoryPagination; products: InventoryProduct[] }>
    // {
    //     console.log("entrooooo");
    //     return this._httpClient.get<{ pagination: InventoryPagination; products: InventoryProduct[] }>('api/apps/ecommerce/inventory/products', {
    //         params: {
    //             page: '' + page,
    //             size: '' + size,
    //             sort,
    //             order,
    //             search
    //         }
    //     }).pipe(
    //         tap((response) => {

    //             console.log("response: ", response);
    //             // this._pagination.next(response.pagination);
    //             // this._products.next(response.products);

    //             this._request.next(this.request);
    //         })
    //     );
    // }
    /**
     * Search collaborators with given query
     *
     * @param query
     */
    //  searchCollaborator(query: string): Observable<Collaborator[]>
    //  {
    //      return this._httpClient.get<Collaborator[]>('http://localhost:1616/api/v1/followup/collaborators/all', {
    //          params: {query}
    //      }).pipe(
    //          tap((collaborators) => {
    //              let collaboratorFiltered : any[]=[];
    //              collaborators.forEach((collaborator) => {
    //                  if (collaborator.isActive != 0){
    //                      collaboratorFiltered.push(collaborator);
    //                  }
    //              });
    //              // If the query exists...
    //              if ( query )
    //              {
    //                  // Filter the collaborators
 
    //                  collaboratorFiltered = collaboratorFiltered.filter(collaborator => collaborator.name && collaborator.name.toLowerCase().includes(query.toLowerCase()));
    //                  function compare(a: Collaborator, b: Collaborator) {
    //                      if (a.name < b.name) return -1;
    //                      if (a.name > b.name) return 1;
    //                      // Their names are equal
    //                      if (a.lastName < b.lastName) return -1;
    //                      if (a.lastName > b.lastName) return 1;
 
    //                      return 0;
    //                  }
    //                  collaboratorFiltered.sort(compare);
    //                  this._collaborators.next(collaboratorFiltered);
    //              }else{
    //                  function compare(a: Collaborator, b: Collaborator) {
    //                      if (a.name < b.name) return -1;
    //                      if (a.name > b.name) return 1;
    //                      // Their names are equal
    //                      if (a.lastName < b.lastName) return -1;
    //                      if (a.lastName > b.lastName) return 1;
 
    //                      return 0;
    //                 }
    //                 collaboratorFiltered.sort(compare);
    //                 this._collaborators.next(collaboratorFiltered);
    //             }
 
    //         })
    //     );
    // }

    /**
     * Get request by id
     */
    getRequestById(id: number): Observable<Request>
    {
        return this._requests.pipe(
            take(1),
            map((requests) => {

                // Find the request
                const request = requests.find(item => item.id === id) || null;

                // Update the request

                this._request.next(request);

                // Return the request
                return request;
            }),
            switchMap((request) => {

                if ( !request )
                {
                    return throwError('Could not found request with id of ' + id + '!');
                }

                return of(request);
            })
        );
    }

    /**
     * 
     * @param query 
     */
    searchRequest(query: string): Observable<Request[]> {

        return this._httpClient.get<Request[]>('http://localhost:1616/api/v1/followup/requests/all',
            {params: {query}}
        )
        .pipe(
            tap((requests) => {
                let requestsFiltered : Request[]=[];
                // Filter inactive request 
                requestsFiltered = requests.filter(item => item.isActive !== 0);

                // If the query exists...
                if ( query )
                {
                    // Filter the requests

                    requestsFiltered = requestsFiltered.filter(request => request.titleRequest && request.titleRequest .toLowerCase().includes(query.toLowerCase()));
                    function compare(a: Request, b: Request) {
                        if (a.titleRequest < b.titleRequest) return -1;
                        if (a.titleRequest > b.titleRequest) return 1;
                        // Their names are equal
                        if (a.titleRequest < b.titleRequest) return -1;
                        if (a.titleRequest > b.titleRequest) return 1;

                        return 0;
                    }
                    requestsFiltered.sort(compare);
                    this._requests.next(requestsFiltered);
                }else{
                    function compare(a: Request, b: Request) {
                        if (a.titleRequest < b.titleRequest) return -1;
                        if (a.titleRequest > b.titleRequest) return 1;
                        // Their names are equal
                        if (a.titleRequest < b.titleRequest) return -1;
                        if (a.titleRequest > b.titleRequest) return 1;

                        return 0;
                    }
                    requestsFiltered.sort(compare);
                    this._requests.next(requestsFiltered);
                }

                return this._requests.next(requestsFiltered);
            })
        );
    }

    getRequests(): Observable<Request[]> {
        return this._httpClient.get<Request[]>('http://localhost:1616/api/v1/followup/requests/all').pipe(
            tap((requests) => {

                // Filter inactive request 
                requests = requests.filter(item => item.isActive !== 0);

                // Emit next value 
                this._requests.next(requests);
            })
        );
    }

    getClients(): Observable<Client[]> {
        return this._httpClient.get<Client[]>('http://localhost:1616/api/v1/followup/clients/all').pipe(
            tap((clients) => {

                this._clients.next(clients);
            })
        );
    }

    getComercArea(): Observable<CommercialArea[]> {
        return this._httpClient.get<CommercialArea[]>('http://localhost:1616/api/v1/followup/commercialareas/all').pipe(
            tap((commerc) => {

                this._commerc.next(commerc);
            })
        );
    }

    getRequestPeriod(): Observable<RequestPeriod[]> {
        return this._httpClient.get<RequestPeriod[]>('http://localhost:1616/api/v1/followup/requestPeriod/all').pipe(
            tap((reqperiod) => {

                this._requestp.next(reqperiod);
            })
        );
    }

    getTypeRequest(): Observable<TypeRequest[]> {
        return this._httpClient.get<TypeRequest[]>('http://localhost:1616/api/v1/followup/typerequests/all').pipe(
            tap((typereq) => {

                this._typereq.next(typereq);
            })
        );
    }

    getStatus(): Observable<Status[]> {
        return this._httpClient.get<Status[]>('http://localhost:1616/api/v1/followup/typestatuses/all').pipe(
            tap((status) => {

                this._status.next(status);
            })
        );
    }

    getAreaTech(): Observable<TechnicalArea[]> {
        return this._httpClient.get<TechnicalArea[]>('http://localhost:1616/api/v1/followup/technicalareas/all').pipe(
            tap((areatech) => {

                this._areatech.next(areatech);
            })
        );
    }

    
    /**
     * Create product
     */
    createRequest(): Observable<Request>
    {
        const newRequest = {
            client: {
              id: 1
            },
            commercialArea: {
              id: 1
            },
            typeRequest: {
              id: 1
            },
            titleRequest: 'Nueva solicitud',
            descriptionRequest: 'Description PRUEBA DESDE JSONDOC CON CAMBIOS',
            responsibleRequest: {
              id: 3
            },
            priorityOrder: 1,
            dateRequest: '2022-02-07T04:00:00.000+00:00',
            dateInit: '2022-02-07T04:00:00.000+00:00',
            datePlanEnd: '2022-02-08T04:00:00.000+00:00',
            dateRealEnd: '2022-02-09T04:00:00.000+00:00',
            status: {
              id: 1
            },
            completionPercentage: 30,
            deviationPercentage: 70,
            deliverablesCompletedIntelix: 'PRUEBA DESDE JSONDOC CON CAMBIOS DELIVERABLES',
            pendingActivitiesIntelix: 'PRUEBA DESDE JSONDOC CON CAMBIOS PENDING',
            commentsIntelix: 'PRUEBA DESDE JSONDOC CON CAMBIOS COMMENTS',
            updateDate: '2022-02-07T04:00:00.000+00:00',
            commentsClient: 'PRUEBA DESDE JSONDOC CON CAMBIOS COMMENTS CLIENT',
            technicalArea: {
              id: 1
            },
            category: {
              id: 1
            },
            internalFeedbackIntelix: 'PRUEBA DESDE JSONDOC CON CAMBIOS INTERNAL FEEDBACK',
            solverGroup: {
              id: 1
            },
            requestPeriod: {
              id: 1
            },
            dateInitPause: '2022-02-08T04:00:00.000+00:00',
            dateEndPause: '2022-02-08T04:00:00.000+00:00',
            totalPauseDays: 1,
            isActive: 1,
            code: 'asd21'
        }
          
        return this.requests$.pipe(
            take(1),
            switchMap(requests => this._httpClient.post<Request>('http://localhost:1616/api/v1/followup/requests/save', newRequest).pipe(
                map((newRequest) => {
                    this._requests.next([newRequest, ...requests]);
                   
                    return newRequest;
                })
            ))
        );
    }

    /**
     * Update product
     *
     * @param id
     * @param request
     */
    updateRequest(id: number, request: Request): Observable<any>
    {
        console.log("updateRequest: ", request);

        const newRequest = {
            id: 6,
            "client": {
              "id": 1
            },
            "commercialArea": {
              "id": 1
            },
            "typeRequest": {
              "id": 1
            },
            "titleRequest": "Petición de Tesis :)",
            "descriptionRequest": "Description PRUEBA DESDE JSONDOC CON CAMBIOS",
            "responsibleRequest": {
              "id": 3
            },
            "priorityOrder": 1,
            "dateRequest": "2022-02-07T04:00:00.000+00:00",
            "dateInit": "2022-02-07T04:00:00.000+00:00",
            "datePlanEnd": "2022-02-08T04:00:00.000+00:00",
            "dateRealEnd": "2022-02-09T04:00:00.000+00:00",
            "status": {
              "id": 1
            },
            "completionPercentage": 30,
            "deviationPercentage": 70,
            "deliverablesCompletedIntelix": "PRUEBA DESDE JSONDOC CON CAMBIOS DELIVERABLES",
            "pendingActivitiesIntelix": "PRUEBA DESDE JSONDOC CON CAMBIOS PENDING",
            "commentsIntelix": "PRUEBA DESDE JSONDOC CON CAMBIOS COMMENTS",
            "updateDate": "2022-02-07T04:00:00.000+00:00",
            "commentsClient": "PRUEBA DESDE JSONDOC CON CAMBIOS COMMENTS CLIENT",
            "technicalArea": {
              "id": 1
            },
            "category": {
              "id": 1
            },
            "internalFeedbackIntelix": "PRUEBA DESDE JSONDOC CON CAMBIOS INTERNAL FEEDBACK",
            "solverGroup": {
              "id": 1
            },
            "requestPeriod": {
              "id": 1
            },
            "dateInitPause": "2022-02-08T04:00:00.000+00:00",
            "dateEndPause": "2022-02-08T04:00:00.000+00:00",
            "totalPauseDays": 1,
            "isActive": 1,
            "code": "asd21"
        }

        return this.requests$.pipe(
            take(1),
            switchMap(requests => this._httpClient.put<Request> ('http://localhost:1616/api/v1/followup/requests/request/' + id, 
                request
            ).pipe(
                map((updatedRequest) => {

                    // Find the index of the updated product
                    const index = requests.findIndex(item => item.id === id);

                    // // Update the product
                    requests[index] = updatedRequest;

                    // Update the products
                    this._requests.next(requests);

                    console.log("Se actualizo");
                    this._isOpenModal.next(true);
                    // // Return the updated product
                    return updatedRequest;
                }),
                switchMap(updatedRequest => this.request$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the product if it's selected
                        this._request.next(updatedRequest);
                        
                        this._isOpenModal.next(true);
                        //this._isOpenModal.complete();


                        // Return the updated product
                        return updatedRequest;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the product
     *
     * @param id
     * @param request
     */
    deleteRequest(id: number, request: Request): Observable<boolean>
    {
        return this.requests$.pipe(
            take(1),
            switchMap(requests => this._httpClient.put('http://localhost:1616/api/v1/followup/requests/status/' + id, request).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted product
                    const index = requests.findIndex(item => item.id === id);

                    // Delete the product
                    requests.splice(index, 1);

                    // Update the products
                    this._requests.next(requests);
                    this._isOpenModal.next(false);
                    // Return the deleted status
                    
                    return isDeleted;
                })
            ))
        );
    }

    /**
     * 
     * @param data 
     * @param options 
     * @param modalType 
     * @returns 
     */
    open(data: DialogData, options: DialogOptions = {width: 800, minHeight: 0, height: 200, disableClose: true}, modalType: 1 | 2 = 1): Observable<boolean> {
        const dialogRef: MatDialogRef<FocuxPopupComponent> = this.dialog.open<FocuxPopupComponent, DialogData>(
            FocuxPopupComponent,
            {
                data
            }
        );
        return dialogRef.afterClosed();

    }
}
