import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {ApiService} from '../../services/api.service';
import {NotifierService} from 'angular-notifier';
import {ConfigService} from '../../services/config.service';
import {Circle} from '../../models/circle';
import {JSON} from 'ta-json';
import {Task} from '../../models/task';
import {File} from '../../models/file';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.scss']
})
export class FileuploadComponent implements OnInit, OnDestroy {

  // Массив картинок
  @Input() public files: File[] = [];
  // Триггер изменения изображений
  @Output() public readonly onFilesChange: EventEmitter<any> = new EventEmitter();
  // Триггер смерти компонента
  private destroyed = new Subject<void>();

  constructor(
    private api: ApiService,
    private notifierService: NotifierService,
    private config: ConfigService
  ) {
  }

  ngOnInit() {
  }

  async onChangeFile($event, input: HTMLButtonElement) {
    if ($event.target.files) {
      const uploadData = new FormData();
      console.log($event.target.files[0]);
      uploadData.append('upload', $event.target.files[0]);
      uploadData.append('entity_id', 'bag_tracker');
      this.api.uploadImage(uploadData)
        .pipe(takeUntil(this.destroyed))
        .subscribe(res => {
          const file = JSON.deserialize<File>(res, File);
          this.files.push(file);
          this.onFilesChange.emit(this.files);
        }, err => {
          this.handleError(err.error.message);
        });

      input.value = null;
    }
  }

  onRemoeImgClick(fileId: string, index) {
    this.api.deleteFile('bag_tracker', fileId)
      .pipe(takeUntil(this.destroyed))
      .subscribe(res => {
        this.files = this.files.splice(index + 1, 1);
        this.onFilesChange.emit(this.files);
      }, err => {
        this.handleError(err.error.message);
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  getImageUrl(url) {
    return this.config.fileStorageURL + 'pics/files/' + url + '/large';
  }

  handleError(errMsg) {
    if (errMsg) {
      this.notifierService.notify('error', errMsg);
    }
  }

}
