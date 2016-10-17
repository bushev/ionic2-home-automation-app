import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {LoggerService} from '../../core/logger.service';
import {LogsComponent} from './logs.component';
import {AppVersion} from 'ionic-native';

@Component({
    templateUrl: 'settings.component.html'
})
export class SettingsComponent {

    settings: any = {};

    appVersion: string;

    constructor(public navParams: NavParams,
                public logger: LoggerService,
                public nav: NavController) {

        AppVersion.getVersionNumber().then(appVersion => {
            this.appVersion = appVersion;
        }).catch(err => {
            console.log(err);
        });
    }

    openLogsPage($event) {

        this.nav.push(LogsComponent);
    }
}
