import {
    AfterContentChecked,
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit, ViewChildren
} from '@angular/core';
import {
    Activity,
    Collaborator,
    EmployeePosition,
    KnowledgeElement,
    Phone,
    Project
} from "../assignment-occupation.types";
import {Form, FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {AssingmentOccupationService} from "../assingment-occupation.service";
import {map, startWith, takeUntil} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignation',
  templateUrl: './asignation.component.html',
  styleUrls: ['./asignation.component.scss']
})
export class AsignationComponent implements OnInit, OnDestroy {
    collaboratorFormGroup: FormGroup;
    myControlTest = new FormControl();
    collaboratorForm = new FormControl().disabled;
    

    collaborators$: Observable<Collaborator[]>;
    collaboratorsArr: Collaborator[] = [];
    collaboratorAsigned = false;
    filteredOptions: Observable<any[]>;
    filteredCollaboratorsOptions: Observable<any[]>;
    project: Project = undefined;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    formFieldHelpers: string[] = [''];
    tabIndex = 0;
    showObservation = false;
    noCollaborators = true;

      constructor(private _assignmentOccupationService: AssingmentOccupationService,
                  private _changeDetectorRef: ChangeDetectorRef,
                  private _formBuilder: FormBuilder,
                   private _router: Router,) {

      }

      ngOnInit(): void {
          this.getProject();
          this.filterEvent();
          
          this.collaboratorsArr = this._assignmentOccupationService.getCollaboratorsSelected();
        console.log(this.collaboratorsArr);
        
          this.collaboratorFormGroup = this._formBuilder.group({
              collaborators: this._formBuilder.array([])
          });
          this.collaborators$ = this._assignmentOccupationService.collaborators$;
          this.collaborators$.subscribe(collaborators => {
              const collaboratorsFormGroups = [];
              (this.collaboratorFormGroup.get('collaborators') as FormArray).clear();
              if (collaborators && collaborators.length > 0) {

                  collaborators.forEach( collaborator => {
                        collaboratorsFormGroups.push(
                            this._formBuilder.group({
                                name: [collaborator.name],
                                assignation: [collaborator.assignation],
                                progress: [collaborator.progress]
                            })
                        );
                  });


                  collaboratorsFormGroups
                      .forEach( collaboratorForm => (this.collaboratorFormGroup.get('collaborators') as FormArray).push(collaboratorForm));

                    // this.collaboratorFormGroup.controls.collaborators
                    //     .patchValue(this._formBuilder.array(collaborators.map( value => this.addingCollaboratorsToForm(value))));

                    this._changeDetectorRef.markForCheck();
              } else {
                  collaboratorsFormGroups.push(
                      this._formBuilder.group({
                          name: [''],
                          assignation: [''],
                          progress: [0]
                      })
                  )
              }
          });
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

        get collaborators() {
            return this.collaboratorFormGroup.controls['collaborators'] as FormArray;
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
                collaborators: this.collaboratorsArr
            };
        }


    displayFn(data): string {
        return data && data.name ? data.name : '';
    }


    removeCollaborator(collaborator) {
        this._assignmentOccupationService.removeCollaboratorByAssign(collaborator);
    }

    removeField(index: number): void
    {
        // Get form array for phone numbers
        const collaboratorsFormArray = this.collaboratorFormGroup.get('collaborators') as FormArray;
        //const collaborator = collaboratorsFormArray.at(index).value
        //collaborator.isActive = 0;
        // Remove the phone number field
        collaboratorsFormArray.removeAt(index);

        // Mark for check
        this._changeDetectorRef.markForCheck();

        //this._collaboratorsService.updatePhoneStatus(id, phone).subscribe();
    }

    /**
     * Add an empty phone number field
     */
    addcollaboratorField(): void
    {
        // Create an empty phone number form group
        const collaboratorsFormGroup = this._formBuilder.group({
            name: [''],
            assignation: [''],
            progress: [0]
        });

        // Add the phone number form group to the phoneNumbers form array
        (this.collaboratorFormGroup.get('collaborators') as FormArray).push(collaboratorsFormGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    filterEvent() {
        this.filteredOptions = this.myControlTest.valueChanges
            .pipe(
                startWith(''),
                map(value => (typeof value === 'string' ? value : value.name)),
                map(name => (name ? this._filter(name) : this.collaboratorsArr.slice()))
            );
        // this.filteredCollaboratorsOptions = this.collaboratorFormGroup?.controls.collaborators.valueChanges
        //     .pipe(
        //         startWith(''),
        //         map(value => (typeof value === 'string' ? value : value.name)),
        //         map(name => (name ? this._filter(name) : this.collaboratorsArr.slice()))
        //     );
    }


    addingCollaboratorsToForm(collaborator: Collaborator): FormGroup {
            return this._formBuilder.group({
               name: collaborator.name,
               assignation: collaborator.assignation,
               progress: collaborator.progress
            });
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


    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.collaboratorsArr.filter(option => option.name.toLowerCase().includes(filterValue));
    }

     redirection(tab: string, index: number) {
      this._assignmentOccupationService.tabIndex$.subscribe(id => {
          if (id != null) this.tabIndex = id;
      });
      this.tabIndex = index;
      this._router.navigate(['dashboards/assignment-occupation/index/' + tab]).then();
  }

  detail(){
      if(this.showObservation=== false){
          this.showObservation = true;
      }else{
          this.showObservation = false;
      }
      
  }
  deleteItem(){
    
    }

    noCollab(){
        this.noCollaborators= false;
    }


}


