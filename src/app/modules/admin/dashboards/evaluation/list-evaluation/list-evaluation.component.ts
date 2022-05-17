import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { collaborators } from 'app/mock-api/dashboards/collaborators/data';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _evaluationService: EvaluationService,
        private _requestService   : RequestService,
        private _modalFocuxService : ModalFocuxService
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
            template       : ['', [Validators.required]],
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
        this._setFormArrayCollaborators();

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
    

    handleEventFilter(filterValues) {

        console.log("filterValues: ", filterValues);
    }

    /**
     * Handle event checkbox
     * 
     * @param collaborator 
     */
    handleEventCheckbox(collaborator) {
        console.log("collaborator: ", collaborator)
        console.log("Evaluation service: ", this._evaluationService.collaboratorsSelected);
        // find if collaborator already selected
        const collaboratorIndex = this._evaluationService.collaboratorsSelected.findIndex(
            (item) => item.id === collaborator.id
        );

        collaboratorIndex >= 0 ? this._evaluationService.collaboratorsSelected.splice(collaboratorIndex, 1)
                                : this._evaluationService.collaboratorsSelected.push(collaborator);

        this.hasCheckedCollaborator = this._evaluationService.collaboratorsSelected.length > 0 ? true : false;
    }

    /**
     *  Set form array the collaborators
     *
     */
     private _setFormArrayCollaborators() {

        this._collaborators$.subscribe(
            collaborators => {
                this.collaborators = collaborators;
                // Clear formArray
                this.collaboratorSelected.clear();
                // Set formArray
                collaborators.forEach((item) => {
                    // Create form group of collaborator
                    const collaboratorGroup = this._formBuilder.group({
                        id: [item.id],
                        checked: [false],
                    });
        
                    this.collaboratorSelected.push(collaboratorGroup);
                    // value.collaboratorSelected[i] = this.collaborators[i];
                });
        
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
        this._evaluationService.setTabIndex(1);
       
    }
    /**
     * showModalEvaluation
     * 
     *
     */
     showModal() {
        this.openPopup();
    }

    /**
     * Open popup
     *
     * 
     */
     openPopup(): void  {

        let actionOption;
        actionOption = 'evaluation-template';
        this._modalFocuxService.open({
            template: this.tplDetail, title: actionOption,
          },
          {width: 300, height: 2880, disableClose: true, panelClass: 'summary-panel'}).subscribe(confirm => {
            if ( confirm ) {
                console.log("hiii")
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

