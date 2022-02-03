import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-vacations',
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.scss']
})
export class VacationsComponent implements OnInit {

  constructor(private _router: Router) { }


  ngOnInit(): void {
  }

    redirection(tab: string) {
        this._router.navigate(['dashboards/vacations/index/' + tab]).then();
    }
}
