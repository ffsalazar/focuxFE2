import {Privileges} from './privileges';
import {FollowupSchema} from './followup-schema';

export interface Roles extends FollowupSchema{
    name: string;
    description: string;
    privileges: Privileges[];
}
