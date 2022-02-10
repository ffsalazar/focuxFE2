import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { Request } from '../request.types';


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

    products$: Observable<InventoryProduct[]>;

    brands: InventoryBrand[];
    categories: InventoryCategory[];
    filteredTags: InventoryTag[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    selectedProductForm: FormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    horizontalStepperForm;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    request$: any;
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _inventoryService: InventoryService,
        private _requestService: RequestService,
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
        this.selectedProductForm = this._formBuilder.group({
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
                titleRequest        : ['', [Validators.required]],
                typeRequest         : ['', [Validators.required]],
                descriptionRequest  : [''],//Descripción solicitud
                company             : ['', [Validators.required]],
                areaComercial       : ['', [Validators.required]],
                customerBranch      : [''],//Ramo cliente
            }),
            step2: this._formBuilder.group({
                //Detalle de solicitud
                solverGroup         : [''],//Grupo solucionador
                priorityOrder       : [''], //Prioridad solicitud 
                category            : ['', [Validators.required]],
                dateInit            : [''],//Fecha de inicio
                dateRealEnd         : [''],//Fecha culminacion
                datePlanEnd         : [''],//Fecha compromiso 
                isActive            : [''],//Solciitud activa
                responsibleRequest  : [''],//Responsable solicitud
                dateRequest         : [''],//Fecha de creacion solcitud
                status              : [''],// Status solicitud id
                technicalArea       : [''],//Area tecnica
            }),
            step3: this._formBuilder.group({
                //Periodo de pausa
                completionPercentage        : [''],//Porcentaje completado
                deviationPercentage         : [''], // Procentaje desviación
                internalFeedbackIntelix     : [''],//Feedback interno intelix
                idRequestPeriod             : [''],//Periodo de solicitud
                dateInitPause               : [''],//Fecha inicial de pausa
                dateEndPause                : [''],//Fecha fin pausa
                totalPauseDays              : [''], //Total días de pausa
            }),
            step4: this._formBuilder.group({
               //Avances y updates de Intelix
                commentsIntelix                 : [''], //Comentarios Intellix
                deliverablesCompletedIntelix    : [''], //Actividades completadas
                pendingActivitiesIntelix        : [''],//Actividades pendientes de intellix
                updateDate                      : [''],//Fecha de actualización
                commentsClient                  : [''],//Comentarios del cliente
            }),
        });

        // Get the brands
        this._inventoryService.brands$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((brands: InventoryBrand[]) => {

                // Update the brands
                this.brands = brands;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the categories
        this._inventoryService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: InventoryCategory[]) => {

                // Update the categories
                this.categories = categories;

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

        // Get the products
        this.products$ = this._inventoryService.products$;
        
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

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the vendors
        this._inventoryService.vendors$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((vendors: InventoryVendor[]) => {

                // Update the vendors
                this.vendors = vendors;

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
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle product details
     *
     * @param productId
     */
    toggleDetails(requestId: number): void
    {
        // If the product is already selected...
        if ( this.selectedProduct && this.selectedProduct.id === requestId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the product by id
        this._requestService.getRequestById( requestId )
            .subscribe((request) => {

                console.log("toggleDetails");
                // Set the selected product
                this.selectedProduct = request;

                // Fill the form
                // this.selectedProductForm.patchValue(product);

                // // Mark for check
                // this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Close the details
     */
    closeDetails(): void
    {
        this.selectedProduct = null;
    }

    /**
     * Cycle through images of selected product
     */
    cycleImages(forward: boolean = true): void
    {
        // Get the image count and current image index
        const count = this.selectedProductForm.get('images').value.length;
        const currentIndex = this.selectedProductForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if ( forward )
        {
            this.selectedProductForm.get('currentImageIndex').setValue(nextIndex);
        }
        // If cycling backwards...
        else
        {
            this.selectedProductForm.get('currentImageIndex').setValue(prevIndex);
        }
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
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
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

        // If there is no tag available...
        if ( this.filteredTags.length === 0 )
        {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.selectedProduct.tags.find(id => id === tag.id);

        // If the found tag is already applied to the product...
        if ( isTagApplied )
        {
            // Remove the tag from the product
            this.removeTagFromProduct(tag);
        }
        else
        {
            // Otherwise add the tag to the product
            this.addTagToProduct(tag);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void
    {
        const tag = {
            title
        };

        // Create tag on the server
        this._inventoryService.createTag(tag)
            .subscribe((response) => {

                // Add the tag to the product
                this.addTagToProduct(response);
            });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: InventoryTag, event): void
    {
        // Update the title on the tag
        tag.title = event.target.value;

        // Update the tag on the server
        this._inventoryService.updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: InventoryTag): void
    {
        // Delete the tag from the server
        this._inventoryService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the product
     *
     * @param tag
     */
    addTagToProduct(tag: InventoryTag): void
    {
        // Add the tag
        this.selectedProduct.tags.unshift(tag.id);

        // Update the selected product form
        this.selectedProductForm.get('tags').patchValue(this.selectedProduct.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the product
     *
     * @param tag
     */
    removeTagFromProduct(tag: InventoryTag): void
    {
        // Remove the tag
        this.selectedProduct.tags.splice(this.selectedProduct.tags.findIndex(item => item === tag.id), 1);

        // Update the selected product form
        this.selectedProductForm.get('tags').patchValue(this.selectedProduct.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle product tag
     *
     * @param tag
     * @param change
     */
    toggleProductTag(tag: InventoryTag, change: MatCheckboxChange): void
    {
        if ( change.checked )
        {
            this.addTagToProduct(tag);
        }
        else
        {
            this.removeTagFromProduct(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean
    {
        return !!!(inputValue === '' || this.tags.findIndex(tag => tag.title.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

    /**
     * Create product
     */
    createProduct(): void
    {
        // Create the product
        this._requestService.createRequest().subscribe((newProduct) => {

            // Go to new product
            this.selectedProduct = newProduct;

            // Fill the form
            //this.selectedProductForm.patchValue(newProduct);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * Update the selected product using the form data
     */
    updateSelectedProduct(): void
    {
        // Get the product object
        const product = this.selectedProductForm.getRawValue();

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
    deleteSelectedProduct(): void
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

                // Get the product object
                const product = this.selectedProductForm.getRawValue();

                // Delete the product on the server

                let newRequest: any = {
                    "id": 5,
                    "client": {
                      "id": 1
                    },
                    "commercialArea": {
                      "id": 1
                    },
                    "typeRequest": {
                      "id": 1
                    },
                    "titleRequest": "PRUEBA DESDE JSONDOC CON CAMBIOS",
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
                  };
                this._requestService.deleteRequest(this.selectedProduct.id, this.selectedProduct).subscribe(() => {

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
                // Clear the Wizzard
                this._stepper.reset();

                // Get the product object
                const product = this.selectedProductForm.getRawValue();

                // Delete the product on the server
                this._inventoryService.deleteProduct(product.id).subscribe(() => {

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
