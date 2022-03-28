import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { map } from 'rxjs/operators';
import { Collaborator } from '../../../collaborators/collaborators.types';
import { DateValidator } from '../../asignation/date-validation';
import { AssingmentOccupationService } from '../../assingment-occupation.service';
import { limitOccupation } from '../../partner-search/limit-occupation';

@Component({
  selector: 'app-update-occupation',
  templateUrl: './update-occupation.component.html',
  styleUrls: ['./update-occupation.component.scss']
})
export class UpdateOccupationComponent implements OnInit {

	@Input() set collaboratorAssigment(collaborator: any) {
		console.log("update: ", collaborator);
		this.collaboratorOccupations = collaborator;
		this._setFormOcupation(collaborator);
	}

	@Input('collaborator') collaborator;
	@Output('returnPrevious') returnPrevious: EventEmitter<any> = new EventEmitter();

	collaboratorOccupations: any = null;
	successSave: string;
    flashMessage: 'success' | 'error' | null = null;

  	collaboratorsArr: any[] = [];
	percentageTotal: number = 0;

  	// Form Array
    formOcupation: FormGroup = this._formBuilder.group({
        collaboratorOccupation: this._formBuilder.array([])
    });

  	constructor(
		private _formBuilder: FormBuilder,
		private _assignmentOccupationService: AssingmentOccupationService,
		private _fuseConfirmationService: FuseConfirmationService,
		private _fuseAlertService: FuseAlertService,
		private _changeDetectorRef: ChangeDetectorRef,
	) { }

	// -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
	
	ngOnInit(): void {

		console.log("colaborador: ", this.collaborator);
		//this.collaboratorsArr = [...aux];

		// Set the form ocupation
		//this._setFormOcupation();
		this._handleChangeFormOccupation();
	}

  	// -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

  	/**
     * Get collaborator occupation
     * 
     */

  	get collaboratorOccupation() {
		return this.formOcupation.get('collaboratorOccupation') as FormArray;
	}


	// -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

	/**
	 * Handle change form occupation
	 * 
	 */
	private _handleChangeFormOccupation() {
		this.formOcupation.valueChanges
			.pipe(
				map(occupations => occupations.collaboratorOccupation)
			)
			.subscribe(occupations => {
				console.log("occupations: ", occupations);
				this._calculatePercentageTotal(occupations);

				// if ( occupations.length > 0 ) {
				// 	for (let i = 0; i < occupations.length; i++) {
				// 		this.collaboratorOccupation.at(i).setValidators(limitOccupation(this.percentageTotal));
				// 		this.collaboratorOccupation.at(i).updateValueAndValidity({onlySelf: true, emitEvent:false});
				// 	}
				// }

				
				// Mark for check
				this._changeDetectorRef.markForCheck();
			})
	}

	test() {
		for (let i = 0; i < this.collaboratorOccupation.length; i++) {
			console.log("total: ", this.percentageTotal);

			this.collaboratorOccupation.at(i).setValidators(limitOccupation(this.percentageTotal));
			this.collaboratorOccupation.at(i).updateValueAndValidity({onlySelf: true, emitEvent: true});
		}
	}

	private _calculatePercentageTotal(occupations) {
		this.percentageTotal = 0;
		occupations.forEach(item => {
			this.percentageTotal = this.percentageTotal + Number(item.occupation);
		});
	}

  	/**
     * Set the form Ocupation
     * 
     */
   	private _setFormOcupation(collaborator: any) {
		if ( collaborator ) {
			this.collaboratorOccupation.clear();

			console.log("Assigments: ", collaborator.assigments);
			collaborator.assigments.forEach(item => {
				
				if ( item && item?.isActive ) {
					console.log("item: ", item);
					let collaboratorOccupation: FormGroup = this._formBuilder.group({
						id              : [item.id],
						requestId 		: [item.requestId],
						requestTitle	: [item.request],
						name            : ['', Validators.required],
						occupation      : [item.occupationPercentage, [Validators.required, Validators.maxLength(100), limitOccupation(item.occupationPercentage)]],
						observation     : [item.observations],
						dateInit        : [item.assignmentStartDate, Validators.required],
						dateEnd         : [item.assignmentEndDate, Validators.required],
						isCollapse      : [false],
					}, {validator: DateValidator});
					
					// Initial default value
					collaboratorOccupation.get('name').setValue(collaborator.name + ' ' + collaborator.lastName);
					// Add collaboratorOcupation to formOcupation
					this.collaboratorOccupation.push(collaboratorOccupation);
				}
			});

			this._calculatePercentageTotal(this.collaboratorOccupation.value);
			console.log("collaboratorOccupation: ", this.collaboratorOccupation.value);
			// Handle event from array form
			//this._handleChangeArrayForm();
		}
	}

