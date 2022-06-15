import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Category } from 'app/modules/admin/masters/categories/categories.types';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService
{
    // Private
    private _category: BehaviorSubject<Category | null> = new BehaviorSubject(null);
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);


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
     * Getter for category
     */
    get category$(): Observable<Category>
    {
        return this._category.asObservable();
    }

    /**
     * Getter for categories
     */
    get categories$(): Observable<Category[]>
    {
        return this._categories.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get categories
     */
    getCategories(): Observable<Category[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });

        return this._httpClient.get<Category[]>('http://localhost:1616/api/v1/followup/categories/all', { headers }).pipe(
            tap((categories) => {


                const categoryFiltered: any[]=[];

                function compare(a: Category, b: Category) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                categories.sort(compare);
                categories.forEach((category) => {
                    if (category.isActive != 0){
                        categoryFiltered.push(category);
                    }
                });
                this._categories.next(categoryFiltered);

            }),

        );
    }

    /**
     * Search categories with given query
     *
     * @param query
     */
    searchCategory(query: string): Observable<Category[]>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this._httpClient.get<Category[]>('http://localhost:1616/api/v1/followup/categories/all', {
            params: {query},
            headers
        }).pipe(
            tap((categories) => {
                let categoryFiltered: any[]=[];
                categories.forEach((category) => {
                    if (category.isActive != 0){
                        categoryFiltered.push(category);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the categories

                    categoryFiltered = categoryFiltered.filter(category => category.name && category.name.toLowerCase().includes(query.toLowerCase()));

                    function compare(a: Category, b: Category) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    categoryFiltered.sort(compare);
                    this._categories.next(categoryFiltered);
                }else{
                    function compare(a: Category, b: Category) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    categoryFiltered.sort(compare);
                    this._categories.next(categoryFiltered);
                }

            })
        );
    }

    /**
     * Get category by id
     */
    getCategoryById(id: number): Observable<Category>
    {
        return this._categories.pipe(
            take(1),
            map((categories) => {

                // Find the category¿

                const category = categories.find(item => item.id === id) || null;

                // Update the category
                this._category.next(category);

                // Return the category

                return category;
            }),
            switchMap((category) => {

                if ( !category )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(category);
            })
        );
    }

    /**
     * Create category
     */
    createCategory(): Observable<Category>
    {
        // Generate a new category
        const newCategory =

        {
            "code": "COD",
            "name": "Nueva Categoria",
            "description": "Nueva Categoria",
            "isActive": 1
        }
        ;
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.categories$.pipe(
            take(1),
            switchMap(categories => this._httpClient.post<Category>('http://localhost:1616/api/v1/followup/categories/save', newCategory, {headers}).pipe(
                map((newCategory) => {
                    // Update the categories with the new category
                    this._categories.next([newCategory, ...categories]);

                    // Return the new category
                    return newCategory;
                })
            ))
        );
    }

    /**
     * Update category
     *
     * @param id
     * @param category
     */
    updateCategory(id: number, category: Category): Observable<Category>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.categories$.pipe(
            take(1),
            switchMap(categories => this._httpClient.put<Category>('http://localhost:1616/api/v1/followup/categories/category/' + category.id,
                category, {headers}
            ).pipe(
                map((updatedCategory) => {

                    // Find the index of the updated category
                    const index = categories.findIndex(item => item.id === id);

                    // Update the category
                    categories[index] = updatedCategory;

                    function compare(a: Category, b: Category) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    categories.sort(compare);

                    // Update the categories
                    this._categories.next(categories);

                    // Return the updated category
                    return updatedCategory;
                }),
                switchMap(updatedCategory => this.category$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the category if it's selected
                        this._category.next(updatedCategory);

                        // Return the updated category
                        return updatedCategory;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the category
     *
     * @param id
     */
    deleteCategory(category: Category): Observable<Category>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.categories$.pipe(
            take(1),
            switchMap(categories => this._httpClient.put('http://localhost:1616/api/v1/followup/categories/status/' + category.id, category, {headers}).pipe(
                map((updatedCategory: Category) => {

                    // Find the index of the deleted category
                    const index = categories.findIndex(item => item.id === category.id);

                    // Update the category
                    categories[index] = updatedCategory;

                    categories.splice(index,1);

                    function compare(a: Category, b: Category) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    categories.sort(compare);

                    // Update the categories
                    this._categories.next(categories);

                    // Return the updated category
                    return updatedCategory;
                })
            ))
        );
    }





    /**
     * Update the avatar of the given category
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<Category>
    {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
            'Content-Type': 'application/json',
        });
        return this.categories$.pipe(
            take(1),
            switchMap(categories => this._httpClient.post<Category>('api/dashboards/categories/avatar', {
                id

            }, {headers}).pipe(
                map((updatedCategory) => {

                    // Find the index of the updated category
                    const index = categories.findIndex(item => item.id === id);

                    // Update the category
                    categories[index] = updatedCategory;

                    // Update the categories
                    this._categories.next(categories);

                    // Return the updated category
                    return updatedCategory;
                }),
                switchMap(updatedcategory => this.category$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the category if it's selected
                        this._category.next(updatedcategory);

                        // Return the updated category
                        return updatedcategory;
                    })
                ))
            ))
        );
    }



}
