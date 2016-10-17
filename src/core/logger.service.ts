import {Injectable} from '@angular/core';

@Injectable()
export class LoggerService {

    public _messages: string[] = [];

    getMessages() {

        return this._messages;
    }

    log(message: string): void {

        console.log(message);

        message = (new Date()) + ': ' + message;

        this._messages.unshift(message);
    }
}
