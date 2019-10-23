import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  constructor() { }
    @Input() title = new EventEmitter<string>();
    @Input() confirmTitle = new EventEmitter<string>();
    @Input() cancelTitle = new EventEmitter<string>();
    @Output() confirm = new EventEmitter<boolean>();
    @Output() cancel = new EventEmitter<boolean>();

  ngOnInit() {
  }

}
