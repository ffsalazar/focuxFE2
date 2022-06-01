import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit, ViewChildren
} from '@angular/core';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseAlertService } from '@fuse/components/alert';
import { Router } from '@angular/router';
import {
    Collaborator,
    Project,
    AssignationOccupation,
    RolesRequest,
} from "../assignment-occupation.types";
import {Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AssingmentOccupationService} from "../assingment-occupation.service";
import {map, startWith, takeUntil} from "rxjs/operators";
import {forkJoin, Observable, pipe, Subject} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import { DateValidator } from './date-validation';
import { limitOccupation } from '../partner-search/limit-occupation';

@Component({
  selector: 'app-asignation',
  templateUrl: './asignation.component.html',
  styleUrls: ['./asignation.component.scss']
})
export class AsignationComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    collaboratorFormGroup: FormGroup;
    myControlTest = new FormControl();
    collaboratorForm = new FormControl();
    successSave: string;
    flashMessage: 'success' | 'error' | null = null;
    collaborators$: Observable<Collaborator[]>;
    collaboratorsArr: any[] = [];
    collaboratorAsigned = false;
    filteredOptions: Observable<any[]>;
    filteredCollaboratorsOptions: Observable<any[]>;
    project: Project = undefined;
    formFieldHelpers: string[] = [''];
    tabIndex = 0;
    showObservation = false;
    noCollaborators = true;
    request: any = null;
    activatedAlert: boolean = false;
    formOcupation: FormGroup = this._formBuilder.group({
        collaboratorOccupation: this._formBuilder.array([])
    });
    rolesRequest$: Observable<RolesRequest[]>;

    constructor(
        private _assignmentOccupationService: AssingmentOccupationService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _router: Router,) {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        
        this._fuseAlertService.dismiss('alertBox4');

        this.rolesRequest$ = this._assignmentOccupationService.rolesRequest$
            .pipe(takeUntil(this._unsubscribeAll));
                
        this._assignmentOccupationService.collaboratorSelected$
            .pipe(
                map(collaboratorSelected => collaboratorSelected))
                    .subscribe(collaboratorSelected => {
                        // Set collaborator selected
                        let aux = collaboratorSelected || [];
                        
                        this.collaboratorsArr = [...aux];

                        // Set the form ocupation
                        this._setFormOcupation();

                        // Set request selected
                        this.request = this._assignmentOccupationService.requestSelected;

                        // Mark for check
                        this._changeDetectorRef.markForCheck();
                    });

        
        if ( this.request ) {
            this.myControlTest.setValue(this.request.titleRequest);
        }
        
          this.collaboratorFormGroup = this._formBuilder.group({
                collaborators: this._formBuilder.array([])
          });
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

    /**
     * Get collaborators
     *
     */
    get collaborators() {
        return this.collaboratorFormGroup.controls['collaborators'] as FormArray;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the form Ocupation
     * 
     */
    private _setFormOcupation() {
        if ( this.collaboratorsArr ) {
            this.collaboratorOccupation.clear();
            this.collaboratorsArr.forEach(item => {
                
                if ( item ) {
                    let collaboratorOccupation: FormGroup = this._formBuilder.group({
                        id              : [item.id],
                        name            : ['', Validators.required],
                        occupation      : ['', [Validators.required, Validators.maxLength(100), limitOccupation(item.occupationPercentage)]],
                        observation     : [''],
                        dateInit        : ['', Validators.required],
                        dateEnd         : ['', Validators.required],
                        roleRequest     : ['', Validators.required],
                        isCollapse      : [false],
                    }, {validator: DateValidator});
                    
                    // Initial default value
                    collaboratorOccupation.get('id').setValue(item.id);
                    collaboratorOccupation.get('name').setValue(item.name + ' ' + item.lastName);
                    // Add collaboratorOcupation to formOcupation
                    this.collaboratorOccupation.push(collaboratorOccupation);
                }
            });
            // Handle event from array form
            this._handleChangeArrayForm();
        }
        
    }

    /**
     * Handle change from array form 
     *
     */
    private _handleChangeArrayForm(){
        for (let i = 0; i < this.collaboratorOccupation.length; i++) {

            this.collaboratorOccupation.at(i).statusChanges
                .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(value => {
                        if ( value === 'VALID' ){
                            this.activatedAlert = true;
                            this.showFlashMessage('success', 'Datos de la asignación cargados con éxito!');
                        }
                    })

            this.collaboratorOccupation.at(i).valueChanges
                .pipe(takeUntil(this._unsubscribeAll))

                    .subscribe(value => {
                        // if ( value === 'VALID' ){
                        //     this.showFlashMessage('success', 'Datos de la asignación cargados con éxito!');
                        // }

                        const collaboratorIndex = this.collaboratorsArr.findIndex(item => item.id === value.id);

                        if ( Number(value.occupation) + Number(this.collaboratorsArr[collaboratorIndex].occupationPercentage) > 100 ) {
                            this.collaboratorOccupation.at(i).get('occupation').setValue('');
                        }
                    })
            
        }
    }

    /**
     * Get calculate real percentage
     * 
     * @param collaboratorAssignation 
     * @returns 
     */
    calculatePercentageReal(collaboratorAssignation) {
        const collaboratorIndex = this.collaboratorsArr.findIndex(item => item && (item.id === collaboratorAssignation.id));
        
        if ( collaboratorAssignation ) {
            return Number(collaboratorAssignation.occupation) + Number(this.collaboratorsArr[collaboratorIndex].occupationPercentage);
        }
    }

    /**
     * Remove collaborator
     * 
     * @param collaborator 
     */
    removeCollaborator(collaborator) {
        this._assignmentOccupationService.removeCollaboratorByAssign(collaborator);
    }

    /**
     * Redirection
     * 
     * @param tab 
     * @param index 
     */
    redirection(tab: string, index: number) {
      this._assignmentOccupationService.tabIndex$.subscribe(id => {
          if (id != null) this.tabIndex = id;
      });
      this.tabIndex = index;
      this._router.navigate(['dashboards/assignment-occupation/index/' + tab]).then();
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
        }, 1500);
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
     * Delete the selected product using the form data
     * 
     * @param i 
     */
    deleteAssignationOcupation(i: number): void
    {
        // Open the confirmation dialog
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
        confirmation.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                // If the confirm button pressed...
                if ( result === 'confirmed' )
                {
                    this.activatedAlert = true;

                    const collaboratorIndex = this.collaboratorsArr.findIndex(item => item && (item.id === this.collaboratorOccupation.at(i).get('id').value));
                    
                    if ( collaboratorIndex != null ) {
                        // remove collaborator from collaboratorsArr
                        this.collaboratorsArr.splice(collaboratorIndex, 1);
                        // Emit index the collaborator
                        this._assignmentOccupationService.removeCollaboratorSelected(this._assignmentOccupationService.collaboratorsSelected[collaboratorIndex].id);
                        // remove collaborator from collaboratorSelected
                        this._assignmentOccupationService.collaboratorsSelected.splice(collaboratorIndex, 1);
                        // remove form group from collaborator occupation
                        this.collaboratorOccupation.removeAt(i);
                        // Show notification update request
                        this.showFlashMessage('success', 'Asignación eliminada con éxito');
                    }

                    // Mark for check
                    this._changeDetectorRef.markForCheck();
                }

                //this._assignmentOccupationService.collaboratorSelectedRemove$.unsubscribe();
                //this.confirmUpdate$.unsubscribe();
            });
    }

    /**
     * Save assignation occupation
     * 
     */
    saveAssignationOccupation() {
        const assignation = this.formOcupation.getRawValue();
        
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Guardar asignación',
            message: '¿Seguro que quiere guardar la asignación?',
            icon: {
                show: true,
                name: "heroicons_outline:check",
                color: "primary"
            },
            actions: {
                confirm: {
                    label: 'Guardar asignación',
                    color: 'primary'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((result) => {
                // If the confirm button pressed...
                if ( result === 'confirmed' )
                {
                    let promise = [];

                    for (let i = 0; i < this.collaboratorOccupation.length; i++) {
                        const assignationOccupation: AssignationOccupation = {
                            occupationPercentage: this.collaboratorOccupation.at(i).get('occupation').value,
                            assignmentStartDate: this.collaboratorOccupation.at(i).get('dateInit').value,
                            assignmentEndDate: this.collaboratorOccupation.at(i).get('dateEnd').value,
                            code: this.request.code,
                            observations: this.collaboratorOccupation.at(i).get('observation').value,
                            isActive: 1,
                            request: {
                                id: this.request.id,
                            },
                            collaborator: {
                                id: this.collaboratorOccupation.at(i).get('id').value
                            },
                            requestRole: {
                                id: this.collaboratorOccupation.at(i).get('roleRequest').value,
                            }
                        };
            
                        promise.push(this._assignmentOccupationService.saveAssignationOccupation(assignationOccupation));

                        forkJoin(promise).subscribe(
                            response => {
                                this.activatedAlert = true;
                                // Show notification update request
                                this.showFlashMessage('success', 'Asignación guardada con éxito');
                                // Set time out for change tab
                                setTimeout(() => {
                                    this._router.navigate(['dashboards/assignment-occupation/index']);
                                    this._assignmentOccupationService.setTabIndex(0);
                                }, 2000); 
                            }
                        );
                        
                    }

                }
            });
    }

    /**
     * Change tab
     * 
     */
     changeTab () {
        this._assignmentOccupationService.setTabIndex(0);
    }

    /**
     * Go back
     */
    goBack() {

        this._assignmentOccupationService.updateIsSuccess();
        this._assignmentOccupationService.setTabIndex(0);
    }

}