import {Component, Input, OnInit} from '@angular/core';
import {Circle} from '../../models/circle';
import {Task} from '../../models/task';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-task-dialog-form-edit',
  templateUrl: './task-dialog-form-edit.component.html',
  styleUrls: ['./task-dialog-form-edit.component.scss']
})
export class TaskDialogFormEditComponent implements OnInit {

  // Модель заявки
  @Input() public task: Task = null;
  // Модель формы
  public formGroup: FormGroup = null;

  constructor() { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      files: new FormControl(null)
    });
  }

  onFilesChange(files) {
    this.formGroup.controls['files'].setValue(files);
  }
}
