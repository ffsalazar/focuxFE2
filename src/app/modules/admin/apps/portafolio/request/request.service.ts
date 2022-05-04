import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import {
    InventoryBrand,
    InventoryPagination,
    InventoryProduct,
    InventoryTag,
    InventoryVendor,
} from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import {
    CommercialArea,
    Request,
    Status,
    Category,
    RequestPeriod,
    TypeRequest,
    TechnicalArea,
    DialogOptions,
    DialogData,
    BusinessType,
    Knowledge,
    Collaborator,
    Department,
} from './request.types';
import { Client } from 'app/modules/admin/dashboards/collaborators/collaborators.types';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FocuxPopupComponent } from './focux-popup/focux-popup.component';

@Injectable({
    providedIn: 'root',
})
export class RequestService {
    // Private
    private _brands: BehaviorSubject<InventoryBrand[] | null> =
        new BehaviorSubject(null);

    private _pagination: BehaviorSubject<InventoryPagination | null> =
        new BehaviorSubject(null);
    private _product: BehaviorSubject<InventoryProduct | null> =
        new BehaviorSubject(null);
    private _products: BehaviorSubject<InventoryProduct[] | null> =
        new BehaviorSubject(null);
    private _tags: BehaviorSubject<InventoryTag[] | null> = new BehaviorSubject(
        null
    );

    private _clients: BehaviorSubject<Client[] | null> = new BehaviorSubject(
        null
    );
    private _commerc: BehaviorSubject<CommercialArea[] | null> =
        new BehaviorSubject(null);
    private _request: BehaviorSubject<Request | null> = new BehaviorSubject(
        null
    );
    private _requests: BehaviorSubject<Request[] | null> = new BehaviorSubject(
        null
    );
    private _status: BehaviorSubject<Status[] | null> = new BehaviorSubject(
        null
    );
    private _categories: BehaviorSubject<Category[] | null> =
        new BehaviorSubject(null);
    private _requestp: BehaviorSubject<RequestPeriod[] | null> =
        new BehaviorSubject(null);
    private _typereq: BehaviorSubject<TypeRequest[] | null> =
        new BehaviorSubject(null);
    private _areatech: BehaviorSubject<TechnicalArea[] | null> =
        new BehaviorSubject(null);
    private _businessType: BehaviorSubject<BusinessType[] | null> =
        new BehaviorSubject(null);
    private _knowledges: BehaviorSubject<Knowledge[] | null> =
        new BehaviorSubject(null);
    private _collaborators: BehaviorSubject<Collaborator[] | null> =
        new BehaviorSubject(null);
    private _departments: BehaviorSubject<Department[] | null> =
        new BehaviorSubject(null);
    private _isOpenModal: Subject<boolean | null> = new Subject();

    public requests: Request[];

