import {AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatMessage} from '../../models/chat';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {JSON} from 'ta-json';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {ConfigService} from '../../services/config.service';
import {hashCode} from '../../utils/commons';
import {ChatsService} from '../../services/chats.service';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {

  /** Список всех сообщений чата */
  public chatData: ChatMessage[] = [];
  /** id текущего пользователя */
  public myId = -1;
  /** данные загружены */
  public isLoaded = false;
  public message = '';
  /** id контракта, внутри которого запущен чат */
  @Input() contractId: string;
  @Input() entity = 'smart_contract';
  /** Элемент списка сообщений в чате */
  @ViewChild('chatList') chatList: ElementRef;
  @ViewChild('input') input: ElementRef;
  /** Отображаемые сообщения в чатах с.. по.. */
  public firstMsg = -1;
  public lastMsg = 0;
  /** триггер завершения подписок */
  private destroyed = new Subject<void>();
  /** Нужно ли соскролить вниз */
  private doScroll = false;

  public ngForm: FormGroup = null;

  constructor(
    private config: ConfigService,
    private chatsApi: ChatsService,
    private api: ApiService
  ) {
  }

  ngOnInit() {
    this.ngForm = new FormGroup({
      message: new FormControl(this.message)
    });

    this.api.currentUser$
      .pipe(takeUntil(this.destroyed))
      .subscribe(param => {
        if (param) {
          this.isLoaded = false;
          this.myId = this.api.currentUser$.getValue().id;
          /** Запрашивает историю, когда подключиться веб сокет */
          this.chatsApi.getChatHistory(this.contractId, this.config.platformApiKey)
            .pipe(takeUntil(this.destroyed))
            .subscribe((messages: ChatMessage[]) => {
              if (messages) {
                this.chatData = [];
                messages.forEach(msg => this.chatData.push(JSON.deserialize<ChatMessage>(msg, ChatMessage)));
                ChatMessage.transformChatData(this.chatData);
                // При загрузке истории устанавливает первое и последнее сообщение
                this.firstMsg = this.chatData.length - 20;
                if (this.firstMsg < 0) {
                  this.firstMsg = 0;
                }

                this.lastMsg = this.chatData.length;
                this.doScroll = true;
                this.isLoaded = true;

                this.api.sendHistoryMessages$.next(this.contractId);
                this.api.gotChatMessage$.next(null);
                this.initChatListener();
              }
            });
        }
      });
  }

  initChatListener() {
    /** Подписывается на единичное сообщение */
    this.api.gotChatMessage$
      .pipe(takeUntil(this.destroyed))
      .subscribe((message: ChatMessage) => {
        if (message && message.entity === this.entity + '=' + this.contractId) {
          const msg = JSON.deserialize<ChatMessage>(message, ChatMessage);
          if (msg.userId !== this.myId) {
            this.api.sendLastRead$.next(this.contractId);
            ChatMessage.addNewMsg(msg, this.chatData);
            this.lastMsg = this.chatData.length;
            setTimeout(() => {
            });
            this.textareaResize(true);
          } else {
            // Это мое сообщение, устанавливаем флаг, что отправлено
            const myMsgInd = this.chatData.findIndex(el => el.msgUid === msg.msgUid);
            if (myMsgInd >= 0) {
              msg.isSent = true;
              this.chatData[myMsgInd] = msg;
            }
          }
          this.api.gotChatMessage$.next(null);
          this.doScroll = true;
        }
      });
  }

  ngAfterViewChecked(): void {
    if (this.chatList && this.doScroll) {
      this.chatList.nativeElement.scrollTop = this.chatList.nativeElement.scrollHeight;
      this.doScroll = false;
    }
  }

  submitOnEnter(event, form: NgForm) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (form.valid) {
        form.ngSubmit.emit();
      }
    }
  }

  /** Создает из текста сообщение нужного для веб сокета формата */
  createMessage(message: string): any {
    const user = this.api.currentUser$.getValue();
    return {
      entity: this.entity + '=' + this.contractId,
      user_id: this.myId,
      user_photo: user.photo,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      message: message,
      msg_uid: hashCode(this.entity + '=' + this.contractId + 'user id' + this.myId + 'message' + message + 'date' + new Date())
    };
  }

  /** Отправляет сообщение */
  sendMessage() {
    let msg = this.createMessage(this.ngForm.controls['message'].value);
    // Отправляет на сервер
    this.api.sendChatMessage$.next(msg);
    // Показывает на экране
    msg = JSON.deserialize<ChatMessage>(msg, ChatMessage);
    msg.createdAt = new Date();
    ChatMessage.addNewMsg(msg, this.chatData);
    this.lastMsg = this.chatData.length;
    this.message = '';
    // Возвращает высоту инпута на дефолтную и скроллирует список с сообщениями
    setTimeout(() => {
    });
    this.textareaResize(true);
    this.doScroll = true;
    // Устанавливает знак, что проблема с отправкой сообщения
    setTimeout(() => {
      msg.isSent = false;
    }, 1000);
  }

  textareaResize(resizeToDefault = false) {
    if (!this.input) {
      return;
    }
    const textarea = this.input.nativeElement;
    textarea.style.height = '';
    if (resizeToDefault) {
      textarea.style.height = 78;
    } else {
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }

  onScrollUp() {
    this.firstMsg = this.firstMsg - 20;
    if (this.firstMsg < 0) {
      this.firstMsg = 0;
    }
  }

  ngOnDestroy() {
    this.api.chatUnsubscribe$.next(this.contractId);
    this.destroyed.next();
    this.destroyed.complete();
  }

}
