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

}
