import { ChangeDetectorRef, Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Subject, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Collaborator } from '../../../collaborators/collaborators.types';
import { DateValidator } from '../../asignation/date-validation';
import {
    RolesRequest,
} from "../../assignment-occupation.types";
import { AssingmentOccupationService } from '../../assingment-occupation.service';
import { limitOccupation } from '../../partner-search/limit-occupation';

@Component({
  selector: 'app-update-occupation',
  templateUrl: './update-occupation.component.html',
  styleUrls: ['./update-occupation.component.scss']
})
export class UpdateOccupationComponent implements OnInit, OnDestroy {

	@Input() set collaboratorAssigment(collaborator: any) {
		this.collaboratorOccupations = collaborator;
		this._setFormOcupation(collaborator);
	}

	@Input('collaborator') collaborator;
	@Output('returnPrevious') returnPrevious: EventEmitter<any> = new EventEmitter();
	@Output('deleteAssignment') deleteAssignment: EventEmitter<any> = new EventEmitter();

	rolesRequest$: Observable<RolesRequest[]>;

	collaboratorOccupations: any = null;
	successSave: string;
    flashMessage: 'success' | 'error' | null = null;
	isActive: boolean = false;
  	collaboratorsArr: any[] = [];
	percentageTotal: number = 0;

  	// Form Array
    formOcupation: FormGroup = this._formBuilder.group({
        collaboratorOccupation: this._formBuilder.array([])
    });

	dissmisible: boolean = true;

	private _unsubscribeAll: Subject<any> = new Subject<any>();

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
	
	/**
	 * ngOnInit
	 * 
	 */
	ngOnInit(): void {
		
		this.rolesRequest$ = this._assignmentOccupationService.rolesRequest$
            .pipe(takeUntil(this._unsubscribeAll));

		this._fuseAlertService.onDismiss
			.pipe(takeUntil(this._unsubscribeAll))
				.subscribe(response => {
				});

		this._fuseAlertService.dismiss('alertBox4');

		// mark for check
		this._changeDetectorRef.markForCheck();
		this._handleChangeFormOccupation();

	}

	/**
	 * ngOnDestroy
	 * 
	 */
	ngOnDestroy(): void {
		//this._fuseAlertService.unSubscribe();
		// Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
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
				this._calculatePercentageTotal(occupations);

				// Mark for check
				this._changeDetectorRef.markForCheck();
			})
	}

	/**
	 * Calculate percentage total
	 * 
	 * @param occupations 
	 */
	private _calculatePercentageTotal(occupations) {
		this.percentageTotal = 0;
		occupations.forEach(item => {
			this.percentageTotal = this.percentageTotal + Number(item.occupation);
		});
	}

	/**
	 * Set form occupation
	 * 
	 * @param collaborator 
	 */
   	private _setFormOcupation(collaborator: any) {
		if ( collaborator ) {
			this.collaboratorOccupation.clear();

			collaborator.assigments.forEach(item => {
				console.log("item: ", item);
				if ( item && item?.isActive ) {
					let collaboratorOccupation: FormGroup = this._formBuilder.group({
						id              : [item.id],
						requestId 		: [item.requestId],
						requestTitle	: [item.request],
						name            : ['', Validators.required],
						occupation      : [item.occupationPercentage, [Validators.required, Validators.maxLength(100)]],
						observation     : [item.observations],
						dateInit        : [item.assignmentStartDate, Validators.required],
						dateEnd         : [item.assignmentEndDate, Validators.required],
						roleRequest     : [item.roleId, Validators.required],
						isCollapse      : [false],
					}, {validator: DateValidator});
					
					// Initial default value
					collaboratorOccupation.get('name').setValue(collaborator.name + ' ' + collaborator.lastName);
					// Add collaboratorOcupation to formOcupation
					this.collaboratorOccupation.push(collaboratorOccupation);
				}
			});
			// Handle event from array form
            this._handleChangeArrayForm();
			this._calculatePercentageTotal(this.collaboratorOccupation.value);
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

		this.dissmisible = true;
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
		this.dissmisible = false;
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

	/**
     * Handle change from array form 
     *
     */
	 private _handleChangeArrayForm(){
        for (let i = 0; i < this.collaboratorOccupation.length; i++) {

            this.collaboratorOccupation.at(i).statusChanges
                .subscribe(value => {
					//console.log("value: ", value);
                    if ( value === 'VALID' ){
						this.isActive = true;
                        this.showFlashMessage('success', 'Datos de la asignación cargados con éxito!');
                    }
                })

            this.collaboratorOccupation.at(i).valueChanges
                .subscribe(value => {
                    // if ( value === 'VALID' ){
                    //     this.showFlashMessage('success', 'Datos de la asignación cargados con éxito!');
                    // }
					let totalOccupation = 0;

					for (let i = 0; i < this.collaboratorOccupation.length; i++) {
						totalOccupation = totalOccupation + Number(this.collaboratorOccupation.at(i).value.occupation);
					}

                    if ( totalOccupation > 100 ) {
                        this.collaboratorOccupation.at(i).get('occupation').setValue('');
                    }
                })
            
            

        }
    }

	/**
	 * Update assignment occupation
	 * 
	 */
	updateAssigmentOccupation() {

		let occupations = [];

		for (let i = 0; i < this.collaboratorOccupation.length; i++) {
			const assignationOccupation = {
				occupationPercentage: this.collaboratorOccupation.at(i).get('occupation').value,
				assignmentStartDate: this.collaboratorOccupation.at(i).get('dateInit').value,
				assignmentEndDate: this.collaboratorOccupation.at(i).get('dateEnd').value,
				observations: this.collaboratorOccupation.at(i).get('observation').value,
				isActive: 1,
				code: '213',
				request: {
					id: this.collaboratorOccupation.at(i).get('requestId').value
				},
				collaborator: {
					id: this.collaborator.id
				},
				id: this.collaboratorOccupation.at(i).get('id').value,
			};

			occupations.push(assignationOccupation);
		}

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
					this._assignmentOccupationService.updateOccupationsByCollaborator(this.collaborator.id, occupations)
						.subscribe(response => {
							this._assignmentOccupationService.getAllColaboratorOccupation()
								.subscribe(() => {
									this.isActive = true;
									// Show notification update request
									this.showFlashMessage('success', 'Asignación editada con éxito');
									// Set time out for change tab
									setTimeout(() => {
										// this._router.navigate(['dashboards/assignment-occupation/index']);
										this._assignmentOccupationService.setTabIndex(0);
									}, 2000); 
								});
						});

				}
			});

	}

	/**
	 * Delete assignment occupation
	 * 
	 * @param assignation 
	 * @param i 
	 */
	deleteAssigmentOccupation(assignation: any, i: number) {

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
			id: assignation.id,
			requestRole: {
				id: this.collaboratorOccupation.at(i).get('roleRequest').value,
			}
		};

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
							this.isActive = true;
							// remove form group from collaborator occupation
							this.collaboratorOccupation.removeAt(i);
							// Show notification update request
							this.showFlashMessage('success', 'Asignación eliminada con éxito');
							// Mark for check
							this._changeDetectorRef.markForCheck();

							//this.deleteAssignment.emit();
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
		this.returnPrevious.emit('');
	}

}
