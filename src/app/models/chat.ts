import {JsonObject, JsonProperty, OnDeserialized} from 'ta-json';
import {areOneDay} from '../utils/commons';

@JsonObject()
export class ChatMessage {
  @JsonProperty()
  id?: number;
  @JsonProperty('msg_uid')
  msgUid?: number;
  @JsonProperty('user_id')
  userId: number;
  @JsonProperty('user_photo')
  userPhoto: string;
  @JsonProperty('first_name')
  firstName: string;
  @JsonProperty('last_name')
  lastName: string;
  @JsonProperty('middle_name')
  middleName: string;
  @JsonProperty('created_at')
  createdAt: Date;
  @JsonProperty()
  entity: string;
  @JsonProperty()
  message: string;

  showAvatar = false;
  showDate = false;
  isSent = false;

  constructor(id: number,
              userId: number,
              userPhoto: string,
              firstName: string,
              lastName: string,
              middleName: string,
              createdAt: Date,
              message: string) {
    this.id = id;
    this.userId = userId;
    this.userPhoto = userPhoto;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
    this.createdAt = createdAt;
    this.message = message;
  }

  get userShortName() {
    let short = this.lastName;
    if (this.firstName) {
      short += ' ' + this.firstName.slice(0, 1) + '.';
      if (this.middleName) {
        short += ' ' + this.middleName.slice(0, 1) + '.';
      }
    }
    return short;
  }


  /**
   * Преобразует единичное сообщение для удобства отображения
   * @param prevMsg - предыдущее сообщение
   * @param chatMsg - текущее сообщение
   * Возвращает: обновленное предыдущее сообщение
   */
  static transformMsg(prevMsg: ChatMessage, chatMsg: ChatMessage): ChatMessage {
    if (!prevMsg) {
      chatMsg.showDate = true;
      chatMsg.showAvatar = true;
      prevMsg = chatMsg;
    } else {
      if (areOneDay(chatMsg.createdAt, prevMsg.createdAt)) {
        chatMsg.showDate = false;
        if (chatMsg.userId !== prevMsg.userId) {
          chatMsg.showAvatar = true;
        }
      } else {
        chatMsg.showDate = true;
        // В новом дне покажем аватарку
        chatMsg.showAvatar = true;
      }
      prevMsg = chatMsg;
    }
    return prevMsg;
  }

  /**
   * Преобразует сообщения от сервера для удобства отображения
   * @param chatData - все сообщения
   */
  static transformChatData(chatData: ChatMessage[]) {
    let prevMsg: ChatMessage;
    chatData.forEach(chatMsg => {
      prevMsg = this.transformMsg(prevMsg, chatMsg);
    });
  }

  /**
   * Добавляет одно сообщение к пулу сообщений с преобразованием
   * @params msg
   * @params chatData
   */
  static addNewMsg(msg: ChatMessage, chatData: ChatMessage[]) {
    let prevMsg;
    if (chatData && chatData.length) {
      prevMsg = chatData[chatData.length - 1];
    } else {
      prevMsg = null;
    }
    this.transformMsg(prevMsg, msg);
    chatData.push(msg);
  }

  @OnDeserialized()
  onDeserialized() {
    this.createdAt = new Date(this.createdAt);
  }

}
