import {Component, Input} from '@angular/core';
import {ConfigService} from '../../../services/config.service';
import {ChatMessage} from '../../../models/chat';

@Component({
  selector: 'app-chat-msg',
  templateUrl: './chat-msg.component.html',
  styleUrls: ['./chat-msg.component.scss']
})
export class ChatMsgComponent {

  yesterday = (d => new Date(d.setDate(d.getDate() - 1)))(new Date);
  today = (d => new Date(d.setDate(d.getDate())))(new Date);
  /** Сообщение чата */
  @Input() chatMsg: ChatMessage;
  /** Id текущего пользователя */
  @Input() currentUserId: number;

  constructor(public config: ConfigService) {
  }

  isMsgToday() {
    if (this.chatMsg.showDate) {
      return (this.chatMsg.createdAt.getFullYear() === this.today.getFullYear())
        && (this.chatMsg.createdAt.getMonth() === this.today.getMonth())
        && (this.chatMsg.createdAt.getDate() === this.today.getDate());
    }
  }

  isMsgYesterday() {
    if (this.chatMsg.showDate) {
      return ((this.yesterday.getFullYear() === this.chatMsg.createdAt.getFullYear())
        && (this.yesterday.getMonth() === this.chatMsg.createdAt.getMonth())
        && (this.yesterday.getDate() === this.chatMsg.createdAt.getDate()));
    }
  }

}
