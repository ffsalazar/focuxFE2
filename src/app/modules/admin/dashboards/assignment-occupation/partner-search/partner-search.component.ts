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

@Component({
  selector: 'app-partner-search',
  templateUrl: './partner-search.component.html',
  styleUrls: ['./partner-search.component.scss']
})
export class PartnerSearchComponent implements OnInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
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

    // FormControls
    statusControl: FormControl = new FormControl();
    
    filterForm: FormGroup = this._fb.group({
        myControl: [''],
        requestControl: [''],
        clientControl: [''],
        collaboratorControl: [''],
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

    
        this._assignmentOccupationService.collaborators$
            .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(collaborators => {
                    //this.collaborators = collaborators;

                    // for(let i = 0; i < collaborators.length; i++){
                    //     this.collaboratorSelected.push(new FormControl(false));
                    // }
                console.log(this.collaboratorArrayForm);
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                })
                
        this.collaboratorArrayForm.valueChanges.subscribe((value)=>{
            console.log("array: ", value);

            console.log("Item: ", value.collaboratorSelected.at(0));

            // Añadir colaboradores seleccionados en el FormArray


        })

        this.status$ = this._assignmentOccupationService.status$;

        this._getStatus();
        this._getClients();
        this._getResponsibleByClient();
        this._getRequestByResponsible()
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

    private _getStatus() {
        this._assignmentOccupationService.getStatus()
            .subscribe(status => {
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
                this._assignmentOccupationService.getCollaboratorsByClient( client.id )
                    .subscribe(collaborators => {
                        this.collaborators = collaborators;
                        this.collaboratorControl.setValue('');
                        this._changeDetectorRef.markForCheck();
                    })
            } else {
                this.collaborators = [];
                this.collaboratorControl.setValue('');
                this._changeDetectorRef.markForCheck();
            }
        });
    }
    
    /**
     * getRequestByResponsible
     */
    private _getRequestByResponsible() {
        this.collaboratorControl.valueChanges
            .subscribe(value => {
                const responsible = this.collaborators.find(item => item.name === value);

                console.log("responsible: ", responsible);
                if ( responsible ) {
                    this._assignmentOccupationService.getRequestByResponsible( responsible.id )
                        .subscribe(requests => {
                            console.log(requests);
                            this.requests = requests;
                            this.requestControl.setValue('');
                            this._changeDetectorRef.markForCheck();
                        })
                } else {
                    this.requests = [];
                    this.requestControl.setValue('');
                    this._changeDetectorRef.markForCheck();
                }
            });
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
     * Get collaborators recommended
     */
    getCollaboratorsRecommended() {
        const request = this.requests.find(item => item.titleRequest === this.requestControl.value);

        if ( request ) {
            this._assignmentOccupationService.getRecommended( request.id )
                .subscribe(collaborators => {
                    console.log("collaborators recomme: ", collaborators);
                    this.collaboratorsRecomm = collaborators;
                    // Clear formArray
                    this.collaboratorSelected.clear();
                    console.log("recomendados: ", this.collaboratorsRecomm);
                    // Set formArray
                    this.collaboratorsRecomm.forEach(item => {
                        this.collaboratorSelected.push(new FormControl(false));
                    });
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
        console.log("requestControl: ", this.requestControl.value);
        const request = this.requests.find(item => item.titleRequest === this.requestControl.value);

        if ( request ) {
            this._assignmentOccupationService.getCollaboratorsRecommendedByClient( request.id )
                .subscribe(collaborators => {
                    console.log("collaborators recomme by clients: ", collaborators);
                    this.collaboratorsRecomm = collaborators;
                    // Clear formArray
                    this.collaboratorSelected.clear();
                    console.log("recomendados: ", this.collaboratorsRecomm);
                    // Set formArray
                    this.collaboratorsRecomm.forEach(item => {
                        this.collaboratorSelected.push(new FormControl(false));
                    });
                    this._changeDetectorRef.markForCheck();
                })
        } else {
            this.collaboratorsRecomm = [];
            this._changeDetectorRef.markForCheck();
        }
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
