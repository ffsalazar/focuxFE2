import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Collaborator, CollaboratorKnowledge, Country, Department, EmployeePosition, Knowledge } from 'app/modules/admin/dashboards/collaborators/collaborators.types';
import { CollaboratorsListComponent } from 'app/modules/admin/dashboards/collaborators/list/list.component';
import { CollaboratorsService } from 'app/modules/admin/dashboards/collaborators/collaborators.service';

@Component({
    selector       : 'collaborators-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollaboratorsDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;
    @ViewChild('knowledgesPanelOrigin') private _knowledgesPanelOrigin: ElementRef;

    editMode: boolean = false;
    knowledges: Knowledge[];
    knowledgesEditMode: boolean = false;
    filteredKnowledges: CollaboratorKnowledge[]=[];
    collaborator: Collaborator;
    collaboratorForm: FormGroup;
    collaborators: Collaborator[];
    departments: Department[];
    filteredDepartments: Department[];
    countries: Country[];
    employeePositions: EmployeePosition[];
    filteredEmployeePositions: EmployeePosition[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _knowledgesPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _collaboratorsListComponent: CollaboratorsListComponent,
        private _collaboratorsService: CollaboratorsService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Open the drawer
        this._collaboratorsListComponent.matDrawer.open();

        // Create the collaborator form
        this.collaboratorForm = new FormGroup({
            id          : new FormControl(''),
            idFile      : new FormControl(''),
            avatar      : new FormControl(null),
            name        : new FormControl('',[Validators.required]), 
            mail        : new FormControl(''),
            lastName    : new FormControl(''),
            nationality : new FormControl(''),
            department : new FormControl(null),
            employeePosition : new FormControl(''),
            companyEntryDate : new FormControl(''),
            organizationEntryDate : new FormControl(''),
            gender       : new FormControl(''),
            bornDate     : new FormControl(''),
            assignedLocation : new FormControl(''),
            knowledges         : new FormControl([]),
            isActive: new FormControl(''),
            technicalSkills: new FormControl(''),
            phones: new FormControl([])
        })
            
        // Get the collaborators
        this._collaboratorsService.collaborators$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((collaborators: Collaborator[]) => {
                this.collaborators = collaborators;


                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
            
            // Get the collaborator        
            
        this._collaboratorsService.departments$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((deparments: Department[]) => {
                this.departments = deparments;
                this.filteredDepartments = deparments;                
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        
        this._collaboratorsService.employeePositions$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((employeePositions: EmployeePosition[]) => {
                this.employeePositions = employeePositions;
                this.filteredEmployeePositions = employeePositions;
                console.log(this.employeePositions);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this._collaboratorsService.collaborator$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((collaborator: Collaborator) => {

               
                // Open the drawer in case it is closed
                this._collaboratorsListComponent.matDrawer.open();

                // Get the collaborator
                this.collaborator = collaborator;
                            
                    // Clear the emails and phoneNumbers form arrays
               /* (this.collaboratorForm.get('emails') as FormArray).clear();
                (this.collaboratorForm.get('phoneNumbers') as FormArray).clear();*/

                // Patch values to the form
                this.collaboratorForm.patchValue(collaborator);
                //console.log(this.collaborator.employeePosition.department.id);                                
                
                this.collaboratorForm.get('department').setValue(collaborator.employeePosition.department.id);
                this.collaboratorForm.get('employeePosition').setValue(collaborator.employeePosition.id);
                this.collaboratorForm.get('phones').setValue(collaborator.phones);
                console.log(this.collaboratorForm.value);
                console.log("Linea 134");
                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the country telephone codes
        this._collaboratorsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((codes: Country[]) => {
                this.countries = codes;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the knowledges
        this._collaboratorsService.knowledges$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((knowledges: Knowledge[]) => {
                this.knowledges = knowledges;


                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        this.knowledges.forEach(filteredKnowledges => {

            let filteredKnowledge = {
                id : filteredKnowledges.id,
                level: 0,
                knowledge: filteredKnowledges
            };
            this.filteredKnowledges.push(filteredKnowledge);

        });

        console.log(this.filteredKnowledges)






    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if ( this._knowledgesPanelOverlayRef )
        {
            this._knowledgesPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._collaboratorsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        console.log(this.collaboratorForm.value);
        
        if ( editMode === null )
        {
            this.editMode = !this.editMode;
        }
        else
        {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the collaborator
     */
    updateCollaborator(): void
    {
        // Get the collaborator object
        let collaborator = this.collaboratorForm.getRawValue();
        collaborator.employeePosition = this.employeePositions.find(value => value.id == collaborator.employeePosition)
        // Update the collaborator on the server
        console.log(collaborator)
        this._collaboratorsService.updateCollaborator(collaborator.id, collaborator).subscribe(() => {

            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }

    filterPositionsByDepartment() {
        let departmentSelected = this.collaboratorForm.get("department").value;

        this.filteredEmployeePositions = this.employeePositions.filter(elem => elem.department.id === departmentSelected)

    }
    
    /**
     * Delete the collaborator
     */
    deleteCollaborator(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Borrar Colaborador',
            message: '\n' +
                '¿Estás seguro de que deseas eliminar este collaboratoro? ¡Esta acción no se puede deshacer!',
            actions: {
                confirm: {
                    label: 'Borrar'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {
                // Get the current collaborator's id
                const id = this.collaborator.id;

                // Get the next/previous collaborator's id
                const currentCollaboratorIndex = this.collaborators.findIndex(item => item.id === id);
                const nextCollaboratorIndex = currentCollaboratorIndex + ((currentCollaboratorIndex === (this.collaborators.length - 1)) ? -1 : 1);
                const nextCollaboratorId = (this.collaborators.length === 1 && this.collaborators[0].id === id) ? null : this.collaborators[nextCollaboratorIndex].id;

                // Delete the collaborator
                this._collaboratorsService.deleteCollaborator(id)
                    .subscribe((isDeleted) => {

                        // Return if the collaborator wasn't deleted...
                        if ( !isDeleted )
                        {
                            return;
                        }

                        // Navigate to the next collaborator if available
                        if ( nextCollaboratorId )
                        {
                            this._router.navigate(['../', nextCollaboratorId], {relativeTo: this._activatedRoute});
                        }
                        // Otherwise, navigate to the parent
                        else
                        {
                            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                        }

                        // Toggle the edit mode off
                        this.toggleEditMode(false);
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

    }

    /**
     * Upload avatar
     *
     * @param fileList
     */
    uploadAvatar(fileList: FileList): void
    {
        // Return if canceled
        if ( !fileList.length )
        {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if ( !allowedTypes.includes(file.type) )
        {
            return;
        }

        // Upload the avatar
        this._collaboratorsService.uploadAvatar(this.collaborator.id, file).subscribe();
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.collaboratorForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the collaborator
        this.collaborator.avatar = null;
    }

    /**
     * Open knowledges panel
     */
    openKnowledgesPanel(): void
    {
        // Create the overlay
        this._knowledgesPanelOverlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._knowledgesPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX : 'start',
                        originY : 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    }
                ])
        });

        // Subscribe to the attachments observable
        this._knowledgesPanelOverlayRef.attachments().subscribe(() => {

            // Add a class to the origin
            this._renderer2.addClass(this._knowledgesPanelOrigin.nativeElement, 'panel-opened');

            // Focus to the search input once the overlay has been attached
            this._knowledgesPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._knowledgesPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._knowledgesPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._knowledgesPanelOverlayRef.backdropClick().subscribe(() => {

            // Remove the class from the origin
            this._renderer2.removeClass(this._knowledgesPanelOrigin.nativeElement, 'panel-opened');

            // If overlay exists and attached...
            if ( this._knowledgesPanelOverlayRef && this._knowledgesPanelOverlayRef.hasAttached() )
            {
                // Detach it
                this._knowledgesPanelOverlayRef.detach();

                // Reset the knowledge filter


                // Toggle the edit mode off
                this.knowledgesEditMode = false;
            }

            // If template portal exists and attached...
            if ( templatePortal && templatePortal.isAttached )
            {
                // Detach it
                templatePortal.detach();
            }
        });
    }

    /**
     * Toggle the knowledges edit mode
     */
    toggleKnowledgesEditMode(): void
    {
        this.knowledgesEditMode = !this.knowledgesEditMode;
    }

    /**
     * Filter knowledges
     *
     * @param event
     */
    filterKnowledges(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the knowledges
        //this.filteredKnowledges = this.knowledges.filter(knowledge => knowledge.name.toLowerCase().includes(value));

    }

    /**
     * Filter knowledges input key down event
     *
     * @param event
     */
    filterKnowledgesInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

        // If there is no knowledge available...
        if ( this.filteredKnowledges.length === 0 )
        {
           /*  TODO: this operation is not supported yet. jpelay  24/01*/
            // // Create the knowledge
            // this.createKnowledge(event.target.value);

            // // Clear the input
            // event.target.value = '';

            // // Return
            return;
        }

        // If there is a knowledge...
        const Knowledge = this.filteredKnowledges[0];
        const isKnowledgeApplied = this.collaborator.knowledges.find(knowledge => knowledge.knowledge.id === Knowledge.id);

        // If the found knowledge is already applied to the collaborator...
        if ( isKnowledgeApplied )
        {
            // Remove the knowledge from the collaborator
            this.removeKnowledgeFromCollaborator(null);
        }
        else
        {
            // Otherwise add the knowledge to the collaborator
            this.addKnowledgeToCollaborator(null);
        }

    }

    /**
     * Create a new knowledge
     *
     * @param title
     */
    createKnowledge(title: string, level: number): void
    {
        const knowledge = {
            title,
            level,
            knowledge: {
                id: 1,
                name: "Java",
                description: "programming language",
                type: "backend"

            }
        };

        // Create knowledge on the server
     /*   this._collaboratorsService.createKnowledge(knowledge.knowledge)
            .subscribe((response) => {

                // Add the knowledge to the collaborator
                this.addKnowledgeToCollaborator(null);
            });*/
    }

    /**
     * Update the knowledge title
     *
     * @param knowledge
     * @param event
     */
   /* updateKnowledgeTitle(knowledge: Knowledge, event): void
    {
        // Update the title on the knowledge
        knowledge.name = event.target.value;

        // Update the knowledge on the server
        this._collaboratorsService.updateKnowledge(knowledge.id, knowledge)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the knowledge
     *
     * @param knowledge
     */
   /* deleteKnowledge(knowledge: Knowledge): void
    {
        // Delete the knowledge from the server
        this._collaboratorsService.deleteKnowledge(knowledge.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add knowledge to the collaborator
     *
     * @param knowledge
     */
    addKnowledgeToCollaborator(knowledge: any): void
    {
        // Update the collaborator form
        this.collaboratorForm.get('knowledges').patchValue(this.collaborator.knowledges);


        // Add the knowledge
        this.collaborator.knowledges.unshift(knowledge);


        // Mark for check
        this._changeDetectorRef.detectChanges();

    }

    /**
     * Remove knowledge from the collaborator
     *
     * @param knowledge
     */
    removeKnowledgeFromCollaborator(knowledge: any): void
    {
        // Remove the knowledge
        this.collaborator.knowledges.splice(this.collaborator.knowledges.findIndex(item => item.id === knowledge.id), 1);

        // Update the collaborator form
        this.collaboratorForm.get('knowledges').patchValue(this.collaborator.knowledges);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle collaborator knowledge
     *
     * @param knowledge
     */
    toggleCollaboratorKnowledge(knowledge: any): void
    {
        /*let collaboratorKnowledge : CollaboratorKnowledge = {
            id: knowledge.id,
            level : 0,
            knowledge : knowledge
        }*/
        if ( this.collaborator.knowledges.includes(knowledge) )
        {
            this.removeKnowledgeFromCollaborator(knowledge);
        }
        else
        {

            this.addKnowledgeToCollaborator(knowledge);
        }
    }

    /**
     * Should the create knowledge button be visible
     *
     * @param inputValue
     */
    shouldShowCreateKnowledgeButton(inputValue: string): boolean
    {
        return !!!(inputValue === '' || this.knowledges.findIndex(knowledge => knowledge.type.toLowerCase() === inputValue.toLowerCase()) > -1);
    }

    /**
     * Add the email field
     */
    addEmailField(): void
    {
        // Create an empty email form group
        const emailFormGroup = this._formBuilder.group({
            email: [''],
            label: ['']
        });

        // Add the email form group to the emails form array
        (this.collaboratorForm.get('emails') as FormArray).push(emailFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the email field
     *
     * @param index
     */
    removeEmailField(index: number): void
    {
        // Get form array for emails
        const emailsFormArray = this.collaboratorForm.get('emails') as FormArray;

        // Remove the email field
        emailsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add an empty phone number field
     */
    addPhoneNumberField(): void
    {
        // Create an empty phone number form group
        const phoneNumberFormGroup = this._formBuilder.group({
            country    : ['us'],
            phoneNumber: [''],
            label      : ['']
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.collaboratorForm.get('phoneNumbers') as FormArray).push(phoneNumberFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the phone number field
     *
     * @param index
     */
    removePhoneNumberField(index: number): void
    {
        // Get form array for phone numbers
        const phoneNumbersFormArray = this.collaboratorForm.get('phoneNumbers') as FormArray;

        // Remove the phone number field
        phoneNumbersFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country
    {
        return this.countries.find(country => country.iso === iso);
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
}
