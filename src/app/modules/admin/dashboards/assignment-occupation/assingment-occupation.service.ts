import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import data from './data/data.json';
import activitys from './data/activitys.json'
import {Activity, Collaborator} from "./assignment-occupation.types";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable()
export class AssingmentOccupationService {

    private _collaborators: BehaviorSubject<Collaborator[] | null > = new BehaviorSubject(null);
    private _activitys: Activity[] = activitys;
    private _collaboratorsAssign: Collaborator[] = data;
    private _tabIndex: Subject<number> = new Subject<number>();

    constructor(private _http: HttpClient) { }



    get tabIndex$(): Observable<number> {
        return this._tabIndex.asObservable();
    }

    setTabIndex(id: number) {
        this._tabIndex.next(id);
    }

    get collaborators$(): Observable<Collaborator[]> {
        return this._collaborators.asObservable();
    }

    get collaboratorsAssign() {
        return this._collaboratorsAssign;
    }

    set collaboratorsAssign(collaborators: Collaborator[]) {
        this._collaboratorsAssign = collaborators;
    }

    setCollaboratorByAssign(collaborator: Collaborator) {
        this._collaboratorsAssign.push(collaborator);
    }

    removeCollaboratorByAssign(collaborator: Collaborator) {
        const index = this._collaboratorsAssign.findIndex(find => find.id === collaborator.id);
        this._collaboratorsAssign.splice(index, 1);
        this._collaborators.next(this._collaboratorsAssign);
    }


    getCollaboratorsJson() {
        const dataJson: Collaborator[] = data;
        this._collaborators.next(dataJson);
        return dataJson;
    }


    get activitys(): Activity[] {
        return this._activitys;
    }

    set activitys(value: Activity[]) {
        this._activitys = value;
    }
}