	/**
     * Show Flash Message
     *
     * @param type
     */
	showFlashMessage(type: 'success' | 'error', message: string): void
	{
		// Show the message
		this.flashMessage = type;

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
     * Dismiss fuse
     * 
     * @param name
     */
	 dismissFuse(name){
		this._fuseAlertService.dismiss(name);
	}

	/**
     * Get calculate percentage real
     *
     */
	 calculatePercentageReal(collaboratorAssignation) {
        // const collaboratorIndex = this.collaboratorsArr.findIndex(item => item && (item.id === collaboratorAssignation.id));
        
        // if ( collaboratorAssignation ) {
        //     return Number(collaboratorAssignation.occupation) + Number(this.collaboratorsArr[collaboratorIndex].occupationPercentage);
        // }

		return 100;
    }

	updateAssigmentOccupation(assignation: any) {

		console.log("collaboratorAssignation:", assignation);

		const assignationOccupation = {
			occupationPercentage: assignation.occupation,
			assignmentStartDate: assignation.dateInit,
			assignmentEndDate: assignation.dateEnd,
			observations: assignation.observation,
			isActive: 1,
			code: '213',
			request: {
				id: assignation.requestId
			},
			collaborator: {
				id: this.collaborator.id
			},
			id: assignation.id
		};

		const confirmation = this._fuseConfirmationService.open({
			title  : 'Editar asignación',
			message: '¿Seguro que quiere editar la asignación?',
			icon: {
				show: true,
				name: "heroicons_outline:check",
				color: "primary"
			},
			actions: {
				confirm: {
					label: 'Editar asignación',
					color: 'primary'
				}
			}
		});

		// Subscribe to the confirmation dialog closed action
		confirmation.afterClosed().subscribe((result) => {

				// If the confirm button pressed...
				if ( result === 'confirmed' )
				{
					this._assignmentOccupationService.updateOccupationsByCollaborator(assignation.id, assignationOccupation)
						.subscribe(response => {
							console.log("Asignación editada con exito: ", response);
							// Show notification update request
							this.showFlashMessage('success', 'Asignación editada con éxito');
							// Set time out for change tab
							setTimeout(() => {
								// this._router.navigate(['dashboards/assignment-occupation/index']);
								// this._assignmentOccupationService.setTabIndex(1);
							}, 2000); 
						});

				}
			});

	}

	deleteAssigmentOccupation(assignation: any) {

		const assignationOccupation = {
			occupationPercentage: assignation.occupation,
			assignmentStartDate: assignation.dateInit,
			assignmentEndDate: assignation.dateEnd,
			observations: assignation.observation,
			isActive: 0,
			code: '213',
			request: {
				id: assignation.requestId
			},
			collaborator: {
				id: this.collaborator.id
			},
			id: assignation.id
		};

		console.log("assignation a eliminar: ", assignationOccupation);

		const confirmation = this._fuseConfirmationService.open({
			title  : 'Eliminar asignación',
			message: '¿Seguro que quiere eliminar la asignación?',
			actions: {
                confirm: {
                    label: 'Eliminar asignación',
                }
            }
		});

		// Subscribe to the confirmation dialog closed action
		confirmation.afterClosed().subscribe((result) => {

				// If the confirm button pressed...
				if ( result === 'confirmed' )
				{
					this._assignmentOccupationService.deleteOccupation(assignation.id, assignationOccupation)
						.subscribe(response => {
							console.log(response);
							// Show notification update request
							//this.showFlashMessage('success', 'Asignación guardada con éxito');
							// Set time out for change tab
							setTimeout(() => {
								// this._router.navigate(['dashboards/assignment-occupation/index']);
								// this._assignmentOccupationService.setTabIndex(1);
							}, 2000); 
						});

				}
			});
	}

	showCollaborators() {
		console.log("show collaborators");
		this.returnPrevious.emit('');
	}

}
