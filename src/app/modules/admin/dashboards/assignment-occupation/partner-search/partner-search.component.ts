import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Activity, Collaborator, Project} from "../assignment-occupation.types";
import {AssingmentOccupationService} from "../assingment-occupation.service";
import {FormControl} from "@angular/forms";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import { collaborators } from 'app/mock-api/dashboards/collaborators/data';

@Component({
  selector: 'app-partner-search',
  templateUrl: './partner-search.component.html',
  styleUrls: ['./partner-search.component.scss']
})
export class PartnerSearchComponent implements OnInit, OnDestroy {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    myControlTest = new FormControl('test');

    collaborators$: any;

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
    tabIndex = 0;


  constructor(
      private _assignmentOccupationService: AssingmentOccupationService,
      private _changeDetectorRef: ChangeDetectorRef,
      private _router: Router,
      private activateRouter: ActivatedRoute,
  ) { }

  ngOnInit(): void {
      this.getProject();
      this.getActivitys();
      this.getAllCollaborators();
      this.filterEvent();

      // Get the collaborators

    //   this._assignmentOccupationService.collaborators$
    //     .pipe(
    //         takeUntil(this._unsubscribeAll)
    //     ).subscribe(collaborators => {
    //         console.log(collaborators);
    //         this.collaborators = collaborators;
    //     });

    //this._assignmentOccupationService.getCollaborators().subscribe(response => console.log(response));
    
    this.collaborators$ = this._assignmentOccupationService.collaborators$;
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
        //this._assignmentOccupationService.getCollaborators();
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
        console.log(collaborator);
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
     
    
    redirection(tab: string, index: number) {
         this.assignActivity(this.collaborators);
      this._assignmentOccupationService.tabIndex$.subscribe(id => {
          if (id != null) this.tabIndex = id;
      });
      this.tabIndex = index;
      this._router.navigate(['dashboards/assignment-occupation/index/' + tab]).then();
  }
}
