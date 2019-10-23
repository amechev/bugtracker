import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';

@Injectable({
    providedIn: 'root'
})
export class ChatsService {

    constructor(
        readonly http: HttpClient,
        public config: ConfigService
    ) {
    }

    public getChatHistory(id, api_key): Observable<any> {
        return this.http.get(
            `${this.config.chatHistory}?id=${id}`,
            {headers: {'Authorization': api_key}}
        ).pipe(map(res => res['payload']));
    }
}
