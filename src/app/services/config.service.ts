import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  /** API URL для получения данных по текущему пользователю **/
  readonly myInfoApiUrl = environment.myInfoApiUrl;
  /** API URL для получения кругов **/
  readonly circlesUrl = environment.circlesUrl;
  /** API URL лого орг юнита */
  readonly logoOrgUnitURL: string = environment.logoOrgUnitURL;

  readonly taskUrl = environment.taskUrl;
  readonly chatHistory = environment.chatHistory;
  readonly fileStorageURL = environment.fileStorage;

  private key: string;

  constructor() {
  }

  /**
   * Возвращает ApiKey
   * @return key string
   */
  get platformApiKey() {
    if (this.key) {
      return this.key;
    } else {
      let apiKey = '';
      if (window.location.search) {
        const queryParams = new URLSearchParams(window.location.search);
        apiKey = queryParams.get('api_key');
      }
      this.setApiKey(apiKey);
      return apiKey;
    }
  }

  /**
   * Задать ApiKey
   * @params string key
   */
  setApiKey(key) {
    this.key = key;
  }

  /**
   * Возвращает URL фото логотипа (если нет - дефолтное)
   * @params {string} orgUnitId
   * @return string
   */
  getLogo(orgUnitId) {
    return this.logoOrgUnitURL + '/' + orgUnitId + '/small';
  }
}
