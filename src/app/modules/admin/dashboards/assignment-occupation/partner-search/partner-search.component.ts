import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'app-partner-search',
  templateUrl: './partner-search.component.html',
  styleUrls: ['./partner-search.component.scss']
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
    
    tabIndex = 0;

    constructor(
        private _assignmentOccupationService: AssingmentOccupationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private activateRouter: ActivatedRoute,
        private _fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.getActivitys();

        if ( this._assignmentOccupationService.selectedFiltered.client !== '' ) {
            this.clientControl.setValue(this._assignmentOccupationService.selectedFiltered.client);
            this.collaboratorControl.setValue(this._assignmentOccupationService.selectedFiltered.responsible);
            this.statusControl.setValue(this._assignmentOccupationService.selectedFiltered.status);
            this.requestControl.setValue(this._assignmentOccupationService.selectedFiltered.request);
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

        this.requestControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filterRequest(value)),
            ).subscribe(value => {
                this.filteredRequest = value;
                this._changeDetectorRef.markForCheck();
            });

        

        // this._assignmentOccupationService.collaborators$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //         .subscribe(collaborators => {
        //             this.collaborators = collaborators;

        //             for(let i = 0; i < collaborators.length; i++){
        //                 this.collaboratorSelected.push(new FormControl(false));
        //             }
        //         console.log(this.collaboratorArrayForm);
        //             Mark for check
        //             this._changeDetectorRef.markForCheck();
        //         })
                
        // this.collaboratorArrayForm.valueChanges.subscribe((value)=>{
        //     console.log("array: ", value);

        //     console.log("Item: ", value.collaboratorSelected.at(0));

        //     Añadir colaboradores seleccionados en el FormArray


        // })

        // this._assignmentOccupationService.getCollaborators()
        //     .subscribe(response => {
        //         console.log("response: ", response);
        //         this.collaboratorsRecomm = response;
        //         this._setCollaboratorsRecomm();
        //     })

        this.status$ = this._assignmentOccupationService.status$;

        this._assignmentOccupationService.collaboratorSelectedRemove$
            .subscribe(index => {
                if ( index !== null ) {
                    this.collaboratorSelected.at(index).setValue(false);

                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

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

    private _handleChangeStatus() {
        this.statusControl.valueChanges
            .subscribe(value => {
                this._assignmentOccupationService.selectedFiltered.status = this.status.find(item => item.id === value).name;

                if ( this.selectedResponsible ) {
                    this._getRequestByResponsible( this.selectedResponsible );
                } else if ( this.selectedClient ) {
                    this._getCollaboratorsByClient( this.selectedClient.id );
                    this._getRequestByClient( this.selectedClient.id );
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    private _getStatus() {
        this._assignmentOccupationService.getStatus()
            .subscribe((status: Status[]) => {
                this.status = status;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * getClients
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
     * getResponsibleByClient
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

    /**
     * getRequestByClient
     */
    private _getRequestByClient(clientId: number) {
        this._assignmentOccupationService.getRequestByClient( clientId, this.statusControl.value | 8 )
            .subscribe(requests => {
                this.requests = requests;
                this.requestControl.setValue('');
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * getRequestByResponsible
     */
    private _handleChangeResponsible() {
        this.collaboratorControl.valueChanges
            .subscribe(value => {
                const responsible = this.collaborators.find(item => item.name === value);

                if ( responsible ) {   
                    this.selectedResponsible = responsible;
                    this._assignmentOccupationService.selectedFiltered.responsible = responsible.name;
                    this._getRequestByResponsible(this.selectedResponsible);
                } else if ( this.selectedResponsible ) {
                    this.selectedResponsible = null;
                    this._getRequestByClient(this.selectedClient.id);
                    // this.requests = [];
                    this.requestControl.setValue('');
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    /**
     * 
     * @param responsible 
     */
    private _getRequestByResponsible(responsible: Collaborator) {
        this._assignmentOccupationService.getRequestByResponsible( responsible.id, this.statusControl.value | 8 )
            .subscribe(requests => {
                this.requests = requests;
                this.requestControl.setValue('');
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
        switch ( this._tab.selectedIndex ) {
            case 0:
                this.getCollaboratorsRecommended();
                break;
            case 1:
                this.getCollaboratorsByClients();
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
                    console.log("Recomendados: ", collaborators);
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
                    console.log("Por cliente: ", this.collaborators);
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
    }

    /**
     * handle ChangeArrayForm
     */
    private _handleChangeArrayForm() {
        this.collaboratorArrayForm.valueChanges.subscribe((value) => {
            // Añadir colaboradores seleccionados en el FormArray
            console.log("value: ", this.collaboratorSelected.value);
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
     
    
    redirection(tab: string, index: number) {
        this.assignActivity(this.collaborators);
         
       this._assignmentOccupationService.tabIndex$.subscribe(id => {
           if (id != null) this.tabIndex = id;
       });
       this.tabIndex = index;
       this._router.navigate(['dashboards/assignment-occupation/index/' + tab]).then();
    }

    recommended(){
        
    }
    selected(){
    
        
        
        
    }

}
