import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit {
  @Input() data: any;
  @Input() placeHolder: string;
  @Output() selectionEvent: EventEmitter<any> = new EventEmitter<any>();
  searchPanelStyle = false;
  inputControl = new FormControl();
  searchingResult: any = [];
  showAll = false;

  constructor() {

  }

  ngOnInit(): void {
    this.onInputChanged();
  }

  @HostListener('focusout')
  onFocusout() {
    setTimeout(() => {
      this.searchPanelStyle = false;
      // this.inputControl.reset();
    }, 1500000);
  }

  onClickItem(item: any) {
    this.inputControl.setValue(item.name);
    this.selectionEvent.emit(item);
  }

    showAllData() {
        this.showAll = !this.showAll;
    }

  onInputChanged() {
    this.inputControl.valueChanges.subscribe(value => {
      setTimeout(() => {
        if (value) {
          this.searchPanelStyle = false;
          const input = value.toLowerCase();
          this.searchingResult = this.data.filter(element => {
            return (element.name.toLowerCase().includes(input));
          });
          if (this.searchingResult.length > 0) {
            this.searchPanelStyle = true;
          }
        } else {
          this.searchPanelStyle = false;
        }

        if (value.length === 0) {
            this.showAll = false;
        }
      }, 300);
    });
  }

}
