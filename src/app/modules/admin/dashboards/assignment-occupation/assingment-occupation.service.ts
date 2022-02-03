import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import data from './data/data.json';
import activitys from './data/activitys.json'
import {Activity, Collaborator} from "./assignment-occupation.types";

@Injectable()
export class AssingmentOccupationService {

    private _collaborators: Collaborator[] = data;
    private _activitys: Activity[] = activitys;

    constructor(private _http: HttpClient) { }

    get collaborators(): any[] {
        return this._collaborators;
    }

    set collaborators(value: any[]) {
        this._collaborators = value;
    }

    get activitys(): Activity[] {
        return this._activitys;
    }

    set activitys(value: Activity[]) {
        this._activitys = value;
    }
}
