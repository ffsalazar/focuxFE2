import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { collaborators } from 'app/mock-api/dashboards/collaborators/data';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { EvaluationService } from '../evaluation.service';
import { Client, Collaborator, Department, Knowledge } from '../evaluation.types';
import { RequestService } from 'app/modules/admin/apps/portafolio/request/request.service';
import { ModalFocuxService } from 'app/core/services/modal-focux/modal-focux.service';
@Component({
  selector: 'app-list-evaluation',
  templateUrl: './list-evaluation.component.html',
  styleUrls: ['./list-evaluation.component.scss']
})
export class ListEvaluationComponent implements OnInit {

    private _collaborators$: Observable<Collaborator[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    departments$: Observable<Department[]>;

    periods: any[] = [
        {
            id: 1,
            dateInit: 'Enero',
            dateEnd: 'Marzo'
        },
        {
            id: 2,
            dateInit: 'Abril',
            dateEnd: 'Junio'
        },
        {
            id: 3,
            dateInit: 'Julio',
            dateEnd: 'Septiembre'
        },
        {
            id: 4,
            dateInit: 'Octubre',
            dateEnd: 'Diciembre'
        },

    ];
    hasCheckedCollaborator: boolean = false;
    tabIndex: number = 0;
    collaborators: Collaborator[];
    clients: Client[];
    knowledges: Knowledge[];
    selectedFilterClient: boolean = false;
    selectedFilterKnowledge: boolean = false;
    selectedFilterOccupation: boolean = false;
    collaboratorArrayForm: FormGroup;
    filterCollaboratorForm: FormGroup;
    filterTemplate: FormGroup;
    @ViewChild('evaluationOptiosModal') private tplDetail: TemplateRef<any>;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private _formBuilder        : FormBuilder,
        private _changeDetectorRef  : ChangeDetectorRef,
        private _evaluationService  : EvaluationService,
        private _requestService     : RequestService,
        private _modalFocuxService  : ModalFocuxService
    )  {

        this.collaboratorArrayForm = new FormGroup({
            collaboratorSelected: new FormArray([]),
        });

        // Create form group for filter collaborators
        this.filterCollaboratorForm = this._formBuilder.group({
            period       : ['', [Validators.required]],
            department   : ['', [Validators.required]],
        });

        // Create form group for filter collaborators
        this.filterTemplate = this._formBuilder.group({
            template       : ['', []],
            teamplateradio : ['', [Validators.required]],
        });
    }

    favoriteSeason: string;
    templates= [{id: 1, name: 'Plantilla Trainee'}, {id: 2, name: 'Plantilla Jr'}, {id: 3, name: 'Plantilla S-Sr'},{id: 4, name: 'Plantilla Sr'}];

    /**
     * On init
     * 
     */
    ngOnInit(): void {
        
        this._collaborators$ = this._evaluationService.collaborators$;
        this.departments$ = this._evaluationService.departments$;
        
        this._getClients();
        this._getKnowledges();
        this._getCollaboratorsEvaluated();
        this._handleChangeFilterCollaboratorForm();
    }

    /**
     * On destroy
     * 
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
     * 
     */
     get collaboratorSelected() {
        return this.collaboratorArrayForm.get('collaboratorSelected') as FormArray;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * Handle change filter collaborator form
     * 
     */
    private _handleChangeFilterCollaboratorForm() {
        this.filterCollaboratorForm.valueChanges.
            pipe(
                switchMap(({period, department}) => {
                    return this._evaluationService.getCollaboratorsEvaluated(period, department);
                })
            ).subscribe(response => {
                console.log(response);
            });
    }

    handleEventFilter(filterValues) {
        console.log("filterValues: ", filterValues);
    }

    /**
     *  Get collaborators evaluated
     *
     */
     private _getCollaboratorsEvaluated() {
        this._collaborators$.subscribe(
            collaborators => {
                this.collaborators = collaborators;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        );
    }

    /**
     * Change tab
     *
     */
    changeTab() {
        this._modalFocuxService.closeModal();
        this._evaluationService.template = this.templates.find(item => item.id === this.filterTemplate.get('teamplateradio').value);
        this._evaluationService.period = this.filterCollaboratorForm.get('period').value;
        this._evaluationService.setTabIndex(1);
    }

    /**
     * showModalEvaluation
     *
     */
    showModal() {
        this._openPopup();
    }

    /**
     * Open popup
     *
     */
    private _openPopup() {
        let actionOption;

        actionOption = 'evaluation-template';

        this._modalFocuxService.open({
            template: this.tplDetail, title: actionOption,
          },
          {width: 300, height: 2880, disableClose: true, panelClass: 'summary-panel'}).subscribe(confirm => {
            if ( confirm ) {
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Get all clients
     *
     */
    private _getClients() {
        this._evaluationService.clients$
            .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((clients: Client[]) => {
                    this.clients = clients;
                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                });
    }

    /**
     * Get all knowledges
     * 
     */
     private _getKnowledges() {
        this._evaluationService.knowledges$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((knowledges: Knowledge[]) => {
                this.knowledges = knowledges;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

}

