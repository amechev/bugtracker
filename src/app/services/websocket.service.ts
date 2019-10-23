import {Inject, Injectable} from '@angular/core';
import {interval, Observable, Observer, Subject, SubscriptionLike} from 'rxjs';
import {WebSocketSubject, WebSocketSubjectConfig} from 'rxjs/webSocket';
import {distinctUntilChanged, filter, map, publishBehavior, refCount, takeWhile} from 'rxjs/operators';
import {NotifierService} from 'angular-notifier';
import {ConfigService} from './config.service';

/** Интерфейс конфигурации веб сокета */
export interface WebSocketConfig {
  url: string;
  /** Как часто пытаться подключаться */
  reconnectInterval?: number;
  /** Количество попыток подключения */
  reconnectAttempts?: number;
}

/** Интерфейс отправляемого сообщения */
export interface IWsMessage<T> {
  command: string;
  message: T;
}

/** Интерфейс получаемых сообщений */
export interface IWsReturnedMessage<T> {
  error: boolean;
  payload: T;
  status: number;
  type: string;
}

export interface IWebsocketService {
  on<T>(command: string): Observable<T>;

  send(command: string, message: any): void;

  status: Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements IWebsocketService {
// объект конфигурации WebSocketSubject
  private config: WebSocketSubjectConfig<IWsMessage<any> | IWsReturnedMessage<any>>;

  private websocketSub: SubscriptionLike;
  private statusSub: SubscriptionLike;
  private wsSub: SubscriptionLike;

  // Observable для реконнекта по interval
  private reconnection$: Observable<number>;
  private reconect$ = new Subject<void>();
  public websocket$: WebSocketSubject<IWsMessage<any> | IWsReturnedMessage<any>>;

  // сообщает, когда происходит коннект и реконнект
  private connection$: Observer<boolean>;

  // вспомогательный Observable для работы с подписками на сообщения
  private wsMessages$: Subject<IWsMessage<any> | IWsReturnedMessage<any>>;

  // пауза между попытками реконнекта в милисекундах
  private reconnectInterval: number;

  // количество попыток реконнекта
  private reconnectAttempts: number;

  // синхронный вспомогатель для статуса соединения
  private isConnected: boolean;

  // статус соединения
  public status: Observable<boolean>;

  /** config инжектируется */
  constructor(@Inject('config') private wsConfig: WebSocketConfig,
              private configService: ConfigService,
              private notifierService: NotifierService) {
    this.wsMessages$ = new Subject<IWsMessage<any> | IWsReturnedMessage<any>>();

    // смотрим конфиг, если пусто, задаем умолчания для реконнекта
    this.reconnectInterval = wsConfig.reconnectInterval || 5000;
    this.reconnectAttempts = wsConfig.reconnectAttempts || 10;

    // получаем данные апи кея
    // при сворачивании коннекта меняем статус connection$ и глушим websocket$
    this.config = {
      url: wsConfig.url + '/?api_key=' + this.configService.platformApiKey,
      closeObserver: {
        next: (event: CloseEvent) => {
          this.websocket$ = null;
          this.connection$.next(false);
        }
      },
      // при коннекте меняем статус connection$
      openObserver: {
        next: (event: Event) => {
          this.connection$.next(true);
        }
      }
    };

    // connection status
    this.status = new Observable<boolean>((observer) => {
      this.connection$ = observer;
    }).pipe(publishBehavior(false), refCount(), distinctUntilChanged());

    // запускаем реконнект при отсутствии соединения
    this.statusSub = this.status
      .subscribe((isConnected) => {
        this.isConnected = isConnected;

        if (!this.reconnection$ && typeof (isConnected) === 'boolean' && !isConnected) {
          this.reconect$.next();
          this.reconect$.complete();
          this.reconnect();
        }
      });

    // говорим, что что-то пошло не так
    this.websocketSub = this.wsMessages$.subscribe(
      null, (error: ErrorEvent) => console.error('WebSocket error!', error)
    );

    // коннектимся
    this.connect();

    setInterval(() => {
      this.send('ping');
    }, 30000);
  }

  private connect(): void {
    this.wsSub && this.wsSub.unsubscribe();
    this.websocket$ = new WebSocketSubject(this.config); // создаем

    // если есть сообщения, шлем их в дальше,
    // если нет, ожидаем
    // реконнектимся, если получили ошибку
    this.wsSub = this.websocket$
      .subscribe(
        (message) => {
          this.wsMessages$.next(message);
        },
        (error: Event) => {
        });
  }

  private reconnect(): void {
    // Создаем interval со значением из reconnectInterval
    this.reconnection$ = interval(this.reconnectInterval)
      .pipe(takeWhile((v, index) => index < this.reconnectAttempts && !this.websocket$));

    // Пытаемся подключиться пока не подключимся, либо не упремся в ограничение попыток подключения
    this.reconnection$.subscribe(
      () => this.connect(),
      null,
      () => {
        // TODO предполагается повторное ручное подключение, на всякий случай все оставлю
        // // Subject complete if reconnect attempts ending
        this.reconnection$ = null;
      });
  }

  public manualReconnect(): void {
    if (!this.isConnected && !this.reconnection$) {
      this.connect();
    }
  }

  public disconnect(): void {
    this.wsMessages$.complete();
    this.websocket$.complete();
    this.reconnection$ = null;
    this.websocket$ = null;
    this.statusSub.unsubscribe();
  }

  /**
   * Подписывается на сообщения определенного типа
   * @params type
   */
  public on<T>(type): Observable<T> {
    return this.wsMessages$.pipe(
      filter((message: IWsReturnedMessage<T>) => message.type === type),
      map((message: IWsReturnedMessage<T>) => message.payload)
    );
  }

  /**
   * Подписывается на сообщения определенного типа
   * @params type
   */
  public onNoPayload<T>(type): Observable<any> {
    return this.wsMessages$.pipe(
      filter((message: IWsReturnedMessage<T>) => message.type === type),
      map((message: IWsReturnedMessage<T>) => message)
    );
  }

  public send(command: string, message: any = {}): void {
    if (command && this.isConnected) {
      this.websocket$.next({command: command, message: message});
    }
  }

  private handleError(err) {
    this.notifierService.notify('error', err);
  }

}
