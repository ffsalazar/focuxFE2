import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { assign, cloneDeep } from 'lodash-es';
import { FuseMockApiService, FuseMockApiUtils } from '@fuse/lib/mock-api';
import { collaborators as collaboratorsData, countries as countriesData, tags as tagsData } from 'app/mock-api/dashboards/collaborators/data';
import {Validators} from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class CollaboratorsMockApi
{
    private _collaborators: any[] = collaboratorsData;
    private _countries: any[] = countriesData;
    private _tags: any[] = tagsData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Collaborators - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/dashboards/collaborators/all')
            .reply(() => {

                // Clone the collaborators
                const collaborators = cloneDeep(this._collaborators);

                // Sort the collaborators by the name field by default
                collaborators.sort((a, b) => a.name.localeCompare(b.name));

                // Return the response
                return [200, collaborators];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Collaborators Search - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/dashboards/collaborators/search')
            .reply(({request}) => {

                // Get the search query
                const query = request.params.get('query');

                // Clone the collaborators
                let collaborators = cloneDeep(this._collaborators);

                // If the query exists...
                if ( query )
                {
                    // Filter the collaborators
                    collaborators = collaborators.filter(collaborator => collaborator.name && collaborator.name.toLowerCase().includes(query.toLowerCase()));
                }

                // Sort the collaborators by the name field by default
                collaborators.sort((a, b) => a.name.localeCompare(b.name));

                // Return the response
                return [200, collaborators];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Collaborator - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/dashboards/collaborators/collaborator')
            .reply(({request}) => {

                // Get the id from the params
                const id = request.params.get('id');

                // Clone the collaborators
                const collaborators = cloneDeep(this._collaborators);

                // Find the collaborator
                const collaborator = collaborators.find(item => item.id === id);

                // Return the response
                return [200, collaborator];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Collaborator - POST
        // -----------------------------------------------------------------------------------------------------
        /*this._fuseMockApiService
            .onPost('http://localhost:1616/api/v1/followup/collaborators/save')
            .reply(() => {

                // Generate a new collaborator
                const newCollaborator = {

                    idFile: 0,
                    name: 'Nuevo',
                    lastName: 'Colaborador',
                    employeePosition: {
                    id: 2,
                        department: {
                        id: 1,
                            code: 'A01',
                            name: 'Aplicaciones',
                            description: 'Departamento encarcado del desarrollo y mantenimiento de las diversas aplicaciones que se manejan.',
                            isActive: 1
                    },
                    name: 'Analista de aplicaciones',
                        description: 'Es capaz de mantener y desrrollar programas.',
                        isActive: 1
                },
                    companyEntryDate: '1970-01-01T00:00:00.000+00:00',
                    organizationEntryDate: '1970-01-01T00:00:00.000+00:00',
                    gender: 'M',
                    bornDate: '1970-01-01T00:00:00.000+00:00',
                    nationality: 'Venezolana',
                    mail: '' ,
                    isActive: 1,
                    assignedLocation: 'Intelix Principal',
                    technicalSkills: '',
                    knowledges: [],
                    phones: []

                };

                // Unshift the new collaborator
                this._collaborators.unshift(newCollaborator);

                // Return the response
                return [200, newCollaborator];
            });*/

        // -----------------------------------------------------------------------------------------------------
        // @ Collaborator - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/dashboards/collaborators/collaborator')
            .reply(({request}) => {

                // Get the id and collaborator
                const id = request.body.id;
                const collaborator = cloneDeep(request.body.collaborator);

                // Prepare the updated collaborator
                let updatedCollaborator = null;

                // Find the collaborator and update it
                this._collaborators.forEach((item, index, collaborators) => {

                    if ( item.id === id )
                    {
                        // Update the collaborator
                        collaborators[index] = assign({}, collaborators[index], collaborator);

                        // Store the updated collaborator
                        updatedCollaborator = collaborators[index];
                    }
                });

                // Return the response
                return [200, updatedCollaborator];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Collaborator - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/dashboards/collaborators/collaborator')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Find the collaborator and delete it
                this._collaborators.forEach((item, index) => {

                    if ( item.id === id )
                    {
                        this._collaborators.splice(index, 1);
                    }
                });

                // Return the response
                return [200, true];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Countries - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/dashboards/collaborators/countries')
            .reply(() => [200, cloneDeep(this._countries)]);

        // -----------------------------------------------------------------------------------------------------
        // @ Tags - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/dashboards/collaborators/tags')
            .reply(() => [200, cloneDeep(this._tags)]);

        // -----------------------------------------------------------------------------------------------------
        // @ Tags - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/dashboards/collaborators/tag')
            .reply(({request}) => {

                // Get the tag
                const newTag = cloneDeep(request.body.tag);

                // Generate a new GUID
                newTag.id = FuseMockApiUtils.guid();

                // Unshift the new tag
                this._tags.unshift(newTag);

                // Return the response
                return [200, newTag];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Tags - PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/dashboards/collaborators/tag')
            .reply(({request}) => {

                // Get the id and tag
                const id = request.body.id;
                const tag = cloneDeep(request.body.tag);

                // Prepare the updated tag
                let updatedTag = null;

                // Find the tag and update it
                this._tags.forEach((item, index, tags) => {

                    if ( item.id === id )
                    {
                        // Update the tag
                        tags[index] = assign({}, tags[index], tag);

                        // Store the updated tag
                        updatedTag = tags[index];
                    }
                });

                // Return the response
                return [200, updatedTag];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Tag - DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/dashboards/collaborators/tag')
            .reply(({request}) => {

                // Get the id
                const id = request.params.get('id');

                // Find the tag and delete it
                this._tags.forEach((item, index) => {

                    if ( item.id === id )
                    {
                        this._tags.splice(index, 1);
                    }
                });

                // Get the collaborators that have the tag
                const collaboratorsWithTag = this._collaborators.filter(collaborator => collaborator.tags.indexOf(id) > -1);

                // Iterate through them and delete the tag
                collaboratorsWithTag.forEach((collaborator) => {
                    collaborator.tags.splice(collaborator.tags.indexOf(id), 1);
                });

                // Return the response
                return [200, true];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Avatar - POST
        // -----------------------------------------------------------------------------------------------------

        /**
         * Read the given file as mock-api url
         *
         * @param file
         */
        const readAsDataURL = (file: File): Promise<any> =>

            // Return a new promise
            new Promise((resolve, reject) => {

                // Create a new reader
                const reader = new FileReader();

                // Resolve the promise on success
                reader.onload = (): void => {
                    resolve(reader.result);
                };

                // Reject the promise on error
                reader.onerror = (e): void => {
                    reject(e);
                };

                // Read the file as the
                reader.readAsDataURL(file);
            })
        ;

        this._fuseMockApiService
            .onPost('api/dashboards/collaborators/avatar')
            .reply(({request}) => {

                // Get the id and avatar
                const id = request.body.id;
                const avatar = request.body.avatar;

                // Prepare the updated collaborator
                let updatedCollaborator: any = null;

                // In a real world application, this would return the path
                // of the saved image file (from host, S3 bucket, etc.) but,
                // for the sake of the demo, we encode the image to base64
                // and return it as the new path of the uploaded image since
                // the src attribute of the img tag works with both image urls
                // and encoded images.
                return from(readAsDataURL(avatar)).pipe(
                    map((path) => {

                        // Find the collaborator and update it
                        this._collaborators.forEach((item, index, collaborators) => {

                            if ( item.id === id )
                            {
                                // Update the avatar
                                collaborators[index].avatar = path;

                                // Store the updated collaborator
                                updatedCollaborator = collaborators[index];
                            }
                        });

                        // Return the response
                        return [200, updatedCollaborator];
                    })
                );
            });
    }
}
