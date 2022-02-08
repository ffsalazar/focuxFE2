import { Component, OnInit } from '@angular/core';
import {Activity, Collaborator, Project} from "../assignment-occupation.types";
import {FormControl} from "@angular/forms";
import {AssingmentOccupationService} from "../assingment-occupation.service";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-asignation',
  templateUrl: './asignation.component.html',
  styleUrls: ['./asignation.component.scss']
})
export class AsignationComponent implements OnInit {
    displayedColumns: string[] = ['collaborator', 'ocupation', 'percent', 'clear'];
    dataSource: any;

    collaborators: Collaborator[] = [];
    activity: Activity[] = [];


    clickedRows = new Set<any>();
    myControlTest = new FormControl();
    filteredOptions: Observable<any[]>;
    project: Project = undefined;
    formFieldHelpers: string[] = [''];


      constructor(private _assignmentOccupationService: AssingmentOccupationService) { }

      ngOnInit(): void {
          this.getAllCollaborators();
          this.getProject();
          this.getActivitys();
          this.filterEvent();
          this.dataSource = [
              {collaborator: 'test', occupation: 'test', percent: '100%'},
              {collaborator: 'test', occupation: 'test', percent: '100%'},
              {collaborator: 'test', occupation: 'test', percent: '100%'},
          ];
      }

        getAllCollaborators(){
            // this.collaborators = this._assignmentOccupationService.collaborators;
        }

        getProject() {
            this.project  = {
                id: 150,
                name: 'Originacion',
                description: 'Aplicacion realizada como api rest con Angular8+ y Spring boot',
                endDate: '2022-02-05',
                initDate: '2022-10-25',
                skills: 'Angular-SpringBoot',
                client: {
                    id: 4,
                    name: 'Credix',
                    description: 'Entidad financiera ubicada en Costa Rica'
                },
                collaborators: this.collaborators
            };
        }

        getActivitys() {
            this.activity = this._assignmentOccupationService.activitys;
        }

        onCollaboratorSearchChange(event) {
            console.log(event);
        }


    displayFn(data): string {
        return data && data.name ? data.name : '';
    }


    filterEvent() {
        this.filteredOptions = this.myControlTest.valueChanges
            .pipe(
                startWith(''),
                map(value => (typeof value === 'string' ? value : value.name)),
                map(name => (name ? this._filter(name) : this.collaborators.slice()))
            )
    }


    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.collaborators.filter(option => option.name.toLowerCase().includes(filterValue));
    }

}
