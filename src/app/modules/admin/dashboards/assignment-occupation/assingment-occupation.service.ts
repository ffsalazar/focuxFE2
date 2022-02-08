import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import data from './data/data.json';
import activitys from './data/activitys.json'
import {Activity, Collaborator, EmployeePosition, KnowledgeElement, Phone} from "./assignment-occupation.types";
import {BehaviorSubject, Observable, Subject} from "rxjs";

@Injectable()
export class AssingmentOccupationService {

    private _collaborators: BehaviorSubject<Collaborator[] | null > = new BehaviorSubject(null);
    private _activitys: Activity[] = activitys;

    constructor(private _http: HttpClient) { }

    get collaborators$(): Observable<Collaborator[]> {
        return this._collaborators.asObservable();
    }

    getCollaboratorsJson() {
        const dataJson: Collaborator[] = data;
        const arrayAux = dataJson.map( values => {
            return {
                id: values.id,
                idFile:  values.idFile,
                name:  values.name,
                lastName: values.lastName,
                employeePosition: values.employeePosition,
                companyEntryDate: values.companyEntryDate,
                organizationEntryDate: values.organizationEntryDate,
                gender: values.gender,
                bornDate: values.bornDate,
                nationality: values.nationality,
                mail: values.mail,
                isActive: values.isActive,
                assignedLocation: values.assignedLocation,
                technicalSkills: values.technicalSkills,
                knowledges: values.knowledges,
                phones: values.phones,
                activitys: this._activitys.filter( elem => elem.colaboratorName === values.name + ' ' +values.lastName)
            }
        });
        this._collaborators.next(arrayAux);
        return arrayAux;
    }


    get activitys(): Activity[] {
        return this._activitys;
    }

    set activitys(value: Activity[]) {
        this._activitys = value;
    }
}
