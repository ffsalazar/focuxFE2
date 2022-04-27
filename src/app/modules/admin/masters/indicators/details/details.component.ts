import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Indicator} from 'app/modules/admin/masters/indicators/indicators.types';
import { IndicatorsListComponent } from 'app/modules/admin/masters/indicators/list/list.component';
import { IndicatorsService } from 'app/modules/admin/masters/indicators/indicators.service';

@Component({
    selector       : 'indicators-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndicatorsDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('indicatorsPanel') private _indicatorsPanel: TemplateRef<any>;
    @ViewChild('indicatorsPanelOrigin') private _indicatorsPanelOrigin: ElementRef;

    editMode: boolean = false;

    indicatorsEditMode: boolean = false;

    indicator: Indicator;
    indicatorForm: FormGroup;
    indicators: Indicator[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _indicatorsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _indicatorsListComponent: IndicatorsListComponent,
        private _indicatorsService: IndicatorsService,
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
        this._indicatorsListComponent.matDrawer.open();

        // Create the indicator form
        this.indicatorForm = this._formBuilder.group({
            id: [''],
            name: [''],
            description: [''],
            type:[''],
            isActive: ['']

        })

        // Get the indicators
        this._indicatorsService.indicators$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((indicators: Indicator[]) => {
                this.indicators = indicators;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the indicator
        this._indicatorsService.indicator$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((indicator: Indicator) => {


                console.log(indicator)


                // Open the drawer in case it is closed
                this._indicatorsListComponent.matDrawer.open();

                // Get the indicator
                this.indicator = indicator;




                // Patch values to the form
                this.indicatorForm.patchValue(indicator);

                this.indicatorForm.get('type').setValue(indicator.type);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



        if(this.indicator.name === 'Nuevo Indicador'){
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
        if ( this._indicatorsPanelOverlayRef )
        {
            this._indicatorsPanelOverlayRef.dispose();
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
        return this._indicatorsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        console.log(this.indicatorForm.value);

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
     * Update the indicator
     */
    updateIndicator(): void
    {
        // Get the indicator object
        let indicator = this.indicatorForm.getRawValue();

        // Update the indicator on the server
        console.log(indicator);
        this._indicatorsService.updateIndicator(indicator.id, indicator).subscribe(() => {

            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }



    /**
     * Delete the indicator
     */
    deleteIndicator(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Borrar indicador',
            message: '\n' +
                '¿Estás seguro de que deseas eliminar este Indicador? ¡Esta acción no se puede deshacer!',
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
                // Get the current indicator's id
                const id = this.indicator.id;

                // Get the next/previous indicator's id
                const currentIndicatorIndex = this.indicators.findIndex(item => item.id === id);
                let nextIndicatorId = null;
                if (currentIndicatorIndex == (this.indicators.length - 1)) {
                    for (let i = currentIndicatorIndex - 1; i >= 0; i--) {
                        if (this.indicators[i].isActive != 0) {
                            nextIndicatorId = this.indicators[i].id;
                        }
                    }
                } else {
                    for (let i = currentIndicatorIndex + 1; i < this.indicators.length; i++) {
                        if (this.indicators[i].isActive != 0) {
                            nextIndicatorId = this.indicators[i].id;
                        }
                    }
                }


                // Delete the indicator
                this.indicator.isActive = 0;
                this._indicatorsService.deleteIndicator(this.indicator)
                    .subscribe(() => {
                        // Navigate to the next indicator if available

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
        this._indicatorsService.uploadAvatar(this.indicator.id, file).subscribe();
    }

    /**
     * Remove the avatar

    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.indicatorForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the indicator
        this.indicator.avatar = null;
    }*/


}
