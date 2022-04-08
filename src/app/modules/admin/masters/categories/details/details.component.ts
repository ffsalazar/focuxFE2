import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Category} from 'app/modules/admin/masters/categories/categories.types';
import { CategoriesListComponent } from 'app/modules/admin/masters/categories/list/list.component';
import { CategoriesService } from 'app/modules/admin/masters/categories/categories.service';

@Component({
    selector       : 'categories-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;
    @ViewChild('knowledgesPanelOrigin') private _knowledgesPanelOrigin: ElementRef;

    editMode: boolean = false;

    knowledgesEditMode: boolean = false;

    category: Category;
    categoryForm: FormGroup;
    categories: Category[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _knowledgesPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _categoriesListComponent: CategoriesListComponent,
        private _categoriesService: CategoriesService,
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
        this._categoriesListComponent.matDrawer.open();

        // Create the category form
        this.categoryForm = this._formBuilder.group({
            id: [''],
            name: [''],
            description: [''],
            code:[''],
            isActive: ['']

        });

        // Get the categories
        this._categoriesService.categories$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((categories: Category[]) => {
                this.categories = categories;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the category
        this._categoriesService.category$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((category: Category) => {


                console.log(category);


                // Open the drawer in case it is closed
                this._categoriesListComponent.matDrawer.open();

                // Get the category
                this.category = category;




                // Patch values to the form
                this.categoryForm.patchValue(category);

                this.categoryForm.get('code').setValue(category.code);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



        if(this.category.name === 'Nueva área técnica'){
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
        return this._categoriesListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {


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
     * Update the category
     */
    updateCategory(): void
    {
        // Get the category object
        const category = this.categoryForm.getRawValue();

        // Update the category on the server
        console.log(category);
        this._categoriesService.updateCategory(category.id, category).subscribe(() => {

            // Toggle the edit mode off
            this.toggleEditMode(false);
        });
    }



    /**
     * Delete the category
     */
    deleteCategory(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Borrar &Aacute;rea T&eacute;cnica',
            message: '\n' +
                '¿Estás seguro de que deseas eliminar esta área técnica? ¡Esta acción no se puede deshacer!',
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
                // Get the current category's id
                const id = this.category.id;

                // Get the next/previous category's id
                const currentCategoryIndex = this.categories.findIndex(item => item.id === id);
                let nextCategoryId = null;
                if (currentCategoryIndex == (this.categories.length - 1)) {
                    for (let i = currentCategoryIndex - 1; i >= 0; i--) {
                        if (this.categories[i].isActive != 0) {
                            nextCategoryId = this.categories[i].id;
                        }
                    }
                } else {
                    for (let i = currentCategoryIndex + 1; i < this.categories.length; i++) {
                        if (this.categories[i].isActive != 0) {
                            nextCategoryId = this.categories[i].id;
                        }
                    }
                }


                // Delete the category
                this.category.isActive = 0;
                this._categoriesService.deleteCategory(this.category)
                    .subscribe(() => {

                            this._router.navigate(['../'], {relativeTo: this._activatedRoute});

                        // Toggle the edit mode off
                        this.toggleEditMode(false);
                    });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

    }

    /*
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
        this._categoriesService.uploadAvatar(this.category.id, file).subscribe();
    }

    /**
     * Remove the avatar

    removeAvatar(): void
    {
        // Get the form control for 'avatar'
        const avatarFormControl = this.categoryForm.get('avatar');

        // Set the avatar as null
        avatarFormControl.setValue(null);

        // Set the file input value as null
        this._avatarFileInput.nativeElement.value = null;

        // Update the category
        this.category.avatar = null;
    }*/


}
