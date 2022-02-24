import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Activity, Collaborator, Project, Client } from "../assignment-occupation.types";
import {AssingmentOccupationService} from "../assingment-occupation.service";
import {FormArray, FormControl} from "@angular/forms";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
//import { collaborators } from 'app/mock-api/dashboards/collaborators/data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    clients: Client[] = [];

    activity: Activity[] = [];
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // FormControls
    
    filterForm: FormGroup = this._fb.group({
        myControl: [''],
        requestControl: [''],
        clientControl: ['']
    });
    
    collaboratorArrayForm: FormGroup = new FormGroup({
        collaboratorSelected: new FormArray([])
    });

    filteredOptions: Observable<string[]>;
    filteredClients: Observable<string[]>;

    filterValue = 'Hola mundo';
    
    projects: any[] = [
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
    project: any = undefined;
    tabIndex = 0;

  constructor(
      private _assignmentOccupationService: AssingmentOccupationService,
      private _changeDetectorRef: ChangeDetectorRef,
      private _router: Router,
      private activateRouter: ActivatedRoute,
      private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
      this.getProject();
      this.getActivitys();
      this.getAllCollaborators();
      this.filterEvent();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterr(value)),
    );

    this.filteredClients = this.clientControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterClient(value)),
    );

    this.filterForm.valueChanges.subscribe(value => {
        let filteredCollaborators = [];
    });
    
    this._assignmentOccupationService.collaborators$
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(collaborators => {
                this.collaborators = collaborators;

                for(let i = 0; i < this.collaborators.length; i++){
                    this.collaboratorSelected.push(new FormControl(false));
                }
               console.log(this.collaboratorArrayForm);
                // Mark for check
                this._changeDetectorRef.markForCheck();
            })
            
    this.collaboratorArrayForm.valueChanges.subscribe((value)=>{
        console.log("array: ", value);

        // Añadir colaboradores seleccionados en el FormArray
        for(let i = 0; i < value.collaboratorSelected.length; i++){
            if(value.collaboratorSelected.at(i) === true){
                 value.collaboratorSelected[i] = this.collaborators[i];
            }
        }
        this._assignmentOccupationService.collaboratorsSelected = value.collaboratorSelected;

        console.log("Item: ", this._assignmentOccupationService.collaboratorsSelected);
        })

    this._assignmentOccupationService.clients$
        .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(clients => {
                this.clients = clients;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            })
    
    this.collaborators$ = this._assignmentOccupationService.collaborators$;
    
  }

    get collaboratorSelected(){
        return this.collaboratorArrayForm.get('collaboratorSelected') as FormArray;
    }

    get myControl() {
        return this.filterForm.get('myControl');
    }

    get clientControl() {
        return this.filterForm.get('clientControl');
    }

    private _filterClient(value: string): string[] {
        const filterValue = value.toLowerCase();

        let val = this.clients.map(option => option.name);
        return val.filter(option => option.toLowerCase().includes(filterValue));
    }

    private _filterr(value: string): string[] {
        const filterValue = value.toLowerCase();

    //     return this.options.map(x => x.color).filter(option =>
    // option.toLowerCase().includes(val.toLowerCase()));

        let val = this.collaborators.map(option => option.name);
        return val.filter(option => option.toLowerCase().includes(filterValue));
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

  recommended(){
    
  }
  selected(){
  
    
    
      
  }

}
