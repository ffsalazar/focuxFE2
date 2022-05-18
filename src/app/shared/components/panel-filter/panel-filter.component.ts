import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-panel-filter',
  templateUrl: './panel-filter.component.html',
  styleUrls: ['./panel-filter.component.scss']
})
export class PanelFilterComponent implements OnInit {

	@Input('clients') clients: any[];
	@Input('knowledges') knowledges: any[];
	@Output('changeFilter') changeFilter: EventEmitter<any> = new EventEmitter<any>();

	selectedFilterClient: boolean = false;
	selectedFilterKnowledge: boolean = false;
	selectedFilterOccupation: boolean = false;
	filterCollaboratorsGroup: FormGroup;
	range: FormGroup;
  
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

	constructor(
		private _formBuilder: FormBuilder,
		private _changeDetectorRef: ChangeDetectorRef,
	) {
		// Create form group for filter collaborators
        this.filterCollaboratorsGroup = this._formBuilder.group({
            filterClients			: this._formBuilder.array([]),
            filterKnowledges		: this._formBuilder.array([]),
            filterOccupation		: [0],
            filterDateInit			: [''],
            filterDateEnd			: [''],
        });

		this.range = this._formBuilder.group({
			start	: [],
			end		: [],
		});
	}

	ngOnInit(): void {
		this._setFilterClients();
		this._setFilterKnowledges();

		this.filterCollaboratorsGroup.valueChanges
            .subscribe((values) => {
                // Get collaborator by filter
                this._getCollaboratorsByFilter();
        });
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
     * Filter clients
     * 
     */
	 get filterClients() {
        return this.filterCollaboratorsGroup.get('filterClients') as FormArray;
    }

    /**
     * Filter knowledges
     * 
     */
    get filterKnowledges(): FormArray {
        return this.filterCollaboratorsGroup.get('filterKnowledges') as FormArray;
    }

    /**
     * Filter occupations
     * 
     */
    get filterOccupation(): AbstractControl {
        return this.filterCollaboratorsGroup.get('filterOccupation');
    }


	// -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

	/**
     * Get collaborators by filter
     * 
     */
    private _getCollaboratorsByFilter() {
        const {
            filterClients,
            filterKnowledges,
            filterOccupation,
            filterDateInit,
            filterDateEnd
        } = this.filterCollaboratorsGroup.getRawValue();

        const filteredClients = filterClients.filter(
            (item) => item.checked && item.id
        );
        const clientsId = filteredClients.map(
            (item) => item.id
        );
        const filteredKnowledges = filterKnowledges.filter(
            (item) => item.checked && item.id
        );
        const knowledgesId = filteredKnowledges.map((item) => item.id);
        
		this.changeFilter.emit([
			clientsId,
			knowledgesId,
			filterOccupation,
			filterDateInit,
			filterDateEnd,
			
		]);
    }

	/**
	 * Set filter clients
	 * 
	 */
	private _setFilterClients() {
		// Create form array filterClients
		this.clients.forEach(client => {
			this.filterClients.push(
				this._formBuilder.group({
					id: [client.id],
					name: [client.name],
					checked: [false],
				}),
				{ emitEvent: false }
			);
		});

		// Mark as check
		this._changeDetectorRef.markForCheck();


	}

	/**
	 * Set filter knowledges
	 * 
	 */
	private _setFilterKnowledges() {
		// Create form array filterClients
		this.knowledges.forEach(knowledge => {
			this.filterKnowledges.push(
				this._formBuilder.group({
					id: [knowledge.id],
					name: [knowledge.name],
					checked: [false],
				}),
				{ emitEvent: false }
			);
		});

		// Mark as check
		this._changeDetectorRef.markForCheck();
	}
	

}
