import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { NgxSpinnerService } from "ngx-spinner";
import { LoadingSpinnerService } from 'app/core/services/loading-spinner/loading-spinner.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {

    @ViewChild(MatTabGroup) private _tab: MatTabGroup;

    tabIndex = 0;

    constructor(
        private _router: Router,
        private spinner: NgxSpinnerService,
        private _loadingSpinnerService: LoadingSpinnerService) {
    }

    ngOnInit(): void {

    }

    /**
     * Select Tab
     *
     */

    /**
     * Handle event saved occupation
     *
     */

}


