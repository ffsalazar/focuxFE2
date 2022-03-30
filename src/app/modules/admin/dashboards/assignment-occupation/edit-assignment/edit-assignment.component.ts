
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
    filteredCollaborators: string[];
    displayedColumns: string[] = ['cliente', 'recurso', '%', 'fechaFinal',
    'dias', 'ocupacion', 'detalle'];
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
    commercialAreaSelected = [];
    statusSelected = [];
    isActive: boolean = true;
    selectedItem: any = null;
    allCompleteClient: boolean = false;
    
    constructor(
        private _assignmentOccupationService: AssingmentOccupationService,
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit(): void {

        if ( this._assignmentOccupationService.selectedFiltered.client !== '' ) {
            this.clientControl.setValue(this._assignmentOccupationService.selectedFiltered.client);
            this.collaboratorControl.setValue(this._assignmentOccupationService.selectedFiltered.responsible);
        }

        // Get all collaborators' occupations

        this._getAllCollaboratorOccupation();        
        
        this.filteredClients = this.clientControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterClient(value)),
        );

        this.collaboratorControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterCollaborator(value)),
            ).subscribe(value => {
                this.filteredCollaborators = value;
                this._changeDetectorRef.markForCheck();
            });
    
        this._getClients();

        this.filteredClients = this.clientControl.valueChanges.pipe(
            startWith(''),
            map((value) => (typeof value === 'string' ? value : this.lastFilter)),
            map((filter) => this.filter(filter, this.clientSelected))
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

    /**
     * clientControl
     */
    get clientControl() {
        return this.filterForm.get('clientControl');
    }

    /**
     * collaboratorControl
     */
    get collaboratorControl() {
        return this.filterForm.get('collaboratorControl');
    }

    /**
     * _filterClient
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
     * @param value 
     */
    private _filterCollaborator(value: string): string[]{
        const filterValue = value.toLowerCase();
        const val = this.collaborators.map(option => option.name);
        return val.filter(option => option.toLowerCase().includes(filterValue));
    }


    private _getAllCollaboratorOccupation() {
        this._assignmentOccupationService.getAllColaboratorOccupation()
            .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(collaborators => {
                    console.log("collaborators occupation: ", collaborators);
                    this.isEditing = false;
                    this.collaborators = collaborators;
                });
    }

    /**
     * getClients
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
    
        //this.collaborators$ = this._assignmentOccupationService.collaborators$;
    }
    
    /**
     * getCollaboratorsByClient
     */
    private _getCollaboratorsByClient(clientId: number) {
        this._assignmentOccupationService.getCollaboratorsByClient( clientId )
            .subscribe(collaborators => {
                this.collaborators = collaborators;
                this.collaboratorControl.setValue('');
                this._changeDetectorRef.markForCheck();
            })
    }

    sortArray(x, y) {
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
        console.log("collaborator: ", collaborator);
        this.collaborator = collaborator;
        this._assignmentOccupationService.getOccupationsByCollaborator(collaborator.id)
            .pipe(finalize(() => this.isEditing = true))
                .subscribe(response => {
                    console.log("response: ", response);
                    this.assigments = response;
                });
        
    }

    onReturnPrevious(e: any) {
        this.isEditing = false;
        // Get all collaborators occupation
        this._getAllCollaboratorOccupation();
        // Mark for check
        this._changeDetectorRef.markForCheck();
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
            case 'branch':
                break;
            case 'client':
                this.clientControl.setValue('');
                break;
            case 'area':
                break;
            case 'status':
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
    restartingList() {
        // this.filterGroupForm.get('customerBranchControl').setValue('', {emitEvent: false});
        // this.filterGroupForm.get('customerBranchControl').updateValueAndValidity({onlySelf: true, emitEvent: true});
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
            case 'branch':
     
                break;
            case 'client':
                this.allCompleteClient = completed;
                this.clientControl.setValue('');
            break;
            case 'area':
                break;
            case 'status':
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
            case 'branch':
                break;
            case 'client':
                this.allCompleteClient = this.clientSelected != null && this.clientSelected.every(item => item.selected);
                break;
            case 'area':
                break;
            case 'status':

                break;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
}
