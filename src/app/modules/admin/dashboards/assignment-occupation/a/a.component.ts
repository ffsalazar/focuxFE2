import { Component, OnInit } from '@angular/core';
import {Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-a',
  templateUrl: './a.component.html',
  styleUrls: ['./a.component.scss']
})
export class AComponent implements OnInit {

  mycontrol: FormControl = new FormControl();

  constructor() {}

  ngOnInit(): void {
    

    this.mycontrol.valueChanges
      .subscribe(value => {
        console.log("value: ", value);
      });
  }

}
