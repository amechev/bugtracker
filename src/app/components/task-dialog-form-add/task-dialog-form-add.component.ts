import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Circle} from '../../models/circle';
import {takeUntil} from 'rxjs/operators';
import {JSON} from 'ta-json';
import {Subject} from 'rxjs';
import {ApiService} from '../../services/api.service';
import {NotifierService} from 'angular-notifier';
import {Task} from '../../models/task';

@Component({
  selector: 'app-task-dialog-form-add',
  templateUrl: './task-dialog-form-add.component.html',
  styleUrls: ['./task-dialog-form-add.component.scss']
})
export class TaskDialogFormAddComponent implements OnInit, OnDestroy {

  // Модель формы
  public formGroup: FormGroup = null;
  // Модель одного круга
  @Input() public circle: Circle = null;
  // Триггер очистки кругов
  @Output() public readonly onClearCircle: EventEmitter<string> = new EventEmitter();
  // Триггер закрытия формы
  @Output() public readonly onDescriptionDone: EventEmitter<Task> = new EventEmitter();
  // Триггер смерти компонента
  private destroyed = new Subject<void>();

  constructor(
    private api: ApiService,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      subdivision: new FormControl({'id': this.circle.productId}),
      name: new FormControl(''),
      description: new FormControl(''),
      isImportant: new FormControl(false),
      files: new FormControl(null)
    });
  }

  onFilesChange(files) {
    this.formGroup.controls['files'].setValue(files);
  }

  onBackClick() {
    this.circle = null;
    this.onClearCircle.emit();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.handleError('Заполните обязательные поля');
      return false;
    }

    const params = {
      'performer_subdivision': this.formGroup.controls['subdivision'].value,
      'name': this.formGroup.controls['name'].value,
      'comment': this.formGroup.controls['description'].value,
      'files': this.formGroup.controls['files'].value,
    };

    this.api.newTask(params)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        if (res) {
          const task = JSON.deserialize<Task>(res, Task);
          this.onDescriptionDone.emit(task);
        }
      }, (err) => {
        this.handleError(err.error.message);
      });

  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  handleError(errMsg) {
    if (errMsg) {
      this.notifierService.notify('error', errMsg);
    }
  }

}
