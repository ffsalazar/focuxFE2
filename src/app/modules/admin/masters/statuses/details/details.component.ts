import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Status, TypeStatus} from 'app/modules/admin/masters/statuses/statuses.types';
import { StatusesListComponent } from 'app/modules/admin/masters/statuses/list/list.component';
import { StatusesService } from 'app/modules/admin/masters/statuses/statuses.service';

@Component({
    selector       : 'statuses-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusesDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;
    @ViewChild('knowledgesPanelOrigin') private _knowledgesPanelOrigin: ElementRef;

    editMode: boolean = false;

    knowledgesEditMode: boolean = false;

    status: Status;
    statusForm: FormGroup;
    statuses: Status[];
    typeStatuses: TypeStatus[];
    filteredTypeStatuses: TypeStatus[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _knowledgesPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _statusesListComponent: StatusesListComponent,
        private _statusesService: StatusesService,
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
        this._statusesListComponent.matDrawer.open();

        // Create the status form
        this.statusForm = this._formBuilder.group({
            id: [''],
            name: [''],
            description: [''],
            isActive: [''],
            typeStatus: [[]]
        })

        // Get the statuses
        this._statusesService.statuses$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((statuses: Status[]) => {
                this.statuses = statuses;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the status
        this._statusesService.status$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((status: Status) => {





                // Open the drawer in case it is closed
                this._statusesListComponent.matDrawer.open();

                // Get the status
                this.status = status;




                // Patch values to the form
                this.statusForm.patchValue(status);

                this.statusForm.get('typeStatus').setValue(status.typeStatus.id);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the typesstatus

        this._statusesService.typeStatuses$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((typeStatuses: TypeStatus[]) => {
                this.typeStatuses = typeStatuses;
                this.filteredTypeStatuses = typeStatuses;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



        if(this.status.name === 'Nuevo Status'){
            this.editMode = true;
        }

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
        return this._statusesListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        console.log(this.statusForm.value);

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
     * Update the status
     */
    updateStatus(): void
    {
        // Get the status object
        let status = this.statusForm.getRawValue();
        status.typeStatus = this.typeStatuses.find(value => value.id == status.typeStatus);

        // Update the status on the server
        console.log(status)
        this._statusesService.updateStatus(status.id, status).subscribe(() => {

            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }

    filterPositionsByTypeStatus() {
        let TypeStatusSelected = this.statusForm.get("typeStatus").value;

        this.filteredTypeStatuses = this.typeStatuses.filter(elem => elem.id === TypeStatusSelected)

    }

    /**
     * Delete the status
     */
    deleteStatus(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Borrar Estatus',
            message: '\n' +
                '¿Estás seguro de que deseas eliminar este estatus? ¡Esta acción no se puede deshacer!',
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
                // Get the current status's id
                const id = this.status.id;

                // Get the next/previous status's id
                const currentStatusIndex = this.statuses.findIndex(item => item.id === id);
                let nextStatusId = null;
                if (currentStatusIndex == (this.statuses.length - 1)) {
                    for (let i = currentStatusIndex - 1; i >= 0; i--) {
                        if (this.statuses[i].isActive != 0) {
                            nextStatusId = this.statuses[i].id;
                        }
                    }
                } else {
                    for (let i = currentStatusIndex + 1; i < this.statuses.length; i++) {
                        if (this.statuses[i].isActive != 0) {
                            nextStatusId = this.statuses[i].id;
                        }
                    }
                }


                // Delete the status
                this.status.isActive = 0;
                this._statusesService.deleteStatus(this.status)
                    .subscribe(() => {
                        // Navigate to the next status if available

                            this._router.navigate(['../'], {relativeTo: this._activatedRoute});


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
        this._statusesService.uploadAvatar(this.status.id, file).subscribe();
    }

    /**
     * Remove the avatar

    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.statusForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the status
        this.status.avatar = null;
    }*/


}
