import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatStepper} from '@angular/material';
import {Circle} from '../../models/circle';
import {ApiService} from '../../services/api.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NotifierService} from 'angular-notifier';
import {JSON} from 'ta-json';
import {Task} from '../../models/task';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit, OnDestroy {

  // Круги
  public circles: Circle[] = null;
  // Круг выбран
  public circle: Circle = null;
  // Флаг загрузки
  public isLoaded = false;
  // Триггер смерти компонента
  private destroyed = new Subject<void>();

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<any>,
    private notifierService: NotifierService,
    @Inject(MAT_DIALOG_DATA) public task: Task,
  ) { }

  ngOnInit() {
    this.circles = this.api.circles$.getValue();
    if (this.circles) {
      this.isLoaded = true;
    } else {
      this.api.circles$
        .pipe(takeUntil(this.destroyed))
        .subscribe(res => {
          if (res) {
            this.circles = JSON.deserialize<Circle[]>(res, Circle);
            this.isLoaded = true;
          }
        }, (err) => {
          this.handleError(err.error.message);
        });
    }
  }

  selectCircle(circle) {
    this.circle = circle;
  }

  onClearCircle() {
    this.circle = null;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onDescriptionDone(task) {
    this.api.newTask$.next(task);
    this.dialogRef.close();
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }

  getAuthorName() {
    return this.task.author.getFullName();
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
