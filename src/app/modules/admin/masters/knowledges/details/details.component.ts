import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Knowledge} from 'app/modules/admin/masters/knowledges/knowledges.types';
import { KnowledgesListComponent } from 'app/modules/admin/masters/knowledges/list/list.component';
import { KnowledgesService } from 'app/modules/admin/masters/knowledges/knowledges.service';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector       : 'knowledges-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KnowledgesDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;
    @ViewChild('knowledgesPanelOrigin') private _knowledgesPanelOrigin: ElementRef;

    editMode: boolean = false;

    knowledgesEditMode: boolean = false;

    knowledge: Knowledge;
    knowledgeForm: FormGroup;
    knowledges: Knowledge[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _knowledgesPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _knowledgesListComponent: KnowledgesListComponent,
        private _knowledgesService: KnowledgesService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _authService: AuthService
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
        this._knowledgesListComponent.matDrawer.open();

        // Create the knowledge form
        this.knowledgeForm = this._formBuilder.group({
            id: [''],
            name: [''],
            description: [''],
            type:[''],
            isActive: ['']

        })

        // Get the knowledges
        this._knowledgesService.knowledges$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((knowledges: Knowledge[]) => {
                this.knowledges = knowledges;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the knowledge
        this._knowledgesService.knowledge$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((knowledge: Knowledge) => {


                console.log(knowledge)


                // Open the drawer in case it is closed
                this._knowledgesListComponent.matDrawer.open();

                // Get the knowledge
                this.knowledge = knowledge;




                // Patch values to the form
                this.knowledgeForm.patchValue(knowledge);

                this.knowledgeForm.get('type').setValue(knowledge.type);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



        if(this.knowledge.name === 'Nuevo Conocimiento'){
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
        return this._knowledgesListComponent.matDrawer.close();
    }

    /**
     * Check if the role is ROLE_BASIC
     */
    canEdit(): boolean{
        return !this._authService.roles.includes('ROLE_BASIC');
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        console.log(this.knowledgeForm.value);

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
     * Update the knowledge
     */
    updateKnowledge(): void
    {
        // Get the knowledge object
        let knowledge = this.knowledgeForm.getRawValue();

        // Update the knowledge on the server
        console.log(knowledge)
        this._knowledgesService.updateKnowledge(knowledge.id, knowledge).subscribe(() => {

            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }



    /**
     * Delete the knowledge
     */
    deleteKnowledge(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Borrar conocimiento',
            message: '\n' +
                '¿Estás seguro de que deseas eliminar este Conocimiento? ¡Esta acción no se puede deshacer!',
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
                // Get the current knowledge's id
                const id = this.knowledge.id;

                // Get the next/previous knowledge's id
                const currentKnowledgeIndex = this.knowledges.findIndex(item => item.id === id);
                let nextKnowledgeId = null;
                if (currentKnowledgeIndex == (this.knowledges.length - 1)) {
                    for (let i = currentKnowledgeIndex - 1; i >= 0; i--) {
                        if (this.knowledges[i].isActive != 0) {
                            nextKnowledgeId = this.knowledges[i].id;
                        }
                    }
                } else {
                    for (let i = currentKnowledgeIndex + 1; i < this.knowledges.length; i++) {
                        if (this.knowledges[i].isActive != 0) {
                            nextKnowledgeId = this.knowledges[i].id;
                        }
                    }
                }


                // Delete the knowledge
                this.knowledge.isActive = 0;
                this._knowledgesService.deleteKnowledge(this.knowledge)
                    .subscribe(() => {
                        // Navigate to the next knowledge if available

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
        this._knowledgesService.uploadAvatar(this.knowledge.id, file).subscribe();
    }

    /**
     * Remove the avatar

    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.knowledgeForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the knowledge
        this.knowledge.avatar = null;
    }*/


}
