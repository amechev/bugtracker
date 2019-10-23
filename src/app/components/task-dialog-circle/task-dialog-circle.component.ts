import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Circle} from '../../models/circle';
import {takeUntil} from 'rxjs/operators';
import {ApiService} from '../../services/api.service';
import {NotifierService} from 'angular-notifier';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-task-dialog-circle',
  templateUrl: './task-dialog-circle.component.html',
  styleUrls: ['./task-dialog-circle.component.scss']
})
export class TaskDialogCircleComponent implements OnInit, OnDestroy {

  // Массив отсортированных кругов
  public sortedCircles: Circle[] = null;
  // Модель массив кругов
  @Input() public circles: Circle[] = null;
  // Модель одного круга
  public circle: Circle = null;
  // Флаг загрузки
  public isLoaded = false;
  // Триггер смерти компонента
  private destroyed = new Subject<void>();
  // Флаг поиска открыто закрыто
  public isSearchOpen = false;
  // Строка поиска
  public searchTerm: string = null;

  @Output() public readonly onCircleSelect: EventEmitter<string> = new EventEmitter();

  constructor(
    private api: ApiService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.sortedCircles = this.circles;
  }

  onSearchOpen() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  onButtonClick(item) {
    this.onCircleSelect.emit(item);
  }

  onSearch(searchTxt) {
    this.searchTerm = searchTxt;
    this.filterValues();
  }

  filterValues() {
    const searchTerm = this.searchTerm;

    if (searchTerm) {
      const terms_str = searchTerm.toLowerCase()
        .split(' ')
        .map(i => i.trim())
        .filter(i => i);
      this.sortedCircles = this.circles.filter(
        item => terms_str.every(
          term => this.testItem(item, term)
        )
      );
    } else {
      this.sortedCircles = this.circles;
    }
  }

  testItem(item: Circle, term: string) {
    return item && (this.testString(item.name, term));
  }

  testString(value: string, term: string) {
    if (!!value) {
      return value.toString().toLowerCase().includes(term);
    }
    return false;
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
