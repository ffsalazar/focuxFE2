import { Component, OnInit } from '@angular/core';
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";
import {Collaborator} from "../../assignment-occupation/assignment-occupation.types";

@Component({
  selector: 'app-consult-vacations',
  templateUrl: './consult-vacations.component.html',
  styleUrls: ['./consult-vacations.component.scss']
})
export class ConsultVacationsComponent implements OnInit {

    pendingDays = 10;
    displayedColumns: string[] = ['collaborator', 'period', 'initDate', 'endDate', 'daysOfEnjoyment', 'returnToOffice'];
    displayedHistoryColumns: string[] = ['collaborator', 'period', 'initDate', 'endDate','daysPendingEnjoyment'];
    historicDataSource = [
        {id: 1, name: 'Emmanuel Ortega', period: '2019-2020', initDate: '01-02-2021', endDate: '01-03-2021', daysPendingEnjoyment: '0'},
        // {id: 2, name: 'Emmanuel Ortega', period: '2021-2022', initDate: '01-02-2022', endDate: '01-03-2022', daysPendingEnjoyment: '18'},
        // {id: 3, name: 'Emmanuel Ortega', period: '2021-2022', initDate: '01-02-2022', endDate: '01-03-2022', daysPendingEnjoyment: '18'},
        // {id: 4, name: 'Emmanuel Ortega', period: '2021-2022', initDate: '01-02-2022', endDate: '01-03-2022', daysPendingEnjoyment: '18'}
    ];
    dataSource = [
        {id: 1, name: 'Emmanuel Ortega', period: '2021-2022', initDate: '01-02-2022', endDate: '01-03-2022', daysOfEnjoyment: '18', returnToOffice: '01-03-2022'},
        {id: 2, name: 'Emmanuel Ortega', period: '2021-2022', initDate: '01-02-2022', endDate: '01-03-2022', daysOfEnjoyment: '18', returnToOffice: '01-03-2022'},
        {id: 3, name: 'Emmanuel Ortega', period: '2021-2022', initDate: '01-02-2022', endDate: '01-03-2022', daysOfEnjoyment: '18', returnToOffice: '01-03-2022'},
        {id: 4, name: 'Emmanuel Ortega', period: '2021-2022', initDate: '01-02-2022', endDate: '01-03-2022', daysOfEnjoyment: '18', returnToOffice: '01-03-2022'},
        {id: 5, name: 'Emmanuel Ortega', period: '2021-2022', initDate: '01-02-2022', endDate: '01-03-2022', daysOfEnjoyment: '18', returnToOffice: '01-03-2022'},
        {id: 6, name: 'Emmanuel Ortega', period: '2021-2022', initDate: '01-02-2022', endDate: '01-03-2022', daysOfEnjoyment: '18', returnToOffice: '01-03-2022'}
    ];
    myControlTest = new FormControl();
    filteredOptions: Observable<any[]>;
    collaborators: Collaborator[] = [];

  constructor() { }

  ngOnInit(): void {
  }

    filterEvent() {
        this.filteredOptions = this.myControlTest.valueChanges
            .pipe(
                startWith(''),
                map(value => (typeof value === 'string' ? value : value.name)),
                map(name => (name ? this._filter(name) : this.collaborators.slice()))
            )
    }

    displayFn(data): string {
        return data && data.name ? data.name : '';
    }

    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.collaborators.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    assignVacations() {

    }

}
