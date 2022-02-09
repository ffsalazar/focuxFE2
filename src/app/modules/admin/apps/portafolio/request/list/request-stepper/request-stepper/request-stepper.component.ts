import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-request-stepper',
  templateUrl: './request-stepper.component.html',
  styleUrls: ['./request-stepper.component.scss']
})
export class RequestStepperComponent implements OnInit {

  selectedProductForm: FormGroup;


  constructor(private _formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    console.log("hola mundoi");
    this.selectedProductForm = this._formBuilder.group({
      id               : [''],
      category         : [''],
      name             : ['', [Validators.required]],
      description      : [''],
      tags             : [[]],
      sku              : [''],
      barcode          : [''],
      brand            : [''],
      vendor           : [''],
      stock            : [''],
      reserved         : [''],
      cost             : [''],
      basePrice        : [''],
      taxPercent       : [''],
      price            : [''],
      weight           : [''],
      thumbnail        : [''],
      images           : [[]],
      currentImageIndex: [0], // Image index that is currently being viewed
      active           : [false]
  });
  }

}
