import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-vacations',
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.scss']
})
export class VacationsComponent implements OnInit {

    tabIndex = 0;
  constructor(private _router: Router) { }


  ngOnInit(): void {
  }

    redirection(tab: string, index: number) {
        this.tabIndex = index;
        this._router.navigate(['dashboards/vacations/index/' + tab]).then();
    }
}
