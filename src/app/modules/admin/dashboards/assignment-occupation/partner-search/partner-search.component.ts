import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { Activity, Collaborator, Project, Client, Status } from "../assignment-occupation.types";
import {AssingmentOccupationService} from "../assingment-occupation.service";
import {FormArray, FormControl} from "@angular/forms";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
//import { collaborators } from 'app/mock-api/dashboards/collaborators/data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { FuseAlertService } from '@fuse/components/alert';

@Component({
  selector: 'app-partner-search',
  templateUrl: './partner-search.component.html',
  styleUrls: ['./partner-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PartnerSearchComponent implements OnInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @ViewChild(MatTabGroup) private _tab: MatTabGroup;
    
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    myControlTest = new FormControl('test');

    collaborators$: any;

    collaborators: Collaborator[] = [];
    collaboratorsRecomm : Collaborator[] = [];
    requests: any[] = [];
    clients: Client[] = [];
    status: any[];
    activity: Activity[] = [];
    isLoading: boolean = false;
    selectedClient: Client;
    selectedResponsible: any = null;
    filterActive: string;

    // FormControls    
    filterForm: FormGroup = this._fb.group({
        myControl: [''],
        requestControl: [''],
        clientControl: [''],
        collaboratorControl: [''],
        statusControl: [''],
        selectControl: ['']
    });
    
    collaboratorArrayForm: FormGroup = new FormGroup({
        collaboratorSelected: new FormArray([])
    });

    // Observables
    filteredOptions: Observable<string[]>;
    filteredClients: Observable<string[]>;
    filteredRequest: string[];
    filteredCollaborators: string[];
    status$: Observable<Status[]>;

    filterValue = 'Hola mundo';
    successSave: string = '';
    tabIndex = 0;
    flashMessage: string = '';

    constructor(
        private _assignmentOccupationService: AssingmentOccupationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseAlertService: FuseAlertService,
        private _router: Router,
        private activateRouter: ActivatedRoute,
        private _fb: FormBuilder,
    ) { }

    ngOnInit(): void {

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

        this.requestControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterRequest(value)),
            ).subscribe(value => {
                this.filteredRequest = value;
                this._changeDetectorRef.markForCheck();
            });

        this.status$ = this._assignmentOccupationService.status$;

        this._assignmentOccupationService.collaboratorSelectedRemove$
            .subscribe(index => {
                if ( index !== null ) {
                    this.collaboratorSelected.at(index).setValue(false);

                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._handleEventSavedOccupation();
        this._handleChangeArrayForm();
        this._handleChangeStatus();
        this._getStatus();
        this._getClients();
        this._getResponsibleByClient();
        this._handleChangeResponsible()
        this._getCollaboratorsByRequest();
  } 


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * collaboratorSelected
     */
    get collaboratorSelected(){
        return this.collaboratorArrayForm.get('collaboratorSelected') as FormArray;
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
     * requestControl
     */
    get requestControl() {
        return this.filterForm.get('requestControl');
    }

    /**
     * requestControl
     */
    get statusControl() {
        return this.filterForm.get('statusControl');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Methods
    // -----------------------------------------------------------------------------------------------------

    private _handleEventSavedOccupation() {
        this._assignmentOccupationService.tabIndex$
            .subscribe((value) => {
                this.selectedResponsible = null;
                this.selectedClient = null;

                this.filterForm.setValue({
                    myControl: '',
                    requestControl: '',
                    clientControl: '',
                    collaboratorControl: '',
                    statusControl: '',
                    selectControl: ''
                });

            });
    }

    private _handleChangeStatus() {
        this.statusControl.valueChanges
            .subscribe(value => {
                console.log("id status: ", value);
                if ( value ) {
                    this._assignmentOccupationService.selectedFiltered.status = this.status.find(item => item.id === value).name;

                    if ( this.selectedResponsible ) {
                        // Get all request by responsible
                        this._getRequestByResponsible( this.selectedResponsible );
                    } else if ( this.selectedClient ) {
                        // Get all collaborators by client
                        this._getCollaboratorsByClient( this.selectedClient.id );
                        // Get all request by client
                        this._getRequestByClient( this.selectedClient.id );
                    }
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }
                
            });
    }

    private _getStatus() {
        this._assignmentOccupationService.getStatus()
            .subscribe((status: Status[]) => {
                this.status = status;
                console.log("status: ", this.status);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Get all clients
     * 
     */
    private _getClients() {
        this._assignmentOccupationService.clients$
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(clients => {
                this.clients = clients;
                // Mark for check
                this._changeDetectorRef.markForCheck();
                
            })
    
        //this.collaborators$ = this._assignmentOccupationService.collaborators$;
    }

    /**
     * Get all responsible by client
     * 
     */
    private _getResponsibleByClient() {
        this.clientControl.valueChanges
            .subscribe(value => {
                const client = this.clients.find(item => item.name === value);

                if ( client ) {
                    this.selectedClient = client;
                    this._assignmentOccupationService.selectedFiltered.client = client.name;
                    this._getCollaboratorsByClient( this.selectedClient.id );
                    this._getRequestByClient( this.selectedClient.id );
                } else {
                    this.selectedClient = null;
                    this.collaborators = [];
                    this.requestControl.setValue('');
                    this.collaboratorControl.setValue('');
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
    
    /**
     * Get all collaborators by client
     * 
     */
    private _getCollaboratorsByClient(clientId: number) {
        this._assignmentOccupationService.getCollaboratorsByClient( clientId )
            .subscribe(collaborators => {
                this.collaborators = collaborators;
                this.collaboratorControl.setValue('');
                // Mark for check
                this._changeDetectorRef.markForCheck();
            })
    }

    /**
     * Get all request by client
     * 
     */
    private _getRequestByClient(clientId: number) {
        this._assignmentOccupationService.getRequestByClient( clientId, this.statusControl.value || 8 )
            .subscribe(requests => {
                this.requests = requests;
                this.requestControl.setValue('');
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Get all request by responsible
     * 
     */
    private _handleChangeResponsible() {
        this.collaboratorControl.valueChanges
            .subscribe(value => {
                const responsible = this.collaborators.find(item => item.name === value);

                if ( responsible ) {
                    this.selectedResponsible = responsible;
                    this._assignmentOccupationService.selectedFiltered.responsible = responsible.name;
                    this._getRequestByResponsible(this.selectedResponsible);
                } else if ( this.selectedResponsible && value === '' ) {
                    this.selectedResponsible = null;
                    this._getRequestByClient(this.selectedClient.id);
                    // this.requests = [];
                    this.requestControl.setValue('');
                } else {
                    this.requests = [];
                    this.requestControl.setValue('');
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Get all request by responsible
     * 
     * @param responsible 
     */
    private _getRequestByResponsible(responsible: Collaborator) {
        this._assignmentOccupationService.getRequestByResponsible( responsible.id, this.statusControl.value || 8 )
            .subscribe(requests => {
                this.requests = requests;
                this.requestControl.setValue('');
                // Mark for check
                this._changeDetectorRef.markForCheck();
            })
    }

    /**
     * _getCollaboratorsByRequest
     */
    private _getCollaboratorsByRequest() {
        this.requestControl.valueChanges
            .subscribe(value => {
                // Get recommended
                this.getCollaboratorsRecommended();
            });
    }

    /**
     * Select Tab
     */
    selectTab() {
    
        this.collaboratorsRecomm = [];

        switch ( this._tab.selectedIndex ) {

            case 0:
                this.getCollaboratorsRecommended();
                break;
            case 1:
                this.getCollaboratorsByClients();
                break;
            case 2:
                this.getCollaboratorRecommendedByKnowledge();
                break;
            case 3:
                this.getCollaboratorRecommendedByFree();
                break;
        
            default:
                break;
        }
    }
    /**
     * Get collaborators recommended
     */
    getCollaboratorsRecommended() {
        const request = this.requests.find(item => item.titleRequest === this.requestControl.value);

        if ( request ) {
            this._assignmentOccupationService.requestSelected = request;
            this._assignmentOccupationService.selectedFiltered.request = request.titleRequest;
            this._assignmentOccupationService.getRecommended( request.id )
                .subscribe(collaborators => {
                    this.collaboratorsRecomm = collaborators;
                    // Update the collaboatorsRecomm
                    this._setCollaboratorsRecomm();
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                })
        } else {
            this.collaboratorsRecomm = [];
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * Get collaboratorsByClient
     */
    getCollaboratorsByClients() {
        const request = this.requests.find(item => item.titleRequest === this.requestControl.value);

        if ( request ) {
            this._assignmentOccupationService.getCollaboratorsRecommendedByClient( request.id )
                .subscribe(collaborators => {
                    this.collaboratorsRecomm = collaborators;
                    // Update the collaboatorsRecomm
                    this._setCollaboratorsRecomm();
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                })
        } else {
            this.collaboratorsRecomm = [];
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * Get collaboratorsByClient
     */
    getCollaboratorRecommendedByKnowledge() {
        const request = this.requests.find(item => item.titleRequest === this.requestControl.value);

        if ( request ) {
            this._assignmentOccupationService.getCollaboratorRecommendedByKnowledge( request.id )
                .subscribe(collaborators => {
                    this.collaboratorsRecomm = collaborators;
                    // Update the collaboatorsRecomm
                    this._setCollaboratorsRecomm();
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                })
        } else {
            this.collaboratorsRecomm = [];
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * Get collaboratorsByClient
     */
    getCollaboratorRecommendedByFree() {
        const request = this.requests.find(item => item.titleRequest === this.requestControl.value);

        if ( request ) {
            this._assignmentOccupationService.getCollaboratorRecommendedByFree( request.id )
                .subscribe(collaborators => {
                    this.collaboratorsRecomm = collaborators;
                    // Update the collaboatorsRecomm
                    this._setCollaboratorsRecomm();
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                })
        } else {
            this.collaboratorsRecomm = [];
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * Set CollaboratorsRecomm
     */
    private _setCollaboratorsRecomm() {
        // Clear formArray
        this.collaboratorSelected.clear();
        // Set formArray
        this.collaboratorsRecomm.forEach(item => {
            this.collaboratorSelected.push(new FormControl(false));
            // value.collaboratorSelected[i] = this.collaborators[i];

        });
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * handle ChangeArrayForm
     */
    private _handleChangeArrayForm() {
        this.collaboratorArrayForm.valueChanges.subscribe((value) => {
            // Añadir colaboradores seleccionados en el FormArray
            for (let i = 0; i < value.collaboratorSelected.length; i++) {
                if ( value.collaboratorSelected.at(i) === true ){
                    value.collaboratorSelected[i] = this.collaboratorsRecomm[i];
                }
            }

            this._assignmentOccupationService.collaboratorsSelected = value.collaboratorSelected;
            //this._assignmentOccupationService.setCollaboratorSelected();
        })
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
     * _filterRequest
     * @param value 
     */
    private _filterRequest(value: string): string[]{
        const filterValue = value.toLowerCase();
        const val = this.requests.map(option => option.titleRequest);
        return val.filter(option => option.toLowerCase().includes(filterValue));
    }

    /**
     * Validate the collaborator
     *
     */
    validateCollaborator() {
        if ( this.requests.length <= 0 ) {
            this.showFlashMessage('error', 'No hay solicitudes para este cliente');
        }
    }

    /**
     *
     * @param name
     */
    dismissFuse(name){
        this.successSave = 'No hay solicitudes para este cliente';
        this._fuseAlertService.dismiss(name);
    }

    showFlashMessage(type: 'success' | 'error' | 'info', message: string): void
    {
        // Show the message
        this.flashMessage = 'info';

        this._fuseAlertService.show('alertBox4');
        // Set message title
        this.successSave = message;

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


    assignActivity(collaborator) {
        this._assignmentOccupationService.setCollaboratorByAssign(collaborator);
        this._assignmentOccupationService.setTabIndex(1);
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
     
    sortArray(x, y) {
        if (x.name < y.name) {return -1; }
        if (x.name > y.name) {return 1; }
    return 0;
    }

}
