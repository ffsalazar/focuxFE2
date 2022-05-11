import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    Validators,
    FormControl,
} from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
    Assigments,
    Client,
    Collaborator,
    CollaboratorKnowledge,
    Country,
    Department,
    EmployeePosition,
    Knowledge,
    Request,
    Status,
} from 'app/modules/admin/dashboards/collaborators/collaborators.types';
import { CollaboratorsListComponent } from 'app/modules/admin/dashboards/collaborators/list/list.component';
import { CollaboratorsService } from 'app/modules/admin/dashboards/collaborators/collaborators.service';
@Component({
    selector: 'collaborators-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollaboratorsDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;
    @ViewChild('knowledgesPanelOrigin')
    private _knowledgesPanelOrigin: ElementRef;
    @ViewChild('requestDetailsTemplate') private tplDetail: TemplateRef<any>;

    editMode: boolean = false;
    knowledges: Knowledge[];
    knowledgesEditMode: boolean = false;
    //filteredKnowledges: CollaboratorKnowledge[] = [];
    collaborator: Collaborator = null;
    request: Request;
    collaboratorForm: FormGroup;
    collaborators: Collaborator[];
    ocupations: Assigments;
    statuses: Status[];
    departments: Department[];
    filteredDepartments: Department[];
    clients: Client[];
    leaders: Collaborator[];
    ocupationGeneralPercentage: number = 0;
    filteredclients: Client[];
    countries: Country[];
    profileTag: boolean = true;
    ocupationTag: boolean = false;
    vacationTag: boolean = false;
    employeePositions: EmployeePosition[];
    filteredEmployeePositions: EmployeePosition[];
    isCreate: boolean = false;
    //selectedKnowledges = [];
    background: any =
        'firebasestorage.googleapis.com/v0/b/focux-f00d8.appspot.com/o/banners%2Funnamed.jpg?alt=media&token=a78e3f7a-575a-48e8-81d7-b6dec2829ceb';

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
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer
        this._collaboratorsListComponent.matDrawer.open();

        // Create the collaborator form
        this.collaboratorForm = this._formBuilder.group({
            id: [''],
            idFile: [''],
            avatar: [null],
            name: ['', [Validators.required]],
            mail: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            nationality: [''],
            department: ['', [Validators.required]],
            employeePosition: [[], [Validators.required]],
            client: [[], [Validators.required]],
            companyEntryDate: ['', [Validators.required]],
            organizationEntryDate: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            bornDate: ['', [Validators.required]],
            assignedLocation: ['', [Validators.required]],
            knowledges: this._formBuilder.array([]),
            isActive: [''],
            technicalSkills: [''],
            phoneNumbers: this._formBuilder.array([]),
            phones: this._formBuilder.array([]),
            isCentralAmerican: [''],
            leader: [[]],
            status: [[], [Validators.required]],
            image: [''],
        });

        // Get the collaborators
        this._collaboratorsService.collaborators$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((collaborators: Collaborator[]) => {
                this.collaborators = collaborators;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the collaborator
        this._collaboratorsService.collaborator$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((collaborator: Collaborator) => {
                // Open the drawer in case it is closed
                this._collaboratorsListComponent.matDrawer.open();

                // Get the collaborator
                this.collaborator = collaborator;

                if (this.collaborator) {
                    // Clear the emails and phoneNumbers form arrays

                    //this.selectedKnowledges = this.collaborator.knowledges;

                    (this.collaboratorForm.get('phones') as FormArray).clear();
                    (
                        this.collaboratorForm.get('knowledges') as FormArray
                    ).clear();
                    // Patch values to the form
                    this.collaboratorForm.patchValue(collaborator);

                    this.collaboratorForm
                        .get('department')
                        .setValue(collaborator.employeePosition.department.id);
                    this.collaboratorForm
                        .get('client')
                        .setValue(collaborator.client.id);
                    this.collaboratorForm
                        .get('employeePosition')
                        .setValue(collaborator.employeePosition.id);
                    this.collaboratorForm
                        .get('client')
                        .setValue(collaborator.client.id);
                    if (collaborator.leader) {
                        this.collaboratorForm
                            .get('leader')
                            .setValue(collaborator.leader.id);
                    }

                    this.collaboratorForm
                        .get('status')
                        .setValue(collaborator.status.id);

                    // Setup the phone numbers form array
                    const phoneNumbersFormGroups = [];

                    if (collaborator.phones.length > 0) {
                        // Iterate through them
                        collaborator.phones.forEach((phoneNumber) => {
                            // Create an email form group
                            phoneNumbersFormGroups.push(
                                this._formBuilder.group({
                                    id: [phoneNumber.id],
                                    number: [phoneNumber.number],
                                    type: [phoneNumber.type],
                                    isActive: [phoneNumber.isActive],
                                })
                            );
                        });
                    } else {
                        // Create a phone number form group
                        phoneNumbersFormGroups.push(
                            this._formBuilder.group({
                                number: [''],
                                type: [''],
                                isActive: [1],
                            })
                        );
                    }

                    // Setup the knowledges form array
                    const knowledgesFormGroups = [];

                    if (collaborator.knowledges.length > 0) {
                        // Iterate through them
                        collaborator.knowledges.forEach((knowledge) => {
                            // Create an knowledge form group
                            knowledgesFormGroups.push(
                                this._formBuilder.group({
                                    id: [knowledge.id],
                                    knowledge: [knowledge.knowledge.id],
                                    level: [knowledge.level],
                                    isActive: [knowledge.isActive],
                                })
                            );
                        });

                        console.log(knowledgesFormGroups);
                    } else {
                        // Create a phone number form group
                        knowledgesFormGroups.push(
                            this._formBuilder.group({
                                id: [''],
                                knowledge: [''],
                                level: [1],
                                isActive: [1],
                            })
                        );
                    }

                    // Add the knowledges form groups to the knowledges form array
                    knowledgesFormGroups.forEach((knowledgesFormGroup) => {
                        (
                            this.collaboratorForm.get('knowledges') as FormArray
                        ).push(knowledgesFormGroup);
                    });

                    // Add the phone numbers form groups to the phone numbers form array
                    phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
                        (this.collaboratorForm.get('phones') as FormArray).push(
                            phoneNumbersFormGroup
                        );
                    });

                    // Toggle the edit mode off
                    this.toggleEditMode(false);
                } else {
                    this.isCreate = true;
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the Deparments
        this._collaboratorsService.departments$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((deparments: Department[]) => {
                this.departments = deparments;
                this.filteredDepartments = deparments;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the Leaders
        this._collaboratorsService.leaders$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((leaders: Collaborator[]) => {
                this.leaders = leaders;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the Status
        this._collaboratorsService.statuses$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((statuses: Status[]) => {
                this.statuses = statuses;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the Employee Positions
        this._collaboratorsService.employeePositions$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((employeePositions: EmployeePosition[]) => {
                this.employeePositions = employeePositions;
                this.filteredEmployeePositions = employeePositions;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the Clients
        this._collaboratorsService.clients$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((clients: Client[]) => {
                this.clients = clients;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        //get the ocupations
        this._collaboratorsService.ocupations$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((ocupations: Assigments) => {
                this.ocupations = ocupations;

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

        if (
            this.collaborator?.name === 'Nuevo' &&
            this.collaborator?.lastName === 'Colaborador'
        ) {
            this.editMode = true;
            this.collaboratorForm.reset();
            this.collaboratorForm.get('id').setValue(this.collaborator.id);
            (this.collaboratorForm.get('phones') as FormArray).removeAt(0);
            (this.collaboratorForm.get('knowledges') as FormArray).removeAt(0);
            this.collaboratorForm
                .get('knowledges')
                .setValue(this.collaborator.knowledges);
        }

        // If go create collaborator
        if (!this.collaborator) {
            this.editMode = true;
            (this.collaboratorForm.get('phones') as FormArray).removeAt(0);
            (this.collaboratorForm.get('knowledges') as FormArray).removeAt(0);
            // Open the drawer in case it is closed
            this._collaboratorsListComponent.matDrawer.open();
        }
    }

    /**
     * openPopup
     * @param id
     */
    openPopup(id: number): void {
        // Get the collaborator
        this._collaboratorsService
            .getRequestById(id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((request: any) => {
                this.request = {
                    id: request.id,
                    titleRequest: request.titleRequest,
                    responsibleRequest: request.responsibleRequest?.name,
                    descriptionRequest: request.descriptionRequest,
                    datePlanEnd: request.datePlanEnd,
                    client: request.client.name,
                    businessType: request.client.businessType.name,
                    priorityOrder: request.priorityOrder,
                    status: request.status.name,
                    completionPercentage: request.completionPercentage,
                    deviationPercentage: request.deviationPercentage,
                };

                this._collaboratorsService
                    .open(
                        {
                            template: this.tplDetail,
                            title: 'detail',
                        },
                        {
                            width: 300,
                            height: 300,
                            disableClose: true,
                            panelClass: 'summary-panel',
                        }
                    )
                    .subscribe((confirm) => {});

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._knowledgesPanelOverlayRef) {
            this._knowledgesPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._collaboratorsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle Tag ocupation
     *
     * @param editMode
     */
    tagOcupation(): void {
        this.profileTag = false;
        this.vacationTag = false;
        this.ocupationTag = true;
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle Tag profile
     *
     * @param editMode
     */
    tagVacation(): void {
        this.profileTag = false;
        this.vacationTag = true;
        this.ocupationTag = false;
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle Tag profile
     *
     * @param editMode
     */
    tagProfile(): void {
        this.profileTag = true;
        this.vacationTag = false;
        this.ocupationTag = false;
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    createCollaborator(): void {
        this.collaboratorForm.removeControl('id', { emitEvent: false });

        // Get the collaborator object
        let collaborator = this.collaboratorForm.getRawValue();
        collaborator.employeePosition = this.employeePositions.find(
            (value) => value.id == collaborator.employeePosition
        );

        collaborator.knowledges.forEach((elem) => {
            elem.knowledge = this.knowledges.filter(
                (e) => e.id == elem.knowledge
            )[0];
        });

        collaborator.client = this.clients.find(
            (value) => value.id === collaborator.client
        );
        if (collaborator.leader) {
            collaborator.leader = this.leaders.find(
                (value) => value.id === collaborator.leader
            );
        }

        collaborator.status = this.statuses.find(
            (value) => value.id === collaborator.status
        );
        collaborator.isCentralAmerican
            ? (collaborator.isCentralAmerican = 1)
            : (collaborator.isCentralAmerican = 0);
        collaborator.idFile = 0;
        collaborator.isActive = 1;

        // Create the collaborator
        this._collaboratorsService
            .createCollaborator(collaborator)
            .subscribe((newCollaborator) => {
                // Go to the new collaborator
                //this._router.navigate(['/dashboards/collaborators/']);
                this._router.navigate(['../'], {
                    relativeTo: this._activatedRoute,
                });
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * Update the collaborator
     */
    updateCollaborator(): void {
        /*this.collaboratorForm
            .get('knowledges')
            .setValue(this.selectedKnowledges);*/

        // Get the collaborator object
        let collaborator = this.collaboratorForm.getRawValue();
        collaborator.employeePosition = this.employeePositions.find(
            (value) => value.id == collaborator.employeePosition
        );

        collaborator.knowledges.forEach((elem) => {
            elem.knowledge = this.knowledges.filter(
                (e) => e.id == elem.knowledge
            )[0];
        });

        collaborator.client = this.clients.find(
            (value) => value.id === collaborator.client
        );
        if (collaborator.leader) {
            collaborator.leader = this.leaders.find(
                (value) => value.id === collaborator.leader
            );
        }

        collaborator.status = this.statuses.find(
            (value) => value.id === collaborator.status
        );
        collaborator.isCentralAmerican
            ? (collaborator.isCentralAmerican = 1)
            : (collaborator.isCentralAmerican = 0);
        // Update the collaborator on the server
        this._collaboratorsService
            .updateCollaborator(collaborator.id, collaborator)
            .subscribe(() => {
                // Toggle the edit mode off
                this.toggleEditMode(false);
            });
    }

    filterPositionsByDepartment() {
        let departmentSelected = this.collaboratorForm.get('department').value;

        this.filteredEmployeePositions = this.employeePositions.filter(
            (elem) => elem.department.id === departmentSelected
        );
    }

    /**
     * Delete the collaborator
     */
    deleteCollaborator(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Desactivar Colaborador',
            message:
                '\n' +
                '¿Estás seguro de que deseas desactivar este colaborador? ¡Esta acción no se puede deshacer!',
            actions: {
                confirm: {
                    label: 'Desactivar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the current collaborator's id
                const id = this.collaborator.id;

                // Get the next/previous collaborator's id
                const currentCollaboratorIndex = this.collaborators.findIndex(
                    (item) => item.id === id
                );
                let nextCollaboratorId = null;
                if (currentCollaboratorIndex == this.collaborators.length - 1) {
                    for (let i = currentCollaboratorIndex - 1; i >= 0; i--) {
                        if (this.collaborators[i].isActive != 0) {
                            nextCollaboratorId = this.collaborators[i].id;
                        }
                    }
                } else {
                    for (
                        let i = currentCollaboratorIndex + 1;
                        i < this.collaborators.length;
                        i++
                    ) {
                        if (this.collaborators[i].isActive != 0) {
                            nextCollaboratorId = this.collaborators[i].id;
                        }
                    }
                }

                // Delete the collaborator
                this.collaborator.isActive = 0;
                this._collaboratorsService
                    .deleteCollaborator(this.collaborator)
                    .subscribe(() => {
                        // Navigate to the next collaborator if available
                        this._router.navigate(['../../'], {
                            relativeTo: this._activatedRoute,
                        });
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
    uploadAvatar(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this._collaboratorsService
                .uploadImage(this.collaborator.id, reader.result)
                .then((urlImage) => {
                    console.log(urlImage);

                    this.collaboratorForm.get('image').setValue(urlImage);
                    this.updateCollaborator();
                    // no borrando esto hasta que estemos seguro de que es seguro removerlo
                    //location.reload();
                });
        };

        // Upload the avatar
        //this._collaboratorsService.uploadAvatar(this.collaborator.id, file).subscribe();
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void {
        // Get the form control for 'avatar'
        const avatarFormControl = this.collaboratorForm.get('image');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the collaborator
        this.collaborator.image = null;

        this.updateCollaborator();

        location.reload();
    }

    /**
     * Open knowledges panel
     */
    openKnowledgesPanel(): void {
        // Create the overlay
        this._knowledgesPanelOverlayRef = this._overlay.create({
            backdropClass: '',
            hasBackdrop: true,
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay
                .position()
                .flexibleConnectedTo(this._knowledgesPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                ]),
        });

        // Subscribe to the attachments observable
        this._knowledgesPanelOverlayRef.attachments().subscribe(() => {
            // Add a class to the origin
            this._renderer2.addClass(
                this._knowledgesPanelOrigin.nativeElement,
                'panel-opened'
            );

            // Focus to the search input once the overlay has been attached
            this._knowledgesPanelOverlayRef.overlayElement
                .querySelector('input')
                .focus();
        });

        // Create a portal from the template
        const templatePortal = new TemplatePortal(
            this._knowledgesPanel,
            this._viewContainerRef
        );

        // Attach the portal to the overlay
        this._knowledgesPanelOverlayRef.attach(templatePortal);

        // Subscribe to the backdrop click
        this._knowledgesPanelOverlayRef.backdropClick().subscribe(() => {
            // Remove the class from the origin
            this._renderer2.removeClass(
                this._knowledgesPanelOrigin.nativeElement,
                'panel-opened'
            );

            // If overlay exists and attached...
            if (
                this._knowledgesPanelOverlayRef &&
                this._knowledgesPanelOverlayRef.hasAttached()
            ) {
                // Detach it
                this._knowledgesPanelOverlayRef.detach();

                // Reset the knowledge filter

                // Toggle the edit mode off
                this.knowledgesEditMode = false;
            }

            // If template portal exists and attached...
            if (templatePortal && templatePortal.isAttached) {
                // Detach it
                templatePortal.detach();
            }
        });
    }

    /**
     * Toggle the knowledges edit mode
     */
    toggleKnowledgesEditMode(): void {
        this.knowledgesEditMode = !this.knowledgesEditMode;
    }

    /**
     * Add the email field
     */
    addEmailField(): void {
        // Create an empty email form group
        const emailFormGroup = this._formBuilder.group({
            email: [''],
            label: [''],
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
    removeEmailField(index: number): void {
        // Get form array for emails
        const emailsFormArray = this.collaboratorForm.get(
            'emails'
        ) as FormArray;

        // Remove the email field
        emailsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Add an empty knowledge field
     */
    addknowledgeField(): void {
        // Create an empty knowledge form group
        const knowledgeFormGroup = this._formBuilder.group({
            id: [''],
            knowledge: [''],
            level: [1],
            isActive: [1],
        });

        // Add the knowledgeform group to the knowledges form array
        (this.collaboratorForm.get('knowledges') as FormArray).push(
            knowledgeFormGroup
        );

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the knowledge field
     *
     * @param index
     */
    removeknowledgeField(index: number, id: number): void {
        // Get form array for phone numbers
        const knowledgeFormArray = this.collaboratorForm.get(
            'knowledges'
        ) as FormArray;
        const knowledge = knowledgeFormArray.at(index).value;
        knowledge.isActive = 0;
        // Remove the phone number field
        knowledgeFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();

        this._collaboratorsService
            .updateCollaboratorKnowledgeStatus(id, knowledge)
            .subscribe();
    }

    /**
     * Add an empty phone number field
     */
    addPhoneNumberField(): void {
        // Create an empty phone number form group
        const phoneNumberFormGroup = this._formBuilder.group({
            id: [''],
            number: [''],
            type: [''],
            isActive: [1],
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.collaboratorForm.get('phones') as FormArray).push(
            phoneNumberFormGroup
        );

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove the phone number field
     *
     * @param index
     */
    removePhoneNumberField(index: number, id: number): void {
        // Get form array for phone numbers
        const phoneNumbersFormArray = this.collaboratorForm.get(
            'phones'
        ) as FormArray;
        const phone = phoneNumbersFormArray.at(index).value;
        phone.isActive = 0;
        // Remove the phone number field
        phoneNumbersFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();

        this._collaboratorsService.updatePhoneStatus(id, phone).subscribe();
    }

    /**
     * Get country info by iso code
     *
     * @param iso
     */
    getCountryByIso(iso: string): Country {
        return this.countries.find((country) => country.iso === iso);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
