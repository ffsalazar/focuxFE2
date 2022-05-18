import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { EvaluationService } from '../evaluation.service';

@Component({
	selector: 'app-list-collaborators',
	templateUrl: './list-collaborators.component.html',
	styleUrls: ['./list-collaborators.component.scss']
})
export class ListCollaboratorsComponent implements OnInit {

	@Input('collaborators') collaborators: any[] = [];
	@Input('filterCollaboratorForm') filterCollaboratorForm: FormGroup;
	@Output('handleEventClick') handleEventClick: EventEmitter<any> = new EventEmitter<any>();

	collaboratorArrayForm: FormGroup;
	hasCheckedCollaborator: boolean;

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	constructor(
		private _formBuilder		: FormBuilder,
		private _changeDetectorRef	: ChangeDetectorRef,
		private _evaluationService	: EvaluationService,
	) { }

	ngOnInit(): void {

		this.collaboratorArrayForm = new FormGroup({
            collaboratorSelected: new FormArray([]),
        });

		this._setFormArrayCollaborators();
	}

	// -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * collaboratorSelected
     * 
     */
     get collaboratorSelected() {
        return this.collaboratorArrayForm.get('collaboratorSelected') as FormArray;
    }

    // -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
     * Handle event checkbox
     * 
     * @param collaborator 
     */
    handleEventCheckbox(collaborator) {
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
		// Clear formArray
		this.collaboratorSelected.clear();
		// Set formArray
		this.collaborators.forEach((item) => {
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

}
