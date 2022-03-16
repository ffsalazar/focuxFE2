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
import {
    Activity,
    Collaborator,
    CollaboratorOcupation,
    EmployeePosition,
    KnowledgeElement,
    Phone,
    Project,
    AssignationOccupation,
} from "../assignment-occupation.types";
import {Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AssingmentOccupationService} from "../assingment-occupation.service";
import {map, startWith, takeUntil} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import { Router } from '@angular/router';
import { DateValidator } from './date-validation';

@Component({
  selector: 'app-asignation',
  templateUrl: './asignation.component.html',
  styleUrls: ['./asignation.component.scss']
})
export class AsignationComponent implements OnInit, OnDestroy {
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
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    formFieldHelpers: string[] = [''];
    tabIndex = 0;
    showObservation = false;
    noCollaborators = true;
    request: any = null;

    // Form Array
    formOcupation: FormGroup = this._formBuilder.group({
        collaboratorOccupation: this._formBuilder.array([])
    });

    constructor(
        private _assignmentOccupationService: AssingmentOccupationService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _router: Router,) {

      }

      ngOnInit(): void {
          // Handle change from occupation form
        this._handleChangeformOccupation();

        this._assignmentOccupationService.collaboratorSelected$
            .subscribe(collaboratorSelected => {
                // Set collaborator selected
                this.collaboratorsArr = collaboratorSelected || [];

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
     * Handle change form occupation
     * 
     */
    private _handleChangeformOccupation() {

        this.formOcupation.valueChanges
            .subscribe(values => {
                console.log("values: ", values);
                console.log("formOccupation: ", this.formOcupation);
            });
        this.collaboratorOccupation.valueChanges
            .subscribe(response => {
                console.log(response);
            })
    }

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
                        id              : [''],
                        name            : ['', Validators.required],
                        occupation      : ['', [Validators.required, Validators.maxLength(100)]],
                        observation     : [''],
                        dateInit        : ['', Validators.required],
                        dateEnd         : ['', Validators.required],
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

    get collaboratorOccupation() {
        return this.formOcupation.get('collaboratorOccupation') as FormArray;
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

    get collaborators() {
        return this.collaboratorFormGroup.controls['collaborators'] as FormArray;
    }


    displayFn(data): string {
        return data && data.name ? data.name : '';
    }


    removeCollaborator(collaborator) {
        this._assignmentOccupationService.removeCollaboratorByAssign(collaborator);
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


    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.collaboratorsArr.filter(option => option.name.toLowerCase().includes(filterValue));
    }

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
        }, 3000);
    }

    /**
     *
     * @param name
     */
    dismissFuse(name){
       this._fuseAlertService.dismiss(name);
    }
    
    /**
     * Delete the selected product using the form data
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
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                const collaboratorIndex = this.collaboratorsArr.findIndex(item => item && (item.id === this.collaboratorOccupation.at(i).get('id').value));
                
                if ( collaboratorIndex != null ) {
                    this._assignmentOccupationService.removeCollaboratorSelected(collaboratorIndex);
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

    saveAssignationOccupation() {
        const assignation = this.formOcupation.getRawValue();

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
            };

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
        confirmation.afterClosed().subscribe((result) => {

                // If the confirm button pressed...
                if ( result === 'confirmed' )
                {
                    this._assignmentOccupationService.saveAssignationOccupation(assignationOccupation)
                        .subscribe(response => {
                            // Show notification update request
                            this.showFlashMessage('success', 'Asignación guardada con éxito');
                        });

                }
            });
        }
    }

    private _handleChangeArrayForm(){
        for (let i = 0; i < this.collaboratorOccupation.length; i++) {

            this.collaboratorOccupation.at(i).statusChanges
                .subscribe(value => {
                    if ( value === 'VALID' ){
                        this.showFlashMessage('success', 'Datos de la asignación cargados con éxito!');
                    }
                })

        }
    }
}