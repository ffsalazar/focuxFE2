import {AfterViewInit, Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dividerFocus]'
})
export class DividerDirective implements AfterViewInit {

  constructor(private el: ElementRef,
              private renderer: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid #E9E9E9', 1);
    this.renderer.setStyle(this.el.nativeElement, 'width', '100%');
  }
}
