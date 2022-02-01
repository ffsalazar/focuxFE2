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
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    knowledges: Knowledge[];
    tagsEditMode: boolean = false;
    filteredTags: Knowledge[];
    collaborator: Collaborator;
    collaboratorForm: FormGroup;
    collaborators: Collaborator[];
    departments: Department[];
    filteredDepartments: Department[];
    countries: Country[];
    employeePositions: EmployeePosition[];
    filteredEmployeePositions: EmployeePosition[];
    private _tagsPanelOverlayRef: OverlayRef;
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
                this.filteredTags = knowledges;
                console.log(knowledges)
                // Mark for check
                this._changeDetectorRef.markForCheck();
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

        // Dispose the overlays if they are still on the DOM
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
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
    openTagsPanel(): void
    {
        // Create the overlay
        this._tagsPanelOverlayRef = this._overlay.create({
            backdropClass   : '',
            hasBackdrop     : true,
            scrollStrategy  : this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._tagsPanelOrigin.nativeElement)
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
        this._tagsPanelOverlayRef.attachments().subscribe(() => {

            // Add a class to the origin
            this._renderer2.addClass(this._tagsPanelOrigin.nativeElement, 'panel-opened');

            // Focus to the search input once the overlay has been attached
            this._tagsPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(this._tagsPanel, this._viewContainerRef);

        // Attach the portal to the overlay
        this._tagsPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._tagsPanelOverlayRef.backdropClick().subscribe(() => {

            // Remove the class from the origin
            this._renderer2.removeClass(this._tagsPanelOrigin.nativeElement, 'panel-opened');

            // If overlay exists and attached...
            if ( this._tagsPanelOverlayRef && this._tagsPanelOverlayRef.hasAttached() )
            {
                // Detach it
                this._tagsPanelOverlayRef.detach();

                // Reset the tag filter
                this.filteredTags = this.knowledges;

                // Toggle the edit mode off
                this.tagsEditMode = false;
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
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter knowledges
     *
     * @param event
     */
    filterTags(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the knowledges
        this.filteredTags = this.knowledges.filter(tag => tag.name.toLowerCase().includes(value));
    }

    /**
     * Filter knowledges input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void
    {
        // Return if the pressed key is not 'Enter'
        if ( event.key !== 'Enter' )
        {
            return;
        }

        // If there is no tag available...
        if ( this.filteredTags.length === 0 )
        {
           /*  TODO: this operation is not supported yet. jpelay  24/01*/
            // // Create the tag
            // this.createTag(event.target.value);

            // // Clear the input
            // event.target.value = '';

            // // Return
            return;
        }

        // If there is a tag...
        const tag = this.filteredTags[0];
        const isTagApplied = this.collaborator.knowledges.find(knowledge => knowledge.id === tag.id);

        // If the found tag is already applied to the collaborator...
        if ( isTagApplied )
        {
            // Remove the tag from the collaborator
            this.removeTagFromCollaborator(null);
        }
        else
        {
            // Otherwise add the tag to the collaborator
            this.addTagToCollaborator(null);
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string, level: number): void
    {
        const tag = {
            title,
            level,
            knowledge: {
                id: 1,
                name: "Java",
                description: "programming language",
                type: "backend"

            }
        };

        // Create tag on the server
        this._collaboratorsService.createTag(tag.knowledge)
            .subscribe((response) => {

                // Add the tag to the collaborator
                this.addTagToCollaborator(null);
            });
    }

    /**
     * Update the tag title
     *
     * @param tag
     * @param event
     */
    updateTagTitle(tag: Knowledge, event): void
    {
        // Update the title on the tag
        tag.name = event.target.value;

        // Update the tag on the server
        this._collaboratorsService.updateTag(tag.id, tag)
            .pipe(debounceTime(300))
            .subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Delete the tag
     *
     * @param tag
     */
    deleteTag(tag: Knowledge): void
    {
        // Delete the tag from the server
        this._collaboratorsService.deleteTag(tag.id).subscribe();

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add tag to the collaborator
     *
     * @param tag
     */
    addTagToCollaborator(tag: CollaboratorKnowledge): void
    {
        // Add the tag
        this.collaborator.knowledges.unshift(tag);

        // Update the collaborator form
        this.collaboratorForm.get('knowledges').patchValue(this.collaborator.knowledges);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the collaborator
     *
     * @param tag
     */
    removeTagFromCollaborator(tag: CollaboratorKnowledge): void
    {
        // Remove the tag
        this.collaborator.knowledges.splice(this.collaborator.knowledges.findIndex(item => item.id === tag.id), 1);

        // Update the collaborator form
        this.collaboratorForm.get('knowledges').patchValue(this.collaborator.knowledges);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle collaborator tag
     *
     * @param tag
     */
    toggleCollaboratorTag(tag: CollaboratorKnowledge): void
    {
        if ( this.collaborator.knowledges.includes(tag) )
        {
            this.removeTagFromCollaborator(tag);
        }
        else
        {
            this.addTagToCollaborator(tag);
        }
    }

    /**
     * Should the create tag button be visible
     *
     * @param inputValue
     */
    shouldShowCreateTagButton(inputValue: string): boolean
    {
        return !!!(inputValue === '' || this.knowledges.findIndex(tag => tag.type.toLowerCase() === inputValue.toLowerCase()) > -1);
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
