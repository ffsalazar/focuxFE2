
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import {AssingmentOccupationService} from "../assingment-occupation.service";
import { Client, Collaborator } from '../assignment-occupation.types';
import {FormArray} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {finalize, map, startWith, takeUntil} from "rxjs/operators";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
//import { collaborators } from 'app/mock-api/dashboards/collaborators/data';
import { MatTabGroup } from '@angular/material/tabs';
import { collaborators } from 'app/mock-api/dashboards/collaborators/data';


@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.scss']
})
export class EditAssignmentComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    collaborators: Collaborator[] = [];
    clients: Client[] = [];
    filteredOptions: Observable<string[]>;
    filteredClients: Observable<string[]>;
    filteredCollaborators: Observable<string[]>;
    displayedColumns: string[] = ['cliente', 'recurso', '%', 'fechaFinal', 'dias', 'ocupacion', 'detalle'];
    isEditing: boolean = false;
    collaborator: Collaborator = null;
    assigments: any = null;
    filterForm: FormGroup = this._formBuilder.group({
        myControl: [''],
        requestControl: [''],
        clientControl: [''],
        collaboratorControl: [''],
        statusControl: [''],
        selectControl: ['']
    });

    lastFilter: string = '';
    businessTypeSelected = [];
    selectedClient: Client[] = [];
    clientSelected = [];
    collaboratorSelected = []
    commercialAreaSelected = [];
    statusSelected = [];
    isActive: boolean = true;
    selectedItem: any = null;
    allCompleteClient: boolean = false;
    collaboratorsOriginal = [];
    allCompleteCollaborator: boolean = false;
    collaborators$: Observable<Collaborator[]>;

    // Form Controls
    filterGroupForm: FormGroup;

    constructor(
        private _assignmentOccupationService: AssingmentOccupationService,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        // Create the fiterGroupForm
        this.filterGroupForm = this._formBuilder.group({
            clientControl          : [],
            collaboratorControl    : []
        });
    }

    ngOnInit(): void {
        
        

        this.collaborators$ = this._assignmentOccupationService.collaborators$;

        // Listener event from tab
        this._handleEventTab();

        // Get all collaborators
        this._getAllCollaboratorOccupation();

        // Get all clients
        this._getClients();

        // Handle change from filterGroupForm
        this._handleChangeForm();

        // Handle event saved occupation
        this._handleEventTab();
        
        // this.filteredClients = this.clientControl.valueChanges.pipe(
        //     startWith(''),
        //     map(value => this._filterClient(value)),
        // );
    
        this.filteredClients = this.clientControl.valueChanges.pipe(
            startWith(''),
            map((value) => (typeof value === 'string' ? value : this.lastFilter)),
            map((filter) => this.filter(filter, this.clientSelected))
        );

        this.filteredCollaborators = this.collaboratorControl.valueChanges.pipe(
            startWith(''),
            map((value) => (typeof value === 'string' ? value : this.lastFilter)),
            map((filter) => this.filter(filter, this.collaboratorSelected))
        );
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
     * clientControl
     * 
     */
    get clientControl() {
        return this.filterGroupForm.get('clientControl');
    }

    /**
     * collaboratorControl
     * 
     */
    get collaboratorControl() {
        return this.filterGroupForm.get('collaboratorControl');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Methods
    // -----------------------------------------------------------------------------------------------------

    private _handleEventTab() {
        this._assignmentOccupationService.tabIndex$
            .subscribe((tabIndex) => {
                if ( tabIndex === 0 ) {
                    this.isEditing = false;
                    this._getAllCollaboratorOccupation();
                    
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }
                
            });
    }

    /**
     * _filterClient
     * 
     * @param value 
     */
    private _filterClient(value: string): string[] {
        const filterValue = value.toLowerCase();

        let val = this.clients.map(option => option.name);
        return val.filter(option => option.toLowerCase().includes(filterValue));
    }

    /**
     * Filter
     * 
     * @param filter 
     * @param collection 
     * @returns 
     */
    filter(filter: string, collection: any[]): any[] {
        this.lastFilter = filter;
        if (filter) {
            return collection.filter((option) => {
                return (option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0);
            });
        } else {
            return collection.slice();
        }
    }

    /**
     * _filterCollaborator
     * 
     * @param value 
     */
    private _filterCollaborator(value: string): string[]{
        const filterValue = value.toLowerCase();
        const val = this.collaborators.map(option => option.name);
        return val.filter(option => option.toLowerCase().includes(filterValue));
    }

    /**
     * Get all collaborators occupation
     * 
     */
    private _getAllCollaboratorOccupation() {
        this._assignmentOccupationService.getAllColaboratorOccupation()
            .subscribe(collaborators => {
                // Update the client
                collaborators.sort(this.sortArray);
                
                this.collaborators = collaborators;

                // Map for clients
                this.collaboratorSelected = this.collaborators.map(item => {
                    return {
                        selected: false,
                        ...item
                    }
                });
                this.collaboratorSelected = this.collaborators.filter((item)=> item.isActive ===1);

            
                this.collaborators = collaborators;
                this.collaboratorControl.setValue('');
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * getClients
     * 
     */
    private _getClients() {
        // Get the clients
        this._assignmentOccupationService.clients$
            .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((clients: Client[]) => {
                    // Update the client
                    clients.sort(this.sortArray);
                    this.clients = clients;

                    // Map for clients
                    this.clientSelected = this.clients.map(item => {
                        return {
                            selected: false,
                            ...item
                        }
                    });

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
    }
    

    /**
     * Sort array
     * 
     * @param x 
     * @param y 
     * @returns 
     */
    sortArray(x: any, y: any) {
        if (x.name < y.name) {return -1; }
        if (x.name > y.name) {return 1; }
        return 0;
    }

    /**
     * Edit occupation
     * 
     * @param collaborator 
     */
    editOccupation(collaborator: Collaborator) {
        this.collaborator = collaborator;
        this._assignmentOccupationService.getOccupationsByCollaborator(collaborator.id)
            .pipe(finalize(() => this.isEditing = true))
                .subscribe(response => {
                    this.assigments = response;
                });
        
    }
    
    /**
     * On return previous
     * 
     * @param event
     */
    onReturnPrevious(event: any) {
        this.isEditing = false;
        // Get all collaborators occupation
        //this._getAllCollaboratorOccupation();
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * On delete assignment
     * 
     */
    onDeleteAssignment() {
        this.editOccupation(Object.assign({}, this.collaborator));
    }

    /**
     * Handle change form
     *
     */
     private _handleChangeForm() {
        // Subscribe from form's values
        this.filterGroupForm.valueChanges.subscribe(controls => {
            let collaborators: Collaborator[] = this._assignmentOccupationService.collaborators;
            // Filter collaborators
            collaborators = collaborators.filter(item =>
                (((this.clientSelected.find(client => client.selected && client.name.includes(item?.client.name)) || this.clientSelected.every(client => !client.selected))) && 
                    ((this.collaboratorSelected.find(collaborator => collaborator.selected && collaborator.name.includes(item?.name)) || this.collaboratorSelected.every(collaborator => !collaborator.selected)))
            ));

            // Set request for filter
            this.collaboratorsOriginal = collaborators;
            // Set the requests
            this._assignmentOccupationService.setCollaborators(collaborators);
            // Mark for check
            this._changeDetectorRef.markForCheck();

        });
    }

    /**
     * Option clicked
     * 
     * @param event 
     * @param selectedItem 
     */
    optionClicked(event: Event, selectedItem: Client, selectedCollection: Client[], option: string) {
        event.stopPropagation();
        this.toggleSelection(selectedItem, selectedCollection, option);
    }
    
    /**
     * Handle change the checkbox
     * 
     * @param option
     */
    handleChangeCheckbox(option: string) {
        // Select action option
        switch( option ) {
            case 'collaborator':
                this.collaboratorControl.setValue('');
                break;
            case 'client':
                this.clientControl.setValue('');
                break;
        }
    }
    
    /**
     * Toggle Selection
     * 
     * @param selectedFilter 
     * @param collection 
     */
    toggleSelection(selectedFilter: any, selectedCollection: Client[], option: string) {
        // change status the selected
        selectedFilter.selected = !selectedFilter.selected;

        // update all as complete
        this.updateAllComplete(option);
        
        // Handle change from checkbox
        this.handleChangeCheckbox(option);
        
    }

    /**
     * Restarting list
     * 
     */
    restartingList(control: FormControl) {
        control.setValue('', {emitEvent: false});
        control.updateValueAndValidity({onlySelf: true, emitEvent: true});
        ///this.inputBranch.nativeElement.focus();
    }

    /**
     * Update selected item
     * 
     * @param selectedItem 
     */
    updateSelectedItem(selectedItem: any) {
        if ( this.selectedItem ) {
            this.selectedItem = null;
        } else {
            this.selectedItem = selectedItem;
        }
    }

    /**
     * Select only one item
     * 
     * @param selectedItem 
     */
    selectOnlyItem(selectedItem: any, collection: any) {
        selectedItem.selected = true;

        collection.forEach((item) => {
            if ( item.name !== selectedItem.name ) {
                item.selected = false;
            }
        });

        //this.clientControl.setValue('');
        //event.stopPropagation();
    }

    /**
     * Check item
     * 
     * @param item 
     * @param collection 
     * @returns 
     */
    checkItem(item: any, collection: any) {
        return collection.find(element => element.name === item.name) === undefined ? false: true;
    }

    /**
     * Set all as selected
     * 
     * @param completed 
     */
    setAll(completed: boolean, collection: any, option: string) {
        
        // Mark as completed all elements
        collection.forEach(item => item.selected = completed);

        // Select action option
        switch( option ) {
            case 'collaborator':
                this.allCompleteCollaborator = completed;
                this.collaboratorControl.setValue('');
                break;
            case 'client':
                this.allCompleteClient = completed;
                this.clientControl.setValue('');
            break;
        }

        
    }

    /**
     * Some complete
     * 
     * @returns
     */
    someComplete(collection: any, allComplete: boolean): boolean {
        return collection.filter(item => item.selected).length > 0 && !allComplete;
    }
    
    /**
     * Update all complete
     * 
     * @param option 
     */
    updateAllComplete(option: string) {

        switch( option ) {
            case 'collaborator':
                this.allCompleteCollaborator = this.collaboratorSelected != null && this.collaboratorSelected.every(item => item.selected);
                break;
            case 'client':
                this.allCompleteClient = this.clientSelected != null && this.clientSelected.every(item => item.selected);
                break;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
}
