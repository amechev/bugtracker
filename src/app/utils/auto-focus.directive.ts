import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[autoFocus]'
})
export class AutoFocusDirective implements OnInit {

  private autofocus;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.autofocus || typeof this.autofocus === "undefined")
      this.el.nativeElement.focus();
  }

  @Input() set autoFocus(condition)
  {
    this.autofocus = condition != false;
  }

}
