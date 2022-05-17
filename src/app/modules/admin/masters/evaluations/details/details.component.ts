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
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Evaluation } from '../evaluations.types';
import { EvaluationsListComponent } from '../list/list.component';
import { EvaluationsService } from '../evaluations.service';
import { ObjetivesService } from '../../objetives/objetives.service';
import { Objetive } from '../../objetives/objetives.types';
import { Indicator } from '../../indicators/indicators.types';
import { IndicatorsService } from '../../indicators/indicators.service';

@Component({
    selector: 'evaluations-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationsDetailsComponent implements OnInit, OnDestroy {
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('knowledgesPanel') private _knowledgesPanel: TemplateRef<any>;
    @ViewChild('knowledgesPanelOrigin')
    private _knowledgesPanelOrigin: ElementRef;
    editMode: boolean = false;

    knowledgesEditMode: boolean = false;

    evaluation: Evaluation;
    evaluationForm: FormGroup;
    evaluations: Evaluation[];
    objetives: Objetive[];
    indicators: Indicator[];
    filteredTarget: Objetive;
    filteredIndicator: Indicator;

    private _tagsPanelOverlayRef: OverlayRef;
    private _knowledgesPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _evaluationsListComponent: EvaluationsListComponent,
        private _evaluationsService: EvaluationsService,
        private _objetivesServices: ObjetivesService,
        private _indicatorsServices: IndicatorsService,
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
        this._evaluationsListComponent.matDrawer.open();

        // Create the evaluation form
        this.evaluationForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            target: ['', [Validators.required]],
            indicator: ['', [Validators.required]],
            minimumPercentage: [
                0,
                [Validators.required, Validators.min(0), Validators.max(100)],
            ],
            maximumPercentage: [
                0,
                [Validators.required, Validators.min(0), Validators.max(100)],
            ],
            code: ['', [Validators.required]],
            isActive: [''],
        });

        // Get the evaluations
        this._evaluationsService.evaluations$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((evaluations: Evaluation[]) => {
                this.evaluations = evaluations;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the evaluation
        this._evaluationsService.evaluation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((evaluation: Evaluation) => {
                // Open the drawer in case it is closed
                this._evaluationsListComponent.matDrawer.open();

                this.evaluation = evaluation;

                // Patch values to the form
                this.evaluationForm.patchValue(evaluation);
                this.evaluationForm
                    .get('indicator')
                    .setValue(evaluation.indicator.id);
                this.evaluationForm
                    .get('target')
                    .setValue(evaluation.target.id);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the objetives
        this._objetivesServices.objetives$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((objetives: Objetive[]) => {
                let filteredObjetives: Objetive[] = [];
                objetives.forEach((objetive) => {
                    if (objetive.isActive != 0) {
                        filteredObjetives.push(objetive);
                    }
                });
                this.objetives = filteredObjetives;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the indicators
        this._indicatorsServices.indicators$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((indicators: Indicator[]) => {
                let filteredIndicators: Indicator[] = [];
                indicators.forEach((indicator) => {
                    if (indicator.isActive != 0) {
                        filteredIndicators.push(indicator);
                    }
                });
                this.indicators = filteredIndicators;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        if (this.evaluation.name === 'Nuevo evaluacion') {
            this.editMode = true;
        }
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
        return this._evaluationsListComponent.matDrawer.close();
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
     * Update the evaluation
     */
    updateEvaluation(): void {
        // Get the evaluation object
        let evaluation = this.evaluationForm.getRawValue();
        evaluation.target = this.objetives.filter(
            (objetive) => objetive.id == evaluation.target
        )[0];

        evaluation.indicator = this.indicators.filter(
            (indicator) => indicator.id == evaluation.indicator
        )[0];

        // Update the evaluation on the server
        this._evaluationsService
            .updateEvaluation(evaluation.id, evaluation)
            .subscribe(() => {
                // Toggle the edit mode off
                this.toggleEditMode(false);
            });
    }

    /**
     * Delete the evaluation
     */
    deleteEvaluation(): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Borrar &Aacute;rea T&eacute;cnica',
            message:
                '\n' +
                '¿Estás seguro de que deseas eliminar esta área técnica? ¡Esta acción no se puede deshacer!',
            actions: {
                confirm: {
                    label: 'Borrar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the current evaluation's id
                const id = this.evaluation.id;

                // Get the next/previous evaluation's id
                const currentEvaluationIndex = this.evaluations.findIndex(
                    (item) => item.id === id
                );
                let nextEvaluationId = null;
                if (currentEvaluationIndex == this.evaluations.length - 1) {
                    for (let i = currentEvaluationIndex - 1; i >= 0; i--) {
                        if (this.evaluations[i].isActive != 0) {
                            nextEvaluationId = this.evaluations[i].id;
                        }
                    }
                } else {
                    for (
                        let i = currentEvaluationIndex + 1;
                        i < this.evaluations.length;
                        i++
                    ) {
                        if (this.evaluations[i].isActive != 0) {
                            nextEvaluationId = this.evaluations[i].id;
                        }
                    }
                }

                // Delete the evaluation
                this.evaluation.isActive = 0;
                this._evaluationsService
                    .deleteEvaluation(this.evaluation)
                    .subscribe(() => {
                        this._router.navigate(['../'], {
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
}
