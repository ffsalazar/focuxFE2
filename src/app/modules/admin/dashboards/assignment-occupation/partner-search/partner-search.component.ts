import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Activity, Collaborator, Project} from "../assignment-occupation.types";
import {AssingmentOccupationService} from "../assingment-occupation.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject} from "rxjs";
import {debounceTime, map, startWith, switchMap, takeUntil} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";
import {
    InventoryBrand,
    InventoryCategory,
    InventoryPagination, InventoryProduct,
    InventoryTag, InventoryVendor
} from "../../../apps/ecommerce/inventory/inventory.types";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {InventoryService} from "../../../apps/ecommerce/inventory/inventory.service";
import {FuseConfirmationService} from "../../../../../../@fuse/services/confirmation";
import {Router} from "@angular/router";

@Component({
  selector: 'app-partner-search',
  templateUrl: './partner-search.component.html',
  styleUrls: ['./partner-search.component.scss']
})
export class PartnerSearchComponent implements OnInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    myControlTest = new FormControl();

    products$: Observable<InventoryProduct[]>;

    collaborators: Collaborator[] = [];
    activity: Activity[] = [];

    brands: InventoryBrand[];
    categories: InventoryCategory[];
    filteredTags: InventoryTag[];
    isLoading: boolean = false;
    pagination: InventoryPagination;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: InventoryProduct | null = null;
    selectedProductForm: FormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
    vendors: InventoryVendor[];
    filteredOptions: Observable<any[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    project: Project = undefined;

  constructor(
      private _assignmentOccupationService: AssingmentOccupationService,
      private _changeDetectorRef: ChangeDetectorRef,
      private _inventoryService: InventoryService,
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: FormBuilder,
      private _router: Router
  ) { }

  ngOnInit(): void {
      this.getProject();
      this.getActivitys();
      this.getAllCollaborators();
      this.filterEvent();


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


  filterEvent() {
      this.filteredOptions = this.myControlTest.valueChanges
          .pipe(
              startWith(''),
              map(value => (typeof value === 'string' ? value : value.name)),
              map(name => (name ? this._filter(name) : this.collaborators.slice()))
          )
  }


    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.collaborators.filter(option => option.name.toLowerCase().includes(filterValue));
    }

  getAllCollaborators(){
      this._assignmentOccupationService.getCollaboratorsJson();
  }

  getProject() {
      this.project  = {
          id: 150,
          name: 'Originacion',
          description: 'Aplicacion realizada como api rest con Angular8+ y Spring boot',
          endDate: '2022-02-05',
          initDate: '2022-10-25',
          skills: 'Angular-SpringBoot',
          client: {
              id: 4,
              name: 'Credix',
              description: 'Entidad financiera ubicada en Costa Rica'
          },
          collaborators: this.collaborators
      };
  }

  getActivitys() {
      this.activity = this._assignmentOccupationService.activitys;
  }

    displayFn(data): string {
        return data && data.name ? data.name : '';
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


    assignActivity(collaborator) {
        this._router.navigate(['']).then();
    }

    /**
     * Toggle product details
     *
     * @param productId
     */
    toggleDetails(productId: string): void
    {
        // If the product is already selected...
        if ( this.selectedProduct && this.selectedProduct.id === productId )
        {
            // Close the details
            this.closeDetails();
            return;
        }

        // Get the product by id
        this._inventoryService.getProductById(productId)
            .subscribe((product) => {

                // Set the selected product
                this.selectedProduct = product;

                // Fill the form
                this.selectedProductForm.patchValue(product);

                // Mark for check
                this._changeDetectorRef.markForCheck();
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
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
