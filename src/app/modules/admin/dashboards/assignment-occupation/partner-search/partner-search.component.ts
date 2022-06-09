import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    Activity,
    Collaborator,
    Project,
    Client,
    Status,
    Knowledge,
} from '../assignment-occupation.types';
import { AssingmentOccupationService } from '../assingment-occupation.service';
import { AbstractControl, FormArray, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil, finalize } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
//import { collaborators } from 'app/mock-api/dashboards/collaborators/data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { FuseAlertService } from '@fuse/components/alert';
import { NgxSpinnerService } from 'ngx-spinner';
import { RequestService } from 'app/modules/admin/apps/portafolio/request/request.service';
import { MatTableDataSource } from '@angular/material/table';
import { collaborators } from 'app/mock-api/dashboards/collaborators/data';

@Component({
    selector: 'app-partner-search',
    templateUrl: './partner-search.component.html',
    styleUrls: ['./partner-search.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PartnerSearchComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    @ViewChild(MatTabGroup) private _tab: MatTabGroup;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    myControlTest = new FormControl('test');

    collaborators$: any;

    collaborators: Collaborator[] = [];
    collaboratorsRecomm: Collaborator[] = [];
    collaborator: any;
    assigments: any = [];
    requests: any[] = [];
    clients: Client[] = [];
    knowledges: Knowledge[] = [];
    status: any[];
    activity: Activity[] = [];
    isLoading: boolean = false;
    selectedClient: Client;
    selectedResponsible: any = null;
    filterActive: string;
    isEditing: boolean = false;
    // FormControls
    filterForm: FormGroup = this._fb.group({
        myControl: [''],
        requestControl: [''],
        clientControl: [''],
        collaboratorControl: [''],
        statusControl: [''],
        selectControl: [''],
    });

    collaboratorArrayForm: FormGroup = new FormGroup({
        collaboratorSelected: new FormArray([]),
    });

    request = null;
    hasRequest: boolean = true;
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
    hasCheckedCollaborator: boolean = false;
    selectedFilterClient: boolean = false;
    selectedFilterKnowledge: boolean = false;
    selectedFilterOccupation: boolean = false;
    collaboratorOccupation = [];
    selectedRequest: boolean = false;
    selectedClients: any = [];
    occupations: number[] = [15, 50, 100];
    filterCollaboratorsGroup: FormGroup;
    range: FormGroup = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });
    valueSlider: FormControl = new FormControl(0);

    dataCollab = new MatTableDataSource<any>();
    valuesFiltered: any = null;

    displayColCollab: string[] = [
        'id',
        'name',
        'roleName',
        'occupationPercentage',
        'startDate',
        'endDate',
        'options',
    ];

    /**
     * Constructor
     */
    constructor(
        private _assignmentOccupationService: AssingmentOccupationService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseAlertService: FuseAlertService,
        private _router: Router,
        private activateRouter: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private _fb: FormBuilder,
        private _requestService: RequestService
    ) {
        // Create form group for filter collaborators
        this.filterCollaboratorsGroup = this._fb.group({
            filterClients: new FormArray([]),
            filterKnowledges: new FormArray([]),
            filterOccupation: [0],
            filterDateInit: [''],
            filterDateEnd: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this._assignmentOccupationService.collaborators$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((collaborators) => {
                this.collaboratorOccupation = collaborators;
                this._setCollaboratorsRecomm();
            });

        this.filterCollaboratorsGroup.valueChanges
            .subscribe((values) => {
                // Get collaborator by filter
                this.getCollaboratorsByFilter();
        });

        this.filteredClients = this.clientControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filterClient(value))
        );

        this.collaboratorControl.valueChanges
            .pipe(
                startWith(''),
                map((value) => this._filterCollaborator(value))
            )
            .subscribe((value) => {
                this.filteredCollaborators = value;
                this._changeDetectorRef.markForCheck();
            });

        this.requestControl.valueChanges
            .pipe(
                startWith(''),
                map((value) => this._filterRequest(value))
            )
            .subscribe((value) => {
                this.filteredRequest = value;
                this._changeDetectorRef.markForCheck();
            });

        this.status$ = this._assignmentOccupationService.status$;

        this._assignmentOccupationService.collaboratorsSelected = [];

        this._assignmentOccupationService.collaboratorSelectedRemove$.subscribe(
            (collaboratorId) => {
                if (collaboratorId !== null) {
                    for (let i = 0; i < this.collaboratorSelected.length; i++) {
                        if (
                            this.collaboratorSelected.at(i).value.id ===
                            collaboratorId
                        ) {
                            this.collaboratorSelected.at(i).setValue({
                                id: collaboratorId,
                                checked: false,
                            });
                        }
                    }
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        );

        this._handleEventSavedOccupation();
        this._handleChangeStatus();
        this._getStatus();
        this._getClients();
        this._getKnowledges();
        this._getResponsibleByClient();
        this._handleChangeResponsible();
        this._getCollaboratorsByRequest();
        this._handleEventTab();
        this._getAllCollaboratorOccupation();
    }

    /**
     * On destroy
     */
     ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * collaboratorSelected
     */
    get collaboratorSelected() {
        return this.collaboratorArrayForm.get(
            'collaboratorSelected'
        ) as FormArray;
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
     * status Control
     */
    get statusControl() {
        return this.filterForm.get('statusControl');
    }

    /**
     * Filter clients
     */
    get filterClients() {
        return this.filterCollaboratorsGroup.get('filterClients') as FormArray;
    }

    /**
     * Filter knowledges
     */
    get filterKnowledges(): FormArray {
        return this.filterCollaboratorsGroup.get('filterKnowledges') as FormArray;
    }

    /**
     * Filter occupations
     */
    get filterOccupation(): AbstractControl {
        return this.filterCollaboratorsGroup.get('filterOccupation');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get collaborators by filter
     * 
     */
    getCollaboratorsByFilter() {
        const {
            filterClients,
            filterKnowledges,
            filterOccupation,
            filterDateInit,
            filterDateEnd
        } = this.filterCollaboratorsGroup.getRawValue();

        const filteredClients = filterClients.filter(
            (item) => item.checked && item.id
        );
        const clientsId = filteredClients.map(
            (item) => item.id
        );
        const filteredKnowledges = filterKnowledges.filter(
            (item) => item.checked && item.id
        );
        const knowledgesId = filteredKnowledges.map((item) => item.id);
        
        console.log("request: ", this.request);

        this._assignmentOccupationService
            .getFilterCollaborator(
                clientsId,
                knowledgesId,
                filterOccupation,
                filterDateInit,
                filterDateEnd,
                this.request?.id,
            )
            .subscribe((response) => {
                //this._setCollaboratorsRecomm();
            });
    }

    /**
     * Get collaborators assigned
     *
     * @param requestId
     */
    getCollaboratorsAssigned(requestId: number) {
        this._requestService.getCollaboratorsAssigned(requestId)
            .subscribe((collaborators) => {
                collaborators.forEach((item) => {
                    item.name = item.name + ' ' + item.lastName;
                });
                this.dataCollab.data = collaborators;
                // Mark as check
                this._changeDetectorRef.markForCheck();
            });
    }
    

    /**
     * Handle event tab
     *
     */
    private _handleEventTab() {
        this._assignmentOccupationService.tabIndex$.subscribe((tabIndex) => {
            if (tabIndex === 0) {
                this.isEditing = false;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Set occupation for collaborator
     * 
     * @param collaborator
     */
    setOccupation(collaborator: any) {
        this.assigments = {
            assigments: [{
                id                      : collaborator.occupationId,
                requestId               : collaborator.requestId,
                request           : this.requestControl.value,
                occupationPercentage    : collaborator.occupationPercentage,
                assignmentStartDate     : collaborator.startDate,
                assignmentEndDate       : collaborator.endDate,
                roleId                  : collaborator.roleId,
                observations            : collaborator.observations,
                isActive                : 1,
            }]
        };

        this.collaborator = {
            id          : collaborator.collaboratorId,
            name        : collaborator.name,
            lastName    : collaborator.lastName
        };

        this.isEditing = true
    }

    /**
     * Edit occupation
     *
     * @param collaborator
     */
    editOccupation(collaborator: Collaborator) {
        this.collaborator = collaborator;
        // Get occupations for collaborator
        this._assignmentOccupationService
            .getOccupationsByCollaborator(collaborator.id)
                .pipe(finalize(() => (this.isEditing = true)))
                    .subscribe((response) => {
                        this.assigments = response;
                    });
    }

    /**
     * On delete assignment
     *
     */
    onDeleteAssignment() {
        this.editOccupation(Object.assign({}, this.collaborator));
    }

    /**
     * On return previous
     *
     * @param event
     */
    onReturnPrevious(event: any) {
        this.isEditing = false;
        // Get all collaborators occupation
        this._getAllCollaboratorOccupation();
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    test() {
        this._getAllCollaboratorOccupation();
    }

    /**
     * Get all collaborators occupation
     *
     */
    private _getAllCollaboratorOccupation() {
        this._assignmentOccupationService
            .getAllColaboratorOccupation()
            .subscribe((collaborators) => {
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Restarting list
     *
     */
    restartingList(control: FormControl) {
        control.setValue('', { emitEvent: false });
        control.updateValueAndValidity({ onlySelf: true, emitEvent: true });
        ///this.inputBranch.nativeElement.focus();
    }

    /**
     * Clear form client
     *
     */
    clearFormClientAndRequest(control: FormControl) {
        this.dataCollab.data = [];
        this.selectedRequest = null;
        this.request = null;
        this.hasRequest = true;
        // Get collaborators by filter
        this.getCollaboratorsByFilter();
        // Restarting list
        this.restartingList(control);
    }

    /**
     * Handle event saved occupation
     *
     */
    private _handleEventSavedOccupation() {
        this._assignmentOccupationService.isSuccess$.subscribe((success) => {
            if (success) {
                this._getAllCollaboratorOccupation();
                this.selectedResponsible = null;
                this.selectedClient = null;
                this.selectedRequest = null;
                this.hasCheckedCollaborator = false;
                this._assignmentOccupationService.collaboratorsSelected = [];
                // Clear form array of collaborator selected
                this.collaboratorSelected.clear();
                this.filterForm.setValue({
                    myControl: '',
                    requestControl: '',
                    clientControl: '',
                    collaboratorControl: '',
                    statusControl: '',
                    selectControl: '',
                });
            }
        });
    }

    private _handleChangeStatus() {
        this.statusControl.valueChanges.subscribe((value) => {
            if (value) {
                this._assignmentOccupationService.selectedFiltered.status =
                    this.status.find((item) => item.id === value).name;

                if (this.selectedResponsible) {
                    // Get all request by responsible
                    this._getRequestByResponsible(this.selectedResponsible);
                } else if (this.selectedClient) {
                    // Get all collaborators by client
                    this._getCollaboratorsByClient(this.selectedClient.id);
                    // Get all request by client
                    this._getRequestByClient(this.selectedClient.id);
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    private _getStatus() {
        this._assignmentOccupationService
            .getStatus()
            .subscribe((status: Status[]) => {
                this.status = status;
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
            .subscribe((clients) => {
                clients.sort(this._sortArray);
                this.clients = clients;

                // Create form array filterClients
                for (let i = 0; i < this.clients.length; i++) {
                    this.filterClients.push(
                        this._fb.group({
                            id: [this.clients[i].id],
                            name: [this.clients[i].name],
                            checked: [false],
                        }),
                        { emitEvent: false }
                    );
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        //this.collaborators$ = this._assignmentOccupationService.collaborators$;
    }

    /**
     * Get all knowledges
     */
    private _getKnowledges() {
        this._assignmentOccupationService.knowledges$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((knowledges) => {
                knowledges.sort(this._sortArray);
                this.knowledges = knowledges;

                // Create form array filterClients
                for (let i = 0; i < this.knowledges.length; i++) {
                    this.filterKnowledges.push(
                        this._fb.group({
                            id: [this.knowledges[i].id],
                            name: [this.knowledges[i].name],
                            checked: [false],
                        }),
                        { emitEvent: false }
                    );
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Get all responsible by client
     *
     */
    private _getResponsibleByClient() {
        this.clientControl.valueChanges.subscribe((value) => {
            const client = this.clients.find((item) => item.name === value);

            this.showFlashMessage('success', 'Asignación eliminada con éxito');

            if (client) {
                this.selectedClient = client;
                this._assignmentOccupationService.selectedFiltered.client = client.name;
                this._getCollaboratorsByClient(this.selectedClient.id);
                this._getRequestByClient(this.selectedClient.id);
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
        this._assignmentOccupationService
            .getCollaboratorsByClient(clientId)
            .subscribe((collaborators) => {
                this.collaborators = collaborators;
                this.collaboratorControl.setValue('');
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Get all request by client
     *
     */
    private _getRequestByClient(clientId: number) {
        this._assignmentOccupationService
            .getRequestByClient(clientId, this.statusControl.value || null)
            .subscribe((requests) => {
                this.requests = requests;

                this.hasRequest = this.requests.length > 0 ? true : false;

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
        this.collaboratorControl.valueChanges.subscribe((value) => {
            const responsible = this.collaborators.find(
                (item) => item.name + ' ' + item.lastName === value
            );

            if (responsible) {
                this.selectedResponsible = responsible;
                this._assignmentOccupationService.selectedFiltered.responsible =
                    responsible.name;
                this._getRequestByResponsible(this.selectedResponsible);
            } else if (this.selectedResponsible && value === '') {
                this.selectedResponsible = null;
                this._getRequestByClient(this.selectedClient.id);
                // this.requests = [];
                this.requestControl.setValue('');
                this.dataCollab.data = [];
                this.selectedRequest = null;
            } else {
                this.dataCollab.data = [];
                this.selectedRequest = null;
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
        this._assignmentOccupationService
            .getRequestByResponsible(
                responsible.id,
                this.statusControl.value || null
            )
            .subscribe((requests) => {
                this.requests = requests;
                this.requestControl.setValue('');
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Update filter values
     * 
     * @param value
     * @param filterArray
     */
    private updateFilterValues(value: any, values: any[], filterArray: FormArray) {
        const valueFind = values.findIndex(item => item.id === value.id);
                    
        if ( valueFind > -1 ) {
            filterArray.at(valueFind).setValue({
                id: value.id,
                name: value.name,
                checked: true,
            }, {onlySelf: true});

            filterArray.at(valueFind).updateValueAndValidity();
        }
    }

    /**
     * _getCollaboratorsByRequest
     *
     */
    private _getCollaboratorsByRequest() {
        this.requestControl.valueChanges
            .subscribe(value => {
                // Get instance selected request
                this.request = this.requests.find(item => item.titleRequest === value);
                
                if ( this.request ) {
                    // Get collaborators assigned to request
                    this.getCollaboratorsAssigned(this.request.id);
                    
                    const clients = this.filterClients.getRawValue();

                    this.selectedFilterClient = true;

                    this.updateFilterValues(this.request.client, clients, this.filterClients);

                    if ( this.request.knowledges.length > 0 ) {
                        // Loop for each knwoledge
                        
                        const knowledges = this.filterKnowledges.getRawValue();

                        this.request.knowledges.forEach(({knowledge}) => {
                            this.updateFilterValues(knowledge, knowledges, this.filterKnowledges);
                        });

                        this.selectedFilterKnowledge = true;
                    }

                    // Get collaborators by filter
                    this.getCollaboratorsByFilter();
                    
                }
                // Get recommended
                this.getCollaboratorsRecommended();
            });
    }

    /**
     * Select Tab
     */
    selectTab() {
        this.collaboratorsRecomm = [];

        switch (this._tab.selectedIndex) {
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
        const request = this.requests.find(
            (item) => item.titleRequest === this.requestControl.value
        );

        if (request) {
            this._assignmentOccupationService.requestSelected = request;
            this.selectedRequest = true;
        } else {
            this.collaboratorsRecomm = [];
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * Get collaboratorsByClient
     */
    getCollaboratorsByClients() {
        const request = this.requests.find(
            (item) => item.titleRequest === this.requestControl.value
        );

        if (request) {
            this._assignmentOccupationService
                .getCollaboratorsRecommendedByClient(request.id)
                .subscribe((collaborators) => {
                    this.collaboratorsRecomm = collaborators;
                    // Update the collaboatorsRecomm
                    this._setCollaboratorsRecomm();
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
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
        const request = this.requests.find(
            (item) => item.titleRequest === this.requestControl.value
        );

        if (request) {
            this._assignmentOccupationService
                .getCollaboratorRecommendedByKnowledge(request.id)
                .subscribe((collaborators) => {
                    this.collaboratorsRecomm = collaborators;
                    // Update the collaboatorsRecomm
                    this._setCollaboratorsRecomm();
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
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
        const request = this.requests.find(
            (item) => item.titleRequest === this.requestControl.value
        );

        if (request) {
            this._assignmentOccupationService
                .getCollaboratorRecommendedByFree(request.id)
                .subscribe((collaborators) => {
                    this.collaboratorsRecomm = collaborators;
                    // Update the collaboatorsRecomm
                    this._setCollaboratorsRecomm();
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
        } else {
            this.collaboratorsRecomm = [];
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * Check collaborators Selected
     *
     */
    private _checkCollaboratorsSelected() {
        for (let i = 0; i < this.collaboratorSelected.length; i++) {
            const collaboratorSelected =
                this._assignmentOccupationService.collaboratorsSelected.find(
                    (item) =>
                        item.id === this.collaboratorSelected.at(i).value.id
                );

            if (collaboratorSelected) {
                this.collaboratorSelected.at(i).setValue({
                    id: this.collaboratorSelected.at(i).value.id,
                    checked: true,
                });
            }
        }
    }

    /**
     * Set CollaboratorsRecomm
     *
     */
    private _setCollaboratorsRecomm() {
        // Clear formArray
        this.collaboratorSelected.clear();
        // Set formArray
        this.collaboratorOccupation.forEach((item) => {
            // Create form group of collaborator
            const collaboratorGroup = this._fb.group({
                id: [item.id],
                checked: [false],
            });

            this.collaboratorSelected.push(collaboratorGroup);
            // value.collaboratorSelected[i] = this.collaborators[i];
        });

        this._checkCollaboratorsSelected();
        this._handleChangeArrayForm();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * handle ChangeArrayForm
     * 
     */
    private _handleChangeArrayForm() {
        this.collaboratorOccupation.forEach((item, index) => {
            this.collaboratorSelected.at(index).valueChanges
                    .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((collaborator) => {
                            // find if collaborator already selected
                            const collaboratorIndex =
                                this._assignmentOccupationService.collaboratorsSelected.findIndex(
                                    (item) => item.id === collaborator.id
                                );

                            collaboratorIndex >= 0
                                ? this._assignmentOccupationService.collaboratorsSelected.splice(collaboratorIndex, 1)
                                : this._assignmentOccupationService.collaboratorsSelected.push(item);

                            this.hasCheckedCollaborator =
                                this._assignmentOccupationService.collaboratorsSelected.length > 0 ? true : false;
                        });
        });
    }

    /**
     * _filterClient
     * @param value
     */
    private _filterClient(value: any): string[] {
        const filterValue = value.toLowerCase();

        let val = this.clients.map((option) => option.name);
        return val.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    /**
     * _filterCollaborator
     * @param value
     */
    private _filterCollaborator(value: string): string[] {
        const filterValue = value.toLowerCase();
        const val = this.collaborators.map(
            (option) => option.name + ' ' + option.lastName
        );
        return val.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    /**
     * _filterRequest
     * @param value
     */
    private _filterRequest(value: string): string[] {
        const filterValue = value.toLowerCase();
        const val = this.requests.map((option) => option.titleRequest);
        return val.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }

    /**
     * Validate the collaborator
     *
     */
    validateCollaborator() {
        if (this.requests.length <= 0) {
            this.showFlashMessage(
                'error',
                'No hay solicitudes para este cliente'
            );
        }
    }

    /**
     *
     * @param name
     */
    dismissFuse(name) {
        this.successSave = 'No hay solicitudes para este cliente';
        this._fuseAlertService.dismiss(name);
    }

    showFlashMessage(type: 'success' | 'error' | 'info', message: string): void {
        // Show the message
        this.flashMessage = 'info';

        this._fuseAlertService.show('alertBox4');
        // Set message title
        this.successSave = message;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        // setTimeout(() => {
        //     this.flashMessage = null;

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // }, 3000);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    assignActivity(collaborator) {
        this._assignmentOccupationService.setCollaboratorByAssign(collaborator);
        this._assignmentOccupationService.setTabIndex(1);
    }

    /**
     * Sort array
     *
     * @param x
     * @param y
     * @returns
     */
    private _sortArray(x, y): number {
        if (x.name < y.name) {
            return -1;
        }
        if (x.name > y.name) {
            return 1;
        }
        return 0;
    }

    /**
     * Change tab
     *
     */
    changeTab() {
        this._assignmentOccupationService.setTabIndex(1);
    }

    handleCheckEvent(client: any) {
        //client = !client.selected;

        this.selectedClients.forEach((item) => {
            if (item.name === client.name) {
                item.selected = !item.selected;
            }
        });

        // Mark as check
        this._changeDetectorRef.markForCheck();
    }
}
