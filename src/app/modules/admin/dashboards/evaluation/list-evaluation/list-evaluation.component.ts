import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { EvaluationService } from '../evaluation.service';
import { Collaborator, Department } from '../evaluation.types';
@Component({
  selector: 'app-list-evaluation',
  templateUrl: './list-evaluation.component.html',
  styleUrls: ['./list-evaluation.component.scss']
})
export class ListEvaluationComponent implements OnInit {
    
    private _collaborators$: Observable<Collaborator[]>;
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
    tabIndex: number = 0;
    collaborators: Collaborator[];
    filterCollaboratorsGroup: FormGroup;
    selectedFilterClient: boolean = false;
    selectedFilterKnowledge: boolean = false;
    selectedFilterOccupation: boolean = false;
    range: FormGroup = new FormGroup({
        start: new FormControl(),
        end: new FormControl(),
    });

    collaboratorArrayForm: FormGroup = new FormGroup({
        collaboratorSelected: new FormArray([]),
    });

    constructor(
        private _formBuilder: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _evaluationService: EvaluationService,
    )  {
        // Create form group for filter collaborators
        this.filterCollaboratorsGroup = this._formBuilder.group({
            filterClients: new FormArray([]),
            filterKnowledges: new FormArray([]),
            filterOccupation: [0],
            filterDateInit: [''],
            filterDateEnd: [''],
        });
    }

    ngOnInit(): void {

        this._collaborators$ = this._evaluationService.collaborators$;
        this.departments$ = this._evaluationService.departments$;

        this._setFormArrayCollaborators();
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
        )
        
    }

}

