import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Activity, Collaborator, Project} from "../assignment-occupation.types";
import {AssingmentOccupationService} from "../assingment-occupation.service";
import {FormControl} from "@angular/forms";
import {Observable, Subject} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";

@Component({
  selector: 'app-partner-search',
  templateUrl: './partner-search.component.html',
  styleUrls: ['./partner-search.component.scss']
})
export class PartnerSearchComponent implements OnInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    myControlTest = new FormControl('test');

    collaborator$: Observable<Collaborator[]>;

    collaborators: Collaborator[] = [];
    activity: Activity[] = [];
    isLoading: boolean = false;
    filteredOptions: Observable<any[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    projects: Project[] = [
        {
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
        },
        {
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
        },
    {
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
    },
        {
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
        }
    ];
    project: Project = undefined;

  constructor(
      private _assignmentOccupationService: AssingmentOccupationService,
      private _changeDetectorRef: ChangeDetectorRef,
      private _router: Router
  ) { }

  ngOnInit(): void {
      this.getProject();
      this.getActivitys();
      this.getAllCollaborators();
      this.filterEvent();

      // Get the collaborators
      this.collaborator$ = this._assignmentOccupationService.collaborators$;
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

  getAllCollaborators(){
        this.collaborators = this._assignmentOccupationService.getCollaboratorsJson();
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

    displayFn(data): string {
        return data && data.name ? data.name : '';
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }


    assignActivity(collaborator) {
        this._assignmentOccupationService.setCollaboratorByAssign(collaborator);
        this._assignmentOccupationService.setTabIndex(1);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
