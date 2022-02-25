import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Knowledge } from 'app/modules/admin/masters/knowledges/knowledges.types';

@Injectable({
    providedIn: 'root'
})
export class KnowledgesService
{
    // Private
    private _knowledge: BehaviorSubject<Knowledge | null> = new BehaviorSubject(null);
    private _knowledges: BehaviorSubject<Knowledge[] | null> = new BehaviorSubject(null);


    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for knowledge
     */
    get knowledge$(): Observable<Knowledge>
    {
        return this._knowledge.asObservable();
    }

    /**
     * Getter for knowledges
     */
    get knowledges$(): Observable<Knowledge[]>
    {
        return this._knowledges.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get knowledges
     */
    getKnowledges(): Observable<Knowledge[]>
    {
        return this._httpClient.get<Knowledge[]>('http://localhost:1616/api/v1/followup/knowledges/all').pipe(
            tap((knowledges) => {


                let knowledgeFiltered : any[]=[];

                function compare(a: Knowledge, b: Knowledge) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                knowledges.sort(compare);
                knowledges.forEach((knowledge) => {
                    if (knowledge.isActive != 0){
                        knowledgeFiltered.push(knowledge);
                    }
                });
                this._knowledges.next(knowledgeFiltered);

            })
        );
    }

    /**
     * Search knowledges with given query
     *
     * @param query
     */
    searchKnowledge(query: string): Observable<Knowledge[]>
    {
        return this._httpClient.get<Knowledge[]>('http://localhost:1616/api/v1/followup/knowledges/all', {
            params: {query}
        }).pipe(
            tap((knowledges) => {
                let knowledgeFiltered : any[]=[];
                knowledges.forEach((knowledge) => {
                    if (knowledge.isActive != 0){
                        knowledgeFiltered.push(knowledge);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the knowledges

                    knowledgeFiltered = knowledgeFiltered.filter(knowledge => knowledge.name && knowledge.name.toLowerCase().includes(query.toLowerCase()));

                    function compare(a: Knowledge, b: Knowledge) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    knowledgeFiltered.sort(compare);
                    this._knowledges.next(knowledgeFiltered);
                }else{
                    function compare(a: Knowledge, b: Knowledge) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    knowledgeFiltered.sort(compare);
                    this._knowledges.next(knowledgeFiltered);
                }

            })
        );
    }

    /**
     * Get knowledge by id
     */
    getKnowledgeById(id: number): Observable<Knowledge>
    {
        return this._knowledges.pipe(
            take(1),
            map((knowledges) => {

                // Find the knowledge¿

                const knowledge = knowledges.find(item => item.id === id) || null;
                const knowledge_test = knowledges.find(item => item.id === id);

                console.log(knowledge_test);
                // Update the knowledge
                this._knowledge.next(knowledge);

                // Return the knowledge

                return knowledge;
            }),
            switchMap((knowledge) => {

                if ( !knowledge )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(knowledge);
            })
        );
    }

    /**
     * Create knowledge
     */
    createKnowledge(): Observable<Knowledge>
    {
        // Generate a new knowledge
        const newKnowledge = {


            "name": "Nuevo Conocimiento",
            "type":"nuevo tipo",
            "description": "Nuevo descripcion Conocimiento",
            "isActive": 1
        };
        return this.knowledges$.pipe(
            take(1),
            switchMap(knowledges => this._httpClient.post<Knowledge>('http://localhost:1616/api/v1/followup/knowledges/save', newKnowledge).pipe(
                map((newKnowledge) => {
                    // Update the knowledges with the new knowledge
                    this._knowledges.next([newKnowledge, ...knowledges]);

                    // Return the new knowledge
                    return newKnowledge;
                })
            ))
        );
    }

    /**
     * Update knowledge
     *
     * @param id
     * @param knowledge
     */
    updateKnowledge(id: number, knowledge: Knowledge): Observable<Knowledge>
    {
       console.log(JSON.stringify(knowledge));
        return this.knowledges$.pipe(
            take(1),
            switchMap(knowledges => this._httpClient.put<Knowledge>('http://localhost:1616/api/v1/followup/knowledges/knowledge/' + knowledge.id,
                knowledge
            ).pipe(
                map((updatedKnowledge) => {

                    // Find the index of the updated knowledge
                    const index = knowledges.findIndex(item => item.id === id);

                    // Update the knowledge
                    knowledges[index] = updatedKnowledge;

                    function compare(a: Knowledge, b: Knowledge) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    knowledges.sort(compare);

                    // Update the knowledges
                    this._knowledges.next(knowledges);

                    // Return the updated knowledge
                    return updatedKnowledge;
                }),
                switchMap(updatedKnowledge => this.knowledge$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the knowledge if it's selected
                        this._knowledge.next(updatedKnowledge);

                        // Return the updated knowledge
                        return updatedKnowledge;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the knowledge
     *
     * @param id
     */
    deleteKnowledge(knowledge: Knowledge): Observable<Knowledge>
    {
        return this.knowledges$.pipe(
            take(1),
            switchMap(knowledges => this._httpClient.put('http://localhost:1616/api/v1/followup/knowledges/status/' + knowledge.id, knowledge).pipe(
                map((updatedKnowledge: Knowledge) => {

                    // Find the index of the deleted knowledge
                    const index = knowledges.findIndex(item => item.id === knowledge.id);

                    // Update the knowledge
                    knowledges[index] = updatedKnowledge;

                    knowledges.splice(index,1);


                    function compare(a: Knowledge, b: Knowledge) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    knowledges.sort(compare);

                    // Update the knowledges
                    this._knowledges.next(knowledges);


                    // Return the updated knowledge
                    return updatedKnowledge;
                })
            ))
        );
    }





    /**
     * Update the avatar of the given knowledge
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<Knowledge>
    {
        return this.knowledges$.pipe(
            take(1),
            switchMap(knowledges => this._httpClient.post<Knowledge>('api/dashboards/knowledges/avatar', {
                id

            }).pipe(
                map((updatedKnowledge) => {

                    // Find the index of the updated knowledge
                    const index = knowledges.findIndex(item => item.id === id);

                    // Update the knowledge
                    knowledges[index] = updatedKnowledge;

                    // Update the knowledges
                    this._knowledges.next(knowledges);

                    // Return the updated knowledge
                    return updatedKnowledge;
                }),
                switchMap(updatedknowledge => this.knowledge$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the knowledge if it's selected
                        this._knowledge.next(updatedknowledge);

                        // Return the updated knowledge
                        return updatedknowledge;
                    })
                ))
            ))
        );
    }



}
