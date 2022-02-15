import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Client, BusinessType } from 'app/modules/admin/masters/clients/clients.types';

@Injectable({
    providedIn: 'root'
})
export class ClientsService
{
    // Private
    private _client: BehaviorSubject<Client | null> = new BehaviorSubject(null);
    private _clients: BehaviorSubject<Client[] | null> = new BehaviorSubject(null);
    private _businessTypes: BehaviorSubject<BusinessType[] | null> = new BehaviorSubject(null);

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
     * Getter for client
     */
    get client$(): Observable<Client>
    {
        return this._client.asObservable();
    }

    /**
     * Getter for clients
     */
    get clients$(): Observable<Client[]>
    {
        return this._clients.asObservable();
    }
    /**
     * Getter for businessTypes
     */
     get businessTypes$(): Observable<BusinessType[]>
    {
        return this._businessTypes.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get clients
     */
    getClients(): Observable<Client[]>
    {
        return this._httpClient.get<Client[]>('http://localhost:1616/api/v1/followup/clients/all').pipe(
            tap((clients) => {


                let clientFiltered : any[]=[];

                function compare(a: Client, b: Client) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                clients.sort(compare);
                clients.forEach((client) => {
                    if (client.isActive != 0){
                        clientFiltered.push(client);
                    }
                });
                this._clients.next(clientFiltered);

            })
        );
    }

    /**
     * Search clients with given query
     *
     * @param query
     */
    searchClient(query: string): Observable<Client[]>
    {
        return this._httpClient.get<Client[]>('http://localhost:1616/api/v1/followup/clients/all', {
            params: {query}
        }).pipe(
            tap((clients) => {
                let clientFiltered : any[]=[];
                clients.forEach((client) => {
                    if (client.isActive != 0){
                        clientFiltered.push(client);
                    }
                });
                // If the query exists...
                if ( query )
                {
                    // Filter the clients

                    clientFiltered = clientFiltered.filter(client => client.name && client.name.toLowerCase().includes(query.toLowerCase()));
                    function compare(a: Client, b: Client) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    clientFiltered.sort(compare);
                    this._clients.next(clientFiltered);
                }else{
                    function compare(a: Client, b: Client) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;


                        return 0;
                    }
                    clientFiltered.sort(compare);
                    this._clients.next(clientFiltered);
                }

            })
        );
    }

    /**
     * Get client by id
     */
    getClientById(id: number): Observable<Client>
    {
        return this._clients.pipe(
            take(1),
            map((clients) => {

                // Find the client¿

                const client = clients.find(item => item.id === id) || null;
                const client_test = clients.find(item => item.id === id);

                console.log(client_test);
                // Update the client
                this._client.next(client);

                // Return the client

                return client;
            }),
            switchMap((client) => {

                if ( !client )
                {
                    return throwError('El colaborador no existe !');
                }

                return of(client);
            })
        );
    }

    /**
     * Create client
     */
    createClient(): Observable<Client>
    {
        // Generate a new client
        const newClient = {

                "businessType": {
                    "id": 2,
                    "code": "FIN01",
                    "name": "Financiero",
                    "description": "Servicios Financieros, inversiones, creditos personales",
                    "isActive": 1
                },
            "name": "Nuevo Cliente",
            "description": "Nuevo Cliente descripcion",
            "isActive": 1
        };
        return this.clients$.pipe(
            take(1),
            switchMap(clients => this._httpClient.post<Client>('http://localhost:1616/api/v1/followup/clients/save', newClient).pipe(
                map((newClient) => {
                    // Update the clients with the new client
                    this._clients.next([newClient, ...clients]);

                    // Return the new client
                    return newClient;
                })
            ))
        );
    }

    /**
     * Update client
     *
     * @param id
     * @param client
     */
    updateClient(id: number, client: Client): Observable<Client>
    {
       console.log(JSON.stringify(client));
        return this.clients$.pipe(
            take(1),
            switchMap(clients => this._httpClient.put<Client>('http://localhost:1616/api/v1/followup/clients/client/' + client.id,
                client
            ).pipe(
                map((updatedClient) => {

                    // Find the index of the updated client
                    const index = clients.findIndex(item => item.id === id);

                    // Update the client
                    clients[index] = updatedClient;

                    // Update the clients
                    this._clients.next(clients);

                    // Return the updated client
                    return updatedClient;
                }),
                switchMap(updatedClient => this.client$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the client if it's selected
                        this._client.next(updatedClient);

                        // Return the updated client
                        return updatedClient;
                    })
                ))
            ))
        );
    }

    /**
     * Delete the client
     *
     * @param id
     */
    deleteClient(client: Client): Observable<Client>
    {
        return this.clients$.pipe(
            take(1),
            switchMap(clients => this._httpClient.put('http://localhost:1616/api/v1/followup/clients/status/' + client.id, client).pipe(
                map((updatedClient: Client) => {

                    // Find the index of the deleted client
                    const index = clients.findIndex(item => item.id === client.id);

                    // Update the client
                    clients[index] = updatedClient;

                    // Update the clients
                    this._clients.next(clients);

                    // Return the updated client
                    return updatedClient;
                })
            ))
        );
    }





    /**
     * Update the avatar of the given client
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: number, avatar: File): Observable<Client>
    {
        return this.clients$.pipe(
            take(1),
            switchMap(clients => this._httpClient.post<Client>('api/dashboards/clients/avatar', {
                id

            }).pipe(
                map((updatedClient) => {

                    // Find the index of the updated client
                    const index = clients.findIndex(item => item.id === id);

                    // Update the client
                    clients[index] = updatedClient;

                    // Update the clients
                    this._clients.next(clients);

                    // Return the updated client
                    return updatedClient;
                }),
                switchMap(updatedclient => this.client$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the client if it's selected
                        this._client.next(updatedclient);

                        // Return the updated client
                        return updatedclient;
                    })
                ))
            ))
        );
    }

    getBusinessTypes(): Observable<BusinessType[]>
    {
        return this._httpClient.get<BusinessType[]>('http://localhost:1616/api/v1/followup/businessType/all').pipe(
            tap((businessTypes) => {
                let businessTypeFiltered : any[]=[];

                function compare(a: BusinessType, b: BusinessType) {
                    if (a.name < b.name) return -1;
                    if (a.name > b.name) return 1;


                    return 0;
                }
                businessTypes.sort(compare);
                businessTypes.forEach((businessType) => {
                    if (businessType.isActive != 0){
                       businessTypeFiltered.push(businessType);
                }
                });
                this._clients.next(businessTypeFiltered);
            })
        );
    }

}
