import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Evaluation } from './evaluations.types';

function compare(a: Evaluation, b: Evaluation) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;

    return 0;
}

@Injectable({
    providedIn: 'root',
})
export class EvaluationsService {
    // Private-
    private _evaluation: BehaviorSubject<Evaluation | null> =
        new BehaviorSubject(null);
    private _evaluations: BehaviorSubject<Evaluation[] | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // ----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for evaluation
     */
    get evaluation$(): Observable<Evaluation> {
        return this._evaluation.asObservable();
    }

    /**
     * Getter for evaluations
     */
    get evaluations$(): Observable<Evaluation[]> {
        return this._evaluations.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get evaluations
     */
    getEvaluations(): Observable<Evaluation[]> {
        return this._httpClient
            .get<Evaluation[]>(
                'http://localhost:1616/api/v1/followup/evaluation/all'
            )
            .pipe(
                tap((evaluations) => {
                    const evaluationFiltered: any[] = [];

                    evaluations.sort(compare);
                    evaluations.forEach((evaluation) => {
                        if (evaluation.isActive != 0) {
                            evaluationFiltered.push(evaluation);
                        }
                    });
                    this._evaluations.next(evaluationFiltered);
                })
            );
    }

    /**
     * Search evaluations with given query
     *
     * @param query
     */
    searchEvaluation(query: string): Observable<Evaluation[]> {
        return this._httpClient
            .get<Evaluation[]>(
                'http://localhost:1616/api/v1/followup/evaluation/all',
                {
                    params: { query },
                }
            )
            .pipe(
                tap((evaluations) => {
                    let evaluationFiltered: any[] = [];
                    evaluations.forEach((evaluation) => {
                        if (evaluation.isActive != 0) {
                            evaluationFiltered.push(evaluation);
                        }
                    });
                    // If the query exists...
                    if (query) {
                        // Filter the evaluations

                        evaluationFiltered = evaluationFiltered.filter(
                            (evaluation) =>
                                evaluation.name &&
                                evaluation.name
                                    .toLowerCase()
                                    .includes(query.toLowerCase())
                        );

                        evaluationFiltered.sort(compare);
                        this._evaluations.next(evaluationFiltered);
                    }
                    evaluationFiltered.sort(compare);
                    this._evaluations.next(evaluationFiltered);
                })
            );
    }

    /**
     * Get evaluation by id
     */
    getEvaluationById(id: number): Observable<Evaluation> {
        return this._evaluations.pipe(
            take(1),
            map((evaluations) => {
                // Find the evaluation

                const evaluation =
                    evaluations.find((item) => item.id === id) || null;

                // Update the evaluation
                this._evaluation.next(evaluation);

                // Return the evaluation

                return evaluation;
            }),
            switchMap((evaluation) => {
                if (!evaluation) {
                    return throwError('La evaluacion no existe !');
                }

                return of(evaluation);
            })
        );
    }

    /**
     * Create evaluation
     */
    createEvaluation(): Observable<Evaluation> {
        // Generate a new evaluation
        const newEvaluation = {
            isActive: 1,
            minimumPercentage: 80,
            maximumPercentage: 100,
            target: { id: 1 },
            indicator: { id: 1 },
            name: 'Nuevo evaluacion',
            code: 'TEST',
        };
        return this.evaluations$.pipe(
            take(1),
            switchMap((evaluations) =>
                this._httpClient
                    .post<Evaluation>(
                        'http://localhost:1616/api/v1/followup/evaluation/save',
                        newEvaluation
                    )
                    .pipe(
                        map((newEvaluation) => {
                            // Update the evaluations with the new evaluation
                            this._evaluations.next([
                                newEvaluation,
                                ...evaluations,
                            ]);

                            // Return the new evaluation
                            return newEvaluation;
                        })
                    )
            )
        );
    }

    /**
     * Update evaluation
     *
     * @param id
     * @param evaluation
     */
    updateEvaluation(
        id: number,
        evaluation: Evaluation
    ): Observable<Evaluation> {
        return this.evaluations$.pipe(
            take(1),
            switchMap((evaluations) =>
                this._httpClient
                    .put<Evaluation>(
                        'http://localhost:1616/api/v1/followup/evaluation/evaluation/' +
                            evaluation.id,
                        evaluation
                    )
                    .pipe(
                        map((updatedEvaluation) => {
                            // Find the index of the updated evaluation
                            const index = evaluations.findIndex(
                                (item) => item.id === id
                            );

                            // Update the evaluation
                            evaluations[index] = updatedEvaluation;

                            evaluations.sort(compare);

                            // Update the evaluations
                            this._evaluations.next(evaluations);

                            // Return the updated evaluation
                            return updatedEvaluation;
                        }),
                        switchMap((updatedEvaluation) =>
                            this.evaluation$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the evaluation if it's selected
                                    this._evaluation.next(updatedEvaluation);

                                    // Return the updated evaluation
                                    return updatedEvaluation;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Delete the evaluation
     *
     * @param id
     */
    deleteEvaluation(evaluation: Evaluation): Observable<Evaluation> {
        return this.evaluations$.pipe(
            take(1),
            switchMap((evaluations) =>
                this._httpClient
                    .put(
                        'http://localhost:1616/api/v1/followup/evaluation/status/' +
                            evaluation.id,
                        evaluation
                    )
                    .pipe(
                        map((updatedEvaluation: Evaluation) => {
                            // Find the index of the deleted evaluation
                            const index = evaluations.findIndex(
                                (item) => item.id === evaluation.id
                            );

                            // Update the evaluation
                            evaluations[index] = updatedEvaluation;

                            evaluations.splice(index, 1);

                            evaluations.sort(compare);

                            // Update the evaluations
                            this._evaluations.next(evaluations);

                            // Return the updated evaluation
                            return updatedEvaluation;
                        })
                    )
            )
        );
    }
}
