import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TaskTypes} from '../../models/task';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  // Типы задач для фильтрации
  public types = TaskTypes;
  // Отправляем изменения в таблицу
  @Output() public readonly newTaskClick = new EventEmitter();
  @Output() public readonly searchChange = new EventEmitter();
  @Output() public readonly filterChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSortChange(sort) {
    this.filterChange.emit(sort.value);
  }

  onSearchChange(txt) {
    this.searchChange.emit(txt);
  }

}
