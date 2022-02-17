import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BusinessType} from 'app/modules/admin/masters/businessType/businessTypes.types';
import { BusinessTypesListComponent } from 'app/modules/admin/masters/businessType/list/list.component';
import { BusinessTypesService } from 'app/modules/admin/masters/businessType/businessTypes.service';

@Component({
    selector       : 'businessTypes-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessTypesDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('businessTypesPanel') private _businessTypesPanel: TemplateRef<any>;
    @ViewChild('businessTypesPanelOrigin') private _businessTypesPanelOrigin: ElementRef;

    editMode: boolean = false;

    businessTypesEditMode: boolean = false;

    businessType: BusinessType;
    businessTypeForm: FormGroup;
    businessTypes: BusinessType[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _businessTypesPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _businessTypesListComponent: BusinessTypesListComponent,
        private _businessTypesService: BusinessTypesService,
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
        this._businessTypesListComponent.matDrawer.open();

        // Create the businessType form
        this.businessTypeForm = this._formBuilder.group({
            id: [''],
            name: [''],
            description: [''],
            code:[''],
            isActive: ['']

        })

        // Get the businessTypes
        this._businessTypesService.businessTypes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((businessTypes: BusinessType[]) => {
                this.businessTypes = businessTypes;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the businessType
        this._businessTypesService.businessType$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((businessType: BusinessType) => {


                console.log(businessType)


                // Open the drawer in case it is closed
                this._businessTypesListComponent.matDrawer.open();

                // Get the businessType
                this.businessType = businessType;




                // Patch values to the form
                this.businessTypeForm.patchValue(businessType);

                this.businessTypeForm.get('code').setValue(businessType.code);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



        if(this.businessType.name === 'Nuevo tipo de negocio'){
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
        if ( this._businessTypesPanelOverlayRef )
        {
            this._businessTypesPanelOverlayRef.dispose();
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
        return this._businessTypesListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        console.log(this.businessTypeForm.value);

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
     * Update the businessType
     */
    updateBusinessType(): void
    {
        // Get the businessType object
        let businessType = this.businessTypeForm.getRawValue();

        // Update the businessType on the server
        console.log(businessType)
        this._businessTypesService.updateBusinessType(businessType.id, businessType).subscribe(() => {

            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }



    /**
     * Delete the businessType
     */
    deleteBusinessType(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Borrar tipo de negocio',
            message: '\n' +
                '¿Estás seguro de que deseas eliminar este tipo de negocio? ¡Esta acción no se puede deshacer!',
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
                // Get the current businessType's id
                const id = this.businessType.id;

                // Get the next/previous businessType's id
                const currentBusinessTypeIndex = this.businessTypes.findIndex(item => item.id === id);
                let nextBusinessTypeId = null;
                if (currentBusinessTypeIndex == (this.businessTypes.length - 1)) {
                    for (let i = currentBusinessTypeIndex - 1; i >= 0; i--) {
                        if (this.businessTypes[i].isActive != 0) {
                            nextBusinessTypeId = this.businessTypes[i].id;
                        }
                    }
                } else {
                    for (let i = currentBusinessTypeIndex + 1; i < this.businessTypes.length; i++) {
                        if (this.businessTypes[i].isActive != 0) {
                            nextBusinessTypeId = this.businessTypes[i].id;
                        }
                    }
                }


                // Delete the businessType
                this.businessType.isActive = 0;
                this._businessTypesService.deleteBusinessType(this.businessType)
                    .subscribe(() => {
                        // Navigate to the next businessType if available
                        if ( nextBusinessTypeId )
                        {
                            this._router.navigate(['../', nextBusinessTypeId], {relativeTo: this._activatedRoute});
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
        this._businessTypesService.uploadAvatar(this.businessType.id, file).subscribe();
    }

    /**
     * Remove the avatar

    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.businessTypeForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the businessType
        this.businessType.avatar = null;
    }*/


}
