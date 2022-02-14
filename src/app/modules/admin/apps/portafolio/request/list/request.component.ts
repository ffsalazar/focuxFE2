import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import { InventoryService } from 'app/modules/admin/apps/ecommerce/inventory/inventory.service';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { RequestService } from '../request.service';
import { CommercialArea, Request, Status, Category, RequestPeriod, TypeRequest, TechnicalArea  } from '../request.types';
import { BusinessType, Client } from 'app/modules/admin/dashboards/collaborators/collaborators.types';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector       : 'request-list',
    templateUrl    : './request.component.html',
    styles         : [
        /* language=SCSS */
        `
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `
    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})
export class RequestListComponent implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @ViewChild('horizontalStepper') private _stepper: MatStepper;
    @ViewChild('rowDetailsTemplate') private tplDetail: TemplateRef<any>;
    products$: Observable<InventoryProduct[]>;

    brands: InventoryBrand[];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: FormControl = new FormControl();
    selectedRequest: any | null = null;
    selecteProductForm: FormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    horizontalStepperForm;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    request$: any;
    
    categories: Category[];
    clients: Client[];
    bunch: BusinessType[];
    commerc: CommercialArea[];  
    status: Status[]; 
    requestp: RequestPeriod[];
    typeReq: TypeRequest[];
    techarea: TechnicalArea[]
    myFooList = ['Some Item', 'Item Second', 'Other In Row', 'What to write', 'Blah To Do']
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _inventoryService: InventoryService,
        private _requestService: RequestService,
        public dialog: MatDialog
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the selected product form
        this.selecteProductForm = this._formBuilder.group({
            id               : [''],
            category         : [''],
            name             : ['', [Validators.required]],
            description      : [''],
            tags             : [[]],
            sku              : [''],
            barcode          : [''],
            brand            : [''],
            vendor           : [''],
            stock            : [''],
            reserved         : [''],
            cost             : [''],
            basePrice        : [''],
            taxPercent       : [''],
            price            : [''],
            weight           : [''],
            thumbnail        : [''],
            images           : [[]],
            currentImageIndex: [0], // Image index that is currently being viewed
            active           : [false]
        });
   

        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                //Info solicictud basica y compañia
                id                  : [''],
                titleRequest        : ['', [Validators.required, Validators.minLength(2)]],
                typeRequest         : ['', [Validators.required]],
                descriptionRequest  : [''],
                client              : ['', [Validators.required]],
                commercialArea      : ['', [Validators.required]],
                customerBranch      : ['', [Validators.required]],
                code                : [''],
            }),
            step2: this._formBuilder.group({
                //Planificación de solicitud
                solverGroup         : [''],
                priorityOrder       : [''],
                category            : ['', [Validators.required]],
                dateInit            : [''],
                dateRealEnd         : [''],
                datePlanEnd         : [''],
                isActive            : [''],
                responsibleRequest  : [''],
                dateRequest         : [''],
                status              : [''],
                technicalArea       : [''],
            }),
            step3: this._formBuilder.group({
                //Periodo de pausa
                completionPercentage        : [''],
                deviationPercentage         : [''],
                internalFeedbackIntelix     : [''],
                requestPeriod             : [''],
                dateInitPause               : [''],
                dateEndPause                : [''],
                totalPauseDays              : [''],
            }),
            step4: this._formBuilder.group({
               //Avances y updates de Intelix
                commentsIntelix                 : [''],
                deliverablesCompletedIntelix    : [''],
                pendingActivitiesIntelix        : [''],
                updateDate                      : [''],
                commentsClient                  : [''],
            }),
        });

        // Get the categories
        this._requestService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: Category[]) => {

                // Update the categories
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

             // Get the categories
        this._requestService.requestp$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((requestp: RequestPeriod[]) => {

            // Update the requestp
            this.requestp = requestp;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
        // Get the clients

        this._requestService.clients$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((clients: Client[]) => {

                // Update the client
                this.clients = clients;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._requestService.commerca$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((commerca: CommercialArea[]) => {

                // Update the commerca
                this.commerc = commerca;
                console.log("clients: ", this.clients);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._requestService.status$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((status: Status[]) => {

                // Update the status
                this.status = status;
                console.log("clients: ", this.clients);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        
        this._requestService.typereq$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((typereq: TypeRequest[]) => {

                // Update the client
                this.typeReq = typereq;
                console.log("clients: ", this.typeReq);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        
            this._requestService.areatech$.pipe(takeUntil(this._unsubscribeAll))
            .subscribe((techarea: TechnicalArea[]) => {

                // Update the client
                this.techarea = techarea;
                console.log("clients: ", this.techarea);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        // Get the pagination
        this._inventoryService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: InventoryPagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        
        // Get the request
        this.request$ = this._requestService.requests$;
        
        this._requestService.getRequests().subscribe(response => {
            console.log(response);
        });

        // Get the tags
        this._inventoryService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: InventoryTag[]) => {

                // Update the tags
                this.tags = tags;
                this.filteredTags = tags;
                console.log("tags", tags)
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProducts(0, 10, 'name', 'asc', query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe();
            
        this.handleChangeClients();
        
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        if ( this._sort && this._paginator )
        {
            // Set the initial sort
            this._sort.sort({
                id          : 'name',
                start       : 'asc',
                disableClear: true
            });

            // Mark for check
            this._changeDetectorRef.markForCheck();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details
                    this.closeDetails();
                });

            // Get products if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.closeDetails();
                    this.isLoading = true;
                    return this._inventoryService.getProducts(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for step1
     */
     get step1 () {
        return this.horizontalStepperForm.get('step1');
    }

    /**
     * Getter for step2
     */
    get step2 () {
        return this.horizontalStepperForm.get('step2');
    }

    /**
     * Getter for step3
     */
    get step3 () {
        return this.horizontalStepperForm.get('step3');
    }

    /**
     * Getter for step4
     */
    get step4 () {
        return this.horizontalStepperForm.get('step4');
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle request details
     *
     * @param requestId
     */
    toggleDetails(requestId: number): void
    {
        // If the request is already selected...
        if ( this.selectedRequest && this.selectedRequest.id === requestId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the request by id
        this._requestService.getRequestById( requestId )
            .subscribe((request) => {

                // Set the selected product
                this.selectedRequest = request;
                
                this.fillWizzardForm(request);
              
            });

            this.horizontalStepperForm.get('step1').valueChanges.subscribe((res) => {
                console.log("res: ", res);
                console.log(this.horizontalStepperForm);
            });
    }

    /**
     * Fill Wizzard form
     * @param request
     */

    fillWizzardForm(request: Request) {
    
        // Fill the formGroup step1
        this.step1.patchValue(request);
        this.step1.get('client').setValue(request.client.id);
        this.step1.get('commercialArea').setValue(request.commercialArea.id);
        this.step1.get('typeRequest').setValue(request.typeRequest.id);
        this.step1.get('customerBranch').setValue(request.client?.businessType.name);

        // Fill the formGroup step2
        this.step2.patchValue(request);
        this.step2.get('dateRequest').setValue(request.dateRequest);
        this.step2.get('technicalArea').setValue(request.technicalArea.id);
        this.step2.get('status').setValue(request.status.id);
        this.step2.get('category').setValue(request.category.id);
        this.step2.get('solverGroup').setValue(request.solverGroup.name + ' ' + request.solverGroup.lastName);
        // Fill the formGroup step3
        this.step3.patchValue(request);
        this.step3.get('requestPeriod').setValue(request.requestPeriod.id);
        
        // Fill the formGroup step4
        this.step4.patchValue(request);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Handle control client
     */
    handleChangeClients() {

        this.step1.get('client').valueChanges.subscribe(clientId => {
            const client = this.clients.find(client => client.id === clientId);
            this.step1.get('customerBranch').setValue(client?.businessType.name);
        });
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedRequest = null;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
    }

    /**
     * Create product
     */
    createRequest(): void
    {
        // Create the product
        this._requestService.createRequest().subscribe((newProduct) => {

            // Go to new product
            this.selectedRequest = newProduct;
            console.log("newRequest: ", newProduct);
            this.step1.get('id').setValue(newProduct.id);
            this.step2.get('isActive').setValue(newProduct.isActive);

            // Fill the form
            //this.fillWizzardForm(this.selectedRequest);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected product using the form data
     */
    updateSelectedRequest(): void
    {
        // Get the product object
        const product = this.selecteProductForm.getRawValue();

        // Remove the currentImageIndex field
        delete product.currentImageIndex;

        // Update the product on the server
        this._inventoryService.updateProduct(product.id, product).subscribe(() => {

            // Show a success message
            this.showFlashMessage('success');
        });
    }

    /**
     * Delete the selected product using the form data
     */
    deleteSelectedRequest(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Eliminar solicitud',
            message: '¿Seguro que quiere eliminar la solicitud?',
            actions: {
                confirm: {
                    label: 'Eliminar solicitud',
          
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                // Clear the Wizzard
                this._stepper.reset();

                // Get the request object
                const request = this.selecteProductForm.getRawValue();
                
                this.selectedRequest.isActive = 0;
                // Delete the request on the server
                this._requestService.deleteRequest(this.selectedRequest.id, this.selectedRequest).subscribe(() => {
                    // Close the details
                    this.closeDetails();
                });
            }
        });
    }

    confirmSaveRequest(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Guardar solicitud',
            message: '¿Seguro que desea guardar la solicitud?',
            icon: {
                show: true,
                name: "heroicons_outline:check",
                color: "primary"
              },
            actions: {
                confirm: {
                    label: 'Guardar solicitud',
                    color: 'primary'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                this.step1.removeControl('customerBranch');

                const wizzard = this.horizontalStepperForm.getRawValue();

                this.step1.setControl('customerBranch', new FormControl());

                let requestNew = {...wizzard.step1, ...wizzard.step2, ...wizzard.step3, ...wizzard.step4};

                requestNew.client = this.clients.find(item => item.id === requestNew.client);
                requestNew.typeRequest = this.typeReq.find(item => item.id === requestNew.typeRequest);
                requestNew.commercialArea = this.commerc.find(item => item.id === requestNew.commercialArea);
                requestNew.category = this.categories.find(item => item.id === requestNew.category);
                requestNew.status = this.status.find(item => item.id === requestNew.status);
                requestNew.requestPeriod = this.requestp.find(item => item.id === requestNew.requestPeriod);
                requestNew.solverGroup = {id: 1};
          
                requestNew.responsibleRequest = {
                    "id": 1
                };

                requestNew.technicalArea = {
                    "id": 1
                };

                // requestNew.dateEndPause = "2022-02-08T04:00:00.000+00:00";
                // requestNew.dateInitPause = "2022-02-08T04:00:00.000+00:00";
                // requestNew.dateRequest = "2022-02-08T04:00:00.000+00:00";
                // requestNew.dateInit = "2022-02-08T04:00:00.000+00:00";
                // requestNew.dateRealEnd = "2022-02-08T04:00:00.000+00:00";
                // requestNew.updateDate = "2022-02-08T04:00:00.000+00:00";
                // requestNew.datePlanEnd = "2022-02-08T04:00:00.000+00:00";

                console.log("requestNew: ", requestNew);

                // Update the request on the server
                this._requestService.updateRequest(requestNew.id, requestNew).subscribe((request) => {
                    // Clear Wizzard
                    this._stepper.reset();
                    this.showFlashMessage('success');

                    // Close the details
                    this.closeDetails();
                });
        
            }
        });
    }

    /**
     * Show flash message
     */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {

            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

    openCompDialog(id: number): void {
        this.toggleDetails(id)
        const myCompDialog = this.dialog.open(this.tplDetail, { data: this.myFooList });
        myCompDialog.afterClosed().subscribe((res) => {
          // Data back from dialog
          console.log({ res });
        });
      }

      closeDialog() { 
          
       }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
