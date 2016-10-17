import {Component} from '@angular/core';
import {LoggerService} from '../../core/logger.service';

@Component({
    templateUrl: 'logs.component.html',
})
export class LogsComponent {

    messages: string[];

    constructor(public logger: LoggerService) {

        this.messages = logger.getMessages();

        setInterval(() => {
            this.messages = logger.getMessages();
        }, 100);
    }
}