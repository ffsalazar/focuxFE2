import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-assignment-occupation',
  templateUrl: './assignment-occupation.component.html',
  styleUrls: ['./assignment-occupation.component.scss']
})
export class AssignmentOccupationComponent implements OnInit {

    tabIndex = 0;

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  redirection(tab: string) {
      this._router.navigate(['dashboards/assignment-occupation/index/' + tab]).then();
  }
}
