import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { Observable, Subject } from 'rxjs';
import { EvaluationService } from '../evaluation.service';
import { Collaborator, Department } from '../evaluation.types';
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
    filterCollaboratorsGroup: FormGroup;
    selectedFilterClient: boolean = false;
    selectedFilterKnowledge: boolean = false;
    selectedFilterOccupation: boolean = false;
    range: FormGroup;
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

        // Form group for range
        this.range = new FormGroup({
            start: new FormControl(),
            end: new FormControl(),
        });

        // Create form group for filter collaborators
        this.filterCollaboratorsGroup = this._formBuilder.group({
            filterClients: new FormArray([]),
            filterKnowledges: new FormArray([]),
            filterOccupation: [0],
            filterDateInit: [''],
            filterDateEnd: [''],
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

    /**
     * Filter clients
     * 
     */
    get filterClients() {
        return this.filterCollaboratorsGroup.get('filterClients') as FormArray;
    }

    /**
     * Filter knowledges
     * 
     */
    get filterKnowledges(): FormArray {
        return this.filterCollaboratorsGroup.get('filterKnowledges') as FormArray;
    }

    /**
     * Filter occupations
     * 
     */
    get filterOccupation(): AbstractControl {
        return this.filterCollaboratorsGroup.get('filterOccupation');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Handle event checkbox
     * 
     * @param collaborator 
     */
    handleEventCheckbox(collaborator) {
        
        // find if collaborator already selected
        const collaboratorIndex = this._evaluationService.collaboratorsSelected.findIndex(
            (item) => item.id === collaborator.value.id
        );

        collaboratorIndex >= 0 ? this._evaluationService.collaboratorsSelected.splice(collaboratorIndex, 1)
                                : this._evaluationService.collaboratorsSelected.push(collaborator.value);

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

    

}

