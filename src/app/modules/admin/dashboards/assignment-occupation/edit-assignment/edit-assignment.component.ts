
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { InventoryBrand, InventoryCategory, InventoryPagination, InventoryProduct, InventoryTag, InventoryVendor } from 'app/modules/admin/apps/ecommerce/inventory/inventory.types';
import {AssingmentOccupationService} from "../assingment-occupation.service";
import { Client, Collaborator } from '../assignment-occupation.types';
import {FormArray} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
//import { collaborators } from 'app/mock-api/dashboards/collaborators/data';
import { MatTabGroup } from '@angular/material/tabs';


@Component({
  selector: 'app-edit-assignment',
  templateUrl: './edit-assignment.component.html',
  styleUrls: ['./edit-assignment.component.scss']
})
export class EditAssignmentComponent implements OnInit {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

collaborators: Collaborator[] = [];
clients: Client[] = [];
selectedClient: Client;
filteredOptions: Observable<string[]>;
filteredClients: Observable<string[]>;
filteredCollaborators: string[];
displayedColumns: string[] = ['cliente', 'recurso','actividad', '%', 'fechaFinal',
'dias', 'ocupacion', 'detalle'];


 filterForm: FormGroup = this._fb.group({
        myControl: [''],
        requestControl: [''],
        clientControl: [''],
        collaboratorControl: [''],
        statusControl: [''],
        selectControl: ['']
    });
    
  constructor( private _assignmentOccupationService: AssingmentOccupationService, private _fb: FormBuilder,  private _changeDetectorRef: ChangeDetectorRef,) { }

  ngOnInit(): void {


        if ( this._assignmentOccupationService.selectedFiltered.client !== '' ) {
            this.clientControl.setValue(this._assignmentOccupationService.selectedFiltered.client);
            this.collaboratorControl.setValue(this._assignmentOccupationService.selectedFiltered.responsible);
        }

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
  this._getResponsibleByClient();
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
     * _filterCollaborator
     * @param value 
     */
    private _filterCollaborator(value: string): string[]{
        const filterValue = value.toLowerCase();
        const val = this.collaborators.map(option => option.name);
        return val.filter(option => option.toLowerCase().includes(filterValue));
    }


       /**
     * getClients
     */
    private _getClients() {
        this._assignmentOccupationService.clients$
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(clients => {
                clients.sort(this.sortArray);
                this.clients = clients;
                // Mark for check
                this._changeDetectorRef.markForCheck();
                
            })
    
        //this.collaborators$ = this._assignmentOccupationService.collaborators$;
    }
     private _getResponsibleByClient() {
        this.clientControl.valueChanges
        .subscribe(value => {
            const client = this.clients.find(item => item.name === value);

            if ( client ) {
                this.selectedClient = client;
                this._assignmentOccupationService.selectedFiltered.client = client.name;
                this._getCollaboratorsByClient( this.selectedClient.id );
            } else {
                this.selectedClient = null;
                this.collaborators = [];
                this.collaboratorControl.setValue('');
                this._changeDetectorRef.markForCheck();
            }
        });
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


}
