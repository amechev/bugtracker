import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ConfigService} from './config.service';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user';
import {JSON} from 'ta-json';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  /** Текущий пользователь */
  currentUser$ = new BehaviorSubject<User>(null);
  // Права
  isAdmin$ = new BehaviorSubject(false);
  // Права
  circles$ = new BehaviorSubject(null);
  // Отправка хистори после иницизации чата
  sendHistoryMessages$ = new BehaviorSubject(null);
  // Отправка  времени последнего полученного сообщения в момент нахожддения в чате
  sendLastRead$ = new BehaviorSubject(null);
  // Отправка сообщения в чате
  sendChatMessage$ = new BehaviorSubject(null);
  // Получение сообщения в чате
  gotChatMessage$ = new BehaviorSubject(null);
  // Отписка от чата
  chatUnsubscribe$ = new BehaviorSubject(null);
  // Создание новой задачи
  newTask$ = new BehaviorSubject(null);

  constructor(
    readonly http: HttpClient,
    public config: ConfigService
  ) {
  }

  authorize(options: {
    headers?: HttpHeaders,
    params?: HttpParams
  } = {}) {
    if (!options.headers) {
      options.headers = new HttpHeaders();
    }
    const auth = this.config.platformApiKey;
    if (auth) {
      options.headers = options.headers.set('Authorization', auth);
    }
    return options;
  }

  async fetchCurrentUser() {
    const user = await this.getMyself();
    if (!user) {
      return;
    }
    const currentUser = JSON.deserialize<User>(user, User);
    this.currentUser$.next(currentUser);
  }

  /**
   * Получает данные текущего пользователя
   */
  getMyself(): Promise<User> {
    return this.http.get(
      `${this.config.myInfoApiUrl}`,
      this.authorize()
    ).pipe(
      map(resp => resp['payload'])
    ).toPromise();
  }

  getCircles() {
    return this.http.get(
      `${this.config.circlesUrl}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  getTasks() {
    return this.http.get(
      `${this.config.taskUrl}`,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  newTask(params) {
    console.log(params);
    return this.http.post(
      `${this.config.taskUrl}`,
      params,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  public uploadImage(file: FormData) {
    return this.http.post(
      `${this.config.fileStorageURL}files/`,
      file,
      this.authorize()
    ).pipe(
      map(res => res['payload'])
    );
  }

  public deleteFile(entity_id: string, fileId: string): Observable<any> {
    return this.http.delete(
      `${this.config.fileStorageURL}files/${entity_id}/${fileId}`,
      this.authorize()
    );
  }

}
