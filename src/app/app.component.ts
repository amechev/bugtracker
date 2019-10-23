import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from './services/api.service';
import {NotifierService} from 'angular-notifier';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {JSON} from 'ta-json';
import {Circle} from './models/circle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  // Триггер смерти компонента
  private destroyed = new Subject<void>();

  constructor(
    private api: ApiService,
    private notifierService: NotifierService
  ) {
  }

  async ngOnInit () {
    this.getCircles();
    await this.api.fetchCurrentUser();
  }

  getCircles() {
    this.api.getCircles()
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        if (res) {
          this.api.circles$.next(JSON.deserialize<Circle[]>(res, Circle));
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
