import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {fromEvent, Subject} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  // Значение введенное
  public inputValue = '';
  /** Поле поиска */
  @ViewChild('searchTerm') searchTermElRef: ElementRef;
  // Передает результат ввода наверх
  @Output()
  public readonly textChange = new EventEmitter();
  /** Подписки живут пока не... */
  destroyed: Subject<void> = new Subject<void>();
  // Модель формы редактирования вопроса
  public formGroup: FormGroup;

  constructor() {
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      inputValue: new FormControl('')
    });
  }

  ngAfterViewInit() {
    fromEvent(this.searchTermElRef.nativeElement, 'keyup')
      .pipe(
        takeUntil(this.destroyed),
        debounceTime(300),
        distinctUntilChanged())
      .subscribe((keyboardEvent: any) => {
        this.textChange.emit(keyboardEvent.target.value);
      });
  }

  onClear() {
    this.formGroup.controls['inputValue'].setValue('');
    this.textChange.emit('');
  }

  ngOnDestroy() {
    this.textChange.emit('');
    this.destroyed.next();
    this.destroyed.complete();
  }

}
