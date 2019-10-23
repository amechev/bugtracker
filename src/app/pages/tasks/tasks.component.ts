import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MatSort, MatTable, Sort} from '@angular/material';
import {Task} from '../../models/task';
import {TaskDialogComponent} from '../../components/task-dialog/task-dialog.component';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ApiService} from '../../services/api.service';
import {NotifierService} from 'angular-notifier';
import {JSON} from 'ta-json';
import {Circle} from '../../models/circle';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {

  // Триггер смерти компонента
  private destroyed = new Subject<void>();
  // Таски список массив
  public tasks: Task[] = [];
  public dataSource: Task[] = [];
  // Отображаемые колонки
  public displayedColumns: string[] = [
    'number', 'name', 'subdivision', 'performer', 'date', 'status'
  ];
  // Выбранный активный фильтр
  public activeFilter = '';
  public matSortDirection = '';
  public matSortActive = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) mainTable: MatTable<any>;
  // Флаг загрузки компонента
  public isLoaded = true;
  // Id открытой таски
  public openedId = '';
  // ДАнные строки поиска
  public searchTerm = '';

  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    private notifierService: NotifierService
  ) {
  }

  ngOnInit() {
    this.getTasks();

    this.api.newTask$
      .pipe(takeUntil(this.destroyed))
      .subscribe(task => {
        if (task) {
          this.dataSource.unshift(task);
          this.mainTable.renderRows();
          this.api.newTask$.next(null);
        }
      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  onSearchChange(txt) {
    this.searchTerm = txt;
    this.filterValues();
  }

  onFilterChange(filter) {
    this.activeFilter = filter;
    console.log(filter);
    if (this.activeFilter) {
      this.dataSource = this.tasks.filter(el => el.type === filter);
    }
    this.filterValues();

  }

  filterValues() {
    const searchTerm = this.searchTerm;

    if (searchTerm) {
      const terms_str = searchTerm.toLowerCase()
        .split(' ')
        .map(i => i.trim())
        .filter(i => i);
      this.dataSource = this.tasks.filter(
        item => terms_str.every(
          term => this.testItem(item, term)
        )
      );
    } else {
      this.dataSource = this.tasks;
    }

    if (this.activeFilter) {
      this.dataSource = this.dataSource.filter(el => el.type === this.activeFilter);
    }
  }

  testItem(item: Task, term: string) {
    return item && (this.testString(item.name, term))
      || (this.testString(item.subdivision.name, term))
      || (this.testString(item.number.toString(), term))
      || (item.performer && this.testString(item.performer.middle_name, term))
      || (item.performer && this.testString(item.performer.first_name, term))
      || (item.performer && this.testString(item.performer.last_name, term));
  }

  testString(value: string, term: string) {
    if (!!value) {
      return value.toString().toLowerCase().includes(term);
    }
    return false;
  }

  getTasks() {
    this.api.getTasks()
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        this.tasks = JSON.deserialize<Task[]>(res, Task);
        this.dataSource = this.tasks;
      }, (err) => {
        this.handleError(err.error.message);
      });
  }

  sortData(sort: Sort) {
    console.log(sort);
  }

  public createNewTask() {
    return new Task();
  }

  openDialog(smth): void {
    this.openedId = smth.id;
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      minWidth: '360px',
      maxWidth: '1000px',
      data: smth
    });

    console.log(this.openedId);

    dialogRef.afterClosed().subscribe(result => {
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