    request: Request;

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private dialog: MatDialog) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for categories
     */
    get categories$(): Observable<Category[]> {
        return this._categories.asObservable();
    }

    /**
     * Getter for knowledge
     */
    get knowledges$(): Observable<Knowledge[]> {
        return this._knowledges.asObservable();
    }

    /**
     * Getter for departments
     */
    get departments$(): Observable<Department[]> {
        return this._departments.asObservable();
    }

    /**
     * Getter for pagination
     */
    get pagination$(): Observable<InventoryPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for product
     */
    get product$(): Observable<InventoryProduct> {
        return this._product.asObservable();
    }

    /**
     * Getter for products
     */
    get products$(): Observable<InventoryProduct[]> {
        return this._products.asObservable();
    }

    /**
     * Getter for products
     */
    get requests$(): Observable<Request[]> {
        return this._requests.asObservable();
    }

    get request$(): Observable<Request> {
        return this._request.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<InventoryTag[]> {
        return this._tags.asObservable();
    }

    /**
     * Getter for commerca
     */
    get commerca$(): Observable<CommercialArea[]> {
        return this._commerc.asObservable();
    }

    /**
     * Getter for status
     */
    get status$(): Observable<Status[]> {
        return this._status.asObservable();
    }

    /**
     * Getter for client
     */
    get clients$(): Observable<Client[]> {
        return this._clients.asObservable();
    }

    /**
     * Getter for request
     */
    get requestp$(): Observable<RequestPeriod[]> {
        return this._requestp.asObservable();
    }

    get areatech$(): Observable<TechnicalArea[]> {
        return this._areatech.asObservable();
    }

    /**
     * Getter for typeRequest
     */
    get typereq$(): Observable<TypeRequest[]> {
        return this._typereq.asObservable();
    }

    /**
     * Getter for isOpenModal
     */
    get isOpenModal$(): Observable<Boolean> {
        return this._isOpenModal.asObservable();
    }

    /**
     * Getter for businessType
     */
    get businessType$(): Observable<BusinessType[]> {
        return this._businessType.asObservable();
    }

    /**
     * Getter for businessType
     */
    get collaborators$(): Observable<Collaborator[]> {
        return this._collaborators.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter for request
     *
     */
    setRequests(requests: Request[]) {
        this._requests.next(requests);
    }

    /**
     * Get categories
     *
     */
    getCategory(): Observable<Category[]> {
        return this._httpClient
            .get<Category[]>(
                'http://localhost:1616/api/v1/followup/categories/all'
            )
            .pipe(
                tap((categories) => {
                    this._categories.next(categories);
                })
            );
    }

    /**
     *
     * @returns
     */
    getDepartments() {
        return this._httpClient
            .get<Department[]>(
                'http://localhost:1616/api/v1/followup/departments/all'
            )
            .pipe(
                tap((departments) => {
                    this._departments.next(departments);
                })
            );
    }

    // /**
    //  * Get categories
    //  */
    // getKnowledges(): Observable<Knowledge[]>
    // {
    //     return this._httpClient.get<Knowledge[]>('http://localhost:1616/api/v1/followup/categories/all').pipe(
    //         tap((categories) => {
    //             this._categories.next(categories);
    //         })
    //     );
    // }

    /**
     * Get knowledges
     *
     */
    getKnowledges(): Observable<Knowledge[]> {
        return this._httpClient
            .get<Knowledge[]>(
                'http://localhost:1616/api/v1/followup/knowledges/all'
            )
            .pipe(
                tap((knowledges) => {
                    let knowledgesFiltered: Knowledge[] = [];
                    knowledges.forEach((knowledge) => {
                        if (knowledge.isActive != 0) {
                            knowledgesFiltered.push(knowledge);
                        }
                    });

                    this._knowledges.next(knowledgesFiltered);
                })
            );
    }

    updateRequestKnowledge(id: number, knowledges) {
        return this._httpClient.put<Knowledge[]>(
            'http://localhost:1616/api/v1/followup/requests/knowledge/update/' +
                id,
            knowledges
        );
    }

    /**
     * Get rewquest by id
     * @param id
     * @returns
     */
    getRequestById(id: number): Observable<Request> {
        return this._requests.pipe(
            take(1),
            map((requests) => {
                // Find the request
                const request = requests.find((item) => item.id === id) || null;

                // Update the request

                this._request.next(request);

                // Return the request
                return request;
            }),
            switchMap((request) => {
                if (!request) {
                    return throwError(
                        'Could not found request with id of ' + id + '!'
                    );
                }

                return of(request);
            })
        );
    }

    getCollaborators(): Observable<Collaborator[]> {
        return this._httpClient
            .get<Collaborator[]>(
                'http://localhost:1616/api/v1/followup/collaborators/all'
            )
            .pipe(
                tap((collaborators) => {
                    let collaboratorFiltered: any[] = [];

                    function compare(a: Collaborator, b: Collaborator) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        // Their names are equal
                        if (a.lastName < b.lastName) return -1;
                        if (a.lastName > b.lastName) return 1;

                        return 0;
                    }
                    collaborators.sort(compare);
                    collaborators.forEach((collaborator) => {
                        if (collaborator.isActive != 0) {
                            collaboratorFiltered.push(collaborator);
                        }
                    });
                    this._collaborators.next(collaboratorFiltered);
                })
            );
    }

    /**
     * Search Request
     * @param query
     */
    searchRequest(query: string): Observable<Request[]> {
        return this._httpClient
            .get<Request[]>(
                'http://localhost:1616/api/v1/followup/requests/all',
                { params: { query } }
            )
            .pipe(
                tap((requests) => {
                    let requestsFiltered: Request[] = [];
                    // Filter inactive request
                    requestsFiltered = requests.filter(
                        (item) => item.isActive !== 0
                    );

                    // If the query exists...
                    if (query) {
                        // Filter the requests

                        requestsFiltered = requestsFiltered.filter(
                            (request) =>
                                request.titleRequest &&
                                request.titleRequest
                                    .toLowerCase()
                                    .includes(query.toLowerCase())
                        );
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
                    } else {
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

    /**
     *
     * Get Requests
     */
    getRequests(): Observable<Request[]> {
        return this._httpClient
            .get<Request[]>(
                'http://localhost:1616/api/v1/followup/requests/all'
            )
            .pipe(
                tap((requests) => {
                    // Filter inactive request
                    requests = requests.filter((item) => item.isActive !== 0);

                    this.requests = requests;

                    // Emit next value
                    this._requests.next(requests);
                })
            );
    }

    /**
     *
     * Get Clients
     */
    getClients(): Observable<Client[]> {
        return this._httpClient
            .get<Client[]>('http://localhost:1616/api/v1/followup/clients/all')
            .pipe(
                tap((clients) => {
                    clients = clients.filter((item) => item.isActive === 1);
                    this._clients.next(clients);
                })
            );
    }

    /**
     *
     * Get CommercialArea
     *
     */
    getComercArea(): Observable<CommercialArea[]> {
        return this._httpClient
            .get<CommercialArea[]>(
                'http://localhost:1616/api/v1/followup/commercialareas/all'
            )
            .pipe(
                tap((commercialArea) => {
                    commercialArea = commercialArea.filter(
                        (item) => item.isActive === 1
                    );
                    this._commerc.next(commercialArea);
                })
            );
    }

    /**
     *
     * Get RequestPeriod
     */
    getRequestPeriod(): Observable<RequestPeriod[]> {
        return this._httpClient
            .get<RequestPeriod[]>(
                'http://localhost:1616/api/v1/followup/requestPeriod/all'
            )
            .pipe(
                tap((requestPeriod) => {
                    requestPeriod = requestPeriod.filter(
                        (item) => item.isActive === 1
                    );
                    this._requestp.next(requestPeriod);
                })
            );
    }

    /**
     *
     * Get TypeRequest
     */
    getTypeRequest(): Observable<TypeRequest[]> {
        return this._httpClient
            .get<TypeRequest[]>(
                'http://localhost:1616/api/v1/followup/typerequests/all'
            )
            .pipe(
                tap((typeRequest) => {
                    typeRequest = typeRequest.filter(
                        (item) => item.isActive === 1
                    );
                    this._typereq.next(typeRequest);
                })
            );
    }

    /**
     *
     * Get Status
     */
    getStatus(): Observable<Status[]> {
        return this._httpClient
            .get<Status[]>('http://localhost:1616/api/v1/followup/statuses/all')
            .pipe(
                tap((status) => {
                    status = status.filter(
                        (elem) => elem.typeStatus != 'Colaborador'
                    );
                    console.log(status);
                    this._status.next(status);
                })
            );
    }

    /**
     *
     * Get AreaTechical
     */
    getAreaTech(): Observable<TechnicalArea[]> {
        return this._httpClient
            .get<TechnicalArea[]>(
                'http://localhost:1616/api/v1/followup/technicalareas/all'
            )
            .pipe(
                tap((technicalArea) => {
                    technicalArea = technicalArea.filter(
                        (item) => item.isActive === 1
                    );
                    this._areatech.next(technicalArea);
                })
            );
    }

    /**
     * Create product
     */
    createRequest(request: Request): Observable<Request> {
        return this.requests$.pipe(
            take(1),
            switchMap((requests) =>
                this._httpClient
                    .post<Request>(
                        'http://localhost:1616/api/v1/followup/requests/save',
                        request
                    )
                    .pipe(
                        map((newRequest) => {
                            this._requests.next([newRequest, ...requests]);

                            return newRequest;
                        })
                    )
            ),
            tap((requestNew) => {
                // Close focuxPopup
                this._isOpenModal.next(true);
            })
        );
    }

    /**
     * Update product
     *
     * @param id
     * @param request
     */
    updateRequest(id: number, request: Request): Observable<any> {
        return this.requests$.pipe(
            take(1),
            switchMap((requests) =>
                this._httpClient
                    .put<Request>(
                        'http://localhost:1616/api/v1/followup/requests/request/' +
                            id,
                        request
                    )
                    .pipe(
                        map((updatedRequest) => {
                            // Find the index of the updated product
                            const index = requests.findIndex(
                                (item) => item.id === id
                            );

                            // Update the product
                            requests[index] = updatedRequest;

                            // Close focuxPopup
                            this._isOpenModal.next(true);

                            // Update the requests
                            this._requests.next(requests);

                            // // Return the updated product
                            return updatedRequest;
                        }),
                        switchMap((updatedRequest) =>
                            this.request$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Close focuxPopup
                                    this._isOpenModal.next(true);

                                    // Update the product if it's selected
                                    this._request.next(updatedRequest);

                                    // Return the updated product
                                    return updatedRequest;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Delete the product
     *
     * @param id
     * @param request
     */
    deleteRequest(id: number, request: Request): Observable<boolean> {
        return this.requests$.pipe(
            take(1),
            switchMap((requests) =>
                this._httpClient
                    .put(
                        'http://localhost:1616/api/v1/followup/requests/status/' +
                            id,
                        request
                    )
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted product
                            const index = requests.findIndex(
                                (item) => item.id === id
                            );

                            // Delete the product
                            requests.splice(index, 1);

                            // Close focuxPopup
                            this._isOpenModal.next(false);

                            // Update the requests
                            this._requests.next(requests);
                            // Return the deleted status

                            return isDeleted;
                        })
                    )
            )
        );
    }

    /**
     * GetBusinessType
     */
    getBusinessType(): Observable<BusinessType[]> {
        return this._httpClient
            .get<BusinessType[]>(
                'http://localhost:1616/api/v1/followup/businesstype/all/'
            )
            .pipe(
                tap((businessType) => {
                    this._businessType.next(businessType);
                })
            );
    }

    /**
     * GetBusinessType
     */
    getClientsByBusinessType(businessTypesId: number[]): Observable<Client[]> {
        let params = new HttpParams();
        params = params.append('bussinessTypes', businessTypesId.join(','));

        return this._httpClient
            .get<Client[]>(
                'http://localhost:1616/api/v1/followup/clients/bussinesstype',
                {
                    params,
                }
            )
            .pipe(
                tap((clients) => {
                    this._clients.next(clients);
                })
            );
    }

    /**
     * Compare
     *
     * @param a
     * @param b
     * @returns
     */
    private _compare(a: Collaborator, b: Collaborator) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        // Their names are equal
        if (a.lastName < b.lastName) return -1;
        if (a.lastName > b.lastName) return 1;

        return 0;
    }

    getCollaboratorsAssigned(requestId: number): Observable<Collaborator[]> {
        return this._httpClient
            .get<Collaborator[]>(
                'http://localhost:1616/api/v1/followup/requests/assigned/' +
                    requestId
            )
            .pipe(
                map((collaborators) => collaborators.sort(this._compare)),
                tap((collaborators) => {
                    this._collaborators.next(collaborators);
                })
            );
    }

    /**
     *
     * @param data
     * @param options
     * @param modalType
     * @returns
     */
    open(
        data: DialogData,
        options: DialogOptions = {
            width: 800,
            minHeight: 0,
            height: 200,
            disableClose: true,
        },
        modalType: 1 | 2 = 1
    ): Observable<boolean> {
        const dialogRef: MatDialogRef<FocuxPopupComponent> = this.dialog.open<
            FocuxPopupComponent,
            DialogData
        >(FocuxPopupComponent, {
            data,
        });
        return dialogRef.afterClosed();
    }
}
