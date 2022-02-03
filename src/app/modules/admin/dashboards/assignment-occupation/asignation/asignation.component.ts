import { Component, OnInit } from '@angular/core';
import {Activity, Collaborator, Project} from "../assignment-occupation.types";
import {FormControl} from "@angular/forms";
import {AssingmentOccupationService} from "../assingment-occupation.service";

@Component({
  selector: 'app-asignation',
  templateUrl: './asignation.component.html',
  styleUrls: ['./asignation.component.scss']
})
export class AsignationComponent implements OnInit {

    collaborators: Collaborator[] = [];
    activity: Activity[] = [];

    project: Project = undefined;
    formFieldHelpers: string[] = [''];

    collaboratorFormControl: FormControl = new FormControl(null);

      constructor(private _assignmentOccupationService: AssingmentOccupationService) { }

      ngOnInit(): void {
          this.getAllCollaborators();
          this.getProject();
          this.getActivitys();
      }

        getAllCollaborators(){
            this.collaborators = this._assignmentOccupationService.collaborators;
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

}
