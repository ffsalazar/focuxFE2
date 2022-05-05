import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {AuthUtils} from 'app/core/auth/auth.utils';
import {UserService} from 'app/core/user/user.service';
import {environment} from '../../../environments/environment';
import {AuthUsers} from '../../shared/models/auth-users';
import {RegisterUserResponse} from '../../shared/models/register-user-response';
import {Collaborator} from '../../modules/admin/dashboards/collaborators/collaborators.types';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    private _roles: {authority: string}[] = [];

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }
    get roles(): {authority: string}[] {return this._roles;}
    set roles(roles: {authority: string}[]) {this._roles = roles;}
    get authenticated(): boolean { return this._authenticated;}
    set authenticated(isAuthenticated: boolean) { this._authenticated = isAuthenticated;}
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        const headers = new HttpHeaders()
            .append('Content-type', 'application/json');
        return this._httpClient.put( environment.baseApiUrl + 'api/v1/followup/user/forgotpassword', email, {
            headers
        }).pipe(
            switchMap( (response) => {
                console.log(response);
                return of(response);
            })
        );
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { username: string; password: string }): Observable<AuthUsers>
    {
        // Throw error, if the user is already logged in
        if ( this.authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(environment.baseApiUrl + 'api/v1/followup/user/login', credentials).pipe(
            switchMap((response: AuthUsers) => {

                console.log(response.authorization);
                // // Store the access token in the local storage
                // this.accessToken = response.accessToken;
                //
                // Set the authenticated flag to true
                this.authenticated = true;
                localStorage.setItem('isAuthenticated', this.authenticated.toString());


                //Set roles
                this._roles = response.authorization;

                // Store the user on the user service
                // this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this.authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this.authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param username
     * @param password
     * @param collaboratorId
     */
    signUp(username, password, collaboratorId): Observable<RegisterUserResponse>
    {
        const body = {
            username,
            password,
            'isActive': 1,
            'collaborator' : {
                id: collaboratorId
            }
        };
        return this._httpClient.post( environment.baseApiUrl + 'api/v1/followup/user/register', body)
            .pipe(
                switchMap((response: RegisterUserResponse) => {
                    if (response?.data && response?.success) {
                        return of({data: response.data, success: response.success});
                    } else {
                        return of({error: response.error});
                    }
                })
            );
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this.authenticated )
        {
            return of(true);
        }


        if(this.roles.length > 0) {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    /*
    * Get collaborators before to register
    * */

    getAllColaborators(): Observable<Collaborator[]>
    {
        return this._httpClient.get(environment.baseApiUrl + 'api/v1/followup/collaborators/all')
            .pipe(
                switchMap((response: Collaborator[]) => {
                   console.log(response);
                   return of(response);
                })
            );
    }
}
