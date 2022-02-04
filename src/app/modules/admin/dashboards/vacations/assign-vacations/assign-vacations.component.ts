import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-vacations',
  templateUrl: './assign-vacations.component.html',
  styleUrls: ['./assign-vacations.component.scss']
})
export class AssignVacationsComponent implements OnInit {

    formFieldHelpers: string[] = [''];
  constructor() { }

  ngOnInit(): void {
  }

}
