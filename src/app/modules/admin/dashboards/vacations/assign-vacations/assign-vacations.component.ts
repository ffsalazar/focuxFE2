import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {
    InventoryBrand,
    InventoryCategory,
    InventoryProduct,
    InventoryTag
} from "../../../apps/ecommerce/inventory/inventory.types";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup} from "@angular/forms";
import {InventoryService} from "../../../apps/ecommerce/inventory/inventory.service";

@Component({
  selector: 'app-assign-vacations',
  templateUrl: './assign-vacations.component.html',
  styleUrls: ['./assign-vacations.component.scss']
})
export class AssignVacationsComponent implements OnInit {

    formFieldHelpers: string[] = [''];
    brands: InventoryBrand[];
    categories: InventoryCategory[];
    filteredTags: InventoryTag[];
    formAssignVacation: FormGroup = new FormGroup({
        collaborator: new FormControl('TESTValue'),
        period: new FormControl(''),
        daysSelected: new FormControl('11'),

    });
    selectedProduct: InventoryProduct | null = null;
    selectedProductForm: FormGroup;
    tags: InventoryTag[];
    tagsEditMode: boolean = false;
  constructor(private _changeDetectorRef: ChangeDetectorRef,
              private _inventoryService: InventoryService) { }

  ngOnInit(): void {
  }


    toggleProductTag(tag: InventoryTag, change: MatCheckboxChange): void
    {
        if ( change.checked )
        {
            this.addTagToProduct(tag);
        }
        else
        {
            this.removeTagFromProduct(tag);
        }
    }

    addTagToProduct(tag: InventoryTag): void
    {
        // Add the tag
        this.selectedProduct.tags.unshift(tag.id);

        // Update the selected product form
        this.selectedProductForm.get('tags').patchValue(this.selectedProduct.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Remove tag from the product
     *
     * @param tag
     */
    removeTagFromProduct(tag: InventoryTag): void
    {
        // Remove the tag
        this.selectedProduct.tags.splice(this.selectedProduct.tags.findIndex(item => item === tag.id), 1);

        // Update the selected product form
        this.selectedProductForm.get('tags').patchValue(this.selectedProduct.tags);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Toggle the tags edit mode
     */
    toggleTagsEditMode(): void
    {
        this.tagsEditMode = !this.tagsEditMode;
    }

    /**
     * Filter tags
     *
     * @param event
     */
    filterTags(event): void
    {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredTags = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
    }

    /**
     * Filter tags input key down event
     *
     * @param event
     */
    filterTagsInputKeyDown(event): void {
        // Return if the pressed key is not 'Enter'
        if (event.key !== 'Enter') {
            return;
        }

        // If there is no tag available...
        if (this.filteredTags.length === 0) {
            // Create the tag
            this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }
    }

    /**
     * Create a new tag
     *
     * @param title
     */
    createTag(title: string): void
    {
        const tag = {
            title
        };

        // Create tag on the server
        this._inventoryService.createTag(tag)
            .subscribe((response) => {

                // Add the tag to the product
                this.addTagToProduct(response);
            });
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
