import {Roles} from './roles';
import {FollowupSchema} from './followup-schema';

export interface Users extends FollowupSchema{
    username: string;
    password: string;
    isActive: number;
    roles: Roles[];
}
