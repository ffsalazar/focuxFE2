import {Users} from './users';

export interface RegisterUserResponse {
    success?: string;
    data?: Users[];
    error?: string;
}
