import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil, startWith, tap } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import { InventoryService } from 'app/modules/admin/apps/ecommerce/inventory/inventory.service';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { RequestService } from '../request.service';
import { CommercialArea, Request, Status, Category, RequestPeriod, TypeRequest, TechnicalArea, BusinessType, Collaborator } from '../request.types';
import { Client, Knowledge } from 'app/modules/admin/dashboards/collaborators/collaborators.types';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { MatTableDataSource } from '@angular/material/table';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
    selector       : 'request-list',
    templateUrl    : './request.component.html',
    styles         : [
        /* language=SCSS */
        `
            th, td{
                text-align: center !important;
            }
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
    @ViewChild('knowledgesPanelOrigin') private _knowledgesPanelOrigin: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _knowledgesPanelOverlayRef: OverlayRef;

    filteredKnowledges: any[] = [];
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

    requestOriginal: Request[] = [];
    showListRequest = true;
    dataSource = new MatTableDataSource<Request[]>();
    knowledgesEditMode: boolean = false;
    categories: Category[];
    clients: Client[];
    bunch: BusinessType[];
    commercialArea: CommercialArea[];
    status: Status[];
    requestp: RequestPeriod[];
    typeRequest: TypeRequest[];
    technicalArea: TechnicalArea[];
    businessType: BusinessType[];
    knowledges: Knowledge[];
    collaborators: Collaborator[];
    isEditing: boolean = false;
    isDetail: boolean = false;
    alert: boolean = false;
    successSave: String = "";
    // dataSource: Request[]
    displayedColumns: string[] = ['id', 'ramo','code', 'client', 'titleRequest',
    'responsibleRequest', 'priorityOrder', 'status', 'completionPercentage', 'dateRealEnd', 'deviationPercentage','dateEndPause', 'Detalle' ];

    // Form Controls
    filterGroupForm: FormGroup;

    // Observables
    filteredClients: Observable<string[]>;
    filteredCommercialArea: Observable<string[]>;
    filteredStatus: Observable<string[]>;
    filteredCustomerBranch: Observable<string[]>;
    knowledgeControl: FormControl = new FormControl();
    request$: any;
    priority: any[] = [{
        id: 1,
        description: 'Alta',
    }, {
        id: 2,
        description: 'Media',
    },
    {
        id: 3,
        description: 'Baja',
    }];

    /*
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _inventoryService: InventoryService,
        private _requestService: RequestService,
        public dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _renderer2: Renderer2
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
        this.request$ = this._requestService.requests$;

        this._requestService.requests$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((requests: any) => {
                this.dataSource.data = requests;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        // Create the selected request form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                //Info solicictud basica y compañia
                id                  : [''],
                titleRequest        : ['', [Validators.required, Validators.minLength(2)]],
                typeRequest         : ['', [Validators.required]],
                descriptionRequest  : ['', [Validators.required, Validators.minLength(2)]],
                client              : ['', [Validators.required]],
                commercialArea      : ['', [Validators.required]],
                customerBranch      : ['', [Validators.required]],
                code                : ['', [Validators.required]],
            }),
            step2: this._formBuilder.group({
                //Planificación de solicitud
                solverGroup         : ['', [Validators.required]],
                priorityOrder       : ['', [Validators.required]],
                category            : ['', [Validators.required]],
                dateInit            : ['', [Validators.required]],
                dateRealEnd         : ['', [Validators.required]],
                datePlanEnd         : ['', [Validators.required]],
                isActive            : ['1', [Validators.required]],
                responsibleRequest  : ['', [Validators.required]],
                dateRequest         : ['', [Validators.required]],
                status              : [''],
                technicalArea       : ['', [Validators.required]],
                knowledges     : [[]],
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

        // Create the fiterGroupForm
        this.filterGroupForm = this._formBuilder.group({
            clientControl           : [],
            commercialAreaControl   : [],
            statusControl           : [],
            customerBranchControl   : [],
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


             // Get the requests
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
                console.table(this.clients);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the Commercial Area
        this._requestService.commerca$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((commercialArea: CommercialArea[]) => {
                // Update the commercialArea
                this.commercialArea = commercialArea;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the Status
        this._requestService.status$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((status: Status[]) => {
                // Update the status
                this.status = status;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the TypeRequest
        this._requestService.typereq$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((typeRequest: TypeRequest[]) => {

                // Update the typeRequest
                this.typeRequest = typeRequest;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._requestService.areatech$.pipe(takeUntil(this._unsubscribeAll))
            .subscribe((technicalArea: TechnicalArea[]) => {

                // Update the technicalArea
                this.technicalArea = technicalArea;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._requestService.businessType$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((businessType: BusinessType[]) => {
                // Update the buninessType
                this.businessType = businessType;
                //Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._requestService.collaborators$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((collaborators: Collaborator[]) => {
                // Update the collaborators
                this.collaborators = collaborators;
                //Mark for check
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

        // Get the requests
        this.request$ = this._requestService.requests$;

        // Get the requests
        this._requestService.getRequests().subscribe(response => {
            // Filter inactive request
            this.requestOriginal = response.filter(item => item.isActive !== 0);
            console.log(this.requestOriginal);

        });

        // Get the tags
        this._inventoryService.tags$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tags: InventoryTag[]) => {

                // Update the tags
                this.tags = tags;
                this.filteredTags = tags;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query =>

                    // Search
                    this._requestService.searchRequest(query)
                ),
            )
            .subscribe();

        this.handleChangeClients();

        // Filter the clients
        this.filteredClients = this.clientControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value, this.clients)),
        );

        // Filter the commercialArea
        this.filteredCommercialArea = this.commercialAreaControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value, this.commercialArea)),
        );

        // Filter the status
        this.filteredStatus = this.statusControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value, this.status)),
        );

        // Filter the status
        this.filteredCustomerBranch = this.customerBranchControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value, this.businessType)),
        );

        this._handleChangeForm();
        this._getKnowledges();

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

    /**
     * Getter for clientControl
     */
    get clientControl() {
        return this.filterGroupForm.get('clientControl');
    }

    /**
     * Getter for clientControl
     */
    get commercialAreaControl() {
        return this.filterGroupForm.get('commercialAreaControl');
    }

    /**
     * Getter for statusCotrol
     */
    get statusControl() {
        return this.filterGroupForm.get('statusControl');
    }

    /**
     * Getter for customerBranchControl
     */
    get customerBranchControl() {
        return this.filterGroupForm.get('customerBranchControl');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open knowledges panel
     */
    openKnowledgesPanel(): void
    {
        // Create the overlay
        this._knowledgesPanelOverlayRef = this._overlay.create({
             backdropClass   : '',
             hasBackdrop     : true,
             scrollStrategy  : this._overlay.scrollStrategies.block(),
             positionStrategy: this._overlay.position()
                 .flexibleConnectedTo(this._knowledgesPanelOrigin.nativeElement)
                 .withFlexibleDimensions(true)
                 .withViewportMargin(64)
                 .withLockedPosition(true)
                 .withPositions([
                     {
                         originX : 'start',
                         originY : 'bottom',
                         overlayX: 'start',
                         overlayY: 'top'
                     }
                 ])
        });

         // Subscribe to the attachments observable
        this._knowledgesPanelOverlayRef.attachments().subscribe(() => {

            // Add a class to the origin
            this._renderer2.addClass(this._knowledgesPanelOrigin.nativeElement, 'panel-opened');

            // Focus to the search input once the overlay has been attached
            this._knowledgesPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

         // Create a portal from the template
         const templatePortal = new TemplatePortal(this._knowledgesPanel, this._viewContainerRef);

         // Attach the portal to the overlay
         this._knowledgesPanelOverlayRef.attach(templatePortal);

         // Subscribe to the backdrop click
         this._knowledgesPanelOverlayRef.backdropClick().subscribe(() => {

             // Remove the class from the origin
             this._renderer2.removeClass(this._knowledgesPanelOrigin.nativeElement, 'panel-opened');

             // If overlay exists and attached...
             if ( this._knowledgesPanelOverlayRef && this._knowledgesPanelOverlayRef.hasAttached() )
             {
                 // Detach it
                 this._knowledgesPanelOverlayRef.detach();

                 // Reset the knowledge filter


                 // Toggle the edit mode off
                 this.knowledgesEditMode = false;
             }

             // If template portal exists and attached...
             if ( templatePortal && templatePortal.isAttached )
             {
                 // Detach it
                 templatePortal.detach();
             }
         });
    }

    /**
     * Filter knowledges input key down event
     *
     * @param event
     */
    filterKnowledgesInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

         // If there is no knowledge available...
        if ( this.filteredKnowledges.length === 0 )
        {
            /*  TODO: this operation is not supported yet. jpelay  24/01*/
             // // Create the knowledge
             // this.createKnowledge(event.target.value);

             // // Clear the input
             // event.target.value = '';

             // // Return
            return;
        }

        //  // If there is a knowledge...
        //  const Knowledge = this.filteredKnowledges[0];
        //  const isKnowledgeApplied = this.collaborator.knowledges.find(knowledge => knowledge.knowledge.id === Knowledge.id);

        //  // If the found knowledge is already applied to the collaborator...
        //  if ( isKnowledgeApplied )
        //  {
        //      // Remove the knowledge from the collaborator
        //      this.removeKnowledgeFromCollaborator(null);
        //  }
        //  else
        //  {
        //      // Otherwise add the knowledge to the collaborator
        //      this.addKnowledgeToCollaborator(null);
        //  }

    }

    /**
     * Filter knowledges
     *
     * @param event
     */
    filterKnowledges(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the knowledges
        //this.filteredKnowledges = this.knowledges.filter(knowledge => knowledge.name.toLowerCase().includes(value));
    }

    /**
     * Handle Change Form
     *
     */
    private _handleChangeForm() {
        // Subscribe from form's values
        this.filterGroupForm.valueChanges.subscribe(controls => {
            let requests: Request[] = this._requestService.requests;

            // Filter requests by clients, commercialArea and status
            requests = requests.filter(item =>
                ((controls.clientControl === null || (controls.clientControl.toLowerCase() === '' || item?.client.name.toLowerCase().includes(controls.clientControl.toLowerCase()) )) &&
                    (controls.commercialAreaControl === null || ( controls.commercialAreaControl.toLowerCase() === '' || item?.commercialArea.name.toLowerCase().includes( controls.commercialAreaControl.toLowerCase()))) &&
                        (controls.statusControl === null || ( controls.statusControl.toLowerCase() === '' || item?.status.name.toLowerCase().includes( controls.statusControl.toLowerCase()))) &&
                            (controls.customerBranchControl === null || ( controls.customerBranchControl.toLowerCase() === '' || item?.client?.businessType.name.toLowerCase().includes( controls.customerBranchControl.toLowerCase())))

            ));

            // Set request for filter
            this.requestOriginal = requests;

            // Set the requests
            this._requestService.setRequests(requests);

            this._changeDetectorRef.markForCheck();

        });
    }

    /**
     * _filter
     * @param value
     *
     */
    private _filter(value: string, collection: any[]): string[] {
        const filteredValue = value.toLowerCase();

        const filteredCollection = collection.map(option => option.name);

        return filteredCollection.filter(option => option.toLowerCase().includes(filteredValue));
    }

    /**
     * Get Knowledges
     *
     */
    private _getKnowledges() {
        // Get the knowledges
        this._requestService.getKnowledges()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((knowledges: Knowledge[]) => {
                this.knowledges = knowledges;
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * checkerKnowledges
     *
     * @param knowledge
     */
    checkerKnowledges(knowledge: Knowledge): boolean {
        let hasKnowledge = this.selectedRequest.knowledges.find(selectedKnowledge => selectedKnowledge.knowledge.id === knowledge.id && selectedKnowledge.isActive);
        return hasKnowledge !== undefined;
    };

    /**
     * Add knowledge to the collaborator
     *
     * @param knowledge
     */
    addKnowledgeToCollaborator(knowledge: Knowledge): void
    {
         // TODO: we need to add logic for levels here
        let newKnowledge: any = {
            knowledge: knowledge,
            isActive: 1
        }

         // Add the knowledge
         this.selectedRequest.knowledges.unshift(newKnowledge);

         // Update the collaborator form
         this.step2.get('knowledges').patchValue(this.selectedRequest.knowledges);

         // Mark for check
         this._changeDetectorRef.detectChanges();
    }

    /**
     * Remove knowledge from the collaborator
     *
     * @param knowledge
     */
     removeKnowledgeFromCollaborator(knowledge: any): void
     {
        // Remove the knowledge
         knowledge.isActive = 0;
        ///const knowledgeIndex = this.selectedRequest.knowledges.find(item => item.knowledge.id === knowledge.knowledge.id);
        //this.selectedRequest.knowledges[knowledgeIndex].isActive = 0;

         // Mark for check
         this._changeDetectorRef.markForCheck();
     }

     /**
      * Active collaborator the knowledge
      *
      * @param knowledge
      */
     activeCollaboratorKnowledge(knowledge: any) {
        knowledge.isActive = 1;

        const knowledgeIndex = this.selectedRequest.knowledges.find(item => item.knowledge.id === knowledge.knowledge.id);
        this.selectedRequest.knowledges[knowledgeIndex - 1].isActive = 1;

        // Mark for check
        this._changeDetectorRef.detectChanges();
    }

    /**
     * Toggle collaborator knowledge
     *
     * @param knowledge
     */
    toggleCollaboratorKnowledge(knowledge: Knowledge): void
    {
        let knowledgeFound = this.selectedRequest.knowledges.find(selectedKnowledge => selectedKnowledge.knowledge.id == knowledge.id);

        if (knowledgeFound) {
            if (knowledgeFound.isActive) this.removeKnowledgeFromCollaborator(knowledgeFound);
            else  this.activeCollaboratorKnowledge(knowledgeFound);
        }
        else
        {
            this.addKnowledgeToCollaborator(knowledge);
        }
    }

    /**
     * getAmountRequestByOption
     * @param name
     * @param filterOption
     *
     */
    getAmountRequestByOption(name: string, filterOption: number) {
        switch (filterOption) {
            case 1:
                return this.requestOriginal.filter(item => item?.client.name === name).length;
                break;
            case 2:
                return this.requestOriginal.filter(item => item?.commercialArea.name === name).length;
                break;
            case 3:
                return this.requestOriginal.filter(item => item?.status.name === name).length;
                break;
            case 4:
                return this.requestOriginal.filter(item => item?.client.businessType.name === name).length;
                break;

            default:
                break;
        }
    }

    /**
     * showDetail
     * @param requestId
     *
     */
    showDetail(id: number) {
        this.isDetail = true;
        this.openPopup(id);
    }

    /**
     * Toggle request details
     *
     * @param requestId
     */
    fillDataFormWizzard(requestId: number): void
    {
        // Get the request by id
        this._requestService.getRequestById( requestId )
            .subscribe((request) => {
                // Set the selected product
                this.selectedRequest = request;
                this.filterKnowledges = request.knowledges;
                this.setRequestForm(request);
            });
    }

    /**
     * Disable steps controls
     */
    disableSteps() {
        Object.keys(this.step1.controls).forEach(key => {
            this.step1.controls[key].disable();
        });
    }

    /**
     * Fill Wizzard form
     * @param request
     */
    setRequestForm(request: Request) {
        // Fill the formGroup step1
        this.step1.patchValue(request);
        this.step1.get('client').setValue(request.client.id);
        this.step1.get('commercialArea').setValue(request.commercialArea.id);
        this.step1.get('typeRequest').setValue(request.typeRequest.id);
        this.step1.get('customerBranch').setValue(request.client?.businessType.name);

        // Fill the formGroup step2
        this.step2.patchValue(request);
        this.step2.get('responsibleRequest').setValue(request.responsibleRequest.id);
        this.step2.get('dateRequest').setValue(request.dateRequest);
        this.step2.get('technicalArea').setValue(request.technicalArea.id);
        this.step2.get('status').setValue(request.status.id);
        this.step2.get('category').setValue(request.category.id);
        this.step2.get('solverGroup').setValue(request.solverGroup.id);

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
        this.isDetail = false;
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
     * Create request
     */
    createRequest(): void
    {
        // Create the request
        this._requestService.createRequest()
            .subscribe((newRequest) => {

                // Go to new request
                this.selectedRequest = newRequest;
                this.selectedRequest.knowledges = [];
                // Set controls id and isActive
                this.step1.get('id').setValue(newRequest.id);
                this.step1.get('titleRequest').setValue(newRequest.titleRequest);
                this.step2.get('isActive').setValue(newRequest.isActive);

                // Open focuxPopup
                this.openPopup(newRequest.id);

                // Fill the form
                //this.setRequestForm(this.selectedRequest);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Update the selected request using the form data
     * @param requestId
     */
    updateSelectedRequest(requestId: number) {
        this.isEditing = true;
        this.openPopup(requestId);
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

                this.selectedRequest.isActive = 0;
                // Delete the request on the server
                this._requestService.deleteRequest(this.selectedRequest.id, this.selectedRequest).subscribe(() => {
                    // Close the details
                    this.closeDetails();
                    this.successSave = 'La solicitud ha sido eliminada con éxito!'
                    this._fuseAlertService.show('alertBox4');

                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }

    /**
     *
     * @param name
     */
    dismissFuse(name){
       this._fuseAlertService.dismiss(name);
    }


    /**
     * Confirm Save Request
     *
     */
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
                requestNew.typeRequest = this.typeRequest.find(item => item.id === requestNew.typeRequest);
                requestNew.commercialArea = this.commercialArea.find(item => item.id === requestNew.commercialArea);
                requestNew.category = this.categories.find(item => item.id === requestNew.category);
                requestNew.status = this.status.find(item => item.id === requestNew.status);
                requestNew.requestPeriod = this.requestp.find(item => item.id === requestNew.requestPeriod);
                requestNew.knowledges = this.selectedRequest.knowledges;
                requestNew.responsibleRequest = this.collaborators.find(item => item.id === requestNew.responsibleRequest);
                //requestNew.solverGroup = this.collaborators.find(item => item.id === requestNew.responsibleRequest);
                //requestNew.technicalArea = this.technicalArea.find(item => item.id === requestNew.technicalArea);
                // requestNew.responsibleRequest = {
                //     id: 1
                // };

                console.log("resolver: ", requestNew);
                requestNew.solverGroup = {
                    id: 1,
                }

                requestNew.technicalArea = {
                    id: 1
                };

                // Update the request on the server
                this._requestService.updateRequest(requestNew.id, requestNew)
                    .subscribe((request) => {
                        // Clear Wizzard
                        this._stepper.reset();
                        // Show notification update request
                        this.showFlashMessage('success');
                        this._fuseAlertService.show('alertBox4');
                        this.successSave = 'Solicitud actualizada con éxito!'
                        // Close the details
                        this.closeDetails();
                    });

            }
        });
    }

    /**
     * Show Flash Message
     *
     * @param type
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


    /**
     * openPopup
     *
     * @param id
     */
    openPopup(id: number): void  {

        if ( this.isDetail || this.isEditing ) {
            this.fillDataFormWizzard(id);
        }

        this._requestService.open({
            template: this.tplDetail, title: this.isDetail ? 'detail' : 'edit',
          },
          {width: 680, height: 1880, disableClose: true, panelClass: 'summary-panel'}).subscribe(confirm => {
            if ( confirm ) {

                if ( this.isEditing ) this.isEditing = false;

                if ( this.isDetail ) this.isDetail = false;

                this.selectedRequest = null;

                this._changeDetectorRef.markForCheck();
            }
        });
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
