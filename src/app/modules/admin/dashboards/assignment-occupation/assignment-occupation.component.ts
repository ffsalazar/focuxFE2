import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AssingmentOccupationService} from "./assingment-occupation.service";

@Component({
  selector: 'app-assignment-occupation',
  templateUrl: './assignment-occupation.component.html',
  styleUrls: ['./assignment-occupation.component.scss']
})
export class AssignmentOccupationComponent implements OnInit {

    tabIndex = 0;

  constructor(private _router: Router,
              private _assingmentOccupationService: AssingmentOccupationService) { }

  ngOnInit(): void {
  }

  redirection(tab: string, index: number) {
      this._assingmentOccupationService.tabIndex$.subscribe(id => {
          if (id != null) this.tabIndex = id;
      });
      this.tabIndex = index;
      this._router.navigate(['dashboards/assignment-occupation/index/' + tab]).then();
  }
}
